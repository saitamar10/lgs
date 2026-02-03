-- Add stage-based progress tracking to user_progress table
ALTER TABLE public.user_progress
ADD COLUMN IF NOT EXISTS easy_completions integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS medium_completions integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS hard_completions integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS exam_completed boolean DEFAULT false;

-- Add comment for clarity
COMMENT ON COLUMN public.user_progress.easy_completions IS 'Number of times easy stage completed (max 3)';
COMMENT ON COLUMN public.user_progress.medium_completions IS 'Number of times medium stage completed (max 3)';
COMMENT ON COLUMN public.user_progress.hard_completions IS 'Number of times hard stage completed (max 3)';
COMMENT ON COLUMN public.user_progress.exam_completed IS 'Whether the final exam for this unit is completed';