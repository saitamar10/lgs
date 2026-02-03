// Edge function for AI Coach

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

const SYSTEM_PROMPT = `Sen LGS (Liselere Geçiş Sınavı) hazırlık koçusun. Türkçe konuşan bir 8. sınıf öğrencisine yardım ediyorsun.

Görevlerin:
1. Zayıf konuları analiz et ve önerilerde bulun
2. Günlük çalışma planı oluştur
3. Soruları detaylı açıkla
4. Motivasyon sağla

LGS Dersleri:
- Türkçe (40 soru)
- Matematik (20 soru)
- Fen Bilimleri (20 soru)
- İnkılap Tarihi ve Atatürkçülük (10 soru)
- Din Kültürü (10 soru)
- İngilizce (10 soru)

Yanıtlarını:
- Kısa ve öz tut
- Öğrenci seviyesine uygun açıkla
- Pozitif ve cesaretlendirici ol
- Türkçe yanıt ver`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { conversationId, message } = await req.json()

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not set')
    }

    // Get conversation history from Supabase
    const authHeader = req.headers.get('Authorization')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    const historyRes = await fetch(
      `${supabaseUrl}/rest/v1/coach_messages?conversation_id=eq.${conversationId}&order=created_at`,
      {
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey!,
          'Content-Type': 'application/json'
        }
      }
    )

    const historyData = await historyRes.json()
    
    // Ensure history is an array
    const history = Array.isArray(historyData) ? historyData : []

    // Build messages array
    const messages = [
      ...history.map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { role: 'user' as const, content: message }
    ]

    // Call Lovable AI Gateway
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
          ...messages
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    })

    if (!aiRes.ok) {
      const error = await aiRes.text()
      throw new Error(`AI API error: ${error}`)
    }

    const aiData = await aiRes.json()
    const response = aiData.choices[0]?.message?.content || 'Üzgünüm, bir hata oluştu.'

    return new Response(
      JSON.stringify({ response }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
