-- Drop existing table and policies if they exist
DROP TABLE IF EXISTS friend_challenges CASCADE;

-- Create friend_challenges table for async friend battles
-- Using auth.users directly (like friendships table does)
CREATE TABLE friend_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenged_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  unit_name TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'exam')),

  -- Challenger results
  challenger_score INTEGER,
  challenger_total INTEGER,
  challenger_time_seconds INTEGER,
  challenger_completed_at TIMESTAMPTZ,

  -- Challenged results
  challenged_score INTEGER,
  challenged_total INTEGER,
  challenged_time_seconds INTEGER,
  challenged_completed_at TIMESTAMPTZ,

  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed', 'declined')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE friend_challenges ENABLE ROW LEVEL SECURITY;

-- Users can see challenges where they are involved
CREATE POLICY "Users can view their challenges"
  ON friend_challenges
  FOR SELECT
  USING (
    auth.uid() = challenger_id OR auth.uid() = challenged_id
  );

-- Users can create challenges
CREATE POLICY "Users can create challenges"
  ON friend_challenges
  FOR INSERT
  WITH CHECK (auth.uid() = challenger_id);

-- Users can update their own challenge results
CREATE POLICY "Users can update challenge results"
  ON friend_challenges
  FOR UPDATE
  USING (
    auth.uid() = challenger_id OR auth.uid() = challenged_id
  );

-- Create indexes for performance
CREATE INDEX idx_friend_challenges_challenger ON friend_challenges(challenger_id);
CREATE INDEX idx_friend_challenges_challenged ON friend_challenges(challenged_id);
CREATE INDEX idx_friend_challenges_status ON friend_challenges(status);
CREATE INDEX idx_friend_challenges_created_at ON friend_challenges(created_at DESC);

-- Add trigger to update updated_at
CREATE OR REPLACE FUNCTION update_friend_challenges_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER friend_challenges_updated_at
  BEFORE UPDATE ON friend_challenges
  FOR EACH ROW
  EXECUTE FUNCTION update_friend_challenges_updated_at();
