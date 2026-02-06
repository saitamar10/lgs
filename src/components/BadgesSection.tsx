import { useBadges, useUserBadges } from '@/hooks/useBadges';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Lock, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Badge as BadgeUI } from '@/components/ui/badge';

const categoryLabels: Record<string, string> = {
  topic: '📚 Konu Başarısı',
  ranking: '🏆 Sıralama',
  xp: '⭐ XP Kazanımı',
  streak: '🔥 Günlük Seri',
  quiz: '📝 Quiz',
  perfect: '💯 Mükemmellik',
  speed: '⚡ Hız',
  league: '🏅 Lig',
  social: '👥 Sosyal',
  special: '✨ Özel',
  subject: '🎓 Bilgi Uzmanlığı',
  milestone: '🎯 Kilometre Taşları',
};

export function BadgesSection() {
  const { data: allBadges, isLoading: badgesLoading } = useBadges();
  const { data: userBadges, isLoading: userBadgesLoading } = useUserBadges();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['topic', 'xp', 'quiz']));

  const earnedBadgeIds = new Set(userBadges?.map(ub => ub.badge_id) || []);
  const isLoading = badgesLoading || userBadgesLoading;

  // Group badges by category
  const badgesByCategory = allBadges?.reduce((acc, badge) => {
    const category = badge.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(badge);
    return acc;
  }, {} as Record<string, typeof allBadges>) || {};

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const earnedCount = userBadges?.length || 0;
  const totalCount = allBadges?.length || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Award className="w-5 h-5 text-warning" />
          Rozetlerim
          <span className="ml-auto text-sm text-muted-foreground">
            {earnedCount} / {totalCount}
          </span>
        </CardTitle>
        {totalCount > 0 && (
          <div className="mt-2">
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-gradient-to-r from-warning to-primary h-2 rounded-full transition-all"
                style={{ width: `${(earnedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        )}
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
          <div className="space-y-4">
            {Object.entries(badgesByCategory).map(([category, badges]) => {
              const isExpanded = expandedCategories.has(category);
              const categoryEarnedCount = badges.filter(b => earnedBadgeIds.has(b.id)).length;

              return (
                <div key={category} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between p-3 bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">
                        {categoryLabels[category] || category}
                      </span>
                      <BadgeUI variant="outline" className="text-xs">
                        {categoryEarnedCount}/{badges.length}
                      </BadgeUI>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {badges.map((badge) => {
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
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
