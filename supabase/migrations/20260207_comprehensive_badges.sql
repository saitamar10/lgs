-- Comprehensive Badge System Migration
-- This migration adds a complete set of achievement badges for the learning platform

-- First, clear existing badges to start fresh
TRUNCATE TABLE public.badges CASCADE;

-- =======================
-- KONU BAŞARISI ROZETLERİ
-- =======================
INSERT INTO public.badges (name, description, icon, category, requirement_type, requirement_value, is_premium) VALUES
  ('İlk Adım', 'İlk konunu tamamla', '🎯', 'topic', 'units_completed', 1, false),
  ('Konu Avcısı', '5 konu tamamla', '📚', 'topic', 'units_completed', 5, false),
  ('Bilgi Canavarı', '10 konu tamamla', '🦁', 'topic', 'units_completed', 10, false),
  ('Uzman Öğrenci', '25 konu tamamla', '🎓', 'topic', 'units_completed', 25, false),
  ('Konu Ustası', '50 konu tamamla', '👨‍🎓', 'topic', 'units_completed', 50, false),
  ('Bilge Profesör', '100 konu tamamla', '👨‍🏫', 'topic', 'units_completed', 100, false);

-- =======================
-- SKOR & SIRALAMA ROZETLERİ
-- =======================
INSERT INTO public.badges (name, description, icon, category, requirement_type, requirement_value, is_premium) VALUES
  ('Altın Madalya', 'Sıralamada 1. ol', '🥇', 'ranking', 'leaderboard_rank', 1, false),
  ('Gümüş Madalya', 'Sıralamada 2. ol', '🥈', 'ranking', 'leaderboard_rank', 2, false),
  ('Bronz Madalya', 'Sıralamada 3. ol', '🥉', 'ranking', 'leaderboard_rank', 3, false),
  ('Top 5', 'Sıralamada ilk 5''e gir', '🏆', 'ranking', 'leaderboard_rank', 5, false),
  ('Top 10', 'Sıralamada ilk 10''a gir', '🎖️', 'ranking', 'leaderboard_rank', 10, false),
  ('Yarışmacı', 'Sıralamada ilk 50''ye gir', '🎯', 'ranking', 'leaderboard_rank', 50, false);

-- =======================
-- XP KAZANMA ROZETLERİ
-- =======================
INSERT INTO public.badges (name, description, icon, category, requirement_type, requirement_value, is_premium) VALUES
  ('XP Başlangıcı', '100 XP kazan', '⭐', 'xp', 'xp_earned', 100, false),
  ('XP Toplayıcı', '500 XP kazan', '✨', 'xp', 'xp_earned', 500, false),
  ('XP Avcısı', '1000 XP kazan', '💎', 'xp', 'xp_earned', 1000, false),
  ('XP Ustası', '2500 XP kazan', '💠', 'xp', 'xp_earned', 2500, false),
  ('XP Efsanesi', '5000 XP kazan', '🌟', 'xp', 'xp_earned', 5000, false),
  ('XP Tanrısı', '10000 XP kazan', '👑', 'xp', 'xp_earned', 10000, false),
  ('XP İmparatoru', '25000 XP kazan', '🔱', 'xp', 'xp_earned', 25000, false);

-- =======================
-- GÜNLÜK SERİ ROZETLERİ
-- =======================
INSERT INTO public.badges (name, description, icon, category, requirement_type, requirement_value, is_premium) VALUES
  ('Kararlı', '3 gün üst üste giriş yap', '🔥', 'streak', 'streak_days', 3, false),
  ('Azimli', '7 gün üst üste giriş yap', '🔥🔥', 'streak', 'streak_days', 7, false),
  ('İstikrarlı', '14 gün üst üste giriş yap', '🌟', 'streak', 'streak_days', 14, false),
  ('Disiplinli', '30 gün üst üste giriş yap', '⚡', 'streak', 'streak_days', 30, false),
  ('Ateşli', '60 gün üst üste giriş yap', '💫', 'streak', 'streak_days', 60, false),
  ('Yılmaz', '100 gün üst üste giriş yap', '🌠', 'streak', 'streak_days', 100, false),
  ('Efsane Seri', '365 gün üst üste giriş yap', '🏆', 'streak', 'streak_days', 365, false);

-- =======================
-- QUIZ TAMAMLAMA ROZETLERİ
-- =======================
INSERT INTO public.badges (name, description, icon, category, requirement_type, requirement_value, is_premium) VALUES
  ('İlk Quiz', 'İlk quiz''ini tamamla', '📝', 'quiz', 'quizzes_completed', 1, false),
  ('Quiz Meraklısı', '10 quiz tamamla', '📚', 'quiz', 'quizzes_completed', 10, false),
  ('Quiz Tutkunu', '25 quiz tamamla', '📖', 'quiz', 'quizzes_completed', 25, false),
  ('Quiz Ustası', '50 quiz tamamla', '🎯', 'quiz', 'quizzes_completed', 50, false),
  ('Quiz Kralı', '100 quiz tamamla', '👑', 'quiz', 'quizzes_completed', 100, false),
  ('Quiz Efsanesi', '250 quiz tamamla', '🔥', 'quiz', 'quizzes_completed', 250, false),
  ('Quiz Tanrısı', '500 quiz tamamla', '⚡', 'quiz', 'quizzes_completed', 500, false);

