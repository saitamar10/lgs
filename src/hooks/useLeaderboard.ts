import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  total_xp: number;
  streak_days: number;
  rank?: number;
}

export function useLeaderboard() {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, display_name, avatar_url, total_xp, streak_days')
        .order('total_xp', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      return (data as LeaderboardEntry[]).map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));
    }
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });
}
