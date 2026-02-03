import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export interface Question {
  id: string;
  unit_id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  explanation: string | null;
  difficulty: number;
  xp_value: number;
  image_url?: string | null; // Optional image URL for math questions
}

export function useQuestions(unitId: string | undefined) {
  return useQuery({
    queryKey: ['questions', unitId],
    queryFn: async () => {
      if (!unitId) return [];
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('unit_id', unitId);
      if (error) throw error;
      return data.map(q => ({
        ...q,
        options: q.options as string[]
      })) as Question[];
    },
    enabled: !!unitId
  });
}

export function useSubmitQuizResult() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ unitId, score, totalQuestions, xpEarned }: {
      unitId: string;
      score: number;
      totalQuestions: number;
      xpEarned: number;
    }) => {
      if (!user) throw new Error('Not authenticated');

      // Insert quiz attempt
      const { error: attemptError } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: user.id,
          unit_id: unitId,
          score,
          total_questions: totalQuestions,
          xp_earned: xpEarned
        });

      if (attemptError) throw attemptError;

      // Update user progress
      const { data: existingProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('unit_id', unitId)
        .maybeSingle();

      if (existingProgress) {
        await supabase
          .from('user_progress')
          .update({
            best_score: Math.max(existingProgress.best_score, score),
            attempts_count: existingProgress.attempts_count + 1,
            completed: score === totalQuestions || existingProgress.completed
          })
          .eq('id', existingProgress.id);
      } else {
        await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            unit_id: unitId,
            best_score: score,
            attempts_count: 1,
            completed: score === totalQuestions
          });
      }

      // Update profile XP
      const { data: profile } = await supabase
        .from('profiles')
        .select('total_xp')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        await supabase
          .from('profiles')
          .update({
            total_xp: (profile.total_xp || 0) + xpEarned,
            last_activity_date: new Date().toISOString().split('T')[0]
          })
          .eq('user_id', user.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
    }
  });
}
