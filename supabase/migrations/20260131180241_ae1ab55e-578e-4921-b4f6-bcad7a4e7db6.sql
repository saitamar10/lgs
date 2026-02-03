-- Add daily message limit tracking for AI coach
CREATE TABLE IF NOT EXISTS public.coach_message_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  message_count INTEGER NOT NULL DEFAULT 0,
  reset_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, reset_date)
);

-- Enable RLS
ALTER TABLE public.coach_message_limits ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own message limits" 
ON public.coach_message_limits 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own message limits" 
ON public.coach_message_limits 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own message limits" 
ON public.coach_message_limits 
FOR UPDATE 
USING (auth.uid() = user_id);