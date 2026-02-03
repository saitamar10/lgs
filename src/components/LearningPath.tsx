import { Unit } from '@/hooks/useSubjects';
import { Star, Lock, CheckCircle2, Gift, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LearningPathProps {
  units: Unit[];
  completedUnits: string[];
  currentUnitIndex: number;
  onSelectUnit: (unitId: string, unitName: string) => void;
}

export function LearningPath({ units, completedUnits, currentUnitIndex, onSelectUnit }: LearningPathProps) {
  const getNodePosition = (index: number): 'left' | 'center' | 'right' => {
    const pattern = ['center', 'right', 'center', 'left'];
    return pattern[index % 4] as 'left' | 'center' | 'right';
  };

  const getNodeOffset = (position: 'left' | 'center' | 'right'): string => {
    switch (position) {
      case 'left': return '-translate-x-16';
      case 'right': return 'translate-x-16';
      default: return '';
    }
  };

  return (
    <div className="relative py-8 px-4">
      {/* Path Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-border -translate-x-1/2" />

      {/* Units */}
      <div className="relative flex flex-col items-center gap-4">
        {units.map((unit, index) => {
          const isCompleted = completedUnits.includes(unit.id);
          const isCurrent = index === currentUnitIndex;
          const isLocked = index > currentUnitIndex && !isCompleted;
          const position = getNodePosition(index);
          const offset = getNodeOffset(position);

          // Special nodes every 5 units
          const isChestNode = (index + 1) % 5 === 0 && index !== units.length - 1;
          const isFinalNode = index === units.length - 1;

          return (
            <div key={unit.id} className="relative z-10">
              {/* Connecting curved line */}
              {index > 0 && (
                <svg 
                  className="absolute -top-4 left-1/2 -translate-x-1/2 w-40 h-8 overflow-visible"
                  style={{ zIndex: -1 }}
                >
                  <path
                    d={position === 'left' 
                      ? "M 80 32 Q 80 16 48 8" 
                      : position === 'right'
                      ? "M 80 32 Q 80 16 112 8"
                      : "M 80 32 L 80 8"}
                    stroke="hsl(var(--border))"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={isLocked ? "8 4" : "none"}
                  />
                </svg>
              )}

              {/* Node */}
              <button
                onClick={() => !isLocked && onSelectUnit(unit.id, unit.name)}
                disabled={isLocked}
                className={cn(
                  "relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 transform",
                  offset,
                  isCompleted && "bg-success shadow-[0_4px_0_hsl(var(--success)/0.7)] hover:shadow-[0_2px_0_hsl(var(--success)/0.7)] hover:translate-y-0.5",
                  isCurrent && !isCompleted && "bg-primary shadow-[0_6px_0_hsl(var(--primary)/0.7)] hover:shadow-[0_4px_0_hsl(var(--primary)/0.7)] hover:translate-y-0.5 animate-pulse",
                  isLocked && "bg-muted cursor-not-allowed shadow-[0_4px_0_hsl(var(--muted)/0.7)]",
                  !isCompleted && !isCurrent && !isLocked && "bg-secondary shadow-[0_4px_0_hsl(var(--secondary)/0.5)] hover:shadow-[0_2px_0_hsl(var(--secondary)/0.5)] hover:translate-y-0.5",
                  isChestNode && "bg-warning shadow-[0_4px_0_hsl(var(--warning)/0.7)]",
                  isFinalNode && isCompleted && "bg-warning shadow-[0_4px_0_hsl(var(--warning)/0.7)]"
                )}
              >
                {isFinalNode ? (
                  <Crown className="w-8 h-8 text-warning-foreground" />
                ) : isChestNode ? (
                  <Gift className="w-8 h-8 text-warning-foreground" />
                ) : isCompleted ? (
                  <CheckCircle2 className="w-8 h-8 text-success-foreground" />
                ) : isLocked ? (
                  <Lock className="w-6 h-6 text-muted-foreground" />
                ) : (
                  <Star className="w-8 h-8 text-primary-foreground" />
                )}

                {/* Progress ring for current unit */}
                {isCurrent && !isCompleted && (
                  <div className="absolute -inset-1 rounded-full border-4 border-primary/30 animate-ping" />
                )}
              </button>

              {/* Unit Label */}
              <div className={cn(
                "absolute top-20 left-1/2 -translate-x-1/2 text-center whitespace-nowrap",
                offset
              )}>
                {isCurrent && !isCompleted && (
                  <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full mb-1">
                    BAŞLAT
                  </span>
                )}
                <p className={cn(
                  "text-sm font-medium max-w-24 truncate",
                  isLocked ? "text-muted-foreground" : "text-foreground"
                )}>
                  {unit.name}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
