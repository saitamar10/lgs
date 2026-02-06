-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Everyone can view badges" ON public.badges;
DROP POLICY IF EXISTS "Users can view all user badges" ON public.user_badges;
DROP POLICY IF EXISTS "Users can insert their own badges" ON public.user_badges;
DROP POLICY IF EXISTS "Users cannot delete badges" ON public.user_badges;
DROP POLICY IF EXISTS "Users cannot update badges" ON public.user_badges;

-- Enable RLS on badges tables (if not already enabled)
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Badges table policies - Everyone can read badges
CREATE POLICY "Everyone can view badges"
  ON public.badges
  FOR SELECT
  TO public
  USING (true);

-- User badges policies - Users can read all user badges (for leaderboard/social features)
CREATE POLICY "Users can view all user badges"
  ON public.user_badges
  FOR SELECT
  TO authenticated
  USING (true);

-- Users can insert their own badges (awarded by system)
CREATE POLICY "Users can insert their own badges"
  ON public.user_badges
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users cannot delete their badges
CREATE POLICY "Users cannot delete badges"
  ON public.user_badges
  FOR DELETE
  TO authenticated
  USING (false);

-- Users cannot update their badges
CREATE POLICY "Users cannot update badges"
  ON public.user_badges
  FOR UPDATE
  TO authenticated
  USING (false);
