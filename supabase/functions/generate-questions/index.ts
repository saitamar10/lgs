// Edge function for AI-generated LGS questions
// SECURITY: JWT verified via config.toml, user authenticated via Supabase auth header

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ALLOWED_ORIGINS = [
  'https://lgscalis.com',
  'https://www.lgscalis.com',
  'https://tuascnmjgbarrtwlxzcx.supabase.co',
  'http://localhost:8080',
  'http://localhost:5173',
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

async function getAuthenticatedUser(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } }
  });

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
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

const MAX_SUBJECT_LENGTH = 100;
const MAX_UNIT_LENGTH = 200;
const MAX_QUESTION_COUNT = 20;
const VALID_DIFFICULTIES = [1, 2, 3];

const VALID_SUBJECTS = [
  'matematik', 'türkçe', 'turkce', 'fen bilimleri', 'fen',
  'inkılap tarihi', 'inkilap tarihi', 'inkılap', 'inkilap',
  'din kültürü', 'din kulturu', 'din',
  'ingilizce', 'english',
  'sosyal bilgiler', 'sosyal',
];

function isValidSubject(name: string): boolean {
  return VALID_SUBJECTS.some(s => name.toLowerCase().includes(s));
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // SECURITY: Authenticate the user
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return new Response(JSON.stringify({ error: "Kimlik doğrulama başarısız." }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { subjectName, unitName, difficulty, count: rawCount } = body as QuestionRequest;

    // SECURITY: Input validation
    if (!subjectName || typeof subjectName !== 'string' || subjectName.length > MAX_SUBJECT_LENGTH) {
      return new Response(JSON.stringify({ error: "Geçersiz ders adı." }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!unitName || typeof unitName !== 'string' || unitName.length > MAX_UNIT_LENGTH) {
      return new Response(JSON.stringify({ error: "Geçersiz konu adı." }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!isValidSubject(subjectName)) {
      return new Response(JSON.stringify({ error: "Geçersiz ders adı." }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // SECURITY: Validate and clamp difficulty and count
    const validDifficulty = VALID_DIFFICULTIES.includes(difficulty) ? difficulty : 1;
    const count = Math.min(Math.max(1, rawCount || 5), MAX_QUESTION_COUNT);

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')
    if (!lovableApiKey) {
      console.error('LOVABLE_API_KEY is not set');
      return new Response(JSON.stringify({ error: "Sunucu yapılandırma hatası." }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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

    // SECURITY: Sanitize user input before injecting into prompt
    const sanitizedSubject = subjectName.replace(/[^\w\sğüşıöçĞÜŞİÖÇ\-()]/g, '');
    const sanitizedUnit = unitName.replace(/[^\w\sğüşıöçĞÜŞİÖÇ\-().,]/g, '');

    const userPrompt = `${sanitizedSubject} dersi, "${sanitizedUnit}" konusu için ${count} adet ${difficultyLabels[validDifficulty]} seviyesinde yeni nesil LGS sorusu üret.

Her soru için:
- question_text: Soru metni (paragraf dahil)
- options: 4 şık (string array)
- correct_answer: Doğru cevap indexi (0-3)
- explanation: Kısa açıklama
- difficulty: ${validDifficulty}
- xp_value: ${xpValues[validDifficulty]}

JSON array olarak döndür: [{"question_text": "...", "options": [...], "correct_answer": 0, "explanation": "...", "difficulty": ${validDifficulty}, "xp_value": ${xpValues[validDifficulty]}}]`

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
      // SECURITY: Don't leak internal error details
      return new Response(
        JSON.stringify({ error: "AI servisi şu anda kullanılamıyor.", questions: [] }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const aiData = await aiRes.json()
    const content = aiData.choices[0]?.message?.content || '[]'

    // Parse JSON from response
    let questions: GeneratedQuestion[] = []
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0])
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content)
      return new Response(
        JSON.stringify({ error: "Sorular ayrıştırılamadı.", questions: [] }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
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

    // SECURITY: Validate, sanitize, and cap output
    questions = questions.slice(0, MAX_QUESTION_COUNT).map((q, idx) => {
      const imageUrl = getMathImage(q.question_text || '', subjectName);
      return {
        id: `ai-${Date.now()}-${idx}`,
        question_text: typeof q.question_text === 'string' ? q.question_text.slice(0, 2000) : 'Soru yüklenemedi',
        options: Array.isArray(q.options) && q.options.length === 4 && q.options.every(o => typeof o === 'string')
          ? q.options.map(o => o.slice(0, 500))
          : ['Şık A', 'Şık B', 'Şık C', 'Şık D'],
        correct_answer: typeof q.correct_answer === 'number' && q.correct_answer >= 0 && q.correct_answer <= 3
          ? q.correct_answer
          : 0,
        explanation: typeof q.explanation === 'string' ? q.explanation.slice(0, 1000) : 'Açıklama mevcut değil',
        difficulty: validDifficulty,
        xp_value: xpValues[validDifficulty],
        image_url: imageUrl
      };
    })

    return new Response(
      JSON.stringify({ questions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: unknown) {
    console.error('Error:', error)
    // SECURITY: Never expose internal error messages
    return new Response(
      JSON.stringify({ error: "Bir hata oluştu. Lütfen tekrar deneyin.", questions: [] }),
      { status: 500, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
    )
  }
})
