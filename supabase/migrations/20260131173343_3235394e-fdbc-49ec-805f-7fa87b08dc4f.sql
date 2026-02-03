-- =============================================
-- 1. USER HEARTS TABLE (persistent hearts in DB)
-- =============================================
CREATE TABLE public.user_hearts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  hearts INTEGER NOT NULL DEFAULT 5,
  max_hearts INTEGER NOT NULL DEFAULT 5,
  last_heart_lost_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_hearts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own hearts" ON public.user_hearts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own hearts" ON public.user_hearts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own hearts" ON public.user_hearts FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_user_hearts_updated_at BEFORE UPDATE ON public.user_hearts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 2. DAILY TASKS TABLE
-- =============================================
CREATE TABLE public.daily_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  xp_reward INTEGER NOT NULL DEFAULT 10,
  coin_reward INTEGER NOT NULL DEFAULT 0,
  task_type TEXT NOT NULL DEFAULT 'quiz', -- quiz, streak, vocabulary, practice
  target_count INTEGER NOT NULL DEFAULT 1,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tasks are viewable by everyone" ON public.daily_tasks FOR SELECT USING (true);

-- =============================================
-- 3. USER TASK PROGRESS TABLE
-- =============================================
CREATE TABLE public.user_task_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  task_id UUID NOT NULL REFERENCES public.daily_tasks(id) ON DELETE CASCADE,
  progress INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  task_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, task_id, task_date)
);

ALTER TABLE public.user_task_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own task progress" ON public.user_task_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own task progress" ON public.user_task_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own task progress" ON public.user_task_progress FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- 4. USER STREAKS TABLE (login streaks)
-- =============================================
CREATE TABLE public.user_streaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_login_date DATE,
  streak_freeze_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own streaks" ON public.user_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own streaks" ON public.user_streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own streaks" ON public.user_streaks FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_user_streaks_updated_at BEFORE UPDATE ON public.user_streaks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 5. SHOP ITEMS TABLE
-- =============================================
CREATE TABLE public.shop_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  item_type TEXT NOT NULL, -- hearts, streak_freeze, xp_boost, badge
  price_coins INTEGER NOT NULL DEFAULT 0,
  price_xp INTEGER NOT NULL DEFAULT 0,
  value INTEGER NOT NULL DEFAULT 1, -- amount given (e.g., 1 heart, 5 hearts)
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Shop items are viewable by everyone" ON public.shop_items FOR SELECT USING (true);

-- =============================================
-- 6. USER INVENTORY TABLE
-- =============================================
CREATE TABLE public.user_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  item_type TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_type)
);

ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own inventory" ON public.user_inventory FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own inventory" ON public.user_inventory FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own inventory" ON public.user_inventory FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_user_inventory_updated_at BEFORE UPDATE ON public.user_inventory FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 7. VOCABULARY WORDS TABLE
-- =============================================
CREATE TABLE public.vocabulary_words (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  meaning TEXT NOT NULL,
  example_sentence TEXT,
  pronunciation TEXT,
  difficulty INTEGER DEFAULT 1,
  category TEXT, -- noun, verb, adjective, etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.vocabulary_words ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Vocabulary words are viewable by everyone" ON public.vocabulary_words FOR SELECT USING (true);

-- =============================================
-- 8. USER VOCABULARY PROGRESS TABLE
-- =============================================
CREATE TABLE public.user_vocabulary_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  word_id UUID NOT NULL REFERENCES public.vocabulary_words(id) ON DELETE CASCADE,
  mastery_level INTEGER NOT NULL DEFAULT 0, -- 0-5
  correct_count INTEGER NOT NULL DEFAULT 0,
  incorrect_count INTEGER NOT NULL DEFAULT 0,
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  next_review_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, word_id)
);

ALTER TABLE public.user_vocabulary_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own vocabulary progress" ON public.user_vocabulary_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own vocabulary progress" ON public.user_vocabulary_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own vocabulary progress" ON public.user_vocabulary_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_user_vocabulary_progress_updated_at BEFORE UPDATE ON public.user_vocabulary_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 9. MOCK EXAMS TABLE
-- =============================================
CREATE TABLE public.mock_exams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 120,
  total_questions INTEGER NOT NULL DEFAULT 90,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.mock_exams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mock exams are viewable by everyone" ON public.mock_exams FOR SELECT USING (true);

-- =============================================
-- 10. USER MOCK EXAM ATTEMPTS TABLE
-- =============================================
CREATE TABLE public.user_mock_exam_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  exam_id UUID NOT NULL REFERENCES public.mock_exams(id) ON DELETE CASCADE,
  score INTEGER,
  total_correct INTEGER DEFAULT 0,
  total_wrong INTEGER DEFAULT 0,
  total_empty INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  answers JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_mock_exam_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own exam attempts" ON public.user_mock_exam_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own exam attempts" ON public.user_mock_exam_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own exam attempts" ON public.user_mock_exam_attempts FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- 11. AI COACH CONVERSATIONS TABLE
