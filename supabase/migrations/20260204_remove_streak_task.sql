-- Remove "Seriyi Koru" task from daily tasks
-- This task type will be removed as per user request
-- NOTE: User progress records are kept for historical data

DELETE FROM daily_tasks
WHERE task_type = 'maintain_streak'
   OR title ILIKE '%seri%koru%'
   OR title ILIKE '%streak%';

-- Progress records are NOT deleted - they are kept for historical data
