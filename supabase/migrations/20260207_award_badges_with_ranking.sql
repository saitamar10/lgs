-- IMPROVED Retroactive Badge Award Script with Leaderboard Rankings
-- Awards badges based on current achievements AND leaderboard position

DO $$
DECLARE
  user_record RECORD;
  badge_record RECORD;
  account_age_days INTEGER;
  quizzes_completed INTEGER;
  units_completed INTEGER;
  perfect_scores INTEGER;
  user_rank INTEGER;
BEGIN
  -- First, create a temporary table with user rankings
  CREATE TEMP TABLE IF NOT EXISTS temp_user_rankings AS
  SELECT
    user_id,
    total_xp,
    ROW_NUMBER() OVER (ORDER BY total_xp DESC) as rank
  FROM profiles
  WHERE total_xp > 0;

  -- Loop through all users
  FOR user_record IN
    SELECT
      p.user_id,
      p.total_xp,
      p.streak_days,
      p.created_at,
      us.plan_type,
      us.is_active,
      COALESCE(tur.rank, 999999) as user_rank
    FROM profiles p
    LEFT JOIN user_subscriptions us ON us.user_id = p.user_id
    LEFT JOIN temp_user_rankings tur ON tur.user_id = p.user_id
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
    -- AWARD RANKING BADGES (MOST IMPORTANT!)
    -- =====================
    FOR badge_record IN
      SELECT id, requirement_value
      FROM badges
      WHERE requirement_type = 'leaderboard_rank'
        AND (user_record.user_rank <= requirement_value)
      ORDER BY requirement_value ASC
    LOOP
      INSERT INTO user_badges (user_id, badge_id)
      VALUES (user_record.user_id, badge_record.id)
      ON CONFLICT DO NOTHING;
    END LOOP;

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
    IF user_record.total_xp >= 1000 THEN
      INSERT INTO user_badges (user_id, badge_id)
      SELECT user_record.user_id, id FROM badges
      WHERE requirement_type = 'league_level' AND requirement_value = 1
      ON CONFLICT DO NOTHING;
    END IF;

    IF user_record.total_xp >= 2000 THEN
      INSERT INTO user_badges (user_id, badge_id)
      SELECT user_record.user_id, id FROM badges
      WHERE requirement_type = 'league_level' AND requirement_value = 2
      ON CONFLICT DO NOTHING;
    END IF;

    IF user_record.total_xp >= 4000 THEN
      INSERT INTO user_badges (user_id, badge_id)
      SELECT user_record.user_id, id FROM badges
      WHERE requirement_type = 'league_level' AND requirement_value = 3
      ON CONFLICT DO NOTHING;
    END IF;

    IF user_record.total_xp >= 6000 THEN
      INSERT INTO user_badges (user_id, badge_id)
      SELECT user_record.user_id, id FROM badges
      WHERE requirement_type = 'league_level' AND requirement_value = 4
      ON CONFLICT DO NOTHING;
    END IF;

    IF user_record.total_xp >= 10000 THEN
      INSERT INTO user_badges (user_id, badge_id)
      SELECT user_record.user_id, id FROM badges
      WHERE requirement_type = 'league_level' AND requirement_value = 5
      ON CONFLICT DO NOTHING;
    END IF;

    -- =====================
    -- AWARD PREMIUM BADGE
    -- =====================
    IF user_record.plan_type IN ('plus', 'premium') AND user_record.is_active = true THEN
      INSERT INTO user_badges (user_id, badge_id)
      SELECT user_record.user_id, id FROM badges
      WHERE requirement_type = 'is_premium'
      ON CONFLICT DO NOTHING;
    END IF;

  END LOOP;

  -- Cleanup
  DROP TABLE IF EXISTS temp_user_rankings;

  RAISE NOTICE 'Badges awarded successfully to all eligible users!';
END $$;

-- Show detailed summary
DO $$
DECLARE
  total_users INTEGER;
  total_awarded_badges INTEGER;
  avg_badges_per_user NUMERIC;
  top_user_badges INTEGER;
BEGIN
  SELECT COUNT(DISTINCT user_id) INTO total_users FROM profiles;
  SELECT COUNT(*) INTO total_awarded_badges FROM user_badges;

  SELECT COUNT(*) INTO top_user_badges
  FROM user_badges
  WHERE user_id = (
    SELECT user_id FROM profiles ORDER BY total_xp DESC LIMIT 1
  );

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
  RAISE NOTICE 'Top User (Rank 1) Badges: %', top_user_badges;
  RAISE NOTICE '========================================';
END $$;

-- Show top users with their badges
SELECT
  p.display_name as "Kullanıcı",
  p.total_xp as "XP",
  COUNT(ub.id) as "Rozet Sayısı",
  STRING_AGG(b.icon || ' ' || b.name, ', ' ORDER BY b.category, b.requirement_value DESC) as "Rozetler"
FROM profiles p
LEFT JOIN user_badges ub ON ub.user_id = p.user_id
LEFT JOIN badges b ON b.id = ub.badge_id
GROUP BY p.user_id, p.display_name, p.total_xp
ORDER BY p.total_xp DESC
LIMIT 10;
