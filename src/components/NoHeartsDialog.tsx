import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, Clock, Play, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { admobService } from '@/lib/admob';
import { toast } from 'sonner';

interface NoHeartsDialogProps {
  open: boolean;
  onClose: () => void;
  hearts: number;
  maxHearts: number;
  timeUntilNextHeart: string;
  isRegenerating: boolean;
  onWatchAd: () => Promise<void>;
  onExit: () => void;
}

export function NoHeartsDialog({
  open,
  onClose,
  hearts,
  maxHearts,
  timeUntilNextHeart,
  isRegenerating,
  onWatchAd,
  onExit
}: NoHeartsDialogProps) {
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adProgress, setAdProgress] = useState(0);

  const handleWatchAd = async () => {
    setIsWatchingAd(true);
    setAdProgress(0);

    try {
      // Progress animasyonu
      const interval = setInterval(() => {
        setAdProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 3;
        });
      }, 100);

      // Gerçek AdMob reklamını göster
      await admobService.showRewardedAd();

      clearInterval(interval);
      setAdProgress(100);

      // Ödülü ver
      await onWatchAd();

      toast.success('Reklam izlediğin için teşekkürler! +1 ❤️', {
        duration: 3000,
      });

      setTimeout(() => {
        setIsWatchingAd(false);
        setAdProgress(0);
        onClose();
      }, 500);

    } catch (error) {
      console.error('Ad watch failed:', error);
      setIsWatchingAd(false);
      setAdProgress(0);

      toast.error('Reklam yüklenemedi. Lütfen tekrar dene.', {
        duration: 3000,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            😢 Canların Bitti!
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-6">
          {/* Hearts Display */}
          <div className="flex gap-2 mb-6">
            {[...Array(maxHearts)].map((_, i) => (
              <Heart
                key={i}
                className={cn(
                  "w-10 h-10 transition-all",
                  i < hearts
                    ? "text-destructive fill-destructive"
                    : "text-muted-foreground/30"
                )}
              />
            ))}
          </div>

          <p className="text-center text-muted-foreground mb-6">
            Yeni bir aşama başlatmak için bekle veya reklam izle!
          </p>

          {/* Regeneration Timer */}
          {isRegenerating && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 bg-muted/50 px-4 py-2 rounded-lg">
              <Clock className="w-4 h-4" />
              <span>Sonraki can: {timeUntilNextHeart}</span>
            </div>
          )}

          {/* Ad watching state */}
          {isWatchingAd && (
            <div className="w-full mb-6">
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-medium">Reklam izleniyor...</span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-100"
                    style={{ width: `${adProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 w-full">
            <Button
              size="lg"
              className="w-full gap-2"
              onClick={handleWatchAd}
              disabled={isWatchingAd}
            >
              <Play className="w-5 h-5" />
              Reklam İzle (+1 ❤️)
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={onExit}
              disabled={isWatchingAd}
            >
              Daha Sonra Dene
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
