-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  total_xp INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create subjects table
CREATE TABLE public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on subjects
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- Subjects are public
CREATE POLICY "Subjects are viewable by everyone"
ON public.subjects FOR SELECT
USING (true);

-- Create units table
CREATE TABLE public.units (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(subject_id, slug)
);

-- Enable RLS on units
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

-- Units are public
CREATE POLICY "Units are viewable by everyone"
ON public.units FOR SELECT
USING (true);

-- Create questions table
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  difficulty INTEGER DEFAULT 1,
  xp_value INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on questions
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Questions are public for authenticated users
CREATE POLICY "Questions are viewable by authenticated users"
ON public.questions FOR SELECT
TO authenticated
USING (true);

-- Create quiz_attempts table
CREATE TABLE public.quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE NOT NULL,
  score INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on quiz_attempts
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Quiz attempts policies
CREATE POLICY "Users can view their own attempts"
ON public.quiz_attempts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own attempts"
ON public.quiz_attempts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create user_progress table
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN DEFAULT false,
  best_score INTEGER DEFAULT 0,
  attempts_count INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, unit_id)
);

-- Enable RLS on user_progress
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- User progress policies
CREATE POLICY "Users can view their own progress"
ON public.user_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
ON public.user_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON public.user_progress FOR UPDATE
USING (auth.uid() = user_id);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
BEFORE UPDATE ON public.user_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Insert default subjects
INSERT INTO public.subjects (name, slug, description, icon, color, order_index) VALUES
('Matematik', 'matematik', 'Sayılar, cebir, geometri ve daha fazlası', '🔢', 'primary', 1),
('Türkçe', 'turkce', 'Dil bilgisi, anlam ve yazım kuralları', '📚', 'accent', 2),
('Fen Bilimleri', 'fen-bilimleri', 'Fizik, kimya ve biyoloji konuları', '🔬', 'warning', 3),
('Sosyal Bilgiler', 'sosyal-bilgiler', 'Tarih, coğrafya ve vatandaşlık', '🌍', 'info', 4),
('İngilizce', 'ingilizce', 'Gramer, kelime ve okuma anlama', '🌐', 'destructive', 5),
('Din Kültürü', 'din-kulturu', 'İnanç, ibadet ve ahlak', '☪️', 'secondary', 6);

-- Insert sample units for Matematik
INSERT INTO public.units (subject_id, name, slug, description, order_index)
SELECT s.id, u.name, u.slug, u.description, u.order_index
FROM public.subjects s
CROSS JOIN (VALUES
  ('Üslü İfadeler', 'uslu-ifadeler', 'Üslü sayılarla işlemler', 1),
  ('Kareköklü İfadeler', 'karekoklu-ifadeler', 'Kareköklü sayılar ve işlemler', 2),
  ('Olasılık', 'olasilik', 'Olasılık hesaplamaları', 3),
  ('Cebirsel İfadeler', 'cebirsel-ifadeler', 'Cebirsel ifadeler ve özdeşlikler', 4),
  ('Denklemler', 'denklemler', 'Birinci dereceden denklemler', 5)
) AS u(name, slug, description, order_index)
WHERE s.slug = 'matematik';

-- Insert sample questions for first unit
INSERT INTO public.questions (unit_id, question_text, options, correct_answer, explanation, difficulty, xp_value)
SELECT u.id, q.question_text, q.options, q.correct_answer, q.explanation, q.difficulty, q.xp_value
FROM public.units u
CROSS JOIN (VALUES
  ('2³ × 2² işleminin sonucu kaçtır?', '["16", "32", "64", "8"]'::jsonb, 1, '2³ × 2² = 2^(3+2) = 2⁵ = 32', 1, 10),
  ('5⁴ ÷ 5² işleminin sonucu kaçtır?', '["5", "25", "125", "625"]'::jsonb, 1, '5⁴ ÷ 5² = 5^(4-2) = 5² = 25', 1, 10),
  ('(3²)³ işleminin sonucu kaçtır?', '["27", "81", "243", "729"]'::jsonb, 3, '(3²)³ = 3^(2×3) = 3⁶ = 729', 2, 15),
  ('2⁰ + 3⁰ + 4⁰ toplamı kaçtır?', '["0", "1", "3", "9"]'::jsonb, 2, 'Sıfırıncı kuvvet her zaman 1 eder. 1+1+1=3', 1, 10),
  ('4⁻² işleminin sonucu kaçtır?', '["1/16", "1/8", "-16", "-8"]'::jsonb, 0, '4⁻² = 1/4² = 1/16', 2, 15),
  ('(-2)⁴ işleminin sonucu kaçtır?', '["-16", "16", "-8", "8"]'::jsonb, 1, 'Çift üs negatif sayıyı pozitif yapar. (-2)⁴ = 16', 1, 10),
  ('3⁴ × 3⁻² işleminin sonucu kaçtır?', '["3", "9", "27", "81"]'::jsonb, 1, '3⁴ × 3⁻² = 3^(4-2) = 3² = 9', 2, 15),
  ('(2³)² ÷ 2⁴ işleminin sonucu kaçtır?', '["2", "4", "8", "16"]'::jsonb, 1, '(2³)² ÷ 2⁴ = 2⁶ ÷ 2⁴ = 2² = 4', 2, 15)
) AS q(question_text, options, correct_answer, explanation, difficulty, xp_value)
WHERE u.slug = 'uslu-ifadeler';