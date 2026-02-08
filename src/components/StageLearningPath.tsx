import { Unit } from '@/hooks/useSubjects';
import { StageProgress, Difficulty, isUnitComplete } from '@/hooks/useStageProgress';
import { UnitPath } from './UnitPath';
import { ScrollArea } from '@/components/ui/scroll-area';

interface StageLearningPathProps {
  units: Unit[];
  progressMap: Map<string, StageProgress>;
  onSelectStage: (unitId: string, unitName: string, difficulty: Difficulty) => void;
  onStartLesson?: (unitId: string, unitName: string) => void;
  onStartExperiment?: (unitId: string, unitName: string) => void;
  onStartInteractive?: (unitId: string, unitName: string) => void;
  isScienceSubject?: boolean;
  isHistorySubject?: boolean;
  isPremium?: boolean;
}

export function StageLearningPath({ units, progressMap, onSelectStage, onStartLesson, onStartExperiment, onStartInteractive, isScienceSubject = false, isHistorySubject = false, isPremium = false }: StageLearningPathProps) {
  // Check if previous unit is complete for unlocking logic
  const isPreviousUnitComplete = (index: number): boolean => {
    // Plus users have all topics unlocked
    if (isPremium) return true;

    if (index === 0) return true;
    const previousUnit = units[index - 1];
    const previousProgress = progressMap.get(previousUnit.id) || null;
    return isUnitComplete(previousProgress);
  };

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="py-4 px-2 space-y-6">
        {units.map((unit, index) => (
          <UnitPath
            key={unit.id}
            unit={unit}
            unitIndex={index}
            progress={progressMap.get(unit.id) || null}
            previousUnitComplete={isPreviousUnitComplete(index)}
            onSelectStage={onSelectStage}
            onStartLesson={onStartLesson}
            onStartExperiment={onStartExperiment}
            onStartInteractive={onStartInteractive}
            isScienceSubject={isScienceSubject}
            isHistorySubject={isHistorySubject}
            isPremium={isPremium}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
