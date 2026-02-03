# ÖDEME ENTEGRASYONU İÇİN LOVABLE TALİMATLARI

## 🔌 Stripe veya iyzico Entegrasyonu Ekleyin

**Lovable'a söylemeniz gerekenler:**

### 1️⃣ **Stripe Entegrasyonu (Önerilen - Uluslararası)**

```
Stripe ödeme entegrasyonu ekle:
1. Stripe API anahtarlarını environment variables'a ekle
2. SubscriptionPage.tsx'te handleConfirmPayment fonksiyonunu güncelle
3. Stripe Checkout Session oluştur
4. Ödeme başarılıysa user_subscriptions tablosunu güncelle
5. Webhook endpoint ekle (ödeme sonrası)

Paketler:
- Plus Aylık: ₺49/ay (price_id: price_xxx)
- Plus Yıllık: ₺399/yıl (price_id: price_yyy)
```

### 2️⃣ **iyzico Entegrasyonu (Türkiye için)**

```
iyzico ödeme entegrasyonu ekle:
1. iyzico API key ve secret'ı environment variables'a ekle
2. SubscriptionPage.tsx'te handleConfirmPayment fonksiyonunu güncelle
3. iyzico Checkout Form oluştur
4. Callback URL'leri ayarla (success/failure)
5. Ödeme başarılıysa user_subscriptions tablosunu güncelle

Paketler:
- Plus Aylık: ₺49/ay
- Plus Yıllık: ₺399/yıl
```

---

## 📋 Environment Variables

`.env.local` dosyasına eklenecekler:

### Stripe için:
```env
VITE_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### iyzico için:
```env
VITE_IYZICO_API_KEY=...
IYZICO_SECRET_KEY=...
IYZICO_BASE_URL=https://sandbox-api.iyzipay.com
```

---

## 🔧 Kod Değişiklikleri

**handleConfirmPayment fonksiyonunu şöyle güncelle:**

```typescript
const handleConfirmPayment = async () => {
  if (!planToUpgrade) return;

  try {
    // Stripe örneği:
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planType: planToUpgrade.planType,
        priceId: planToUpgrade.id === 'monthly' ? 'price_monthly' : 'price_yearly'
      })
    });

    const { url } = await response.json();

    // Stripe ödeme sayfasına yönlendir
    window.location.href = url;

  } catch (error) {
    toast.error('Ödeme sayfasına yönlendirilirken hata oluştu');
  }
};
```

---

## 🎯 Webhook Endpoint

**Supabase Edge Function oluştur:**

```
supabase/functions/stripe-webhook/index.ts

- Stripe webhook'larını dinle
- payment_intent.succeeded event'inde:
  - user_subscriptions tablosunu güncelle
  - plan_type, started_at, expires_at ayarla
```

---

## ✅ Kontrol Listesi

Lovable'a ekletmeden önce:

- [ ] Stripe hesabı oluştur (stripe.com)
- [ ] Test mode API keys al
- [ ] Fiyat ID'lerini oluştur (Dashboard → Products)
- [ ] Webhook endpoint URL'ini Stripe'a kaydet
- [ ] Environment variables'ı ekle

---

## 🚀 Test Modu

Stripe test kartları:
- Başarılı: 4242 4242 4242 4242
- 3D Secure: 4000 0027 6000 3184
- Reddedilmiş: 4000 0000 0000 0002

iyzico test kartları:
- Başarılı: 5890 0400 0000 0001
- CVV: 123
- Expiry: 12/30

---

## 📝 Son Not

Şu anda `handleConfirmPayment` fonksiyonu **DEMO MOD**da çalışıyor.
Gerçek ödeme entegrasyonu için yukarıdaki adımları Lovable'a söyleyin.
