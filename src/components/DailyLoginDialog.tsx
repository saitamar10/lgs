import { useEffect, useState, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mascot } from '@/components/Mascot';
import { Flame, Gift, Star, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DailyLoginDialogProps {
  open: boolean;
  onClose: () => void;
  streak: number;
  isNewRecord?: boolean;
  usedFreeze?: boolean;
  xpBonus?: number;
}

export function DailyLoginDialog({
  open,
  onClose,
  streak,
  isNewRecord = false,
  usedFreeze = false,
  xpBonus = 10
}: DailyLoginDialogProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (open) {
      // Delay content for animation
      setTimeout(() => setShowContent(true), 100);
      
      // Celebration confetti
      if (streak > 0) {
        setTimeout(async () => {
          const confettiModule = await import('canvas-confetti');
          const confetti = confettiModule.default;
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }, 300);
      }
    } else {
      setShowContent(false);
    }
  }, [open, streak]);

  const getMascotMessage = () => {
    if (isNewRecord) return 'Yeni rekor! Sen bir efsanesin! 🏆';
    if (streak >= 30) return 'Bir ay boyunca devam ettin! İnanılmaz! 🌟';
    if (streak >= 7) return 'Bir hafta boyunca çalıştın! Harika! 🔥';
    if (streak >= 3) return 'Üç gün üst üste! Devam et! 💪';
    return 'Bugün de buradasın! Harika! 🎯';
  };

  const getStreakColor = () => {
    if (streak >= 30) return 'from-yellow-500 to-orange-500';
    if (streak >= 7) return 'from-orange-500 to-red-500';
    if (streak >= 3) return 'from-red-500 to-pink-500';
    return 'from-primary to-primary/70';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm p-0 overflow-hidden border-0">
        {/* Top gradient section */}
        <div className={cn(
          "bg-gradient-to-br p-8 text-center",
          getStreakColor()
        )}>
          <div className={cn(
            "transition-all duration-500",
            showContent ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          )}>
            {/* Streak flame animation */}
            <div className="relative inline-flex items-center justify-center mb-4">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse" />
              <div className="relative bg-white/10 backdrop-blur rounded-full p-6">
                <Flame className="w-16 h-16 text-white animate-bounce" />
              </div>
            </div>

            {/* Streak number */}
            <div className="text-6xl font-black text-white mb-2 animate-scale-in">
              {streak}
            </div>
            <div className="text-white/90 text-lg font-medium">
              {streak === 1 ? 'Günlük Seri Başladı!' : 'Gün Seri!'}
            </div>

            {isNewRecord && (
              <div className="mt-2 inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-300" />
                <span className="text-white text-sm font-medium">Yeni Rekor!</span>
              </div>
            )}

            {usedFreeze && (
              <div className="mt-2 inline-flex items-center gap-1 bg-blue-500/30 px-3 py-1 rounded-full">
                <span className="text-white text-sm">❄️ Seri koruyucu kullanıldı</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom content section */}
        <div className={cn(
          "p-6 bg-card transition-all duration-500 delay-200",
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          {/* Mascot */}
          <div className="flex justify-center mb-4">
            <Mascot 
              size="md" 
              mood={isNewRecord ? 'celebrating' : 'happy'}
              message={getMascotMessage()}
              animate={false}
            />
          </div>

          {/* Rewards */}
          <div className="bg-secondary rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary" />
                <span className="font-medium">Günlük Ödül</span>
              </div>
              <div className="flex items-center gap-1 text-primary font-bold">
                <Zap className="w-4 h-4" />
                +{xpBonus} XP
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-1 mb-6">
            {['P', 'S', 'Ç', 'P', 'C', 'C', 'P'].map((day, idx) => {
              // Only show flames for completed days (up to current streak within 7-day cycle)
              const dayInCycle = (streak - 1) % 7; // Which day of the week we're on (0-6)
              const isCompleted = idx < dayInCycle; // Days before today in this week
              const isToday = idx === dayInCycle; // Current day
              
              return (
                <div
                  key={idx}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                    isCompleted 
                      ? "bg-primary text-primary-foreground" 
                      : isToday 
                        ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-card"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted || isToday ? <Flame className="w-4 h-4" /> : day}
                </div>
              );
            })}
          </div>

          <Button onClick={onClose} className="w-full h-12 text-lg font-bold">
            Haydi Başlayalım!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
