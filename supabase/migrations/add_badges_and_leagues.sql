-- Insert achievement badges
INSERT INTO public.badges (name, description, icon, requirement_type, requirement_value, is_premium) VALUES
  ('Bölüm Bitirici', 'İlk bölüm bitirme testini tamamla', '🎯', 'unit_final_completed', 1, false),
  ('Hız Canavarı', '3 dakikada bir testi bitir', '⚡', 'quick_test', 1, false),
  ('Sıralama 1.si', 'Liderlik tablosunda 1. ol', '🥇', 'leaderboard_rank', 1, false),
  ('Top 10', 'Liderlik tablosunda ilk 10\'a gir', '🏆', 'leaderboard_rank', 10, false),
  ('XP Avcısı', '1000 XP kazan', '💎', 'xp_earned', 1000, false),
  ('XP Ustası', '5000 XP kazan', '💠', 'xp_earned', 5000, false),
  ('Çaylak', '1. Lige çık', '🥉', 'league', 1, false),
  ('Amatör', '2. Lige çık', '🥈', 'league', 2, false),
  ('Profesyonel', '3. Lige çık', '🥇', 'league', 3, false),
  ('Uzman', '4. Lige çık', '💎', 'league', 4, false),
  ('Efsane', '5. Lige çık', '👑', 'league', 5, false),
  ('7 Günlük Seri', '7 gün üst üste giriş yap', '🔥', 'streak_days', 7, false),
  ('30 Günlük Seri', '30 gün üst üste giriş yap', '🌟', 'streak_days', 30, false),
  ('Quiz Ustası', '50 quiz tamamla', '📚', 'quizzes_completed', 50, false),
  ('Mükemmellik', 'Bir testi tam puanla bitir', '⭐', 'perfect_score', 1, false)
ON CONFLICT (name) DO NOTHING;

-- Add league field to profiles if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS league INTEGER DEFAULT 1;

-- Create function to calculate league based on XP
CREATE OR REPLACE FUNCTION calculate_league(xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
  IF xp >= 10000 THEN RETURN 5; -- Efsane
  ELSIF xp >= 6000 THEN RETURN 4; -- Uzman
  ELSIF xp >= 4000 THEN RETURN 3; -- Profesyonel
  ELSIF xp >= 2000 THEN RETURN 2; -- Amatör
  ELSIF xp >= 1000 THEN RETURN 1; -- Çaylak
  ELSE RETURN 0; -- Henüz lige girmedi
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Update all users' leagues based on their current XP
UPDATE public.profiles SET league = calculate_league(total_xp);

-- Function to search users by friendship code (UUID text search)
CREATE OR REPLACE FUNCTION search_users_by_friendship_code(
  search_code TEXT,
  excluded_ids UUID[]
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  display_name TEXT,
  total_xp INTEGER,
  avatar_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.user_id, p.display_name, p.total_xp, p.avatar_url
  FROM profiles p
  WHERE p.user_id::text ILIKE search_code || '%'
    AND NOT (p.user_id = ANY(excluded_ids))
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;
