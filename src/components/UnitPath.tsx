import { Unit } from '@/hooks/useSubjects';
import { StageProgress, Difficulty, getStageStatus, getNextStage, isUnitComplete } from '@/hooks/useStageProgress';
import { StageNode } from './StageNode';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Trophy, BookOpen, Microscope, ScrollText } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface UnitPathProps {
  unit: Unit;
  unitIndex: number;
  progress: StageProgress | null;
  previousUnitComplete: boolean;
  onSelectStage: (unitId: string, unitName: string, difficulty: Difficulty) => void;
  onStartLesson?: (unitId: string, unitName: string) => void;
  onStartExperiment?: (unitId: string, unitName: string) => void;
  onStartInteractive?: (unitId: string, unitName: string) => void;
  isScienceSubject?: boolean;
  isHistorySubject?: boolean;
  isPremium?: boolean;
}

const stages: Difficulty[] = ['easy', 'medium', 'hard', 'exam', 'unit-final'];

export function UnitPath({
  unit,
  unitIndex,
  progress,
  previousUnitComplete,
  onSelectStage,
  onStartLesson,
  onStartExperiment,
  onStartInteractive,
  isScienceSubject = false,
  isHistorySubject = false,
  isPremium = false
}: UnitPathProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const unitComplete = isUnitComplete(progress);
  const nextStage = getNextStage(progress);
  // Plus users: all topics unlocked
  const isLocked = !isPremium && unitIndex > 0 && !previousUnitComplete;

  // Pattern for node positions: center, right, center, left
  const getPosition = (index: number): 'left' | 'center' | 'right' => {
    const pattern: ('left' | 'center' | 'right')[] = ['center', 'right', 'center', 'left'];
    return pattern[index % 4];
  };

  return (
    <div className="relative">
      {/* Unit Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center justify-between p-3 rounded-xl mb-2 transition-all",
          unitComplete 
            ? "bg-warning/10 border border-warning/30" 
            : isLocked 
              ? "bg-muted/50 border border-muted" 
              : "bg-card border border-border hover:bg-accent/10"
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
            unitComplete 
              ? "bg-warning text-warning-foreground" 
              : isLocked 
                ? "bg-muted text-muted-foreground" 
                : "bg-primary text-primary-foreground"
          )}>
            {unitComplete ? <Trophy className="w-4 h-4" /> : unitIndex + 1}
          </div>
          <div className="text-left">
            <h3 className={cn(
              "font-semibold text-sm",
              isLocked ? "text-muted-foreground" : "text-foreground"
            )}>
              {unit.name}
            </h3>
            {!unitComplete && !isLocked && nextStage && (
              <p className="text-xs text-muted-foreground">
                Sonraki: {nextStage === 'easy' ? 'Kolay' : nextStage === 'medium' ? 'Orta' : nextStage === 'hard' ? 'Zor' : nextStage === 'exam' ? 'Deneme' : 'Bölüm Testi'}
              </p>
            )}
            {unitComplete && (
              <p className="text-xs text-warning">Tamamlandı! 🎉</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Mini progress indicator */}
          <div className="flex gap-1">
            {stages.map((stage) => {
              const status = getStageStatus(progress, stage);
              return (
                <div
                  key={stage}
                  className={cn(
                    "w-2 h-2 rounded-full",
                    status.isMastered ? "bg-warning" :
                    status.isComplete ? (
                      stage === 'easy' ? "bg-success" :
                      stage === 'medium' ? "bg-warning" :
                      stage === 'hard' ? "bg-destructive" :
                      "bg-info"
                    ) :
                    "bg-muted"
                  )}
                />
              );
            })}
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Stages */}
      {isExpanded && (
        <div className="relative py-4 px-4">
          {/* Topic Lesson Button - at the top */}
          {!isLocked && onStartLesson && (
            <div className="flex flex-col items-center gap-3 mb-6">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onStartLesson(unit.id, unit.name);
                }}
                variant="outline"
                className="gap-2 bg-info/10 border-info/30 text-info hover:bg-info/20 hover:border-info/50"
              >
                <BookOpen className="w-4 h-4" />
                Konu Anlatımı
              </Button>

              {/* Experiment Button - only for science subjects */}
              {isScienceSubject && onStartExperiment && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartExperiment(unit.id, unit.name);
                  }}
                  variant="outline"
                  className="gap-2 bg-success/10 border-success/30 text-success hover:bg-success/20 hover:border-success/50"
                >
                  <Microscope className="w-4 h-4" />
                  Deneyi Yap ve Öğren 🔬
                </Button>
              )}

              {/* Interactive Narration Button - only for history subjects */}
              {isHistorySubject && onStartInteractive && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartInteractive(unit.id, unit.name);
                  }}
                  variant="outline"
                  className="gap-2 bg-red-900/10 border-red-800/30 text-red-700 dark:text-red-400 hover:bg-red-900/20 hover:border-red-800/50"
                >
                  <ScrollText className="w-4 h-4" />
                  İnteraktif Anlatım
                </Button>
              )}
            </div>
          )}

          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />

          <div className="relative flex flex-col items-center gap-8">
            {stages.map((difficulty, index) => {
              const status = getStageStatus(progress, difficulty);
              const position = getPosition(index);
              const isCurrent = !isLocked && nextStage === difficulty;

              return (
                <div key={difficulty} className="relative z-10">
                  {/* Curved connecting path */}
                  {index > 0 && (
                    <svg 
                      className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-8 overflow-visible"
                      style={{ zIndex: -1 }}
                    >
                      <path
                        d={position === 'left' 
                          ? "M 64 32 Q 64 16 32 8" 
                          : position === 'right'
                          ? "M 64 32 Q 64 16 96 8"
                          : "M 64 32 L 64 8"}
                        stroke="hsl(var(--border))"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray={isLocked || !status.isUnlocked ? "6 3" : "none"}
                      />
                    </svg>
                  )}

                  <StageNode
                    difficulty={difficulty}
                    completions={status.completions}
                    isUnlocked={!isLocked && status.isUnlocked}
                    isMastered={status.isMastered}
                    isCurrent={isCurrent}
                    onClick={() => !isLocked && status.isUnlocked && onSelectStage(unit.id, unit.name, difficulty)}
                    position={position}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
