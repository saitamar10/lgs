# 🛒 SHOPIER ÖDEME ENTEGRASYONU

## 📋 Shopier Nedir?
Türkiye'nin en popüler ödeme gateway'lerinden biri. Kredi kartı, banka kartı ve havale ile ödeme kabul eder.

---

## 🔑 1. Shopier Hesabı Oluşturma

1. **Shopier'e kaydol**: https://www.shopier.com
2. **API Bilgilerini al**:
   - Ayarlar → API Ayarları
   - API Key
   - API Secret

---

## 🔧 2. Environment Variables

`.env.local` dosyasına ekle:

```env
VITE_SHOPIER_API_KEY=your_api_key_here
SHOPIER_API_SECRET=your_api_secret_here
VITE_APP_URL=http://localhost:5173
```

Production için:
```env
VITE_APP_URL=https://yourdomain.com
```

---

## 📝 3. Supabase Edge Function Oluştur

### `supabase/functions/create-shopier-payment/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { planType, userId, userEmail } = await req.json()

    const apiKey = Deno.env.get('SHOPIER_API_KEY')!
    const apiSecret = Deno.env.get('SHOPIER_API_SECRET')!
    const baseUrl = Deno.env.get('APP_URL')!

    // Plan fiyatlarını belirle
    const prices = {
      plus: { amount: 49, currency: 'TRY', name: 'Plus Aylık' },
      premium: { amount: 399, currency: 'TRY', name: 'Plus Yıllık' }
    }

    const selectedPlan = prices[planType as keyof typeof prices]

    // Shopier API isteği
    const shopierPayload = {
      API_key: apiKey,
      website_index: 1, // Shopier'den aldığınız website index
      platform_order_id: `order_${Date.now()}_${userId}`,
      product_name: selectedPlan.name,
      product_type: 2, // Dijital ürün
      buyer_name: userEmail,
      buyer_email: userEmail,
      buyer_phone: '', // Opsiyonel
      total_order_value: selectedPlan.amount,
      currency: selectedPlan.currency,
      modul_version: 'LGS_APP_v1',
      callback_url: `${baseUrl}/api/shopier-callback`,
      current_language: 'TR'
    }

    // Shopier'e istek gönder
    const shopierResponse = await fetch('https://www.shopier.com/api/create_order/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shopierPayload)
    })

    const shopierData = await shopierResponse.json()

    if (shopierData.status === 'success') {
      return new Response(
        JSON.stringify({
          url: shopierData.payment_url,
          orderId: shopierPayload.platform_order_id
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      throw new Error('Shopier ödeme oluşturulamadı')
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

---

## 📥 4. Shopier Webhook (Callback) Handler

### `supabase/functions/shopier-webhook/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const formData = await req.formData()
    const platform_order_id = formData.get('platform_order_id')
    const status = formData.get('status') // 'success' veya 'failed'
    const payment_id = formData.get('payment_id')

    if (status === 'success') {
      // Order ID'den userId ve planType'ı çıkar
      // Format: order_timestamp_userId
      const userId = platform_order_id.split('_')[2]

      // Supabase client oluştur
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      )

      // Plan tipini belirle (order notlarından veya veritabanından)
      // Basit örnek: aylık 49TL, yıllık 399TL
      const amount = parseFloat(formData.get('total_order_value'))
      const planType = amount === 399 ? 'premium' : 'plus'

      const expiresAt = new Date()
      if (planType === 'plus') {
        expiresAt.setMonth(expiresAt.getMonth() + 1)
      } else {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1)
      }

      // Subscription'ı güncelle
      await supabase
        .from('user_subscriptions')
        .update({
          plan_type: planType,
          is_active: true,
          started_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
          cancelled_at: null,
          features: {
            unlimited_hearts: true,
            ad_free: true,
            ai_coach: true,
            special_badges: true
          }
        })
        .eq('user_id', userId)

      console.log(`Subscription updated for user ${userId}`)
    }

    return new Response('OK', { status: 200 })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Error', { status: 500 })
  }
})
```

---

## 🎨 5. Frontend Kodu Güncelleme

### `src/pages/SubscriptionPage.tsx` içinde `handleConfirmPayment`:

```typescript
const handleConfirmPayment = async () => {
  if (!planToUpgrade) return;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Shopier ödeme linki oluştur
    const response = await supabase.functions.invoke('create-shopier-payment', {
      body: {
        planType: planToUpgrade.planType,
        userId: user.id,
        userEmail: user.email
      }
    });

    if (response.error) throw response.error;

    const { url, orderId } = response.data;

    // Order ID'yi localStorage'a kaydet (callback'de kullanmak için)
    localStorage.setItem('pending_order_id', orderId);

    // Shopier ödeme sayfasına yönlendir
    window.location.href = url;

  } catch (error) {
    console.error('Payment error:', error);
    toast.error('Ödeme sayfasına yönlendirilirken hata oluştu');
  }
};
```

---

## 🔄 6. Callback Sayfası

### `src/pages/PaymentCallback.tsx` oluştur:

```typescript
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function PaymentCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const orderId = params.get('order_id');

    if (status === 'success') {
      toast.success('Ödeme başarılı! Aboneliğiniz aktif edildi.');
      localStorage.removeItem('pending_order_id');

      // 2 saniye sonra abonelik sayfasına yönlendir
      setTimeout(() => {
        navigate('/subscription');
      }, 2000);
    } else {
      toast.error('Ödeme başarısız oldu.');
      setTimeout(() => {
        navigate('/subscription');
      }, 2000);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">⏳</div>
        <h1 className="text-2xl font-bold">Ödeme İşleniyor...</h1>
        <p className="text-muted-foreground mt-2">Lütfen bekleyin...</p>
      </div>
    </div>
  );
}
```

### Router'a ekle (`App.tsx`):

```typescript
<Route path="/payment-callback" element={<PaymentCallback />} />
```

---

## 📋 7. Lovable'a Söylemeniz Gerekenler

```
Shopier ödeme entegrasyonu ekle:

