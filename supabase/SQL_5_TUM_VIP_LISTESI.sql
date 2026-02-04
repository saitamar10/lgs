-- ============================================
-- TUM VIP KULLANICILARI LISTELE
-- ============================================

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
