import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { hasActiveSubscription, getSubscriberInfo } from '@/lib/revenuecat';

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

      // FIRST: Check database for subscription (WhatsApp payments on web)
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      // If database has an active subscription, use it (WhatsApp web payment)
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

      // SECOND: Check RevenueCat for mobile subscriptions
      const isPremiumFromRC = await hasActiveSubscription(user.id);
      const subscriberInfo = await getSubscriberInfo(user.id);

      let planType: 'free' | 'plus' | 'premium' = 'free';
      let expiresAt: string | null = null;

      if (isPremiumFromRC && subscriberInfo) {
        const entitlements = subscriberInfo.subscriber.entitlements;
        const premiumEntitlement = entitlements['premium'] || Object.values(entitlements)[0];

        if (premiumEntitlement) {
          expiresAt = premiumEntitlement.expires_date || null;
          const productId = premiumEntitlement.product_identifier || '';
          planType = productId.includes('yearly') ? 'premium' : 'plus';
        }
      }

      const features = isPremiumFromRC
        ? { unlimited_hearts: true, ad_free: true, ai_coach: true, special_badges: true }
        : { unlimited_hearts: false, ad_free: false, ai_coach: false, special_badges: false };

      // If no subscription exists in database, create one
      if (!data) {
        const { data: newData, error: insertError } = await supabase
          .from('user_subscriptions')
          .insert({
            user_id: user.id,
            plan_type: planType,
            is_active: isPremiumFromRC,
            expires_at: expiresAt,
            features
          })
          .select()
          .single();

        if (insertError) throw insertError;
        return {
          ...newData,
          features: newData.features as UserSubscription['features']
        } as UserSubscription;
      }

      // Only update if RevenueCat has active subscription (mobile payment)
      // Don't override database if RevenueCat is inactive (keeps WhatsApp web payments intact)
      if (isPremiumFromRC) {
        const { data: updatedData, error: updateError } = await supabase
          .from('user_subscriptions')
          .update({
            plan_type: planType,
            is_active: true,
            expires_at: expiresAt,
            features
          })
          .eq('user_id', user.id)
          .select()
          .single();

        if (updateError) throw updateError;

        return {
          ...updatedData,
          features: updatedData.features as UserSubscription['features']
        } as UserSubscription;
      }

      // Return existing database data without modification
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
