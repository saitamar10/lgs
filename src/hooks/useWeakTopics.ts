import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export interface WeakTopic {
  id: string;
  user_id: string;
  unit_id: string;
  subject_id: string;
  unit_name: string;
  subject_name: string;
  mistake_count: number;
  created_at: string;
  updated_at: string;
}

export function useWeakTopics() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['weak-topics', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('weak_topics')
        .select('*')
        .eq('user_id', user.id)
        .order('mistake_count', { ascending: false });

      if (error) throw error;
      return data as WeakTopic[];
    },
    enabled: !!user
  });
}

export function useAddWeakTopic() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      unitId, 
      unitName, 
      subjectId, 
      subjectName 
    }: { 
      unitId: string; 
      unitName: string; 
      subjectId: string; 
      subjectName: string;
    }) => {
      if (!user) throw new Error('Not authenticated');

      // Check if already exists
      const { data: existing } = await supabase
        .from('weak_topics')
        .select('*')
        .eq('user_id', user.id)
        .eq('unit_id', unitId)
        .maybeSingle();

      if (existing) {
        // Update mistake count
        const { error } = await supabase
          .from('weak_topics')
          .update({ mistake_count: existing.mistake_count + 1 })
          .eq('id', existing.id);

        if (error) throw error;
        return { ...existing, mistake_count: existing.mistake_count + 1 };
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('weak_topics')
          .insert({
            user_id: user.id,
            unit_id: unitId,
            subject_id: subjectId,
            unit_name: unitName,
            subject_name: subjectName,
            mistake_count: 1
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weak-topics'] });
    }
  });
}

export function useRemoveWeakTopic() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (unitId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('weak_topics')
        .delete()
        .eq('user_id', user.id)
        .eq('unit_id', unitId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weak-topics'] });
    }
  });
}
