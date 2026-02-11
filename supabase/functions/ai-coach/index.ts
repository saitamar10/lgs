// Edge function for AI Coach - Question Solving Assistant with Vision
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
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

// Extract and verify the authenticated user from the request
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

const MAX_MESSAGE_LENGTH = 5000;
const MAX_IMAGE_SIZE = 7 * 1024 * 1024; // 7MB base64 (~5MB actual)

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

  ÇOK ÖNEMLİ - MATEMATİK FORMATLAMA KURALLARI:
  - ASLA LaTeX formatı kullanma! $ işareti, \\frac, \\sqrt, \\times, \\div, \\cdot, \\left, \\right, \\text, \\boxed, \\overline, \\underline, \\hat, \\vec, \\sum, \\int, \\lim, \\infty gibi LaTeX komutları YASAKTIR.
  - Matematiksel ifadeleri DÜZGÜN METİN olarak yaz.
  - Kesirler için: 3/4, 1/2, 5/8 gibi yaz ($ işareti olmadan)
  - Üs için: x², x³, 2⁴ gibi Unicode karakterler kullan veya "x üzeri 2", "2 üzeri 4" yaz
  - Karekök için: √9 = 3 veya "karekök 9 = 3" yaz
  - Çarpma için: × veya * kullan
  - Bölme için: ÷ veya / kullan
  - Pi için: π kullan
  - Toplam, çarpım gibi ifadeleri kelimelerle yaz
  - Özetle: Hiçbir zaman $ veya $$ işareti kullanma, hiçbir zaman ters eğik çizgi (\\) ile başlayan LaTeX komutu kullanma

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

// LaTeX temizleme fonksiyonu - modelin LaTeX kullanması durumunda güvenlik ağı
function cleanLatex(text: string): string {
  let cleaned = text;
  cleaned = cleaned.replace(/\$\$([\s\S]*?)\$\$/g, (_match, inner) => cleanLatexInner(inner.trim()));
  cleaned = cleaned.replace(/\$([^$]+?)\$/g, (_match, inner) => cleanLatexInner(inner.trim()));
  cleaned = cleanLatexInner(cleaned);
  return cleaned;
}

function cleanLatexInner(text: string): string {
  let cleaned = text;
  cleaned = cleaned.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '$1/$2');
  cleaned = cleaned.replace(/\\sqrt\{([^}]*)\}/g, '√$1');
  cleaned = cleaned.replace(/\\times/g, '×');
  cleaned = cleaned.replace(/\\div/g, '÷');
  cleaned = cleaned.replace(/\\cdot/g, '·');
  cleaned = cleaned.replace(/\\pi/g, 'π');
  cleaned = cleaned.replace(/\\infty/g, '∞');
  cleaned = cleaned.replace(/\\leq/g, '≤');
  cleaned = cleaned.replace(/\\geq/g, '≥');
  cleaned = cleaned.replace(/\\neq/g, '≠');
  cleaned = cleaned.replace(/\\approx/g, '≈');
  cleaned = cleaned.replace(/\\pm/g, '±');
  cleaned = cleaned.replace(/\^{2}/g, '²');
  cleaned = cleaned.replace(/\^\{2\}/g, '²');
  cleaned = cleaned.replace(/\^2/g, '²');
  cleaned = cleaned.replace(/\^{3}/g, '³');
  cleaned = cleaned.replace(/\^\{3\}/g, '³');
  cleaned = cleaned.replace(/\^3/g, '³');
  cleaned = cleaned.replace(/\^\{([^}]*)\}/g, ' üzeri $1');
  cleaned = cleaned.replace(/\_\{([^}]*)\}/g, '$1');
  cleaned = cleaned.replace(/\\left/g, '');
  cleaned = cleaned.replace(/\\right/g, '');
  cleaned = cleaned.replace(/\\text\{([^}]*)\}/g, '$1');
  cleaned = cleaned.replace(/\\boxed\{([^}]*)\}/g, '[$1]');
  cleaned = cleaned.replace(/\\overline\{([^}]*)\}/g, '$1');
  cleaned = cleaned.replace(/\\underline\{([^}]*)\}/g, '$1');
  cleaned = cleaned.replace(/\\quad/g, ' ');
  cleaned = cleaned.replace(/\\qquad/g, '  ');
  cleaned = cleaned.replace(/\\[,;!]/g, ' ');
  cleaned = cleaned.replace(/\\\\/g, '\n');
  cleaned = cleaned.replace(/\\[a-zA-Z]+\{([^}]*)\}/g, '$1');
  cleaned = cleaned.replace(/\\[a-zA-Z]+/g, '');
  cleaned = cleaned.replace(/\{([^}]*)\}/g, '$1');
  return cleaned;
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // SECURITY: Authenticate the user
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return new Response(JSON.stringify({ error: "Kimlik doğrulama başarısız." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { conversationId, message, imageBase64 } = body;

    // SECURITY: Input validation
    if (message && typeof message !== 'string') {
      return new Response(JSON.stringify({ error: "Geçersiz mesaj formatı." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (message && message.length > MAX_MESSAGE_LENGTH) {
      return new Response(JSON.stringify({ error: "Mesaj çok uzun." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (imageBase64 && imageBase64.length > MAX_IMAGE_SIZE) {
      return new Response(JSON.stringify({ error: "Görsel boyutu çok büyük." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (conversationId && typeof conversationId !== 'string') {
      return new Response(JSON.stringify({ error: "Geçersiz sohbet ID." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) {
      console.error("LOVABLE_API_KEY is not set");
      return new Response(JSON.stringify({ error: "Sunucu yapılandırma hatası." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build conversation history from database if conversationId provided
    const historyMessages: { role: string; content: any }[] = [];

    if (conversationId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // SECURITY: Verify the conversation belongs to the authenticated user
      const { data: conversation, error: convError } = await supabase
        .from('coach_conversations')
        .select('id, user_id')
        .eq('id', conversationId)
        .single();

      if (convError || !conversation || conversation.user_id !== user.id) {
        return new Response(JSON.stringify({ error: "Bu sohbete erişim yetkiniz yok." }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: previousMessages } = await supabase
        .from('coach_messages')
        .select('role, content')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(20);

      if (previousMessages && previousMessages.length > 0) {
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
      const base64Data = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;

      // SECURITY: Validate image type strictly
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
      let imageType = "image/png";
      for (const type of allowedTypes) {
        if (imageBase64.includes(type)) {
          imageType = type === "image/jpg" ? "image/jpeg" : type;
          break;
        }
      }

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
      userContent = message;
    }

    const messages = [
      ...historyMessages,
      { role: "user" as const, content: userContent }
    ];

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

      // SECURITY: Don't leak internal error details
      return new Response(JSON.stringify({ error: "AI servisi şu anda kullanılamıyor." }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiRes.json();
    const rawResponse = aiData.choices[0]?.message?.content || "Üzgünüm, sorunuzu çözemedim. Lütfen tekrar deneyin.";
    const response = cleanLatex(rawResponse);

    return new Response(JSON.stringify({ response }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error:", error);
    // SECURITY: Never expose internal error messages to the client
    return new Response(JSON.stringify({ error: "Bir hata oluştu. Lütfen tekrar deneyin." }), {
      status: 500,
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
    });
  }
});
