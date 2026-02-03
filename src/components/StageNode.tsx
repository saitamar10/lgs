import { Lock, Star, CheckCircle2, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Difficulty } from '@/hooks/useStageProgress';

interface StageNodeProps {
  difficulty: Difficulty;
  completions: number;
  isUnlocked: boolean;
  isMastered: boolean;
  isCurrent: boolean;
  onClick: () => void;
  position: 'left' | 'center' | 'right';
}

const REQUIRED_COMPLETIONS = 3;

export function StageNode({ 
  difficulty, 
  completions, 
  isUnlocked, 
  isMastered, 
  isCurrent,
  onClick, 
  position 
}: StageNodeProps) {
  const offset = position === 'left' ? '-translate-x-12' : position === 'right' ? 'translate-x-12' : '';

  // Get colors based on difficulty and mastery state
  const getNodeStyles = () => {
    if (!isUnlocked) {
      return 'bg-muted shadow-[0_4px_0_hsl(var(--muted-foreground)/0.3)]';
    }

    if (isMastered) {
      // Gold/yellow for mastered
      return 'bg-warning shadow-[0_4px_0_hsl(var(--warning)/0.7)] hover:shadow-[0_2px_0_hsl(var(--warning)/0.7)] hover:translate-y-0.5';
    }

    if (completions > 0) {
      // Partial completion - use difficulty color with partial opacity
      switch (difficulty) {
        case 'easy':
          return 'bg-success shadow-[0_4px_0_hsl(var(--success)/0.7)] hover:shadow-[0_2px_0_hsl(var(--success)/0.7)] hover:translate-y-0.5';
        case 'medium':
          return 'bg-warning shadow-[0_4px_0_hsl(var(--warning)/0.7)] hover:shadow-[0_2px_0_hsl(var(--warning)/0.7)] hover:translate-y-0.5';
        case 'hard':
          return 'bg-destructive shadow-[0_4px_0_hsl(var(--destructive)/0.7)] hover:shadow-[0_2px_0_hsl(var(--destructive)/0.7)] hover:translate-y-0.5';
        case 'exam':
          return 'bg-info shadow-[0_4px_0_hsl(var(--info)/0.7)] hover:shadow-[0_2px_0_hsl(var(--info)/0.7)] hover:translate-y-0.5';
      }
    }

    // Not started but unlocked - outline style
    switch (difficulty) {
      case 'easy':
        return 'bg-success/20 border-2 border-success shadow-[0_4px_0_hsl(var(--success)/0.3)] hover:bg-success/40 hover:shadow-[0_2px_0_hsl(var(--success)/0.3)] hover:translate-y-0.5';
      case 'medium':
        return 'bg-warning/20 border-2 border-warning shadow-[0_4px_0_hsl(var(--warning)/0.3)] hover:bg-warning/40 hover:shadow-[0_2px_0_hsl(var(--warning)/0.3)] hover:translate-y-0.5';
      case 'hard':
        return 'bg-destructive/20 border-2 border-destructive shadow-[0_4px_0_hsl(var(--destructive)/0.3)] hover:bg-destructive/40 hover:shadow-[0_2px_0_hsl(var(--destructive)/0.3)] hover:translate-y-0.5';
      case 'exam':
        return 'bg-info/20 border-2 border-info shadow-[0_4px_0_hsl(var(--info)/0.3)] hover:bg-info/40 hover:shadow-[0_2px_0_hsl(var(--info)/0.3)] hover:translate-y-0.5';
    }
  };

  const getIcon = () => {
    if (!isUnlocked) {
      return <Lock className="w-5 h-5 text-muted-foreground" />;
    }

    if (difficulty === 'exam') {
      return <Crown className={cn(
        "w-6 h-6",
        isMastered ? "text-warning-foreground" : completions > 0 ? "text-info-foreground" : "text-info"
      )} />;
    }

    if (isMastered) {
      return <CheckCircle2 className="w-6 h-6 text-warning-foreground" />;
    }

    return <Star className={cn(
      "w-6 h-6",
      completions > 0 ? (
        difficulty === 'easy' ? "text-success-foreground" :
        difficulty === 'medium' ? "text-warning-foreground" :
        "text-destructive-foreground"
      ) : (
        difficulty === 'easy' ? "text-success" :
        difficulty === 'medium' ? "text-warning" :
        "text-destructive"
      )
    )} />;
  };

  const getDifficultyLabel = () => {
    switch (difficulty) {
      case 'easy': return 'Kolay';
      case 'medium': return 'Orta';
      case 'hard': return 'Zor';
      case 'exam': return 'Deneme';
    }
  };

  return (
    <div className={cn("relative flex flex-col items-center", offset)}>
      <button
        onClick={onClick}
        disabled={!isUnlocked}
        className={cn(
          "relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 transform",
          getNodeStyles(),
          !isUnlocked && "cursor-not-allowed"
        )}
      >
        {getIcon()}

        {/* Progress ring for current stage */}
        {isCurrent && isUnlocked && !isMastered && (
          <div className="absolute -inset-1 rounded-full border-4 border-primary/30 animate-ping" />
        )}

        {/* Completion dots */}
        {difficulty !== 'exam' && isUnlocked && (
          <div className="absolute -bottom-1 flex gap-0.5">
            {[...Array(REQUIRED_COMPLETIONS)].map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "w-2 h-2 rounded-full border border-background",
                  i < completions ? "bg-warning" : "bg-muted"
                )} 
              />
            ))}
          </div>
        )}
      </button>

      {/* Label */}
      <span className={cn(
        "mt-3 text-xs font-medium",
        !isUnlocked ? "text-muted-foreground" : "text-foreground"
      )}>
        {getDifficultyLabel()}
      </span>

      {/* Start button for current */}
      {isCurrent && isUnlocked && !isMastered && (
        <span className="mt-1 px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full">
          BAŞLAT
        </span>
      )}
    </div>
  );
}
