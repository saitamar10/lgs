// Edge function for AI Coach - Question Solving Assistant with Vision

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Sen bir LGS öğretmenisin. Öğrenciye soruyu adım adım, temel seviyeden başlayarak açıkla.

  KRİTİK TALİMAT - GÖRSELLER İÇİN:
  Eğer öğrenci görsel gönderdiyse:
  1. Görseldeki metni DİKKATLE ve TAMAMEN oku
  2. Hangi ders/konu olduğunu belirle (Matematik, Türkçe, İngilizce, Fen, Sosyal)
  3. ASLA varsayım yapma - görselde ne yazıyorsa ona göre cevap ver
  4. Örnek: "Hangman" veya "Adam Asmaca" görüyorsan → İngilizce kelime sorusu
  5. Örnek: Denklem, sayı, geometri görüyorsan → Matematik sorusu

  LGS Konuları:
  - Türkçe (40 soru) - Dil bilgisi, okuma, anlama
  - Matematik (20 soru) - Sayılar, cebir, geometri
  - Fen Bilimleri (20 soru) - Fizik, kimya, biyoloji
  - İnkılap Tarihi (10 soru) - Atatürk dönemi
  - Din Kültürü (10 soru) - Temel din bilgisi
  - İngilizce (10 soru) - Kelime, dilbilgisi

  KURALLARIN:
  1. Her adımı numaralandır ve açıkla
  2. Temel kavramları hatırlat
  3. Formülleri göster
  4. Örnek ver
  5. Nihai cevabı net ver
  6. Öğrenci seviyesinde, basit dil kullan
  7. Markdown formatında yanıt ver
  8. Önceki mesajlara referans verebilirsin, sohbet geçmişini hatırla
  9. Motivasyon ver, teşvik et

  Yanıt Formatı:
  ## 📚 Konu
  [Konunun adı - görsele göre doğru belirle]

  ## 🎯 Adım Adım Çözüm

  ### Adım 1: [Başlık]
  [Açıklama]

  ### Adım 2: [Başlık]
  [Açıklama]

  ## ✅ Nihai Cevap
  [Net cevap]

  ## 💡 Hatırlatma
  [Önemli not veya tüyo]`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { conversationId, message, imageBase64 } = await req.json();

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY is not set");
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
        .limit(20);

      if (previousMessages && previousMessages.length > 0) {
        // Remove last message if it's the same user message just saved (text-only, image will be added below)
        let messagesToUse = previousMessages;
        const lastMsg = messagesToUse[messagesToUse.length - 1];
        if (lastMsg.role === 'user' && lastMsg.content === message) {
          messagesToUse = messagesToUse.slice(0, -1);
        }

        for (const msg of messagesToUse) {
          historyMessages.push({
            role: msg.role,
            content: msg.content
          });
        }
      }
    }

    // Build user message content
    let userContent: any;

    if (imageBase64) {
      // Extract base64 data (remove data:image/xxx;base64, prefix if present)
      const base64Data = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;

      // Detect image type from base64 prefix
      const imageType = imageBase64.includes("image/png")
        ? "image/png"
        : imageBase64.includes("image/jpeg") || imageBase64.includes("image/jpg")
          ? "image/jpeg"
          : "image/png"; // default

      // Vision mode: send both image and text
      userContent = [
        {
          type: "image_url",
          image_url: {
            url: `data:${imageType};base64,${base64Data}`,
          },
        },
        {
          type: "text",
          text: message || "Bu görseldeki soruyu çöz ve açıkla.",
        },
      ];
    } else {
      // Text-only mode
      userContent = message;
    }

    // Build full messages array: history + current message
    const messages = [
      ...historyMessages,
      { role: "user" as const, content: userContent }
    ];

    // Call Lovable AI Gateway with Gemini 2.5 Pro (best for vision + Turkish)
    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 16384,
        temperature: 0.7,
      }),
    });

    if (!aiRes.ok) {
      const errorText = await aiRes.text();
      console.error("AI Gateway error:", aiRes.status, errorText);

      if (aiRes.status === 429) {
        return new Response(JSON.stringify({ error: "Çok fazla istek gönderildi. Lütfen biraz bekleyin." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiRes.status === 402) {
        return new Response(JSON.stringify({ error: "AI kullanım limiti doldu." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      throw new Error(`AI API error: ${errorText}`);
    }

    const aiData = await aiRes.json();
    const response = aiData.choices[0]?.message?.content || "Üzgünüm, sorunuzu çözemedim. Lütfen tekrar deneyin.";

    return new Response(JSON.stringify({ response }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
