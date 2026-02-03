-- ==========================================
-- FRIENDSHIPS TABLE
-- ==========================================
-- Arkadaşlık sistemi için tablo

CREATE TABLE IF NOT EXISTS public.friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

-- Enable RLS
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own friendships"
ON public.friendships
FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can create friend requests"
ON public.friendships
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their friendships"
ON public.friendships
FOR UPDATE
USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can delete their friendships"
ON public.friendships
FOR DELETE
USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_friendships_updated_at
BEFORE UPDATE ON public.friendships
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ==========================================
-- EXPERIMENTS TABLE
-- ==========================================
-- Fen Bilimleri deneyleri için tablo

CREATE TABLE IF NOT EXISTS public.experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  materials JSONB DEFAULT '[]'::jsonb,
  safety_notes TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Everyone can read experiments)
CREATE POLICY "Anyone can view experiments"
ON public.experiments
FOR SELECT
USING (true);

-- Only admins can create/update/delete (optional - can be removed if not needed)
CREATE POLICY "Only admins can modify experiments"
ON public.experiments
FOR ALL
USING (auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_experiments_updated_at
BEFORE UPDATE ON public.experiments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================

-- Friendships indexes
CREATE INDEX IF NOT EXISTS idx_friendships_user_id ON public.friendships(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_friend_id ON public.friendships(friend_id);
CREATE INDEX IF NOT EXISTS idx_friendships_status ON public.friendships(status);

-- Experiments indexes
CREATE INDEX IF NOT EXISTS idx_experiments_unit_id ON public.experiments(unit_id);
