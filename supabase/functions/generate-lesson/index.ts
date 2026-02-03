import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface LessonSlide {
  title: string;
  content: string;
  icon: 'intro' | 'concept' | 'example' | 'tip' | 'summary';
  highlight?: string;
  mascotMood?: 'happy' | 'thinking' | 'celebrating' | 'encouraging';
  mascotMessage?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subjectName, unitName } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Sen bir 8. sınıf LGS eğitim uzmanısın. Verilen konu için Türkçe eğitim slaytları oluşturacaksın.

ÖNEMLI KURALLAR:
- Tüm içerik Türkçe olmalı
- MEB 8. sınıf müfredatına uygun olmalı
- LGS sınavına hazırlık odaklı olmalı
- Basit ve anlaşılır dil kullan
- Her slayt kısa ve öz olmalı (max 80 kelime)
- Gerçek matematiksel formüller ve kavramlar kullan
- LGS tarzı örnek soru ve çözümü ekle

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

    const userPrompt = `Ders: ${subjectName}, Konu: ${unitName} - 5 slayt oluştur, her slaytta mascotMessage olsun.`;

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
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content received from AI");
    }

    // Parse JSON from response
    let slides: LessonSlide[];
    try {
      // Try to extract JSON array from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        slides = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON array found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse lesson content");
    }

    // Default mascot messages for each slide type
    const defaultMascotMessages: Record<string, string> = {
      intro: "Hadi başlayalım! 🚀",
      concept: "Bunu anlamak çok önemli! 📚",
      example: "Birlikte çözelim! 💪",
      tip: "Bunu unutma! ⭐",
      summary: "Harika iş çıkardın! 🎉"
    };

    // Validate and ensure all slides have required fields including mascotMessage
    slides = slides.map((slide, index) => {
      const icon = slide.icon || (index === 0 ? 'intro' : index === slides.length - 1 ? 'summary' : 'concept');
      return {
        title: slide.title || `Slayt ${index + 1}`,
        content: slide.content || "",
        icon,
        highlight: slide.highlight,
        mascotMood: slide.mascotMood || 'happy',
        mascotMessage: slide.mascotMessage || defaultMascotMessages[icon] || "Devam et! 💪"
      };
    });

    return new Response(JSON.stringify({ slides }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating lesson:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
