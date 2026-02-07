import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FriendChallenge, getChallengeWinner, formatChallengeTime } from '@/hooks/useFriendChallenges';
import { Trophy, Zap, Timer, Target, Flame, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface ChallengeResultsDialogProps {
  open: boolean;
  onClose: () => void;
  challenge: FriendChallenge;
  currentUserId: string;
  onRematch?: () => void;
  onPlayAgain?: () => void;
}

export function ChallengeResultsDialog({
  open,
  onClose,
  challenge,
  currentUserId,
  onRematch,
  onPlayAgain
}: ChallengeResultsDialogProps) {
  const winner = getChallengeWinner(challenge);
  const isChallenger = currentUserId === challenge.challenger_id;
  const didWin = (isChallenger && winner === 'challenger') || (!isChallenger && winner === 'challenged');
  const isTie = winner === 'tie';

  const myScore = isChallenger ? challenge.challenger_score : challenge.challenged_score;
  const myTotal = isChallenger ? challenge.challenger_total : challenge.challenged_total;
  const myTime = isChallenger ? challenge.challenger_time_seconds : challenge.challenged_time_seconds;

  const opponentScore = isChallenger ? challenge.challenged_score : challenge.challenger_score;
  const opponentTotal = isChallenger ? challenge.challenged_total : challenge.challenged_total;
  const opponentTime = isChallenger ? challenge.challenged_time_seconds : challenge.challenger_time_seconds;

  const opponentName = isChallenger ? challenge.challenged_name : challenge.challenger_name;

  // Trigger confetti when dialog opens and user won
  useEffect(() => {
    if (open && didWin && !isTie) {
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [open, didWin, isTie]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">

        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-center">
            {didWin ? (
              <>
                <Trophy className="w-6 h-6 text-yellow-500" />
                <span className="text-2xl">Kazandın!</span>
              </>
            ) : isTie ? (
              <>
                <Target className="w-6 h-6 text-blue-500" />
                <span className="text-2xl">Berabere!</span>
              </>
            ) : (
              <>
                <Target className="w-6 h-6 text-muted-foreground" />
                <span className="text-2xl">Kaybettin</span>
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Challenge Info */}
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <p className="text-sm text-muted-foreground">Meydan Okuma</p>
            <p className="font-semibold">{challenge.subject_name} - {challenge.unit_name}</p>
            <p className="text-xs text-muted-foreground mt-1 capitalize">{challenge.difficulty}</p>
          </div>

          {/* Scores Comparison */}
          <div className="grid grid-cols-2 gap-4">
            {/* My Score */}
            <div className={cn(
              "rounded-lg p-4 border-2 text-center",
              didWin && !isTie ? "border-green-500 bg-green-500/10" :
              isTie ? "border-blue-500 bg-blue-500/10" :
              "border-red-500 bg-red-500/10"
            )}>
              <div className="flex items-center justify-center gap-1 mb-2">
                {didWin && !isTie && <Trophy className="w-4 h-4 text-yellow-500" />}
                <p className="text-sm font-medium">Sen</p>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-3xl font-bold">{myScore}/{myTotal}</p>
                  <p className="text-xs text-muted-foreground">Doğru Sayısı</p>
                </div>
              </div>
            </div>

            {/* Opponent Score */}
            <div className={cn(
              "rounded-lg p-4 border-2 text-center",
              !didWin && !isTie ? "border-green-500 bg-green-500/10" :
              isTie ? "border-blue-500 bg-blue-500/10" :
              "border-red-500 bg-red-500/10"
            )}>
              <div className="flex items-center justify-center gap-1 mb-2">
                {!didWin && !isTie && <Trophy className="w-4 h-4 text-yellow-500" />}
                <p className="text-sm font-medium">{opponentName}</p>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-3xl font-bold">{opponentScore}/{opponentTotal}</p>
                  <p className="text-xs text-muted-foreground">Doğru Sayısı</p>
                </div>
              </div>
            </div>
          </div>

          {/* Result Message */}
          <div className={cn(
            "rounded-lg p-4 text-center",
            didWin && !isTie ? "bg-green-500/10 text-green-700 dark:text-green-400" :
            isTie ? "bg-blue-500/10 text-blue-700 dark:text-blue-400" :
            "bg-red-500/10 text-red-700 dark:text-red-400"
          )}>
            <p className="font-medium">
              {didWin && !isTie && "Harika bir performans! Meydan okumayı kazandın! 🎉"}
              {isTie && "İkiniz de aynı skoru aldınız! Rövanş zamanı! 🤝"}
              {!didWin && !isTie && "Bu sefer olmadı, tekrar dene! 💪"}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-secondary rounded-lg p-3 text-center">
              <Zap className="w-4 h-4 mx-auto mb-1 text-primary" />
              <p className="font-medium">{myScore || 0} / {myTotal || 5}</p>
              <p className="text-xs text-muted-foreground">Doğru Cevap</p>
            </div>
            <div className="bg-secondary rounded-lg p-3 text-center">
              <Timer className="w-4 h-4 mx-auto mb-1 text-primary" />
              <p className="font-medium">{formatChallengeTime(myTime)}</p>
              <p className="text-xs text-muted-foreground">Süre</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-2">
            {onRematch && (
              <Button
                onClick={() => {
                  onRematch();
                  onClose();
                }}
                className="w-full"
                variant="default"
              >
                <Flame className="w-4 h-4 mr-2" />
                Rövanş İste
              </Button>
            )}
            {onPlayAgain && (
              <Button
                onClick={() => {
                  onPlayAgain();
                  onClose();
                }}
                variant="outline"
                className="w-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Tekrar Oyna
              </Button>
            )}
            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full"
            >
              Kapat
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
