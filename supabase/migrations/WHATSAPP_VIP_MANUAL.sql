-- ============================================
-- WhatsApp Ödemesi İçin Manuel VIP Verme SQL
-- ============================================
-- Bu SQL'i WhatsApp'tan ödeme yapan kullanıcılara VIP vermek için kullan
-- Supabase Dashboard > SQL Editor'de çalıştır

-- ============================================
-- KULLANIM: Aşağıdaki değerleri değiştir:
-- ============================================
-- 1. 'KULLANICI_EMAIL_BURAYA' → Kullanıcının email adresi
-- 2. 'plus' veya 'premium' → Plan tipi seç
--    - 'plus' = Aylık (₺49)
--    - 'premium' = Yıllık (₺399)
-- 3. INTERVAL → Süre belirle
--    - '1 month' = 1 ay (aylık için)
--    - '12 months' = 12 ay (yıllık için)

-- ============================================
-- ÖRNEK 1: AYLIK PLAN (PLUS) VERME
-- ============================================
-- Bu örneği kullan, sadece email'i değiştir:

/*
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Kullanıcının ID'sini bul
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'ornek@email.com'; -- BURAYA KULLANICININ EMAİLİNİ YAZ

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Kullanıcı bulunamadı!';
  END IF;

  -- VIP ver veya güncelle
  INSERT INTO user_subscriptions (
    user_id,
    plan_type,
    started_at,
    expires_at,
    is_active,
    features
  ) VALUES (
    v_user_id,
    'plus', -- Aylık plan
    NOW(),
    NOW() + INTERVAL '1 month', -- 1 ay
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

  RAISE NOTICE 'VIP verildi! User ID: %, Plan: Plus, Bitiş: %', v_user_id, NOW() + INTERVAL '1 month';
END $$;
*/

-- ============================================
-- ÖRNEK 2: YILLIK PLAN (PREMIUM) VERME
-- ============================================
-- Bu örneği kullan, sadece email'i değiştir:

/*
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Kullanıcının ID'sini bul
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'ornek@email.com'; -- BURAYA KULLANICININ EMAİLİNİ YAZ

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Kullanıcı bulunamadı!';
  END IF;

  -- VIP ver veya güncelle
  INSERT INTO user_subscriptions (
    user_id,
    plan_type,
    started_at,
    expires_at,
    is_active,
    features
  ) VALUES (
    v_user_id,
    'premium', -- Yıllık plan
    NOW(),
    NOW() + INTERVAL '12 months', -- 12 ay
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

  RAISE NOTICE 'VIP verildi! User ID: %, Plan: Premium, Bitiş: %', v_user_id, NOW() + INTERVAL '12 months';
END $$;
*/

-- ============================================
-- ÖRNEK 3: TOPLU VIP VERME (Birden fazla kullanıcı)
-- ============================================
-- WhatsApp'tan ödeme yapan birden fazla kullanıcıya tek seferde VIP ver:

/*
DO $$
DECLARE
  v_user_record RECORD;
  v_emails TEXT[] := ARRAY[
    'kullanici1@email.com',
    'kullanici2@email.com',
    'kullanici3@email.com'
  ]; -- BURAYA KULLANICI EMAİLLERİNİ YAZ
BEGIN
  FOR v_user_record IN
    SELECT id, email FROM auth.users WHERE email = ANY(v_emails)
  LOOP
    -- Her kullanıcıya VIP ver
    INSERT INTO user_subscriptions (
      user_id,
      plan_type,
      started_at,
      expires_at,
      is_active,
      features
    ) VALUES (
      v_user_record.id,
      'plus', -- Plan tipini buradan değiştirebilirsin
      NOW(),
      NOW() + INTERVAL '1 month', -- Süreyi buradan değiştirebilirsin
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
*/

-- ============================================
-- KULLANICI BİLGİLERİNİ GÖRÜNTÜLEME
-- ============================================
-- Kullanıcının mevcut VIP durumunu kontrol et:

/*
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
WHERE u.email = 'ornek@email.com'; -- BURAYA KULLANICININ EMAİLİNİ YAZ
*/

-- ============================================
-- TÜM VIP KULLANICILARI GÖRÜNTÜLEME
-- ============================================
-- Aktif VIP'leri listele:

/*
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
*/
