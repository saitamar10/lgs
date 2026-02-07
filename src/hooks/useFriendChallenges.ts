import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

export type ChallengeStatus = 'pending' | 'accepted' | 'completed' | 'declined';
export type ChallengeDifficulty = 'easy' | 'medium' | 'hard' | 'exam';

export interface FriendChallenge {
  id: string;
  challenger_id: string;
  challenged_id: string;
  unit_id: string;
  unit_name: string;
  subject_name: string;
  difficulty: ChallengeDifficulty;

  challenger_score: number | null;
  challenger_total: number | null;
  challenger_time_seconds: number | null;
  challenger_completed_at: string | null;

  challenged_score: number | null;
  challenged_total: number | null;
  challenged_time_seconds: number | null;
  challenged_completed_at: string | null;

  status: ChallengeStatus;
  created_at: string;
  updated_at: string;

  // Joined data
  challenger_name?: string;
  challenged_name?: string;
}

// Get all challenges (sent and received)
export function useFriendChallenges() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['friend-challenges', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // First, get all challenges
      const { data: challenges, error } = await supabase
        .from('friend_challenges')
        .select('*')
        .or(`challenger_id.eq.${user.id},challenged_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!challenges || challenges.length === 0) return [];

      // Get unique user IDs
      const userIds = new Set<string>();
      challenges.forEach(c => {
        userIds.add(c.challenger_id);
        userIds.add(c.challenged_id);
      });

      // Fetch profiles for these users
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, display_name')
        .in('user_id', Array.from(userIds));

      if (profileError) throw profileError;

      // Create a map for quick lookup
      const profileMap = new Map(
        (profiles || []).map(p => [p.user_id, p.display_name || 'Kullanıcı'])
      );

      // Combine data
      return challenges.map(challenge => ({
        ...challenge,
        challenger_name: profileMap.get(challenge.challenger_id) || 'Kullanıcı',
        challenged_name: profileMap.get(challenge.challenged_id) || 'Kullanıcı'
      })) as FriendChallenge[];
    },
    enabled: !!user
  });
}

// Get pending challenges (received, not completed)
export function usePendingChallenges() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['pending-challenges', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // First, get pending challenges
      const { data: challenges, error } = await supabase
        .from('friend_challenges')
        .select('*')
        .eq('challenged_id', user.id)
        .in('status', ['pending', 'accepted'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!challenges || challenges.length === 0) return [];

      // Get unique challenger IDs
      const challengerIds = [...new Set(challenges.map(c => c.challenger_id))];

      // Fetch profiles for challengers
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, display_name')
        .in('user_id', challengerIds);

      if (profileError) throw profileError;

      // Create a map for quick lookup
      const profileMap = new Map(
        (profiles || []).map(p => [p.user_id, p.display_name || 'Kullanıcı'])
      );

      // Combine data
      return challenges.map(challenge => ({
        ...challenge,
        challenger_name: profileMap.get(challenge.challenger_id) || 'Kullanıcı'
      })) as FriendChallenge[];
    },
    enabled: !!user
  });
}

// Create a new challenge
export function useCreateChallenge() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      challengedId: string;
      unitId: string;
      unitName: string;
      subjectName: string;
      difficulty: ChallengeDifficulty;
      score: number;
      total: number;
      timeSeconds: number;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('friend_challenges')
        .insert({
          challenger_id: user.id,
          challenged_id: params.challengedId,
          unit_id: params.unitId,
          unit_name: params.unitName,
          subject_name: params.subjectName,
          difficulty: params.difficulty,
          challenger_score: params.score,
          challenger_total: params.total,
          challenger_time_seconds: params.timeSeconds,
          challenger_completed_at: new Date().toISOString(),
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friend-challenges'] });
      toast.success('Meydan okuma gönderildi!');
    },
    onError: (error) => {
      console.error('Challenge creation error:', error);
      toast.error('Meydan okuma gönderilemedi');
    }
  });
}

// Accept a challenge and submit results
export function useCompleteChallenge() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      challengeId: string;
      score: number;
      total: number;
      timeSeconds: number;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('friend_challenges')
        .update({
          challenged_score: params.score,
          challenged_total: params.total,
          challenged_time_seconds: params.timeSeconds,
          challenged_completed_at: new Date().toISOString(),
          status: 'completed'
        })
        .eq('id', params.challengeId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friend-challenges'] });
      queryClient.invalidateQueries({ queryKey: ['pending-challenges'] });
      toast.success('Mücadele tamamlandı!');
    },
    onError: (error) => {
      console.error('Challenge completion error:', error);
      toast.error('Sonuç kaydedilemedi');
    }
  });
}

// Decline a challenge
export function useDeclineChallenge() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (challengeId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('friend_challenges')
        .update({ status: 'declined' })
        .eq('id', challengeId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friend-challenges'] });
      queryClient.invalidateQueries({ queryKey: ['pending-challenges'] });
      toast.success('Meydan okuma reddedildi');
    },
    onError: (error) => {
      console.error('Challenge decline error:', error);
      toast.error('İşlem başarısız');
    }
  });
}

// Mark challenge as accepted (when user starts playing)
export function useAcceptChallenge() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (challengeId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('friend_challenges')
        .update({ status: 'accepted' })
        .eq('id', challengeId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friend-challenges'] });
      queryClient.invalidateQueries({ queryKey: ['pending-challenges'] });
    },
    onError: (error) => {
      console.error('Challenge accept error:', error);
      toast.error('İşlem başarısız');
    }
  });
}

// Helper function to determine winner
export function getChallengeWinner(challenge: FriendChallenge): 'challenger' | 'challenged' | 'tie' | null {
  if (!challenge.challenger_score || !challenge.challenged_score) return null;

  // First compare scores
  if (challenge.challenger_score > challenge.challenged_score) return 'challenger';
  if (challenge.challenged_score > challenge.challenger_score) return 'challenged';

  // If scores are equal, compare time (faster wins)
  if (challenge.challenger_time_seconds && challenge.challenged_time_seconds) {
    if (challenge.challenger_time_seconds < challenge.challenged_time_seconds) return 'challenger';
    if (challenge.challenged_time_seconds < challenge.challenger_time_seconds) return 'challenged';
  }

  return 'tie';
}

// Format time seconds to readable format
export function formatChallengeTime(seconds: number | null): string {
  if (!seconds) return '--';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
