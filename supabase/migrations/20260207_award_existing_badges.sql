-- Retroactive Badge Award Script
-- This script awards badges to existing users based on their current achievements

DO $$
DECLARE
  user_record RECORD;
  badge_record RECORD;
  account_age_days INTEGER;
  quizzes_completed INTEGER;
  units_completed INTEGER;
  perfect_scores INTEGER;
BEGIN
  -- Loop through all users
  FOR user_record IN
    SELECT
      p.user_id,
      p.total_xp,
      p.streak_days,
      p.created_at,
      us.plan_type,
      us.is_active
    FROM profiles p
    LEFT JOIN user_subscriptions us ON us.user_id = p.user_id
  LOOP
    -- Calculate account age in days
    account_age_days := EXTRACT(DAY FROM (NOW() - user_record.created_at));

    -- Count quizzes completed
    SELECT COUNT(*) INTO quizzes_completed
    FROM quiz_attempts
    WHERE user_id = user_record.user_id;

    -- Count units completed (based on user_progress)
    SELECT COUNT(*) INTO units_completed
    FROM user_progress
    WHERE user_id = user_record.user_id
      AND completed = true;

    -- Count perfect scores (100% correct)
    SELECT COUNT(*) INTO perfect_scores
    FROM quiz_attempts
    WHERE user_id = user_record.user_id
      AND score = total_questions;

    -- =====================
    -- AWARD XP BADGES
    -- =====================
    FOR badge_record IN
      SELECT id, requirement_value
      FROM badges
      WHERE requirement_type = 'xp_earned'
        AND (user_record.total_xp >= requirement_value)
    LOOP
      INSERT INTO user_badges (user_id, badge_id)
      VALUES (user_record.user_id, badge_record.id)
      ON CONFLICT DO NOTHING;
    END LOOP;

    -- =====================
    -- AWARD STREAK BADGES
    -- =====================
    FOR badge_record IN
      SELECT id, requirement_value
      FROM badges
      WHERE requirement_type = 'streak_days'
        AND (user_record.streak_days >= requirement_value)
    LOOP
      INSERT INTO user_badges (user_id, badge_id)
      VALUES (user_record.user_id, badge_record.id)
      ON CONFLICT DO NOTHING;
    END LOOP;

    -- =====================
    -- AWARD QUIZ BADGES
    -- =====================
    FOR badge_record IN
      SELECT id, requirement_value
      FROM badges
      WHERE requirement_type = 'quizzes_completed'
        AND (quizzes_completed >= requirement_value)
    LOOP
      INSERT INTO user_badges (user_id, badge_id)
      VALUES (user_record.user_id, badge_record.id)
      ON CONFLICT DO NOTHING;
    END LOOP;

    -- =====================
    -- AWARD UNIT COMPLETION BADGES
    -- =====================
    FOR badge_record IN
      SELECT id, requirement_value
      FROM badges
      WHERE requirement_type = 'units_completed'
        AND (units_completed >= requirement_value)
    LOOP
      INSERT INTO user_badges (user_id, badge_id)
      VALUES (user_record.user_id, badge_record.id)
      ON CONFLICT DO NOTHING;
    END LOOP;

    -- =====================
    -- AWARD PERFECT SCORE BADGES
    -- =====================
    FOR badge_record IN
      SELECT id, requirement_value
      FROM badges
      WHERE requirement_type = 'perfect_scores'
        AND (perfect_scores >= requirement_value)
    LOOP
      INSERT INTO user_badges (user_id, badge_id)
      VALUES (user_record.user_id, badge_record.id)
      ON CONFLICT DO NOTHING;
    END LOOP;

    -- =====================
    -- AWARD ACCOUNT AGE BADGES
    -- =====================
    FOR badge_record IN
      SELECT id, requirement_value
      FROM badges
      WHERE requirement_type = 'account_age_days'
        AND (account_age_days >= requirement_value)
    LOOP
      INSERT INTO user_badges (user_id, badge_id)
      VALUES (user_record.user_id, badge_record.id)
      ON CONFLICT DO NOTHING;
    END LOOP;

    -- =====================
    -- AWARD LEAGUE BADGES (based on XP)
    -- =====================
    -- Çaylak Lig (1000 XP)
    IF user_record.total_xp >= 1000 THEN
      INSERT INTO user_badges (user_id, badge_id)
      SELECT user_record.user_id, id
      FROM badges
      WHERE requirement_type = 'league_level' AND requirement_value = 1
      ON CONFLICT DO NOTHING;
    END IF;

    -- Amatör Lig (2000 XP)
    IF user_record.total_xp >= 2000 THEN
      INSERT INTO user_badges (user_id, badge_id)
      SELECT user_record.user_id, id
      FROM badges
      WHERE requirement_type = 'league_level' AND requirement_value = 2
      ON CONFLICT DO NOTHING;
    END IF;

    -- Profesyonel Lig (4000 XP)
    IF user_record.total_xp >= 4000 THEN
      INSERT INTO user_badges (user_id, badge_id)
      SELECT user_record.user_id, id
      FROM badges
      WHERE requirement_type = 'league_level' AND requirement_value = 3
      ON CONFLICT DO NOTHING;
    END IF;

    -- Uzman Lig (6000 XP)
    IF user_record.total_xp >= 6000 THEN
      INSERT INTO user_badges (user_id, badge_id)
      SELECT user_record.user_id, id
      FROM badges
      WHERE requirement_type = 'league_level' AND requirement_value = 4
      ON CONFLICT DO NOTHING;
    END IF;

    -- Efsane Lig (10000 XP)
    IF user_record.total_xp >= 10000 THEN
      INSERT INTO user_badges (user_id, badge_id)
      SELECT user_record.user_id, id
      FROM badges
      WHERE requirement_type = 'league_level' AND requirement_value = 5
      ON CONFLICT DO NOTHING;
    END IF;

    -- =====================
    -- AWARD PREMIUM BADGE
    -- =====================
    IF user_record.plan_type IN ('plus', 'premium') AND user_record.is_active = true THEN
      INSERT INTO user_badges (user_id, badge_id)
      SELECT user_record.user_id, id
      FROM badges
      WHERE requirement_type = 'is_premium'
      ON CONFLICT DO NOTHING;
    END IF;

  END LOOP;

  RAISE NOTICE 'Badges awarded successfully to all eligible users!';
END $$;

-- Create a summary of awarded badges
DO $$
DECLARE
  total_users INTEGER;
  total_awarded_badges INTEGER;
  avg_badges_per_user NUMERIC;
BEGIN
  SELECT COUNT(DISTINCT user_id) INTO total_users FROM profiles;
  SELECT COUNT(*) INTO total_awarded_badges FROM user_badges;

  IF total_users > 0 THEN
    avg_badges_per_user := ROUND(total_awarded_badges::NUMERIC / total_users, 2);
  ELSE
    avg_badges_per_user := 0;
  END IF;

  RAISE NOTICE '========================================';
  RAISE NOTICE 'BADGE DISTRIBUTION SUMMARY';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Total Users: %', total_users;
  RAISE NOTICE 'Total Badges Awarded: %', total_awarded_badges;
  RAISE NOTICE 'Average Badges per User: %', avg_badges_per_user;
  RAISE NOTICE '========================================';
END $$;

-- Show badge distribution by category
SELECT
  b.category as "Kategori",
  COUNT(DISTINCT ub.user_id) as "Kullanıcı Sayısı",
  COUNT(ub.id) as "Toplam Rozet"
FROM badges b
LEFT JOIN user_badges ub ON ub.badge_id = b.id
GROUP BY b.category
ORDER BY COUNT(ub.id) DESC;
