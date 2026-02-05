import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_type: 'free' | 'plus' | 'premium';
  started_at: string;
  expires_at: string | null;
  is_active: boolean;
  features: {
    unlimited_hearts: boolean;
    ad_free: boolean;
    ai_coach: boolean;
    special_badges: boolean;
  };
}

export function useSubscription() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-subscription', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Check database for subscription
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      // If database has an active subscription, check if expired
      if (data && data.is_active && data.expires_at) {
        const expiresAt = new Date(data.expires_at);
        const isExpired = expiresAt < new Date();

        // If expired, mark as inactive
        if (isExpired) {
          await supabase
            .from('user_subscriptions')
            .update({ is_active: false })
            .eq('user_id', user.id);

          return {
            ...data,
            is_active: false,
            plan_type: 'free' as const,
            features: { unlimited_hearts: false, ad_free: false, ai_coach: false, special_badges: false }
          } as UserSubscription;
        }

        // Return database subscription (valid and active)
        return {
          ...data,
          features: data.features as UserSubscription['features']
        } as UserSubscription;
      }

      // If no subscription exists in database, create a free one
      if (!data) {
        const { data: newData, error: insertError } = await supabase
          .from('user_subscriptions')
          .insert({
            user_id: user.id,
            plan_type: 'free',
            is_active: false,
            expires_at: null,
            features: { unlimited_hearts: false, ad_free: false, ai_coach: false, special_badges: false }
          })
          .select()
          .single();

        if (insertError) throw insertError;
        return {
          ...newData,
          features: newData.features as UserSubscription['features']
        } as UserSubscription;
      }

      // Return existing database data
      return {
        ...data,
        features: data.features as UserSubscription['features']
      } as UserSubscription;
    },
    enabled: !!user,
    refetchInterval: 60000, // Refetch every minute to keep in sync
  });
}

export function useUpgradeSubscription() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planType: 'plus' | 'premium') => {
      if (!user) throw new Error('Not authenticated');

      const features = planType === 'plus'
        ? { unlimited_hearts: true, ad_free: true, ai_coach: true, special_badges: true }
        : { unlimited_hearts: true, ad_free: true, ai_coach: true, special_badges: true };

      const expiresAt = new Date();
      // Plus = 1 month, Premium = 1 year
      if (planType === 'plus') {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      } else {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      }

      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          plan_type: planType,
          is_active: true,
          started_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
          cancelled_at: null, // Clear any previous cancellation
          features
        })
        .eq('user_id', user.id);

      if (error) throw error;

      return { success: true, planType };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-subscription'] });
    }
  });
}

export function useIsPremium() {
  const { data: subscription } = useSubscription();
  return subscription?.plan_type !== 'free' && subscription?.is_active;
}

export function useHasFeature(feature: keyof UserSubscription['features']) {
  const { data: subscription } = useSubscription();
  return subscription?.features?.[feature] ?? false;
}
