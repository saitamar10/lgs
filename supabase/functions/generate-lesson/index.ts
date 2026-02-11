// Edge function for AI-generated lesson slides
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
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
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

interface LessonSlide {
  title: string;
  content: string;
  icon: 'intro' | 'concept' | 'example' | 'tip' | 'summary';
  highlight?: string;
  mascotMood?: 'happy' | 'thinking' | 'celebrating' | 'encouraging';
  mascotMessage?: string;
}

const MAX_SUBJECT_LENGTH = 100;
const MAX_UNIT_LENGTH = 200;

// Whitelist of valid subject names
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
    const { subjectName, unitName } = body;

    // SECURITY: Input validation
    if (!subjectName || typeof subjectName !== 'string' || subjectName.length > MAX_SUBJECT_LENGTH) {
      return new Response(JSON.stringify({ error: "Geçersiz ders adı." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!unitName || typeof unitName !== 'string' || unitName.length > MAX_UNIT_LENGTH) {
      return new Response(JSON.stringify({ error: "Geçersiz konu adı." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!isValidSubject(subjectName)) {
      return new Response(JSON.stringify({ error: "Geçersiz ders adı." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(JSON.stringify({ error: "Sunucu yapılandırma hatası." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const isInkilap = subjectName.toLowerCase().includes('inkılap') || subjectName.toLowerCase().includes('inkilap');

    const inkilapExtra = isInkilap ? `
ÖZEL - İNKILAP TARİHİ KURALLARI:
- Konuya uygun askeri terminoloji kullan (cephe, muharebe, mütareke, antlaşma, kongre, milli mücadele vb.)
- Tarihi olayları kronolojik sıraya göre anlat
- Önemli tarihleri ve kişileri mutlaka belirt
- Atatürk'ün rolünü ve liderliğini vurgula
- Slayt başlıklarında askeri/tarihi terimler kullan (örn: "Cephe Hattı", "Zafer Yolu", "Stratejik Hamle")
- Highlight kutusunda tarihi önemi vurgula
` : '';

    const systemPrompt = `Sen bir 8. sınıf LGS eğitim uzmanısın. Verilen konu için Türkçe eğitim slaytları oluşturacaksın.

ÖNEMLI KURALLAR:
- Tüm içerik Türkçe olmalı
- MEB 8. sınıf müfredatına uygun olmalı
- LGS sınavına hazırlık odaklı olmalı
- Basit ve anlaşılır dil kullan
- Her slayt kısa ve öz olmalı (max 80 kelime)
- Gerçek matematiksel formüller ve kavramlar kullan
- LGS tarzı örnek soru ve çözümü ekle
${inkilapExtra}
JSON formatında tam olarak 5 slayt döndür:
1. Giriş (icon: "intro") - Konuya kısa giriş, mascotMessage: "Hadi başlayalım! 🚀"
2. Kavram (icon: "concept") - Ana kavram ve formül, mascotMessage: "Bunu anlamak çok önemli! 📚"
3. Örnek (icon: "example") - LGS tarzı örnek soru ve çözümü, mascotMessage: "Birlikte çözelim! 💪"
4. İpucu (icon: "tip") - LGS sınav ipucu, mascotMessage: "Bunu unutma! ⭐"
5. Özet (icon: "summary") - Kısa özet, mascotMessage: "Harika iş çıkardın! 🎉"

ZORUNLU: Her slaytta mascotMessage alanı MUTLAKA olmalı!

Her slayt şu formatta olmalı:
{
  "title": "Başlık",
  "content": "İçerik",
  "icon": "intro|concept|example|tip|summary",
  "highlight": "Önemli not (opsiyonel)",
  "mascotMood": "happy|thinking|celebrating|encouraging",
  "mascotMessage": "Maskot mesajı (ZORUNLU)"
}`;

    // SECURITY: Sanitize user input before injecting into prompt
    const sanitizedSubject = subjectName.replace(/[^\w\sğüşıöçĞÜŞİÖÇ\-()]/g, '');
    const sanitizedUnit = unitName.replace(/[^\w\sğüşıöçĞÜŞİÖÇ\-().,]/g, '');

    const userPrompt = `Ders: ${sanitizedSubject}, Konu: ${sanitizedUnit} - 5 slayt oluştur, her slaytta mascotMessage olsun.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.5,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI servisi şu anda kullanılamıyor." }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(JSON.stringify({ error: "AI'dan yanıt alınamadı." }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse JSON from response
    let slides: LessonSlide[];
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        slides = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON array found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Ders içeriği ayrıştırılamadı." }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const defaultMascotMessages: Record<string, string> = {
      intro: "Hadi başlayalım! 🚀",
      concept: "Bunu anlamak çok önemli! 📚",
      example: "Birlikte çözelim! 💪",
      tip: "Bunu unutma! ⭐",
      summary: "Harika iş çıkardın! 🎉"
    };

    const validIcons = ['intro', 'concept', 'example', 'tip', 'summary'];
    const validMoods = ['happy', 'thinking', 'celebrating', 'encouraging'];

    slides = slides.slice(0, 10).map((slide, index) => {
      const icon = validIcons.includes(slide.icon) ? slide.icon : (index === 0 ? 'intro' : index === slides.length - 1 ? 'summary' : 'concept');
      const mood = validMoods.includes(slide.mascotMood || '') ? slide.mascotMood : 'happy';
      return {
        title: typeof slide.title === 'string' ? slide.title.slice(0, 200) : `Slayt ${index + 1}`,
        content: typeof slide.content === 'string' ? slide.content.slice(0, 2000) : "",
        icon: icon as LessonSlide['icon'],
        highlight: typeof slide.highlight === 'string' ? slide.highlight.slice(0, 500) : undefined,
        mascotMood: mood as LessonSlide['mascotMood'],
        mascotMessage: typeof slide.mascotMessage === 'string' ? slide.mascotMessage.slice(0, 200) : (defaultMascotMessages[icon] || "Devam et! 💪")
      };
    });

    return new Response(JSON.stringify({ slides }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating lesson:", error);
    return new Response(
      JSON.stringify({ error: "Bir hata oluştu. Lütfen tekrar deneyin." }),
      {
        status: 500,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      }
    );
  }
});