-- =============================================
CREATE TABLE public.coach_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT DEFAULT 'Yeni Sohbet',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.coach_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own conversations" ON public.coach_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own conversations" ON public.coach_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own conversations" ON public.coach_conversations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own conversations" ON public.coach_conversations FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_coach_conversations_updated_at BEFORE UPDATE ON public.coach_conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 12. AI COACH MESSAGES TABLE
-- =============================================
CREATE TABLE public.coach_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.coach_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- user, assistant
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.coach_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view messages from their conversations" ON public.coach_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.coach_conversations WHERE id = coach_messages.conversation_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert messages to their conversations" ON public.coach_messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.coach_conversations WHERE id = coach_messages.conversation_id AND user_id = auth.uid())
);

-- =============================================
-- 13. PREMIUM SUBSCRIPTIONS TABLE
-- =============================================
CREATE TABLE public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  plan_type TEXT NOT NULL DEFAULT 'free', -- free, plus, premium
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  features JSONB DEFAULT '{"unlimited_hearts": false, "ad_free": false, "ai_coach": false, "special_badges": false}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own subscription" ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own subscription" ON public.user_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own subscription" ON public.user_subscriptions FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON public.user_subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 14. USER BADGES TABLE
-- =============================================
CREATE TABLE public.badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT, -- streak, achievement, special, premium
  requirement_type TEXT, -- streak_days, quizzes_completed, xp_earned, etc.
  requirement_value INTEGER,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Badges are viewable by everyone" ON public.badges FOR SELECT USING (true);

-- =============================================
-- 15. USER EARNED BADGES TABLE
-- =============================================
CREATE TABLE public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own badges" ON public.user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own badges" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 16. ADD COINS COLUMN TO PROFILES
-- =============================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS coins INTEGER DEFAULT 0;

-- =============================================
-- 17. INSERT DEFAULT DAILY TASKS
-- =============================================
INSERT INTO public.daily_tasks (title, description, xp_reward, coin_reward, task_type, target_count, icon) VALUES
('3 Quiz Tamamla', 'Bugün 3 quiz tamamla', 30, 10, 'quiz', 3, '📝'),
('5 Doğru Cevap Ver', 'Bir seferde 5 soruyu doğru cevapla', 20, 5, 'quiz', 5, '✅'),
('Seriyi Koru', 'Günlük serini devam ettir', 15, 5, 'streak', 1, '🔥'),
('10 Kelime Öğren', 'Bugün 10 yeni kelime ezberle', 25, 8, 'vocabulary', 10, '📚'),
('Bir Ünite Bitir', 'Herhangi bir ünitede tüm aşamaları tamamla', 50, 20, 'practice', 1, '🏆');

-- =============================================
-- 18. INSERT DEFAULT SHOP ITEMS
-- =============================================
INSERT INTO public.shop_items (name, description, item_type, price_coins, price_xp, value, icon) VALUES
('1 Kalp', 'Bir adet kalp satın al', 'hearts', 50, 0, 1, '❤️'),
('5 Kalp Paketi', '5 kalp indirimli fiyata', 'hearts', 200, 0, 5, '💕'),
('Seri Koruyucu', 'Bir gün kaçırsan bile serin korunsun', 'streak_freeze', 100, 0, 1, '🛡️'),
('XP Çarpanı x2', '1 saat boyunca 2x XP kazan', 'xp_boost', 150, 0, 1, '⚡'),
('Premium Rozet', 'Özel premium rozet', 'badge', 500, 0, 1, '👑');

-- =============================================
-- 19. INSERT DEFAULT BADGES
-- =============================================
INSERT INTO public.badges (name, description, icon, category, requirement_type, requirement_value, is_premium) VALUES
('Yeni Başlayan', 'İlk quizi tamamla', '🌱', 'achievement', 'quizzes_completed', 1, false),
('Quiz Ustası', '50 quiz tamamla', '🎯', 'achievement', 'quizzes_completed', 50, false),
('Haftalık Seri', '7 günlük seri yap', '🔥', 'streak', 'streak_days', 7, false),
('Aylık Seri', '30 günlük seri yap', '💎', 'streak', 'streak_days', 30, false),
('XP Avcısı', '1000 XP kazan', '⭐', 'achievement', 'xp_earned', 1000, false),
('Premium Üye', 'Plus üyeliğe sahip ol', '👑', 'premium', 'subscription', 1, true),
('Kelime Ustası', '100 kelime ezberle', '📖', 'achievement', 'words_learned', 100, false);