# 📝 Supabase SQL Komutları

Bu dosya WhatsApp ödemesi yapan kullanıcılara VIP vermek ve günlük görevleri yönetmek için kullanılır.

---

## 🚀 HIZLI BAŞLANGIÇ

### 1️⃣ Günlük Görevlerden "Seriyi Koru" Görevini Kaldır

**Supabase Dashboard → SQL Editor** - Bunu çalıştır:

```sql
-- "Seriyi Koru" görevini siler
DELETE FROM daily_tasks
WHERE task_type = 'maintain_streak'
   OR title ILIKE '%seri%koru%'
   OR title ILIKE '%streak%';

-- İlerleme kayıtları KORUNUYOR - silinmiyor!
```

✅ **Ne Olur:** Günlük görevlerden "Seriyi Koru" görevi kalkacak

---

### 2️⃣ WhatsApp Ödemesi Yapan Kullanıcıya VIP Ver

**Supabase Dashboard → SQL Editor** - Bunu çalıştır:

#### 🟢 AYLIK PLAN (₺49 - 1 Ay)

```sql
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Kullanıcının ID'sini bul
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'kullanici@email.com'; -- 👈 BURAYA KULLANICININ EMAİLİNİ YAZ

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Kullanıcı bulunamadı!';
  END IF;

  -- VIP ver
  INSERT INTO user_subscriptions (
    user_id, plan_type, started_at, expires_at, is_active, features
  ) VALUES (
    v_user_id,
    'plus',
    NOW(),
    NOW() + INTERVAL '1 month',
    true,
    '{"unlimited_hearts": true, "ad_free": true, "ai_coach": true, "special_badges": true}'::jsonb
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    plan_type = 'plus',
    started_at = NOW(),
    expires_at = NOW() + INTERVAL '1 month',
    is_active = true,
    features = '{"unlimited_hearts": true, "ad_free": true, "ai_coach": true, "special_badges": true}'::jsonb,
    updated_at = NOW();

  RAISE NOTICE 'VIP verildi! User ID: %, Bitiş: %', v_user_id, NOW() + INTERVAL '1 month';
END $$;
```

#### 🟡 YILLIK PLAN (₺399 - 12 Ay)

```sql
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Kullanıcının ID'sini bul
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'kullanici@email.com'; -- 👈 BURAYA KULLANICININ EMAİLİNİ YAZ

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Kullanıcı bulunamadı!';
  END IF;

  -- VIP ver
  INSERT INTO user_subscriptions (
    user_id, plan_type, started_at, expires_at, is_active, features
  ) VALUES (
    v_user_id,
    'premium',
    NOW(),
    NOW() + INTERVAL '12 months',
    true,
    '{"unlimited_hearts": true, "ad_free": true, "ai_coach": true, "special_badges": true}'::jsonb
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    plan_type = 'premium',
    started_at = NOW(),
    expires_at = NOW() + INTERVAL '12 months',
    is_active = true,
    features = '{"unlimited_hearts": true, "ad_free": true, "ai_coach": true, "special_badges": true}'::jsonb,
    updated_at = NOW();

  RAISE NOTICE 'VIP verildi! User ID: %, Bitiş: %', v_user_id, NOW() + INTERVAL '12 months';
END $$;
```

---

## 📊 KULLANICI KONTROLÜ

### Kullanıcının VIP Durumunu Kontrol Et

```sql
SELECT
  u.email,
  s.plan_type,
  s.started_at,
  s.expires_at,
  s.is_active,
  CASE
    WHEN s.expires_at IS NULL THEN 'Süresiz'
    WHEN s.expires_at > NOW() THEN 'Aktif (' || (s.expires_at::DATE - NOW()::DATE) || ' gün kaldı)'
    ELSE 'Süresi Dolmuş'
  END as durum
FROM auth.users u
LEFT JOIN user_subscriptions s ON s.user_id = u.id
WHERE u.email = 'kullanici@email.com'; -- 👈 BURAYA KULLANICININ EMAİLİNİ YAZ
```

### Tüm VIP Kullanıcıları Listele

