import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export interface UserStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_login_date: string | null;
  streak_freeze_count: number;
}

export function useStreak() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: streakData, isLoading } = useQuery({
    queryKey: ['user-streak', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      // If no streak record exists, create one
      if (!data) {
        const { data: newData, error: insertError } = await supabase
          .from('user_streaks')
          .insert({ user_id: user.id, current_streak: 0, longest_streak: 0 })
          .select()
          .single();

        if (insertError) throw insertError;
        return newData as UserStreak;
      }

      return data as UserStreak;
    },
    enabled: !!user
  });

  const checkInMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');

      // First, get or create streak data
      let currentStreakData = streakData;
      
      if (!currentStreakData) {
        // Try to fetch or create streak data
        const { data: existingData } = await supabase
          .from('user_streaks')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (existingData) {
          currentStreakData = existingData as UserStreak;
        } else {
          // Create new streak record
          const { data: newData, error: insertError } = await supabase
            .from('user_streaks')
            .insert({ user_id: user.id, current_streak: 0, longest_streak: 0, streak_freeze_count: 0 })
            .select()
            .single();

          if (insertError) throw insertError;
          currentStreakData = newData as UserStreak;
        }
      }

      const today = new Date().toISOString().split('T')[0];
      const lastLogin = currentStreakData.last_login_date;

      if (lastLogin === today) {
        // Already checked in today
        return { alreadyCheckedIn: true, streak: currentStreakData.current_streak };
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak: number;
      let usedFreeze = false;

      if (lastLogin === yesterdayStr) {
        // Continuing streak
        newStreak = currentStreakData.current_streak + 1;
      } else if (lastLogin && currentStreakData.streak_freeze_count > 0) {
        // Check if we can use a streak freeze (missed 1 day)
        const daysSinceLogin = Math.floor(
          (new Date(today).getTime() - new Date(lastLogin).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (daysSinceLogin <= 2) {
          // Use streak freeze
          newStreak = currentStreakData.current_streak + 1;
          usedFreeze = true;
        } else {
          // Too many days missed
          newStreak = 1;
        }
      } else {
        // Starting fresh or first time
        newStreak = 1;
      }

      const newLongest = Math.max(currentStreakData.longest_streak, newStreak);

      const { error } = await supabase
        .from('user_streaks')
        .update({
          current_streak: newStreak,
          longest_streak: newLongest,
          last_login_date: today,
          streak_freeze_count: usedFreeze ? currentStreakData.streak_freeze_count - 1 : currentStreakData.streak_freeze_count
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Also update profile streak
      await supabase
        .from('profiles')
        .update({ streak_days: newStreak, last_activity_date: today })
        .eq('user_id', user.id);

      return { 
        alreadyCheckedIn: false, 
        streak: newStreak, 
        usedFreeze,
        isNewRecord: newStreak > currentStreakData.longest_streak
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-streak'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });

  return {
    currentStreak: streakData?.current_streak ?? 0,
    longestStreak: streakData?.longest_streak ?? 0,
    lastLoginDate: streakData?.last_login_date,
    streakFreezeCount: streakData?.streak_freeze_count ?? 0,
    isLoading,
    checkIn: () => checkInMutation.mutateAsync(),
    isCheckingIn: checkInMutation.isPending
  };
}
