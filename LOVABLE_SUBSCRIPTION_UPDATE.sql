-- ==========================================
-- ABONELIK İPTAL SİSTEMI - LOVABLE'A EKLET
-- ==========================================

-- 1. cancelled_at kolonu ekle
ALTER TABLE public.user_subscriptions
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE;

-- 2. Index ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_cancelled
ON public.user_subscriptions(cancelled_at)
WHERE cancelled_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_expires
ON public.user_subscriptions(expires_at)
WHERE expires_at IS NOT NULL;

-- 3. Süresi dolan abonelikleri otomatik free plana geçir
CREATE OR REPLACE FUNCTION expire_subscriptions()
RETURNS void AS $$
BEGIN
  UPDATE public.user_subscriptions
  SET
    plan_type = 'free',
    is_active = true,
    expires_at = NULL,
    features = jsonb_build_object(
      'unlimited_hearts', false,
      'ad_free', false,
      'ai_coach', false,
      'special_badges', false
    )
  WHERE
    expires_at IS NOT NULL
    AND expires_at < NOW()
    AND plan_type != 'free';

  RAISE NOTICE 'Expired subscriptions updated to free plan';
END;
$$ LANGUAGE plpgsql;

-- 4. Manuel test için (Lovable'da çalıştır):
-- SELECT expire_subscriptions();

-- 5. OPSIYONEL: Otomatik her gün çalıştırmak için cron job
-- NOT: Supabase'de pg_cron extension gerektirir
-- Lovable'a ekletmek için şunu söyle:
-- "pg_cron extension ekle ve her gün gece expire_subscriptions() fonksiyonunu çalıştır"
--
-- SQL:
-- CREATE EXTENSION IF NOT EXISTS pg_cron;
-- SELECT cron.schedule('expire-subscriptions', '0 0 * * *', 'SELECT expire_subscriptions();');
