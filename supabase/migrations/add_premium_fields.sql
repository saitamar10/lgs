-- Add premium fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS premium_expires_at TIMESTAMPTZ;

-- Create index for faster premium checks
CREATE INDEX IF NOT EXISTS idx_profiles_premium ON profiles(is_premium, premium_expires_at);

-- Function to check if premium is expired and auto-update
CREATE OR REPLACE FUNCTION check_premium_expiration()
RETURNS TRIGGER AS $$
BEGIN
  -- If premium has expired, set is_premium to false
  IF NEW.is_premium = true AND NEW.premium_expires_at IS NOT NULL AND NEW.premium_expires_at < NOW() THEN
    NEW.is_premium := false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-check premium expiration on select
CREATE TRIGGER trigger_check_premium_expiration
BEFORE SELECT ON profiles
FOR EACH ROW
EXECUTE FUNCTION check_premium_expiration();
