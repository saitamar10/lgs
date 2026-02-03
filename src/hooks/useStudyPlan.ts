import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export interface StudyPlan {
  id: string;
  user_id: string;
  exam_date: string;
  daily_goal_xp: number;
  created_at: string;
  updated_at: string;
}

export function useStudyPlan() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['study-plan', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('study_plans')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data as StudyPlan | null;
    },
    enabled: !!user
  });
}

export function useCreateStudyPlan() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ examDate, dailyGoalXp }: { examDate: string; dailyGoalXp: number }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('study_plans')
        .insert({
          user_id: user.id,
          exam_date: examDate,
          daily_goal_xp: dailyGoalXp
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-plan'] });
    }
  });
}

export function useUpdateStudyPlan() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ examDate, dailyGoalXp }: { examDate: string; dailyGoalXp: number }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('study_plans')
        .update({
          exam_date: examDate,
          daily_goal_xp: dailyGoalXp
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-plan'] });
    }
  });
}

export function calculateDaysRemaining(examDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exam = new Date(examDate);
  exam.setHours(0, 0, 0, 0);
  const diffTime = exam.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function calculateDailyTopics(daysRemaining: number, totalTopics: number): number {
  if (daysRemaining <= 0) return totalTopics;
  return Math.ceil(totalTopics / daysRemaining);
}
