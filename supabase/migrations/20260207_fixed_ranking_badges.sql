-- FIXED Retroactive Badge Award Script with CORRECT Leaderboard Rankings
-- Awards ONLY the correct medals + cumulative top badges

DO $$
DECLARE
  user_record RECORD;
  badge_record RECORD;
  account_age_days INTEGER;
  quizzes_completed INTEGER;
  units_completed INTEGER;
  perfect_scores INTEGER;
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

    -- Count units completed
    SELECT COUNT(*) INTO units_completed
    FROM user_progress
    WHERE user_id = user_record.user_id
      AND completed = true;

    -- Count perfect scores
    SELECT COUNT(*) INTO perfect_scores
    FROM quiz_attempts
    WHERE user_id = user_record.user_id
      AND score = total_questions;

    -- =====================
    -- AWARD RANKING BADGES - FIXED LOGIC!
    -- =====================

    -- EXACT MATCH for medals (only give the medal they deserve)
    IF user_record.user_rank = 1 THEN
      -- Award Gold Medal ONLY
      INSERT INTO user_badges (user_id, badge_id)
      SELECT user_record.user_id, id FROM badges
      WHERE name = 'Altın Madalya' AND requirement_type = 'leaderboard_rank'
      ON CONFLICT DO NOTHING;
    ELSIF user_record.user_rank = 2 THEN
      -- Award Silver Medal ONLY
      INSERT INTO user_badges (user_id, badge_id)
      SELECT user_record.user_id, id FROM badges
      WHERE name = 'Gümüş Madalya' AND requirement_type = 'leaderboard_rank'
      ON CONFLICT DO NOTHING;
    ELSIF user_record.user_rank = 3 THEN
      -- Award Bronze Medal ONLY
      INSERT INTO user_badges (user_id, badge_id)
      SELECT user_record.user_id, id FROM badges
      WHERE name = 'Bronz Madalya' AND requirement_type = 'leaderboard_rank'
      ON CONFLICT DO NOTHING;
    END IF;

    -- CUMULATIVE for top groups (top 5, top 10, top 50)
    IF user_record.user_rank <= 5 THEN
      INSERT INTO user_badges (user_id, badge_id)
      SELECT user_record.user_id, id FROM badges
      WHERE name = 'Top 5' AND requirement_type = 'leaderboard_rank'
      ON CONFLICT DO NOTHING;
    END IF;

    IF user_record.user_rank <= 10 THEN
      INSERT INTO user_badges (user_id, badge_id)
      SELECT user_record.user_id, id FROM badges
      WHERE name = 'Top 10' AND requirement_type = 'leaderboard_rank'
      ON CONFLICT DO NOTHING;
    END IF;

    IF user_record.user_rank <= 50 THEN
      INSERT INTO user_badges (user_id, badge_id)
      SELECT user_record.user_id, id FROM badges
      WHERE name = 'Yarışmacı' AND requirement_type = 'leaderboard_rank'
      ON CONFLICT DO NOTHING;
    END IF;

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
    -- AWARD LEAGUE BADGES
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

  RAISE NOTICE '✅ Badges awarded successfully!';
END $$;

-- Summary Report
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
  RAISE NOTICE 'ROZET DAĞITIM ÖZETİ';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Toplam Kullanıcı: %', total_users;
  RAISE NOTICE 'Toplam Rozet: %', total_awarded_badges;
  RAISE NOTICE 'Kullanıcı Başına Ortalama: %', avg_badges_per_user;
  RAISE NOTICE '========================================';
END $$;

-- Show Top 10 users with their badges
SELECT
  p.display_name as "Kullanıcı",
  p.total_xp as "XP",
  ROW_NUMBER() OVER (ORDER BY p.total_xp DESC) as "Sıra",
  COUNT(ub.id) as "Rozet Sayısı",
  STRING_AGG(b.icon || ' ' || b.name, ', ' ORDER BY b.category, b.requirement_value DESC) as "Rozetler"
FROM profiles p
LEFT JOIN user_badges ub ON ub.user_id = p.user_id
LEFT JOIN badges b ON b.id = ub.badge_id
GROUP BY p.user_id, p.display_name, p.total_xp
ORDER BY p.total_xp DESC
LIMIT 10;
