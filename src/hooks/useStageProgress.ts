import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'exam' | 'unit-final';

export interface StageProgress {
  id: string;
  unit_id: string;
  easy_completions: number;
  medium_completions: number;
  hard_completions: number;
  exam_completed: boolean;
  unit_final_completed?: boolean; // Bölüm Bitiriş Testi
}

const REQUIRED_COMPLETIONS = 3;

export function useStageProgress(unitId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['stage-progress', user?.id, unitId],
    queryFn: async () => {
      if (!user || !unitId) return null;
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('id, unit_id, easy_completions, medium_completions, hard_completions, exam_completed, unit_final_completed')
        .eq('user_id', user.id)
        .eq('unit_id', unitId)
        .maybeSingle();
      
      if (error) throw error;
      return data as StageProgress | null;
    },
    enabled: !!user && !!unitId
  });
}

export function useAllStageProgress() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['all-stage-progress', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('id, unit_id, easy_completions, medium_completions, hard_completions, exam_completed, unit_final_completed')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data as StageProgress[];
    },
    enabled: !!user
  });
}

export function useSubmitStageResult() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      unitId, 
      difficulty, 
      score, 
      totalQuestions, 
      xpEarned 
    }: {
      unitId: string;
      difficulty: Difficulty;
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

      // Get existing progress
      const { data: existingProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('unit_id', unitId)
        .maybeSingle();

      // Only count as completion if score is perfect
      const isSuccess = score === totalQuestions;

      if (existingProgress) {
        const updates: Record<string, number | boolean> = {
          attempts_count: (existingProgress.attempts_count || 0) + 1,
          best_score: Math.max(existingProgress.best_score || 0, score)
        };

        if (isSuccess) {
          if (difficulty === 'easy') {
            updates.easy_completions = Math.min((existingProgress.easy_completions || 0) + 1, REQUIRED_COMPLETIONS);
          } else if (difficulty === 'medium') {
            updates.medium_completions = Math.min((existingProgress.medium_completions || 0) + 1, REQUIRED_COMPLETIONS);
          } else if (difficulty === 'hard') {
            updates.hard_completions = Math.min((existingProgress.hard_completions || 0) + 1, REQUIRED_COMPLETIONS);
          } else if (difficulty === 'exam') {
            updates.exam_completed = true;
          } else if (difficulty === 'unit-final') {
            updates.unit_final_completed = true;
          }
        }

        // Check if unit is fully completed
        const easyCount = typeof updates.easy_completions === 'number' ? updates.easy_completions : (existingProgress.easy_completions ?? 0);
        const mediumCount = typeof updates.medium_completions === 'number' ? updates.medium_completions : (existingProgress.medium_completions ?? 0);
        const hardCount = typeof updates.hard_completions === 'number' ? updates.hard_completions : (existingProgress.hard_completions ?? 0);
        const examDone = typeof updates.exam_completed === 'boolean' ? updates.exam_completed : (existingProgress.exam_completed ?? false);
        
        updates.completed = easyCount >= REQUIRED_COMPLETIONS && 
                           mediumCount >= REQUIRED_COMPLETIONS && 
                           hardCount >= REQUIRED_COMPLETIONS && 
                           examDone;

        await supabase
          .from('user_progress')
          .update(updates)
          .eq('id', existingProgress.id);
      } else {
        await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            unit_id: unitId,
            best_score: score,
            attempts_count: 1,
            easy_completions: isSuccess && difficulty === 'easy' ? 1 : 0,
            medium_completions: isSuccess && difficulty === 'medium' ? 1 : 0,
            hard_completions: isSuccess && difficulty === 'hard' ? 1 : 0,
            exam_completed: isSuccess && difficulty === 'exam',
            unit_final_completed: isSuccess && difficulty === 'unit-final',
            completed: false
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
      queryClient.invalidateQueries({ queryKey: ['stage-progress'] });
      queryClient.invalidateQueries({ queryKey: ['all-stage-progress'] });
    }
  });
}

export function getStageStatus(progress: StageProgress | null, difficulty: Difficulty): {
  completions: number;
  isUnlocked: boolean;
  isComplete: boolean;
  isMastered: boolean;
} {
  if (!progress) {
    return {
      completions: 0,
      isUnlocked: difficulty === 'easy' || difficulty === 'exam' || difficulty === 'unit-final', // Exam ve Bölüm Testi her zaman açık
      isComplete: false,
      isMastered: false
    };
  }

  const easyComplete = (progress.easy_completions || 0) >= REQUIRED_COMPLETIONS;
  const mediumComplete = (progress.medium_completions || 0) >= REQUIRED_COMPLETIONS;
  const hardComplete = (progress.hard_completions || 0) >= REQUIRED_COMPLETIONS;

  switch (difficulty) {
    case 'easy':
      return {
        completions: progress.easy_completions || 0,
        isUnlocked: true,
        isComplete: (progress.easy_completions || 0) >= 1,
        isMastered: easyComplete
      };
    case 'medium':
      return {
        completions: progress.medium_completions || 0,
        isUnlocked: easyComplete,
        isComplete: (progress.medium_completions || 0) >= 1,
        isMastered: mediumComplete
      };
    case 'hard':
      return {
        completions: progress.hard_completions || 0,
        isUnlocked: mediumComplete,
        isComplete: (progress.hard_completions || 0) >= 1,
        isMastered: hardComplete
      };
    case 'exam':
      return {
        completions: progress.exam_completed ? 1 : 0,
        isUnlocked: true, // Exam is always unlocked for everyone
        isComplete: progress.exam_completed || false,
        isMastered: progress.exam_completed || false
      };
    case 'unit-final':
      return {
        completions: progress.unit_final_completed ? 1 : 0,
        isUnlocked: true, // Bölüm Bitiriş Testi herkese açık
        isComplete: progress.unit_final_completed || false,
        isMastered: progress.unit_final_completed || false
      };
  }
}

export function getNextStage(progress: StageProgress | null): Difficulty | null {
  if (!progress) return 'easy';

  const easyComplete = (progress.easy_completions || 0) >= REQUIRED_COMPLETIONS;
  const mediumComplete = (progress.medium_completions || 0) >= REQUIRED_COMPLETIONS;
  const hardComplete = (progress.hard_completions || 0) >= REQUIRED_COMPLETIONS;

  if (!easyComplete) return 'easy';
  if (!mediumComplete) return 'medium';
  if (!hardComplete) return 'hard';
  if (!progress.exam_completed) return 'exam';
  if (!progress.unit_final_completed) return 'unit-final'; // Bölüm Geçme Testi
  return null; // Unit complete
}

export function isUnitComplete(progress: StageProgress | null): boolean {
  if (!progress) return false;

  // YENİ: Bölüm Geçme Testi yapıldıysa direkt tamamlanmış sayılır
  if (progress.unit_final_completed) return true;

  // ESKİ YOL: Tüm aşamalar + deneme tamamlanmışsa
  return (
    (progress.easy_completions || 0) >= REQUIRED_COMPLETIONS &&
    (progress.medium_completions || 0) >= REQUIRED_COMPLETIONS &&
    (progress.hard_completions || 0) >= REQUIRED_COMPLETIONS &&
    (progress.exam_completed || false)
  );
}
