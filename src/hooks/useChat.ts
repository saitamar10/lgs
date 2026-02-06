import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useEffect } from 'react';

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  other_user?: {
    user_id: string;
    display_name: string;
  };
  last_message?: {
    content: string;
    created_at: string;
    sender_id: string;
  };
  unread_count?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  sender?: {
    display_name: string;
  };
}

// Get or create conversation with a user
export function useGetOrCreateConversation() {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (friendId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.rpc('get_or_create_conversation', {
        user1_id: user.id,
        user2_id: friendId
      });

      if (error) throw error;
      return data as string; // conversation_id
    }
  });
}

// Get all conversations for current user
export function useConversations() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get all conversation IDs user is part of
      const { data: participants, error: participantsError } = await supabase
        .from('conversation_participants')
        .select('conversation_id, conversation:conversations(*)')
        .eq('user_id', user.id);

      if (participantsError) throw participantsError;

      const conversationIds = participants?.map(p => p.conversation_id) || [];

      if (conversationIds.length === 0) return [];

      // Get other participants for each conversation
      const conversations = await Promise.all(
        conversationIds.map(async (convId) => {
          // Get other user in conversation
          const { data: otherParticipant } = await supabase
            .from('conversation_participants')
            .select('user_id, profiles:user_id(display_name)')
            .eq('conversation_id', convId)
            .neq('user_id', user.id)
            .single();

          // Get last message
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('content, created_at, sender_id')
            .eq('conversation_id', convId)
            .eq('is_deleted', false)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Get unread count
          const { data: participantData } = await supabase
            .from('conversation_participants')
            .select('last_read_at')
            .eq('conversation_id', convId)
            .eq('user_id', user.id)
            .single();

          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', convId)
            .neq('sender_id', user.id)
            .gt('created_at', participantData?.last_read_at || new Date(0).toISOString())
            .eq('is_deleted', false);

          const conv = participants.find(p => p.conversation_id === convId)?.conversation;

          return {
            id: convId,
            created_at: conv?.created_at || '',
            updated_at: conv?.updated_at || '',
            other_user: otherParticipant ? {
              user_id: otherParticipant.user_id,
              display_name: (otherParticipant.profiles as any)?.display_name || 'Unknown'
            } : undefined,
            last_message: lastMessage || undefined,
            unread_count: unreadCount || 0
          } as Conversation;
        })
      );

      return conversations.sort((a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    },
    enabled: !!user
  });

  // Subscribe to realtime changes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return query;
}

// Get messages for a conversation
export function useMessages(conversationId: string | null) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];

      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(display_name)
        `)
        .eq('conversation_id', conversationId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return data.map(m => ({
        ...m,
        sender: { display_name: (m.sender as any)?.display_name || 'Unknown' }
      })) as Message[];
    },
    enabled: !!conversationId && !!user
  });

  // Subscribe to realtime new messages
  useEffect(() => {
    if (!conversationId || !user) return;

    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user, queryClient]);

  return query;
}

// Send a message
export function useSendMessage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: string; content: string }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: content.trim()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });
}

// Mark conversation as read
export function useMarkAsRead() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('conversation_participants')
        .update({ last_read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });
}
