import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export function useUserProgress() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-progress', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });
}

export function useCompletedUnits() {
  const { data: progress } = useUserProgress();
  
  return progress?.filter(p => p.completed).map(p => p.unit_id) || [];
}
