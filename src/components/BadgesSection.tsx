import { useBadges, useUserBadges } from '@/hooks/useBadges';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Lock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BadgesSection() {
  const { data: allBadges, isLoading: badgesLoading } = useBadges();
  const { data: userBadges, isLoading: userBadgesLoading } = useUserBadges();

  const earnedBadgeIds = new Set(userBadges?.map(ub => ub.badge_id) || []);
  const isLoading = badgesLoading || userBadgesLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Award className="w-5 h-5 text-warning" />
          Rozetlerim
          {userBadges && userBadges.length > 0 && (
            <span className="ml-auto text-sm text-muted-foreground">
              {userBadges.length} / {allBadges?.length || 0}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : !allBadges || allBadges.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Henüz rozet bulunmuyor. Yakında eklenecek! 🎉
          </p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {allBadges.map((badge) => {
              const isUnlocked = earnedBadgeIds.has(badge.id);

              return (
                <div
                  key={badge.id}
                  className={cn(
                    "relative aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-2 transition-all cursor-pointer",
                    isUnlocked
                      ? "bg-gradient-to-br from-warning/20 to-primary/20 border-warning shadow-lg hover:scale-105"
                      : "bg-secondary/50 border-border opacity-50 hover:opacity-70"
                  )}
                  title={`${badge.name}${badge.description ? ': ' + badge.description : ''}`}
                >
                  {!isUnlocked && (
                    <Lock className="absolute top-1 right-1 w-3 h-3 text-muted-foreground" />
                  )}

                  <div className="text-3xl mb-1">
                    {badge.icon || '🏆'}
                  </div>

                  <p className="text-xs font-medium text-center line-clamp-2">
                    {badge.name}
                  </p>

                  {badge.requirement_value && !isUnlocked && (
                    <p className="text-[10px] text-muted-foreground text-center mt-0.5">
                      {badge.requirement_value}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
