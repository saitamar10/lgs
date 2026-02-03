import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

const FREE_DAILY_MESSAGE_LIMIT = 5;

export interface CoachConversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface CoachMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export function useCoachConversations() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['coach-conversations', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('coach_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as CoachConversation[];
    },
    enabled: !!user
  });
}

export function useCoachMessageLimit() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: messageLimit, isLoading } = useQuery({
    queryKey: ['coach-message-limit', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const today = new Date().toISOString().split('T')[0];

      // Check if there's a record for today
      const { data, error } = await supabase
        .from('coach_message_limits')
        .select('*')
        .eq('user_id', user.id)
        .eq('reset_date', today)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const incrementMessageCount = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');

      const today = new Date().toISOString().split('T')[0];

      // Get existing record
      const { data: existing } = await supabase
        .from('coach_message_limits')
        .select('*')
        .eq('user_id', user.id)
        .eq('reset_date', today)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('coach_message_limits')
          .update({ 
            message_count: existing.message_count + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('coach_message_limits')
          .insert({
            user_id: user.id,
            message_count: 1,
            reset_date: today
          });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-message-limit'] });
    }
  });

  const currentCount = messageLimit?.message_count || 0;
  const canSendMessage = currentCount < FREE_DAILY_MESSAGE_LIMIT;
  const remainingMessages = Math.max(0, FREE_DAILY_MESSAGE_LIMIT - currentCount);

  return {
    currentCount,
    canSendMessage,
    remainingMessages,
    dailyLimit: FREE_DAILY_MESSAGE_LIMIT,
    isLoading,
    incrementMessageCount
  };
}

export function useCoachMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ['coach-messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];

      const { data, error } = await supabase
        .from('coach_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at');

      if (error) throw error;
      return data as CoachMessage[];
    },
    enabled: !!conversationId
  });
}

export function useCreateConversation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (title?: string) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('coach_conversations')
        .insert({ user_id: user.id, title: title || 'Yeni Sohbet' })
        .select()
        .single();

      if (error) throw error;
      return data as CoachConversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-conversations'] });
    }
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: string; content: string }) => {
      // Save user message
      const { error: userMsgError } = await supabase
        .from('coach_messages')
        .insert({ conversation_id: conversationId, role: 'user', content });

      if (userMsgError) throw userMsgError;

      // Call AI edge function
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('ai-coach', {
        body: { conversationId, message: content }
      });

      if (aiError) throw aiError;

      // Save AI response
      const { error: aiMsgError } = await supabase
        .from('coach_messages')
        .insert({ 
          conversation_id: conversationId, 
          role: 'assistant', 
          content: aiResponse.response 
        });

      if (aiMsgError) throw aiMsgError;

      // Update conversation timestamp
      await supabase
        .from('coach_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      return aiResponse.response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['coach-messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['coach-conversations'] });
    }
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      const { error } = await supabase
        .from('coach_conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-conversations'] });
    }
  });
}
