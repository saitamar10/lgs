import { useEffect, useState } from 'react';
import { useStreak } from '@/hooks/useStreak';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Flame, Trophy, Shield, Loader2, PartyPopper } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakDialogProps {
  open: boolean;
  onClose: () => void;
}

export function StreakDialog({ open, onClose }: StreakDialogProps) {
  const { 
    currentStreak, 
    longestStreak, 
    streakFreezeCount, 
    checkIn, 
    isCheckingIn,
    lastLoginDate 
  } = useStreak();

  const [checkInResult, setCheckInResult] = useState<{
    alreadyCheckedIn: boolean;
    streak?: number;
    usedFreeze?: boolean;
    isNewRecord?: boolean;
  } | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const hasCheckedInToday = lastLoginDate === today;

  const handleCheckIn = async () => {
    try {
      const result = await checkIn();
      setCheckInResult(result);
    } catch (error) {
      console.error('Check-in failed:', error);
    }
  };

  useEffect(() => {
    if (!open) {
      setCheckInResult(null);
    }
  }, [open]);

  // Generate week days for streak visualization
  const weekDays = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  const todayIndex = new Date().getDay();
  const adjustedTodayIndex = todayIndex === 0 ? 6 : todayIndex - 1;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 justify-center text-xl">
            <Flame className="w-6 h-6 text-destructive" />
            Günlük Seri
          </DialogTitle>
        </DialogHeader>

        {checkInResult && !checkInResult.alreadyCheckedIn ? (
          <div className="text-center py-6 animate-slide-up">
            <PartyPopper className="w-16 h-16 mx-auto text-warning mb-4" />
            <h3 className="text-2xl font-bold mb-2">
              {checkInResult.isNewRecord ? '🎉 Yeni Rekor!' : 'Tebrikler!'}
            </h3>
            <p className="text-4xl font-bold text-destructive mb-2">
              {checkInResult.streak} Gün
            </p>
            {checkInResult.usedFreeze && (
              <p className="text-sm text-primary flex items-center justify-center gap-1">
                <Shield className="w-4 h-4" />
                Seri koruyucu kullanıldı!
              </p>
            )}
            <Button onClick={onClose} className="mt-6">
              Harika!
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Current Streak */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-destructive to-orange-500 rounded-full mb-3">
                <span className="text-4xl font-bold text-white">{currentStreak}</span>
              </div>
              <p className="text-muted-foreground">Günlük seri</p>
            </div>

            {/* Week Progress */}
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((day, index) => {
                const isActive = index <= adjustedTodayIndex && hasCheckedInToday;
                const isPast = index < adjustedTodayIndex;
                const isToday = index === adjustedTodayIndex;

                return (
                  <div 
                    key={day}
                    className={cn(
                      "flex flex-col items-center gap-1 py-2 rounded-lg transition-all",
                      isActive && "bg-destructive/10"
                    )}
                  >
                    <div 
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm",
                        isActive ? "bg-destructive text-white" : 
                        isToday && !hasCheckedInToday ? "bg-border border-2 border-dashed border-destructive" :
                        isPast ? "bg-muted" : "bg-border"
                      )}
                    >
                      {isActive && <Flame className="w-4 h-4" />}
                    </div>
                    <span className={cn(
                      "text-xs",
                      isToday && "font-bold"
                    )}>
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary rounded-lg p-3 text-center">
                <Trophy className="w-5 h-5 mx-auto text-warning mb-1" />
                <p className="text-lg font-bold">{longestStreak}</p>
                <p className="text-xs text-muted-foreground">En uzun seri</p>
              </div>
              <div className="bg-secondary rounded-lg p-3 text-center">
                <Shield className="w-5 h-5 mx-auto text-primary mb-1" />
                <p className="text-lg font-bold">{streakFreezeCount}</p>
                <p className="text-xs text-muted-foreground">Seri koruyucu</p>
              </div>
            </div>

            {/* Check-in Button */}
            {!hasCheckedInToday && (
              <Button 
                onClick={handleCheckIn} 
                disabled={isCheckingIn}
                className="w-full bg-gradient-to-r from-destructive to-orange-500 hover:from-destructive/90 hover:to-orange-500/90"
              >
                {isCheckingIn ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Flame className="w-4 h-4 mr-2" />
                )}
                Bugün Giriş Yap
              </Button>
            )}

            {hasCheckedInToday && (
              <div className="text-center text-sm text-success">
                ✓ Bugün giriş yapıldı!
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
