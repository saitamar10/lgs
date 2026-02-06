import { useEffect, useRef } from 'react';
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
  const notifiedTasksRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;

    // Reset notified tasks on new day
    const today = new Date().toISOString().split('T')[0];
    const lastResetDate = localStorage.getItem('lastTaskResetDate');
    if (lastResetDate !== today) {
      notifiedTasksRef.current.clear();
      localStorage.setItem('lastTaskResetDate', today);
    }

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

          // Only invalidate queries, don't show toast here
          // Toast notifications should only come from the mutation itself
          queryClient.invalidateQueries({ queryKey: ['user-task-progress'] });
          queryClient.invalidateQueries({ queryKey: ['profile'] });
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);
}
