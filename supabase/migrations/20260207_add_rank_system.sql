-- Add rank/title system to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS selected_rank VARCHAR(50) DEFAULT NULL;

-- Create ranks table for available ranks
CREATE TABLE IF NOT EXISTS public.ranks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  color VARCHAR(50) NOT NULL,
  min_xp INTEGER NOT NULL DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default ranks (6 ranks)
INSERT INTO public.ranks (name, icon, color, min_xp, order_index) VALUES
  ('Çaylak', '🌱', 'green', 0, 1),
  ('Öğrenci', '📚', 'blue', 500, 2),
  ('Bilge', '🧠', 'purple', 1500, 3),
  ('Usta', '⚡', 'orange', 3000, 4),
  ('Efsane', '🔥', 'red', 6000, 5),
  ('Tanrı', '👑', 'gold', 10000, 6)
ON CONFLICT (name) DO NOTHING;

-- Enable RLS on ranks table
ALTER TABLE public.ranks ENABLE ROW LEVEL SECURITY;

-- Everyone can view ranks
CREATE POLICY "Everyone can view ranks"
  ON public.ranks
  FOR SELECT
  TO public
  USING (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_selected_rank ON public.profiles(selected_rank);
CREATE INDEX IF NOT EXISTS idx_ranks_min_xp ON public.ranks(min_xp);

-- Function to get available ranks for a user based on their XP
CREATE OR REPLACE FUNCTION get_available_ranks(user_xp INTEGER)
RETURNS SETOF ranks AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM ranks
  WHERE min_xp <= user_xp
  ORDER BY order_index ASC;
END;
$$ LANGUAGE plpgsql;
