-- ============================================
-- KULLANICI VIP DURUMUNU KONTROL ET
-- ============================================
-- Email adresini degistir ve calistir

SELECT
  u.email,
  s.plan_type,
  s.started_at,
  s.expires_at,
  s.is_active,
  CASE
    WHEN s.expires_at IS NULL THEN 'Suresiz'
    WHEN s.expires_at > NOW() THEN 'Aktif (' || (s.expires_at::DATE - NOW()::DATE) || ' gun kaldi)'
    ELSE 'Suresi Dolmus'
  END as durum
FROM auth.users u
LEFT JOIN user_subscriptions s ON s.user_id = u.id
WHERE u.email = 'kullanici@email.com'; -- BURAYA KULLANICININ EMAILINI YAZ
