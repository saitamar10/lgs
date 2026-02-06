-- Function to automatically award Plus badge when user becomes premium
CREATE OR REPLACE FUNCTION award_plus_badge_on_premium()
RETURNS TRIGGER AS $$
DECLARE
  plus_badge_id UUID;
BEGIN
  -- Only proceed if plan_type changed to plus or premium and is_active is true
  IF (NEW.plan_type IN ('plus', 'premium')) AND
     (NEW.is_active = true) AND
     (OLD.plan_type IS NULL OR OLD.plan_type = 'free' OR OLD.is_active = false) THEN

    -- Get Plus badge ID
    SELECT id INTO plus_badge_id
    FROM badges
    WHERE name = 'Plus Üye'
    LIMIT 1;

    -- Award the badge if it exists and user doesn't have it
    IF plus_badge_id IS NOT NULL THEN
      INSERT INTO user_badges (user_id, badge_id)
      VALUES (NEW.user_id, plus_badge_id)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic Plus badge award
DROP TRIGGER IF EXISTS trigger_award_plus_badge ON user_subscriptions;
CREATE TRIGGER trigger_award_plus_badge
  AFTER INSERT OR UPDATE OF plan_type, is_active
  ON user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION award_plus_badge_on_premium();

-- Award Plus badge to existing premium users
DO $$
DECLARE
  plus_badge_id UUID;
BEGIN
  -- Get Plus badge ID
  SELECT id INTO plus_badge_id
  FROM badges
  WHERE name = 'Plus Üye'
  LIMIT 1;

  -- Award to all current premium/plus users who don't have it
  IF plus_badge_id IS NOT NULL THEN
    INSERT INTO user_badges (user_id, badge_id)
    SELECT us.user_id, plus_badge_id
    FROM user_subscriptions us
    WHERE us.plan_type IN ('plus', 'premium')
      AND us.is_active = true
      AND NOT EXISTS (
        SELECT 1 FROM user_badges ub
        WHERE ub.user_id = us.user_id
        AND ub.badge_id = plus_badge_id
      )
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
