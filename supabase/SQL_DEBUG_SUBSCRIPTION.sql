-- ============================================
-- DEBUG: KULLANICININ ABONELIK DURUMUNU KONTROL ET
-- ============================================
-- Bu SQL ile kullanicinin tam durumunu gorebilirsin

SELECT
  u.id as user_id,
  u.email,
  u.created_at as kayit_tarihi,
  s.plan_type,
  s.is_active,
  s.started_at,
  s.expires_at,
  s.cancelled_at,
  s.features,
  CASE
    WHEN s.expires_at IS NULL THEN 'HATA: Bitis tarihi YOK!'
    WHEN s.expires_at > NOW() THEN 'AKTIF (' || (s.expires_at::DATE - NOW()::DATE) || ' gun kaldi)'
    WHEN s.expires_at <= NOW() THEN 'SURESI DOLMUS!'
    ELSE 'BILINMEYEN DURUM'
  END as durum,
  CASE
    WHEN s.is_active = true THEN 'EVET'
    WHEN s.is_active = false THEN 'HAYIR'
    ELSE 'NULL'
  END as is_active_durum
FROM auth.users u
LEFT JOIN user_subscriptions s ON s.user_id = u.id
WHERE u.email = 'kullanici@email.com' -- BURAYA KULLANICININ EMAILINI YAZ
ORDER BY s.created_at DESC;
