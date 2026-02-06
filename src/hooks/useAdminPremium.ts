import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  email?: string;
  is_premium: boolean | null;
  premium_expires_at: string | null;
  total_xp: number | null;
}

// Search users by email
export function useSearchUsersByEmail(email: string) {
  return useQuery({
    queryKey: ['admin-search-users', email],
    queryFn: async () => {
      if (!email || email.length < 3) return [];

      // First get user IDs from auth.users by email
      const { data: authUsers, error: authError } = await supabase
        .from('profiles')
        .select('user_id')
        .limit(10);

      if (authError) throw authError;

      // Search in profiles using ilike on display_name or get all profiles
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, user_id, display_name, is_premium, premium_expires_at, total_xp')
        .ilike('display_name', `%${email}%`)
        .limit(10);

      if (error) throw error;

      // Also try to get email from auth.users for each profile
      const profilesWithEmail = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: { user } } = await supabase.auth.admin.getUserById(profile.user_id);
          return {
            ...profile,
            email: user?.email
          };
        })
      );

      // Filter by email match
      return profilesWithEmail.filter(p =>
        p.email?.toLowerCase().includes(email.toLowerCase()) ||
        p.display_name?.toLowerCase().includes(email.toLowerCase())
      ) as UserProfile[];
    },
    enabled: email.length >= 3,
  });
}

// Simple search by display name (doesn't need admin access)
export function useSearchUsersByName(searchTerm: string) {
  return useQuery({
    queryKey: ['admin-search-users-simple', searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return [];

      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, display_name, is_premium, premium_expires_at, total_xp')
        .or(`display_name.ilike.%${searchTerm}%,user_id.ilike.%${searchTerm}%`)
        .limit(20);

      if (error) throw error;

      return (data || []) as UserProfile[];
    },
    enabled: searchTerm.length >= 2,
  });
}

// Update user premium status
export function useUpdatePremium() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      duration
    }: {
      userId: string;
      duration: '1month' | '1year' | 'remove'
    }) => {
      let premiumExpiresAt: string | null = null;
      let isPremium = true;

      if (duration === 'remove') {
        isPremium = false;
        premiumExpiresAt = null;
      } else {
        const now = new Date();
        if (duration === '1month') {
          now.setMonth(now.getMonth() + 1);
        } else if (duration === '1year') {
          now.setFullYear(now.getFullYear() + 1);
        }
        premiumExpiresAt = now.toISOString();
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          is_premium: isPremium,
          premium_expires_at: premiumExpiresAt
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-search-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-search-users-simple'] });

      const message = variables.duration === 'remove'
        ? 'Premium kaldırıldı'
        : `Premium eklendi (${variables.duration === '1month' ? '1 Ay' : '1 Yıl'})`;

      toast.success(message);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Premium güncellenemedi');
    },
  });
}
