import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export interface VocabularyWord {
  id: string;
  subject_id: string | null;
  word: string;
  meaning: string;
  example_sentence: string | null;
  pronunciation: string | null;
  difficulty: number;
  category: string | null;
}

export interface UserVocabularyProgress {
  id: string;
  user_id: string;
  word_id: string;
  mastery_level: number;
  correct_count: number;
  incorrect_count: number;
  last_reviewed_at: string | null;
  next_review_at: string | null;
}

export function useVocabularyWords(subjectId?: string) {
  return useQuery({
    queryKey: ['vocabulary-words', subjectId],
    queryFn: async () => {
      let query = supabase.from('vocabulary_words').select('*');
      
      if (subjectId) {
        query = query.eq('subject_id', subjectId);
      }

      const { data, error } = await query.order('difficulty');
      if (error) throw error;
      return data as VocabularyWord[];
    }
  });
}

export function useUserVocabularyProgress() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-vocabulary-progress', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_vocabulary_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data as UserVocabularyProgress[];
    },
    enabled: !!user
  });
}

export function useWordsDueForReview() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['words-due-for-review', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from('user_vocabulary_progress')
        .select('*, vocabulary_words(*)')
        .eq('user_id', user.id)
        .or(`next_review_at.is.null,next_review_at.lte.${now}`)
        .order('next_review_at');

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });
}

export function useUpdateVocabularyProgress() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ wordId, correct }: { wordId: string; correct: boolean }) => {
      if (!user) throw new Error('Not authenticated');

      // Get current progress
      const { data: existing } = await supabase
        .from('user_vocabulary_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('word_id', wordId)
        .maybeSingle();

      // Calculate next review time based on spaced repetition
      const calculateNextReview = (masteryLevel: number): Date => {
        const intervals = [0, 1, 3, 7, 14, 30]; // Days
        const days = intervals[Math.min(masteryLevel, intervals.length - 1)];
        const next = new Date();
        next.setDate(next.getDate() + days);
        return next;
      };

      if (existing) {
        const newMastery = correct 
          ? Math.min(5, existing.mastery_level + 1) 
          : Math.max(0, existing.mastery_level - 1);

        const { error } = await supabase
          .from('user_vocabulary_progress')
          .update({
            mastery_level: newMastery,
            correct_count: correct ? existing.correct_count + 1 : existing.correct_count,
            incorrect_count: correct ? existing.incorrect_count : existing.incorrect_count + 1,
            last_reviewed_at: new Date().toISOString(),
            next_review_at: calculateNextReview(newMastery).toISOString()
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const newMastery = correct ? 1 : 0;

        const { error } = await supabase
          .from('user_vocabulary_progress')
          .insert({
            user_id: user.id,
            word_id: wordId,
            mastery_level: newMastery,
            correct_count: correct ? 1 : 0,
            incorrect_count: correct ? 0 : 1,
            last_reviewed_at: new Date().toISOString(),
            next_review_at: calculateNextReview(newMastery).toISOString()
          });

        if (error) throw error;
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-vocabulary-progress'] });
      queryClient.invalidateQueries({ queryKey: ['words-due-for-review'] });
    }
  });
}