-- =======================
-- MÜKEMMELLİK ROZETLERİ
-- =======================
INSERT INTO public.badges (name, description, icon, category, requirement_type, requirement_value, is_premium) VALUES
  ('İlk Tam Puan', 'İlk defa tam puan al', '⭐', 'perfect', 'perfect_scores', 1, false),
  ('Mükemmeliyetçi', '5 quiz''de tam puan al', '🌟', 'perfect', 'perfect_scores', 5, false),
  ('Kusursuz', '10 quiz''de tam puan al', '💯', 'perfect', 'perfect_scores', 10, false),
  ('Hatasız Yıldız', '25 quiz''de tam puan al', '✨', 'perfect', 'perfect_scores', 25, false),
  ('Mükemmellik Ustası', '50 quiz''de tam puan al', '💎', 'perfect', 'perfect_scores', 50, false);

-- =======================
-- HIZ ROZETLERİ
-- =======================
INSERT INTO public.badges (name, description, icon, category, requirement_type, requirement_value, is_premium) VALUES
  ('Hızlı Düşünür', 'Bir quiz''i 3 dakikada bitir', '⚡', 'speed', 'speed_completion', 1, false),
  ('Şimşek', '5 quiz''i hızlı tamamla', '⚡⚡', 'speed', 'speed_completion', 5, false),
  ('Hız Canavarı', '10 quiz''i hızlı tamamla', '🚀', 'speed', 'speed_completion', 10, false),
  ('Sürat Ustası', '25 quiz''i hızlı tamamla', '💨', 'speed', 'speed_completion', 25, false);

-- =======================
-- LİG ROZETLERİ
-- =======================
INSERT INTO public.badges (name, description, icon, category, requirement_type, requirement_value, is_premium) VALUES
  ('Çaylak Lig', '1. Lige çık', '🥉', 'league', 'league_level', 1, false),
  ('Amatör Lig', '2. Lige çık', '🥈', 'league', 'league_level', 2, false),
  ('Profesyonel Lig', '3. Lige çık', '🥇', 'league', 'league_level', 3, false),
  ('Uzman Lig', '4. Lige çık', '💎', 'league', 'league_level', 4, false),
  ('Efsane Lig', '5. Lige çık', '👑', 'league', 'league_level', 5, false);

-- =======================
-- SOSYAL ROZETLERİ
-- =======================
INSERT INTO public.badges (name, description, icon, category, requirement_type, requirement_value, is_premium) VALUES
  ('Sosyal Kelebek', 'İlk arkadaşını ekle', '🦋', 'social', 'friends_added', 1, false),
  ('Popüler', '5 arkadaş ekle', '👥', 'social', 'friends_added', 5, false),
  ('Sosyal Ağ', '10 arkadaş ekle', '🌐', 'social', 'friends_added', 10, false),
  ('Topluluk Lideri', '25 arkadaş ekle', '👑', 'social', 'friends_added', 25, false);

-- =======================
-- ÖZEL & PREMIUM ROZETLERİ
-- =======================
INSERT INTO public.badges (name, description, icon, category, requirement_type, requirement_value, is_premium) VALUES
  ('Plus Üye', 'Plus üyelik al', '💎', 'special', 'is_premium', 1, true),
  ('Erken Kuş', 'Sabah 6''dan önce giriş yap', '🌅', 'special', 'early_bird', 1, false),
  ('Gece Baykuşu', 'Gece 12''den sonra çalış', '🦉', 'special', 'night_owl', 1, false),
  ('Hafta Sonu Savaşçısı', 'Hafta sonu 10 quiz tamamla', '⚔️', 'special', 'weekend_warrior', 1, false),
  ('Beta Kullanıcı', 'Beta testçisi ol', '🚀', 'special', 'beta_tester', 1, true),
  ('İlk 100', 'İlk 100 kullanıcıdan ol', '🎖️', 'special', 'early_adopter', 1, true);

-- =======================
-- BİLGİ USTALIĞI ROZETLERİ
-- =======================
INSERT INTO public.badges (name, description, icon, category, requirement_type, requirement_value, is_premium) VALUES
  ('Matematik Dehası', 'Matematik konularında 1000 XP kazan', '🔢', 'subject', 'subject_xp_math', 1000, false),
  ('Fizik Bilgini', 'Fizik konularında 1000 XP kazan', '⚛️', 'subject', 'subject_xp_physics', 1000, false),
  ('Kimya Uzmanı', 'Kimya konularında 1000 XP kazan', '⚗️', 'subject', 'subject_xp_chemistry', 1000, false),
  ('Biyoloji Profesörü', 'Biyoloji konularında 1000 XP kazan', '🧬', 'subject', 'subject_xp_biology', 1000, false),
  ('Tarih Bilgesi', 'Tarih konularında 1000 XP kazan', '📜', 'subject', 'subject_xp_history', 1000, false),
  ('Edebiyat Aşığı', 'Edebiyat konularında 1000 XP kazan', '📚', 'subject', 'subject_xp_literature', 1000, false);

-- =======================
-- BAŞARI GEMİ ROZETLERİ
-- =======================
INSERT INTO public.badges (name, description, icon, category, requirement_type, requirement_value, is_premium) VALUES
  ('Yeni Yolculuk', 'Öğrenme yolculuğuna başla', '🎒', 'milestone', 'account_age_days', 1, false),
  ('Bir Haftalık', '1 hafta üye kal', '📅', 'milestone', 'account_age_days', 7, false),
  ('Aylık Üye', '1 ay üye kal', '📆', 'milestone', 'account_age_days', 30, false),
  ('Sadık Öğrenci', '3 ay üye kal', '🎓', 'milestone', 'account_age_days', 90, false),
  ('Yıllık Yıldız', '1 yıl üye kal', '⭐', 'milestone', 'account_age_days', 365, false);

-- Add index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_badges_category ON public.badges(category);
CREATE INDEX IF NOT EXISTS idx_badges_requirement_type ON public.badges(requirement_type);

-- Add index on user_badges for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_badges_user_badge ON public.user_badges(user_id, badge_id);
