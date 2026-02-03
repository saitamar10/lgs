-- Create weak_topics table for tracking user's weak subjects
CREATE TABLE public.weak_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  unit_name TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  mistake_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, unit_id)
);

-- Enable RLS
ALTER TABLE public.weak_topics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own weak topics"
ON public.weak_topics
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weak topics"
ON public.weak_topics
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weak topics"
ON public.weak_topics
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weak topics"
ON public.weak_topics
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_weak_topics_updated_at
BEFORE UPDATE ON public.weak_topics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add image_url column to questions table for math visuals
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS image_url TEXT;