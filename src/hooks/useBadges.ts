import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export interface Badge {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  category: string | null;
  requirement_type: string | null;
  requirement_value: number | null;
  is_premium: boolean;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge?: Badge;
}

export function useBadges() {
  return useQuery({
    queryKey: ['badges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .order('created_at');

      if (error) throw error;
      return data as Badge[];
    }
  });
}

export function useUserBadges() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-badges', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_badges')
        .select('*, badges(*)')
        .eq('user_id', user.id);

      if (error) throw error;
      return data.map(ub => ({
        ...ub,
        badge: ub.badges
      })) as (UserBadge & { badge: Badge })[];
    },
    enabled: !!user
  });
}

export function useAwardBadge() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (badgeId: string) => {
      if (!user) throw new Error('Not authenticated');

      // Check if already has badge
      const { data: existing } = await supabase
        .from('user_badges')
        .select('id')
        .eq('user_id', user.id)
        .eq('badge_id', badgeId)
        .maybeSingle();

      if (existing) return { alreadyHas: true };

      const { error } = await supabase
        .from('user_badges')
        .insert({ user_id: user.id, badge_id: badgeId });

      if (error) throw error;

      return { alreadyHas: false };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-badges'] });
    }
  });
}

export function useCheckBadgeEligibility() {
  const { user } = useAuth();
  const { data: badges } = useBadges();
  const { data: userBadges } = useUserBadges();
  const awardBadge = useAwardBadge();

  const checkAndAward = async (stats: {
    quizzesCompleted?: number;
    streakDays?: number;
    xpEarned?: number;
    wordsLearned?: number;
    unitsCompleted?: number;
    leaderboardRank?: number;
    perfectScores?: number;
    speedCompletions?: number;
    leagueLevel?: number;
    friendsAdded?: number;
    isPremium?: boolean;
    accountAgeDays?: number;
    subjectXp?: Record<string, number>;
  }) => {
    if (!badges || !userBadges || !user) return;

    const earnedBadgeIds = new Set(userBadges.map(ub => ub.badge_id));

    for (const badge of badges) {
      if (earnedBadgeIds.has(badge.id)) continue;

      // Skip premium badges unless user is premium
      if (badge.is_premium && !stats.isPremium) continue;

      let eligible = false;

      switch (badge.requirement_type) {
        case 'quizzes_completed':
          eligible = (stats.quizzesCompleted ?? 0) >= (badge.requirement_value ?? 0);
          break;
        case 'streak_days':
          eligible = (stats.streakDays ?? 0) >= (badge.requirement_value ?? 0);
          break;
        case 'xp_earned':
          eligible = (stats.xpEarned ?? 0) >= (badge.requirement_value ?? 0);
          break;
        case 'words_learned':
          eligible = (stats.wordsLearned ?? 0) >= (badge.requirement_value ?? 0);
          break;
        case 'units_completed':
          eligible = (stats.unitsCompleted ?? 0) >= (badge.requirement_value ?? 0);
          break;
        case 'leaderboard_rank':
          eligible = (stats.leaderboardRank ?? 999) <= (badge.requirement_value ?? 0);
          break;
        case 'perfect_scores':
          eligible = (stats.perfectScores ?? 0) >= (badge.requirement_value ?? 0);
          break;
        case 'speed_completion':
          eligible = (stats.speedCompletions ?? 0) >= (badge.requirement_value ?? 0);
          break;
        case 'league_level':
          eligible = (stats.leagueLevel ?? 0) >= (badge.requirement_value ?? 0);
          break;
        case 'friends_added':
          eligible = (stats.friendsAdded ?? 0) >= (badge.requirement_value ?? 0);
          break;
        case 'is_premium':
          eligible = stats.isPremium ?? false;
          break;
        case 'account_age_days':
          eligible = (stats.accountAgeDays ?? 0) >= (badge.requirement_value ?? 0);
          break;
        // Subject-specific XP badges
        case 'subject_xp_math':
          eligible = (stats.subjectXp?.['matematik'] ?? 0) >= (badge.requirement_value ?? 0);
          break;
        case 'subject_xp_physics':
          eligible = (stats.subjectXp?.['fizik'] ?? 0) >= (badge.requirement_value ?? 0);
          break;
        case 'subject_xp_chemistry':
          eligible = (stats.subjectXp?.['kimya'] ?? 0) >= (badge.requirement_value ?? 0);
          break;
        case 'subject_xp_biology':
          eligible = (stats.subjectXp?.['biyoloji'] ?? 0) >= (badge.requirement_value ?? 0);
          break;
        case 'subject_xp_history':
          eligible = (stats.subjectXp?.['tarih'] ?? 0) >= (badge.requirement_value ?? 0);
          break;
        case 'subject_xp_literature':
          eligible = (stats.subjectXp?.['edebiyat'] ?? 0) >= (badge.requirement_value ?? 0);
          break;
      }

      if (eligible) {
        await awardBadge.mutateAsync(badge.id);
      }
    }
  };

  return { checkAndAward };
}
