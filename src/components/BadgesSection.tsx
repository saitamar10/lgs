import { useBadges, useUserBadges } from '@/hooks/useBadges';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Lock, Star, Trophy, Flame, BookOpen, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const badgeIcons: Record<string, any> = {
  'first-steps': Star,
  'streak': Flame,
  'quiz-master': Trophy,
  'bookworm': BookOpen,
  'daily-grind': Target,
  'xp-hunter': Zap,
  'math-wizard': '🧮',
  'vocabulary-master': '📚'
};

// Hardcoded badges for display
const DISPLAY_BADGES = [
  { id: '1', name: 'İlk Adımlar', description: 'İlk dersi tamamla', icon: 'first-steps', requirement: 1 },
  { id: '2', name: '7 Günlük Seri', description: '7 gün üst üste giriş yap', icon: 'streak', requirement: 7 },
  { id: '3', name: 'Quiz Ustası', description: '50 quiz tamamla', icon: 'quiz-master', requirement: 50 },
  { id: '4', name: 'Kitap Kurdu', description: '100 ders tamamla', icon: 'bookworm', requirement: 100 },
  { id: '5', name: 'Günlük Aslan', description: '30 günlük seri yap', icon: 'daily-grind', requirement: 30 },
  { id: '6', name: 'XP Avcısı', description: '10,000 XP kazan', icon: 'xp-hunter', requirement: 10000 },
  { id: '7', name: 'Matematik Sihirbazı', description: 'Matematik dersinde 5 yıldız', icon: 'math-wizard', requirement: 5 },
  { id: '8', name: 'Kelime Ustası', description: '500 kelime öğren', icon: 'vocabulary-master', requirement: 500 },
  { id: '9', name: 'LGS Şampiyonu', description: '10 deneme sınavı tamamla', icon: 'quiz-master', requirement: 10 },
  { id: '10', name: 'Süper Öğrenci', description: '50,000 XP kazan', icon: 'xp-hunter', requirement: 50000 }
];

export function BadgesSection() {
  const { data: userBadges } = useUserBadges();
  const earnedBadgeIds = new Set(userBadges?.map(ub => ub.badge_id) || []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Award className="w-5 h-5 text-warning" />
          Rozetlerim
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {DISPLAY_BADGES.map((badge) => {
            const isUnlocked = earnedBadgeIds.has(badge.id);
            const IconComponent = badgeIcons[badge.icon];

            return (
              <div
                key={badge.id}
                className={cn(
                  "relative aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-2 transition-all",
                  isUnlocked
                    ? "bg-gradient-to-br from-warning/20 to-primary/20 border-warning shadow-lg hover:scale-105"
                    : "bg-secondary/50 border-border opacity-50"
                )}
                title={`${badge.name}: ${badge.description}`}
              >
                {!isUnlocked && (
                  <Lock className="absolute top-1 right-1 w-3 h-3 text-muted-foreground" />
                )}

                <div className="text-2xl mb-1">
                  {typeof IconComponent === 'string' ? (
                    IconComponent
                  ) : IconComponent ? (
                    <IconComponent className={cn(
                      "w-8 h-8",
                      isUnlocked ? "text-warning" : "text-muted-foreground"
                    )} />
                  ) : (
                    <Award className="w-8 h-8" />
                  )}
                </div>

                <p className="text-xs font-medium text-center line-clamp-2">
                  {badge.name}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
