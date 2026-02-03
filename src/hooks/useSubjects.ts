import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  order_index: number;
}

export interface Unit {
  id: string;
  subject_id: string;
  name: string;
  slug: string;
  description: string | null;
  order_index: number;
}

export function useSubjects() {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('order_index');
      if (error) throw error;
      return data as Subject[];
    }
  });
}

export function useUnits(subjectId: string | undefined) {
  return useQuery({
    queryKey: ['units', subjectId],
    queryFn: async () => {
      if (!subjectId) return [];
      const { data, error } = await supabase
        .from('units')
        .select('*')
        .eq('subject_id', subjectId)
        .order('order_index');
      if (error) throw error;
      return data as Unit[];
    },
    enabled: !!subjectId
  });
}
