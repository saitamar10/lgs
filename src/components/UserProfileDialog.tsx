import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Flame, Trophy, Crown, Loader2, Award } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface UserProfileDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

interface UserProfile {
  user_id: string;
  display_name: string;
  total_xp: number;
  level: number;
  streak_days: number;
  longest_streak: number;
  plan_type?: string;
  selected_rank?: string;
}

interface Rank {
  name: string;
  icon: string;
  color: string;
}

interface UserBadge {
  badge_id: string;
  earned_at: string;
  badges: {
    name: string;
    description: string;
    icon: string;
  };
}

// Calculate level from XP
function calculateLevel(xp: number): { level: number; progress: number; xpToNext: number } {
  const baseXP = 100;
  const multiplier = 1.5;

  let level = 1;
  let totalXPForLevel = 0;
  let xpForCurrentLevel = baseXP;

  while (totalXPForLevel + xpForCurrentLevel <= xp) {
    totalXPForLevel += xpForCurrentLevel;
    level++;
    xpForCurrentLevel = Math.floor(baseXP * Math.pow(multiplier, level - 1));
  }

  const xpIntoCurrentLevel = xp - totalXPForLevel;
  const progress = (xpIntoCurrentLevel / xpForCurrentLevel) * 100;

  return {
    level,
    progress,
    xpToNext: xpForCurrentLevel - xpIntoCurrentLevel
  };
}

export function UserProfileDialog({ open, onClose, userId }: UserProfileDialogProps) {
  // Fetch user profile
  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      console.log('Fetching profile for userId:', userId);

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          user_id,
          display_name,
          total_xp,
          streak_days,
          selected_rank
        `)
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        throw error;
      }

      console.log('Profile data:', data);

      const levelInfo = calculateLevel(data.total_xp || 0);

      return {
        ...data,
        level: levelInfo.level,
        longest_streak: data.streak_days || 0 // Use current streak as longest for now
      } as UserProfile;
    },
    enabled: open && !!userId,
    retry: 1
  });

  // Fetch user subscription
  const { data: subscription } = useQuery({
    queryKey: ['user-subscription', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('plan_type')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: open && !!userId
  });

  // Fetch rank details if user has one
  const { data: rankDetails } = useQuery({
    queryKey: ['rank-details', profile?.selected_rank],
    queryFn: async () => {
      if (!profile?.selected_rank) return null;

      const { data, error } = await supabase
        .from('ranks')
        .select('name, icon, color')
        .eq('name', profile.selected_rank)
        .single();

      if (error) throw error;
      return data as Rank;
    },
    enabled: open && !!profile?.selected_rank
  });

  // Fetch user badges
  const { data: userBadges = [] } = useQuery({
    queryKey: ['user-badges', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          badge_id,
          earned_at,
          badges (
            name,
            description,
            icon
          )
        `)
        .eq('user_id', userId)
        .order('earned_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data as UserBadge[];
    },
    enabled: open && !!userId
  });

  const isPremium = subscription?.plan_type !== 'free' && subscription?.plan_type;
  const levelInfo = profile ? calculateLevel(profile.total_xp || 0) : { level: 1, progress: 0, xpToNext: 100 };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Kullanıcı Profili</DialogTitle>
        </DialogHeader>

        {profileLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : profileError ? (
          <div className="text-center text-destructive py-8">
            <p className="font-semibold mb-2">Profil yüklenemedi</p>
            <p className="text-sm text-muted-foreground">
              {profileError instanceof Error ? profileError.message : 'Bilinmeyen hata'}
            </p>
            <p className="text-xs text-muted-foreground mt-2">User ID: {userId}</p>
          </div>
        ) : profile ? (
          <div className="space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {profile.display_name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold">{profile.display_name || 'Kullanıcı'}</h2>
                  {isPremium && (
                    <Badge variant="secondary" className="bg-warning/20 text-warning">
                      <Crown className="w-3 h-3 mr-0.5" />
                      Plus
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Seviye {levelInfo.level}</span>
                  {rankDetails && (
                    <Badge variant="outline" className="text-xs">
                      {rankDetails.icon} {rankDetails.name}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Friendship Code */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🔑</span>
                  </div>
                  <div>
                    <p className="text-xs text-blue-700">Arkadaşlık Kodu</p>
                    <p className="font-mono font-bold text-blue-900 tracking-wider">
                      {userId.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <Card>
                <CardContent className="p-3 text-center">
                  <Zap className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-lg font-bold">{profile.total_xp || 0}</p>
                  <p className="text-xs text-muted-foreground">XP</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <Flame className="w-5 h-5 text-warning mx-auto mb-1" />
                  <p className="text-lg font-bold">{profile.streak_days || 0}</p>
                  <p className="text-xs text-muted-foreground">Seri</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <Trophy className="w-5 h-5 text-warning mx-auto mb-1" />
                  <p className="text-lg font-bold">{profile.longest_streak || 0}</p>
                  <p className="text-xs text-muted-foreground">En Uzun</p>
                </CardContent>
              </Card>
            </div>

            {/* Badges */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-warning" />
                Rozetler
                {userBadges.length > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {userBadges.length}
                  </Badge>
                )}
              </h3>
              {userBadges.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {userBadges.map((userBadge) => (
                    <div
                      key={userBadge.badge_id}
                      className="aspect-square rounded-xl border-2 bg-gradient-to-br from-warning/20 to-primary/20 border-warning flex flex-col items-center justify-center p-2"
                      title={`${userBadge.badges.name}: ${userBadge.badges.description}`}
                    >
                      <div className="text-2xl mb-1">{userBadge.badges.icon || '🏆'}</div>
                      <p className="text-xs font-medium text-center line-clamp-2">
                        {userBadge.badges.name}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Henüz rozet kazanılmamış
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            Profil yüklenemedi
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
