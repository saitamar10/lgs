// Edge function for AI Coach - Chat Assistant

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

const SYSTEM_PROMPT = `Sen bir LGS öğretmenisin. Öğrenciyle sohbet ediyorsun. Soruları adım adım, temel seviyeden başlayarak açıkla.

KRİTİK TALİMAT - GÖRSELLER İÇİN:
Eğer öğrenci görsel gönderdiyse:
1. Görseldeki metni DİKKATLE ve TAMAMEN oku
2. Hangi ders/konu olduğunu belirle (Matematik, Türkçe, İngilizce, Fen, Sosyal)
3. ASLA varsayım yapma - görselde ne yazıyorsa ona göre cevap ver

LGS Konuları:
- Türkçe (40 soru) - Dil bilgisi, okuma, anlama
- Matematik (20 soru) - Sayılar, cebir, geometri
- Fen Bilimleri (20 soru) - Fizik, kimya, biyoloji
- İnkılap Tarihi (10 soru) - Atatürk dönemi
- Din Kültürü (10 soru) - Temel din bilgisi
- İngilizce (10 soru) - Kelime, dilbilgisi

KURALLARIN:
1. Öğrenci seviyesinde, basit ve samimi dil kullan
2. Sorulara adım adım cevap ver
3. Formülleri ve kavramları açıkla
4. Kısa ve öz cevap ver, gereksiz uzatma
5. Markdown formatında yanıt ver
6. Önceki mesajlara referans verebilirsin, sohbet geçmişini hatırla
7. Motivasyon ver, teşvik et`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { conversationId, message, imageBase64 } = await req.json()

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not set')
    }

    // Build conversation history from database if conversationId provided
    const historyMessages: { role: string; content: any }[] = [];

    if (conversationId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: previousMessages } = await supabase
        .from('coach_messages')
        .select('role, content')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(20); // Son 20 mesaj ile sınırla

      if (previousMessages && previousMessages.length > 0) {
        // Son mesaj az önce kaydedilen kullanıcı mesajıysa çıkar (görselsiz kaydedildi, burada görselli eklenecek)
        let messagesToUse = previousMessages;
        if (messagesToUse.length > 0) {
          const lastMsg = messagesToUse[messagesToUse.length - 1];
          if (lastMsg.role === 'user' && lastMsg.content === message) {
            messagesToUse = messagesToUse.slice(0, -1);
          }
        }

        for (const msg of messagesToUse) {
          historyMessages.push({
            role: msg.role,
            content: msg.content
          });
        }
      }
    }

    // Build current user message content
    let userContent: any;

    if (imageBase64) {
      const base64Data = imageBase64.includes(',')
        ? imageBase64.split(',')[1]
        : imageBase64;

      const imageType = imageBase64.includes('image/png')
        ? 'image/png'
        : imageBase64.includes('image/jpeg') || imageBase64.includes('image/jpg')
        ? 'image/jpeg'
        : 'image/png';

      userContent = [
        {
          type: 'image_url',
          image_url: {
            url: `data:${imageType};base64,${base64Data}`
          }
        },
        {
          type: 'text',
          text: message
        }
      ];
    } else {
      userContent = message;
    }

    // Build full messages array: history + current message
    const messages = [
      ...historyMessages,
      { role: 'user' as const, content: userContent }
    ];

    // Call Lovable AI Gateway
    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-sonnet-4-5-20250929',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        max_tokens: 2048,
        temperature: 0.7
      })
    })

    if (!aiRes.ok) {
      const error = await aiRes.text()
      throw new Error(`AI API error: ${error}`)
    }

    const aiData = await aiRes.json()
    const response = aiData.choices[0]?.message?.content || 'Üzgünüm, sorunuzu çözemedim. Lütfen tekrar deneyin.'

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
