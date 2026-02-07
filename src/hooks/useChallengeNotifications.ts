import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNotifications } from '@/hooks/useNotifications';

/**
 * Hook to listen for new friend challenges via Supabase Realtime
 * and show browser + in-app notifications
 */
export function useChallengeNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { sendNotification, permission } = useNotifications();

  useEffect(() => {
    if (!user) return;

    console.log('🔔 Setting up challenge notifications for user:', user.id);

    // Subscribe to friend_challenges table for INSERT events
    const channel = supabase
      .channel('friend_challenges_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'friend_challenges',
          filter: `challenged_id=eq.${user.id}`
        },
        async (payload) => {
          console.log('🔔 New challenge received!', payload);

          const newChallenge = payload.new as any;

          // Fetch challenger's profile to get their name
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', newChallenge.challenger_id)
            .single();

          const challengerName = profile?.display_name || 'Bir arkadaşın';

          // Show browser notification
          if (permission === 'granted') {
            sendNotification(
              'Yeni Meydan Okuma! 🎮',
              `${challengerName} sana ${newChallenge.subject_name} - ${newChallenge.unit_name} konusunda meydan okudu!`
            );
          }

          // Show in-app toast notification
          toast.info(`${challengerName} sana meydan okudu!`, {
            description: `${newChallenge.subject_name} - ${newChallenge.unit_name}`,
            duration: 5000,
            action: {
              label: 'Görüntüle',
              onClick: () => {
                // This will trigger navigation in the main component
                window.dispatchEvent(new CustomEvent('navigate-to-challenges'));
              }
            }
          });

          // Invalidate queries to refresh the UI
          queryClient.invalidateQueries({ queryKey: ['pending-challenges'] });
          queryClient.invalidateQueries({ queryKey: ['friend-challenges'] });
        }
      )
      .subscribe((status) => {
        console.log('🔔 Challenge notification subscription status:', status);
      });

    // Cleanup subscription on unmount
    return () => {
      console.log('🔔 Cleaning up challenge notifications');
      supabase.removeChannel(channel);
    };
  }, [user, queryClient, sendNotification, permission]);
}
