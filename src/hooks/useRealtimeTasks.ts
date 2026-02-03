import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

/**
 * Supabase Realtime subscription for task progress updates
 * Automatically refetches task progress when changes occur in the database
 */
export function useRealtimeTasks() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    // Subscribe to user_task_progress changes for current user
    const channel = supabase
      .channel('task-progress-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'user_task_progress',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Task progress changed:', payload);

          // Invalidate queries to trigger refetch
          queryClient.invalidateQueries({ queryKey: ['user-task-progress'] });
          queryClient.invalidateQueries({ queryKey: ['profile'] });
          queryClient.invalidateQueries({ queryKey: ['daily-tasks'] });
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);
}