1. Environment variables ekle:
   - VITE_SHOPIER_API_KEY
   - SHOPIER_API_SECRET
   - VITE_APP_URL

2. Supabase Edge Functions oluştur:
   - create-shopier-payment (ödeme linki oluşturur)
   - shopier-webhook (ödeme callback'lerini dinler)

3. SubscriptionPage.tsx'te handleConfirmPayment'ı güncelle:
   - create-shopier-payment fonksiyonunu çağır
   - Dönen URL'e yönlendir

4. PaymentCallback.tsx sayfası oluştur
   - /payment-callback route'u ekle
   - Başarılı/başarısız ödeme kontrolü

5. Shopier ayarlarında callback URL'leri ayarla:
   - Success: https://yourdomain.com/payment-callback?status=success
   - Failed: https://yourdomain.com/payment-callback?status=failed
   - Webhook: https://your-project.supabase.co/functions/v1/shopier-webhook
```

---

## ✅ Test Checklist

- [ ] Shopier hesabı oluşturuldu
- [ ] API key/secret alındı
- [ ] Environment variables eklendi
- [ ] Edge functions deploy edildi
- [ ] Callback URL'leri Shopier'de ayarlandı
- [ ] Test ödemesi yapıldı
- [ ] Webhook çalışıyor
- [ ] Subscription güncelleniyor

---

## 🔒 Güvenlik Notları

1. **API Secret'ı asla frontend'de kullanma** - Sadece Edge Functions'da
2. **Webhook'larda signature doğrulaması yap** - Shopier'den gelen istekleri doğrula
3. **Order ID'leri unique olmalı** - Tekrarlanan ödemeleri engelle
4. **User ID kontrolü** - Webhook'ta user ID'yi doğrula

---

## 💡 Pro Tips

1. **Test Modu**: Shopier'de test ödemeleri yapabilirsiniz (sandbox)
2. **Email Bildirimleri**: Shopier otomatik email gönderir
3. **İade İşlemleri**: Shopier dashboard'dan yapılabilir
4. **Ödeme Planı**: Taksitli ödeme de desteklenir

---

## 📞 Shopier Destek

- Website: https://www.shopier.com
- Dokümantasyon: https://dev.shopier.com
- Destek: destek@shopier.com
