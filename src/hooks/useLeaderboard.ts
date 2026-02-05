import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { calculateLeague } from '@/lib/leagues';

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  total_xp: number;
  streak_days: number;
  rank?: number;
}

export function useLeaderboard(leagueFilter?: 'all' | 'my-league') {
  return useQuery({
    queryKey: ['leaderboard', leagueFilter],
    queryFn: async () => {
      // Get current user's league if filtering by league
      let userLeague: number | null = null;

      if (leagueFilter === 'my-league') {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data: profile } = await supabase
          .from('profiles')
          .select('total_xp')
          .eq('user_id', user.id)
          .single();

        if (profile) {
          const league = calculateLeague(profile.total_xp || 0);
          userLeague = league.id;
        }
      }

      // Fetch leaderboard
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, display_name, avatar_url, total_xp, streak_days')
        .order('total_xp', { ascending: false })
        .limit(100); // Get more entries for filtering

      if (error) throw error;

      // Filter by league if needed
      let filteredData = data as LeaderboardEntry[];

      if (leagueFilter === 'my-league' && userLeague !== null) {
        filteredData = filteredData.filter(entry => {
          const league = calculateLeague(entry.total_xp || 0);
          return league.id === userLeague;
        });
      }

      // Limit to top 20 and add ranks
      return filteredData.slice(0, 20).map((entry, index) => ({
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
