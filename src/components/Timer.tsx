import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimerProps {
  totalSeconds: number;
  onTimeUp?: () => void;
  className?: string;
}

export function Timer({ totalSeconds, onTimeUp, className }: TimerProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds);

  useEffect(() => {
    if (secondsRemaining <= 0) {
      onTimeUp?.();
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsRemaining, onTimeUp]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const progress = ((totalSeconds - secondsRemaining) / totalSeconds) * 100;

  // Calculate bonus XP based on time remaining
  const getBonusXP = () => {
    const timePercent = secondsRemaining / totalSeconds;
    return Math.floor(timePercent * 50); // Up to 50 bonus XP
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Clock className={cn(
        "w-5 h-5",
        secondsRemaining < 10 ? "text-destructive animate-pulse" : "text-primary"
      )} />
      <div className="flex flex-col">
        <span className={cn(
          "font-bold text-lg tabular-nums",
          secondsRemaining < 10 && "text-destructive"
        )}>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </span>
        {secondsRemaining > 0 && (
          <span className="text-xs text-muted-foreground">
            +{getBonusXP()} bonus XP
          </span>
        )}
      </div>
    </div>
  );
}

export function calculateTimeBonus(totalSeconds: number, timeRemaining: number, baseXP: number): number {
  const timePercent = timeRemaining / totalSeconds;
  const bonusXP = Math.floor(timePercent * 50);
  return baseXP + bonusXP;
}
