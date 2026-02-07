# AI Coach Edge Function - Deploy Talimatları

## ⚠️ ÖNEMLİ: Bu kodu Supabase Dashboard'a kopyalayıp yapıştırın

1. https://supabase.com/dashboard → Projenizi açın
2. Sol menüden **Edge Functions** seçin
3. **ai-coach** function'ını bulun ve tıklayın
4. **Deploy new version** butonuna tıklayın
5. Aşağıdaki kodu TAMAMEN kopyalayıp yapıştırın
6. **Deploy** butonuna tıklayın

---

## 📋 GÜNCEL KOD (Vision API Desteği ile):

```typescript
// Edge function for AI Coach - Question Solving Assistant

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

const SYSTEM_PROMPT = `Sen bir LGS öğretmenisin. Öğrenciye soruyu adım adım, temel seviyeden başlayarak açıkla.

KURALLARIN:
1. Her adımı numaralandır ve açıkla
2. Temel kavramları hatırlat
3. Formülleri göster
4. Örnek ver
5. Nihai cevabı net ver
6. Öğrenci seviyesinde, basit dil kullan
7. Markdown formatında yanıt ver (başlıklar, listeler, kalın yazı kullan)

LGS Konuları:
- Türkçe (40 soru)
- Matematik (20 soru)
- Fen Bilimleri (20 soru)
- İnkılap Tarihi ve Atatürkçülük (10 soru)
- Din Kültürü (10 soru)
- İngilizce (10 soru)

Yanıt Formatı:
## 📚 Konu
[Konunun adı]

## 🎯 Adım Adım Çözüm

### Adım 1: [Başlık]
[Açıklama]

### Adım 2: [Başlık]
[Açıklama]

## ✅ Nihai Cevap
[Net cevap]

## 💡 Hatırlatma
[Önemli not veya tüyo]`

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

    // Build user message content
    let userContent: any;

    if (imageBase64) {
      // Extract base64 data (remove data:image/xxx;base64, prefix if present)
      const base64Data = imageBase64.includes(',')
        ? imageBase64.split(',')[1]
        : imageBase64;

      // Detect image type from base64 prefix
      const imageType = imageBase64.includes('image/png')
        ? 'image/png'
        : imageBase64.includes('image/jpeg') || imageBase64.includes('image/jpg')
        ? 'image/jpeg'
        : 'image/png'; // default

      // Vision mode: send both image and text
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
      // Text-only mode
      userContent = message;
    }

    // Build messages array
    const messages = [
      { role: 'user' as const, content: userContent }
    ];

    // Call Lovable AI Gateway with vision support
    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp', // Gemini 2.0 with vision support
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        max_tokens: 2000, // Increased for detailed explanations
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
```

---

## ✅ Deploy Sonrası Kontrol:

1. Edge function deploy olduktan sonra (yeşil tik göreceksiniz)
2. Mobil/web uygulamadan AI Coach'a gidin
3. Bir matematik sorusu yazın veya soru görseli yükleyin
4. Artık görseldeki soruyu okuyup adım adım çözüm verecek! 🎉

## 🔑 Farklar (Eski vs Yeni):

| Özellik | Eski Version | Yeni Version |
|---------|-------------|--------------|
| Görsel okuma | ❌ Yok | ✅ Var (Vision API) |
| Model | gemini-3-flash-preview | gemini-2.0-flash-exp |
| Conversation history | ✅ Database'den çekiyor | ❌ Tek soru modu |
| imageBase64 parametresi | ❌ Yok | ✅ Var |
| Max tokens | 1000 | 2000 |
| Prompt | Genel koç | Soru çözme odaklı |

Deploy ettikten sonra test edin! 🚀
