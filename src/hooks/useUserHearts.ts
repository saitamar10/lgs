import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useEffect, useState, useCallback } from 'react';

const HEART_REGENERATION_MS = 15 * 60 * 1000; // 15 minutes per heart

interface UserHearts {
  id: string;
  user_id: string;
  hearts: number;
  max_hearts: number;
  last_heart_lost_at: string | null;
}

export function useUserHearts() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [timeUntilNextHeart, setTimeUntilNextHeart] = useState<number>(0);

  const { data: heartsData, isLoading } = useQuery({
    queryKey: ['user-hearts', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_hearts')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      // If no hearts record exists, create one
      if (!data) {
        const { data: newData, error: insertError } = await supabase
          .from('user_hearts')
          .insert({ user_id: user.id, hearts: 5, max_hearts: 5 })
          .select()
          .single();
        
        if (insertError) throw insertError;
        return newData as UserHearts;
      }

      return data as UserHearts;
    },
    enabled: !!user
  });

  // Auto-regenerate hearts
  useEffect(() => {
    if (!heartsData || heartsData.hearts >= heartsData.max_hearts || !heartsData.last_heart_lost_at) {
      setTimeUntilNextHeart(0);
      return;
    }

    const interval = setInterval(async () => {
      const lastLost = new Date(heartsData.last_heart_lost_at!).getTime();
      const elapsed = Date.now() - lastLost;
      const regeneratedHearts = Math.floor(elapsed / HEART_REGENERATION_MS);

      if (regeneratedHearts > 0) {
        const newHearts = Math.min(heartsData.max_hearts, heartsData.hearts + regeneratedHearts);
        
        await supabase
          .from('user_hearts')
          .update({ 
            hearts: newHearts,
            last_heart_lost_at: newHearts >= heartsData.max_hearts ? null : new Date().toISOString()
          })
          .eq('user_id', heartsData.user_id);

        queryClient.invalidateQueries({ queryKey: ['user-hearts'] });
      }

      const timeForNextHeart = HEART_REGENERATION_MS - (elapsed % HEART_REGENERATION_MS);
      setTimeUntilNextHeart(timeForNextHeart);
    }, 1000);

    return () => clearInterval(interval);
  }, [heartsData, queryClient]);

  const useHeartMutation = useMutation({
    mutationFn: async () => {
      if (!heartsData || heartsData.hearts <= 0) return false;

      const { error } = await supabase
        .from('user_hearts')
        .update({ 
          hearts: heartsData.hearts - 1,
          last_heart_lost_at: heartsData.last_heart_lost_at || new Date().toISOString()
        })
        .eq('user_id', heartsData.user_id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-hearts'] });
    }
  });

  const addHeartsMutation = useMutation({
    mutationFn: async (amount: number) => {
      if (!heartsData) return;

      const newHearts = Math.min(heartsData.max_hearts, heartsData.hearts + amount);
      
      const { error } = await supabase
        .from('user_hearts')
        .update({ 
          hearts: newHearts,
          last_heart_lost_at: newHearts >= heartsData.max_hearts ? null : heartsData.last_heart_lost_at
        })
        .eq('user_id', heartsData.user_id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-hearts'] });
    }
  });

  const refillHeartsMutation = useMutation({
    mutationFn: async () => {
      if (!heartsData) return;

      const { error } = await supabase
        .from('user_hearts')
        .update({ hearts: heartsData.max_hearts, last_heart_lost_at: null })
        .eq('user_id', heartsData.user_id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-hearts'] });
    }
  });

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const watchAd = useCallback(async () => {
    // Simulate watching an ad
    await new Promise(resolve => setTimeout(resolve, 3000));
    await addHeartsMutation.mutateAsync(1);
  }, [addHeartsMutation]);

  return {
    hearts: heartsData?.hearts ?? 5,
    maxHearts: heartsData?.max_hearts ?? 5,
    hasHearts: (heartsData?.hearts ?? 5) > 0,
    isLoading,
    useHeart: () => useHeartMutation.mutate(),
    addHearts: (amount: number) => addHeartsMutation.mutate(amount),
    refillHearts: () => refillHeartsMutation.mutate(),
    watchAd,
    timeUntilNextHeart,
    formattedTimeUntilNextHeart: formatTime(timeUntilNextHeart),
    isRegenerating: (heartsData?.hearts ?? 5) < (heartsData?.max_hearts ?? 5) && !!heartsData?.last_heart_lost_at
  };
}
