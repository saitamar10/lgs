import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export interface ShopItem {
  id: string;
  name: string;
  description: string | null;
  item_type: string;
  price_coins: number;
  price_xp: number;
  value: number;
  icon: string | null;
  is_active: boolean;
}

export function useShopItems() {
  return useQuery({
    queryKey: ['shop-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      return data as ShopItem[];
    }
  });
}

export function usePurchaseItem() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: ShopItem) => {
      if (!user) throw new Error('Not authenticated');

      // Get current profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('coins')
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;
      if ((profile?.coins ?? 0) < item.price_coins) {
        throw new Error('Yeterli coin yok!');
      }

      // Deduct coins
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ coins: (profile?.coins ?? 0) - item.price_coins })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Apply item effect based on type
      if (item.item_type === 'hearts') {
        const { data: heartsData } = await supabase
          .from('user_hearts')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (heartsData) {
          const newHearts = Math.min(heartsData.max_hearts, heartsData.hearts + item.value);
          await supabase
            .from('user_hearts')
            .update({ hearts: newHearts })
            .eq('user_id', user.id);
        }
      } else if (item.item_type === 'streak_freeze') {
        // Add to inventory
        const { data: inventory } = await supabase
          .from('user_inventory')
          .select('*')
          .eq('user_id', user.id)
          .eq('item_type', 'streak_freeze')
          .maybeSingle();

        if (inventory) {
          await supabase
            .from('user_inventory')
            .update({ quantity: inventory.quantity + item.value })
            .eq('id', inventory.id);
        } else {
          await supabase
            .from('user_inventory')
            .insert({ user_id: user.id, item_type: 'streak_freeze', quantity: item.value });
        }
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['user-hearts'] });
      queryClient.invalidateQueries({ queryKey: ['user-inventory'] });
    }
  });
}

export function useUserInventory() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-inventory', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_inventory')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });
}
