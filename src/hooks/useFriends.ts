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
        .select('id, display_name, level, total_xp, avatar_url')
        .in('id', friendIds);

      if (profileError) throw profileError;

      return profiles as FriendProfile[];
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
        .select('id, display_name, level, total_xp, avatar_url')
        .in('id', requesterIds);

      if (profileError) throw profileError;

      return profiles as FriendProfile[];
    },
  });
}

// Search users by username
export function useSearchUsers(searchQuery: string) {
  return useQuery({
    queryKey: ['search-users', searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return [];

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, level, total_xp, avatar_url')
        .ilike('display_name', `%${searchQuery}%`)
        .neq('id', user.id)
        .limit(10);

      if (error) throw error;

      return data as FriendProfile[];
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
