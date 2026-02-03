import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export interface DailyTask {
  id: string;
  title: string;
  description: string | null;
  xp_reward: number;
  coin_reward: number;
  task_type: string;
  target_count: number;
  icon: string | null;
}

export interface UserTaskProgress {
  id: string;
  user_id: string;
  task_id: string;
  progress: number;
  completed: boolean;
  completed_at: string | null;
  task_date: string;
}

export function useDailyTasks() {
  return useQuery({
    queryKey: ['daily-tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      return data as DailyTask[];
    }
  });
}

export function useUserTaskProgress() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-task-progress', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('user_task_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('task_date', today);

      if (error) throw error;
      return data as UserTaskProgress[];
    },
    enabled: !!user
  });
}

export function useUpdateTaskProgress() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, increment }: { taskId: string; increment: number }) => {
      if (!user) throw new Error('Not authenticated');

      const today = new Date().toISOString().split('T')[0];

      // Get current progress
      const { data: existing } = await supabase
        .from('user_task_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('task_id', taskId)
        .eq('task_date', today)
        .maybeSingle();

      // Get task details
      const { data: task } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (!task) throw new Error('Task not found');

      const newProgress = (existing?.progress || 0) + increment;
      const isCompleted = newProgress >= task.target_count;

      if (existing) {
        const { error } = await supabase
          .from('user_task_progress')
          .update({
            progress: newProgress,
            completed: isCompleted,
            completed_at: isCompleted && !existing.completed ? new Date().toISOString() : existing.completed_at
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_task_progress')
          .insert({
            user_id: user.id,
            task_id: taskId,
            progress: newProgress,
            completed: isCompleted,
            completed_at: isCompleted ? new Date().toISOString() : null,
            task_date: today
          });

        if (error) throw error;
      }

      // If just completed, award rewards
      if (isCompleted && !existing?.completed) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('total_xp, coins')
          .eq('user_id', user.id)
          .single();

        if (profile) {
          await supabase
            .from('profiles')
            .update({
              total_xp: (profile.total_xp || 0) + task.xp_reward,
              coins: (profile.coins || 0) + task.coin_reward
            })
            .eq('user_id', user.id);
        }
      }

      return { completed: isCompleted };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-task-progress'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });
}
