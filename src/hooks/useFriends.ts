import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface FriendProfile {
  id: string;
  display_name: string | null;
  level: number;
  total_xp: number;
  rank?: number;
  avatar_url?: string;
  email?: string;
}

// Helper: Calculate level from XP
function calculateLevel(xp: number): number {
  const baseXP = 100;
  const multiplier = 1.5;
  let level = 1;
  let totalXPForLevel = 0;
  let xpForCurrentLevel = baseXP;

  while (totalXPForLevel + xpForCurrentLevel <= xp) {
    totalXPForLevel += xpForCurrentLevel;
    level++;
    xpForCurrentLevel = Math.floor(baseXP * Math.pow(multiplier, level - 1));
  }

  return level;
}

// Helper: Get display name with fallback
export function getDisplayName(profile: FriendProfile): string {
  if (profile.display_name && profile.display_name.trim()) {
    return profile.display_name;
  }
  if (profile.email) {
    return profile.email.split('@')[0];
  }
  return 'Kullanıcı';
}

// Get all friends (accepted status)
export function useFriends() {
  return useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: friendships, error } = await supabase
        .from('friendships')
        .select('friend_id')
        .eq('user_id', user.id)
        .eq('status', 'accepted');

      if (error) throw error;

      if (!friendships || friendships.length === 0) return [];

      const friendIds = friendships.map(f => f.friend_id);

      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, user_id, display_name, total_xp, avatar_url')
        .in('user_id', friendIds);

      if (profileError) throw profileError;

      return (profiles || []).map(profile => ({
        id: profile.user_id,
        display_name: profile.display_name,
        level: calculateLevel(profile.total_xp || 0),
        total_xp: profile.total_xp,
        avatar_url: profile.avatar_url
      })) as FriendProfile[];
    },
  });
}

// Get pending friend requests
export function useFriendRequests() {
  return useQuery({
    queryKey: ['friend-requests'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: requests, error } = await supabase
        .from('friendships')
        .select('user_id')
        .eq('friend_id', user.id)
        .eq('status', 'pending');

      if (error) throw error;

      if (!requests || requests.length === 0) return [];

      const requesterIds = requests.map(r => r.user_id);

      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, user_id, display_name, total_xp, avatar_url')
        .in('user_id', requesterIds);

      if (profileError) throw profileError;

      return (profiles || []).map(profile => ({
        id: profile.user_id,
        display_name: profile.display_name,
        level: calculateLevel(profile.total_xp || 0),
        total_xp: profile.total_xp,
        avatar_url: profile.avatar_url
      })) as FriendProfile[];
    },
  });
}

// Search users by username OR friendship code
export function useSearchUsers(searchQuery: string) {
  return useQuery({
    queryKey: ['search-users', searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return [];

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get existing friendships to filter them out
      const { data: existingFriendships } = await supabase
        .from('friendships')
        .select('friend_id')
        .eq('user_id', user.id)
        .in('status', ['pending', 'accepted']);

      const excludedIds = [user.id, ...(existingFriendships || []).map(f => f.friend_id)];

      // Check if search query looks like a friendship code (8 characters, alphanumeric)
      const isFriendshipCode = /^[A-Z0-9]{8}$/i.test(searchQuery.trim());

      let query;

      if (isFriendshipCode) {
        // Search by user_id prefix (friendship code is first 8 chars of user_id)
        query = supabase
          .from('profiles')
          .select('id, user_id, display_name, total_xp, avatar_url')
          .ilike('user_id', `${searchQuery.toLowerCase()}%`)
          .limit(10);
      } else {
        // Search by display name
        query = supabase
          .from('profiles')
          .select('id, user_id, display_name, total_xp, avatar_url')
          .ilike('display_name', `%${searchQuery}%`)
          .limit(10);
      }

      // Apply exclusion filter only if we have IDs to exclude
      if (excludedIds.length > 0) {
        query = query.not('user_id', 'in', `(${excludedIds.join(',')})`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Search error:', error);
        throw error;
      }

      console.log('Search results:', data);

      // Filter out excluded IDs on client side as backup
      const filtered = (data || []).filter(profile => !excludedIds.includes(profile.user_id));

      return filtered.map(profile => ({
        id: profile.user_id,
        display_name: profile.display_name,
        level: calculateLevel(profile.total_xp || 0),
        total_xp: profile.total_xp,
        avatar_url: profile.avatar_url
      })) as FriendProfile[];
    },
    enabled: searchQuery.length >= 2,
  });
}

// Send friend request
export function useSendFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (friendId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('friendships')
        .insert({
          user_id: user.id,
          friend_id: friendId,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      toast.success('Arkadaşlık isteği gönderildi!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Arkadaşlık isteği gönderilemedi');
    },
  });
}

// Accept friend request
export function useAcceptFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requesterId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('user_id', requesterId)
        .eq('friend_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Create reciprocal friendship
      await supabase.from('friendships').insert({
        user_id: user.id,
        friend_id: requesterId,
        status: 'accepted',
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
      toast.success('Arkadaşlık isteği kabul edildi!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'İstek kabul edilemedi');
    },
  });
}

// Reject friend request
export function useRejectFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requesterId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('friendships')
        .update({ status: 'rejected' })
        .eq('user_id', requesterId)
        .eq('friend_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
      toast.info('İstek reddedildi');
    },
    onError: (error: any) => {
      toast.error(error.message || 'İstek reddedilemedi');
    },
  });
}

// Remove friend
export function useRemoveFriend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (friendId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Remove both directions
      await supabase
        .from('friendships')
        .delete()
        .or(`and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.id})`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      toast.success('Arkadaş listeden çıkarıldı');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Arkadaş çıkarılamadı');
    },
  });
}
