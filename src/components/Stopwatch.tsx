import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StopwatchProps {
  onTimeChange?: (seconds: number) => void;
  className?: string;
  isRunning?: boolean;
}

export function Stopwatch({ onTimeChange, className, isRunning = true }: StopwatchProps) {
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsElapsed(prev => {
        const newValue = prev + 1;
        onTimeChange?.(newValue);
        return newValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onTimeChange]);

  const minutes = Math.floor(secondsElapsed / 60);
  const seconds = secondsElapsed % 60;

  // Calculate bonus XP based on speed (faster = more bonus)
  const getBonusXP = () => {
    if (secondsElapsed < 30) return 50; // Ultra fast: +50 XP
    if (secondsElapsed < 45) return 35; // Fast: +35 XP
    if (secondsElapsed < 60) return 20; // Normal: +20 XP
    return 10; // Slow but OK: +10 XP
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Clock className={cn(
        "w-5 h-5 text-primary",
        isRunning && "animate-pulse"
      )} />
      <div className="flex flex-col">
        <span className="font-bold text-lg tabular-nums text-primary">
          {minutes}:{seconds.toString().padStart(2, '0')}
        </span>
        {secondsElapsed < 60 && (
          <span className="text-xs text-success">
            +{getBonusXP()} bonus XP
          </span>
        )}
      </div>
    </div>
  );
}

export function calculateSpeedBonus(timeElapsed: number, baseXP: number): number {
  let bonusXP = 0;
  if (timeElapsed < 30) bonusXP = 50;
  else if (timeElapsed < 45) bonusXP = 35;
  else if (timeElapsed < 60) bonusXP = 20;
  else bonusXP = 10;

  return baseXP + bonusXP;
}
