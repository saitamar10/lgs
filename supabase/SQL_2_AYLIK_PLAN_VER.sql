-- ============================================
-- WHATSAPP ODEMESI AYLIK PLAN (TL 49 - 1 AY)
-- ============================================
-- Email adresini degistir ve calistir

DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Kullanicinin ID'sini bul
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'kullanici@email.com'; -- BURAYA KULLANICININ EMAILINI YAZ

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Kullanici bulunamadi!';
  END IF;

  -- VIP ver veya guncelle
  INSERT INTO user_subscriptions (
    user_id,
    plan_type,
    started_at,
    expires_at,
    is_active,
    features
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

  RAISE NOTICE 'VIP verildi! User ID: %, Plan: Plus, Bitis: %', v_user_id, NOW() + INTERVAL '1 month';
END $$;
