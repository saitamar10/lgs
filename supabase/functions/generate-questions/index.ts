// Edge function for AI-generated LGS questions

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

const SYSTEM_PROMPT = `Sen LGS (Liselere Geçiş Sınavı) soru yazarısın. Yeni nesil, düşünme becerisine dayalı sorular üretiyorsun.

SORU FORMATI:
- Her soru gerçek yaşam senaryolarına dayalı olmalı
- Paragraf/metin tabanlı sorular tercih et
- 4 şık olmalı (A, B, C, D değil, direkt metin)
- Tek doğru cevap olmalı
- correct_answer 0-3 arası (0=ilk şık)

ZORLUK SEVİYELERİ:
1 = Kolay: Bilgi hatırlama, basit kavramlar
2 = Orta: Uygulama, analiz gerektiren
3 = Zor: Sentez, değerlendirme, çok adımlı düşünme

YENİ NESİL SORU ÖZELLİKLERİ:
- Günlük hayat bağlantısı
- Görsel/grafik açıklamalı (metin olarak)
- Bilgi + yorum birlikte
- Eleştirel düşünme
- PISA tarzı okuma metinleri

JSON formatında döndür. Açıklama kısa ve öz olsun.`

interface QuestionRequest {
  subjectName: string;
  unitName: string;
  difficulty: number; // 1, 2, or 3
  count: number;
}

interface GeneratedQuestion {
  question_text: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  difficulty: number;
  xp_value: number;
  image_url?: string;
}

// Sample math images for geometry and graph questions
const mathImages: Record<string, string[]> = {
  'geometri': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Triangle.Equilateral.svg/200px-Triangle.Equilateral.svg.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Pythagorean_theorem.svg/200px-Pythagorean_theorem.svg.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Rectangle.svg/200px-Rectangle.svg.png',
  ],
  'grafik': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Slope_illustration.svg/200px-Slope_illustration.svg.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Equation_illustration_colour.svg/200px-Equation_illustration_colour.svg.png',
  ],
  'çember': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Circle_-_black_simple.svg/200px-Circle_-_black_simple.svg.png',
  ],
  'üçgen': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Triangle.Equilateral.svg/200px-Triangle.Equilateral.svg.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Triangle_right.svg/200px-Triangle_right.svg.png',
  ],
  'dikdörtgen': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Rectangle.svg/200px-Rectangle.svg.png',
  ],
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { subjectName, unitName, difficulty, count = 5 }: QuestionRequest = await req.json()

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not set')
    }

    const difficultyLabels: Record<number, string> = {
      1: 'Kolay (bilgi hatırlama)',
      2: 'Orta (uygulama ve analiz)',
      3: 'Zor (sentez ve değerlendirme)'
    }

    const xpValues: Record<number, number> = {
      1: 10,
      2: 15,
      3: 25
    }

    const userPrompt = `${subjectName} dersi, "${unitName}" konusu için ${count} adet ${difficultyLabels[difficulty]} seviyesinde yeni nesil LGS sorusu üret.

Her soru için:
- question_text: Soru metni (paragraf dahil)
- options: 4 şık (string array)
- correct_answer: Doğru cevap indexi (0-3)
- explanation: Kısa açıklama
- difficulty: ${difficulty}
- xp_value: ${xpValues[difficulty]}

JSON array olarak döndür: [{"question_text": "...", "options": [...], "correct_answer": 0, "explanation": "...", "difficulty": ${difficulty}, "xp_value": ${xpValues[difficulty]}}]`

    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 4000,
        temperature: 0.8
      })
    })

    if (!aiRes.ok) {
      const error = await aiRes.text()
      console.error('AI API error:', error)
      throw new Error(`AI API error: ${error}`)
    }

    const aiData = await aiRes.json()
    const content = aiData.choices[0]?.message?.content || '[]'
    
    // Parse JSON from response
    let questions: GeneratedQuestion[] = []
    try {
      // Try to extract JSON array from response
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0])
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content)
      throw new Error('Failed to parse questions from AI')
    }

    // Helper to get image URL for math questions
    const getMathImage = (questionText: string, subject: string): string | undefined => {
      if (subject.toLowerCase() !== 'matematik') return undefined;
      
      const text = questionText.toLowerCase();
      for (const [keyword, images] of Object.entries(mathImages)) {
        if (text.includes(keyword)) {
          return images[Math.floor(Math.random() * images.length)];
        }
      }
      return undefined;
    }

    // Validate and clean questions
    questions = questions.map((q, idx) => {
      const imageUrl = getMathImage(q.question_text || '', subjectName);
      return {
        id: `ai-${Date.now()}-${idx}`,
        question_text: q.question_text || 'Soru yüklenemedi',
        options: Array.isArray(q.options) && q.options.length === 4 
          ? q.options 
          : ['Şık A', 'Şık B', 'Şık C', 'Şık D'],
        correct_answer: typeof q.correct_answer === 'number' && q.correct_answer >= 0 && q.correct_answer <= 3
          ? q.correct_answer
          : 0,
        explanation: q.explanation || 'Açıklama mevcut değil',
        difficulty: difficulty,
        xp_value: xpValues[difficulty],
        image_url: imageUrl
      };
    })

    return new Response(
      JSON.stringify({ questions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: errorMessage, questions: [] }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