```sql
SELECT
  u.email,
  s.plan_type,
  s.started_at,
  s.expires_at,
  (s.expires_at::DATE - NOW()::DATE) as kalan_gun
FROM auth.users u
INNER JOIN user_subscriptions s ON s.user_id = u.id
WHERE s.is_active = true
  AND s.plan_type IN ('plus', 'premium')
  AND (s.expires_at IS NULL OR s.expires_at > NOW())
ORDER BY s.expires_at DESC NULLS LAST;
```

---

## 🔧 GELİŞMİŞ KULLANIM

### Birden Fazla Kullanıcıya Toplu VIP Ver

```sql
DO $$
DECLARE
  v_user_record RECORD;
  v_emails TEXT[] := ARRAY[
    'kullanici1@email.com',
    'kullanici2@email.com',
    'kullanici3@email.com'
  ]; -- 👈 BURAYA KULLANICI EMAİLLERİNİ YAZ
BEGIN
  FOR v_user_record IN
    SELECT id, email FROM auth.users WHERE email = ANY(v_emails)
  LOOP
    INSERT INTO user_subscriptions (
      user_id, plan_type, started_at, expires_at, is_active, features
    ) VALUES (
      v_user_record.id,
      'plus', -- 👈 'plus' veya 'premium'
      NOW(),
      NOW() + INTERVAL '1 month', -- 👈 '1 month' veya '12 months'
      true,
      '{"unlimited_hearts": true, "ad_free": true, "ai_coach": true, "special_badges": true}'::jsonb
    )
    ON CONFLICT (user_id)
    DO UPDATE SET
      plan_type = 'plus',
      started_at = NOW(),
      expires_at = NOW() + INTERVAL '1 month',
      is_active = true,
      features = '{"unlimited_hearts": true, "ad_free": true, "ai_coach": true, "special_badges": true}'::jsonb,
      updated_at = NOW();

    RAISE NOTICE 'VIP verildi: %', v_user_record.email;
  END LOOP;
END $$;
```

### Kullanıcının VIP'ini İptal Et

```sql
UPDATE user_subscriptions
SET
  is_active = false,
  cancelled_at = NOW()
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'kullanici@email.com' -- 👈 BURAYA EMAİL YAZ
);
```

### VIP Süresini Uzat

```sql
-- Mevcut bitiş tarihine 1 ay ekle
UPDATE user_subscriptions
SET
  expires_at = expires_at + INTERVAL '1 month',
  updated_at = NOW()
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'kullanici@email.com' -- 👈 BURAYA EMAİL YAZ
);
```

---

## 📋 NOTLAR

### Plan Tipleri:
- `free` = Ücretsiz
- `plus` = Aylık (₺49)
- `premium` = Yıllık (₺399)

### Süre Örnekleri:
- `'1 month'` = 1 ay
- `'3 months'` = 3 ay
- `'6 months'` = 6 ay
- `'12 months'` = 12 ay / 1 yıl
- `'1 year'` = 1 yıl

### Features (Özellikler):
```json
{
  "unlimited_hearts": true,  // Sınırsız can
  "ad_free": true,          // Reklamsız
  "ai_coach": true,         // AI Koç
  "special_badges": true    // Özel rozetler
}
```

---

## 🎯 KULLANIM SENARYOSU

**Örnek: WhatsApp'tan ödeme geldi**

1. Kullanıcı WhatsApp'tan ₺49 ödedi
2. Email'ini aldın: `ahmet@example.com`
3. Supabase Dashboard > SQL Editor'e git
4. Yukarıdaki **AYLIK PLAN** SQL'ini kopyala
5. `'kullanici@email.com'` kısmını `'ahmet@example.com'` yap
6. **RUN** butonuna bas
7. ✅ Kullanıcı Plus üye oldu!

---

## ⚠️ ÖNEMLİ

- Email adresini **doğru** yaz (büyük/küçük harf fark eder)
- Plan tipini **doğru** seç (`plus` veya `premium`)
- Süreyi **doğru** ayarla (`1 month` veya `12 months`)
- Her değişiklikten sonra kullanıcının durumunu kontrol et
