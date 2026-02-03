import { Unit } from '@/hooks/useSubjects';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Lock, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UnitCardProps {
  unit: Unit;
  index: number;
  isCompleted?: boolean;
  isLocked?: boolean;
  onClick: () => void;
}

export function UnitCard({ unit, index, isCompleted, isLocked, onClick }: UnitCardProps) {
  return (
    <Card 
      className={cn(
        "transition-all duration-300 border-2",
        isCompleted && "border-success bg-success/5",
        isLocked && "opacity-50 cursor-not-allowed",
        !isCompleted && !isLocked && "border-border hover:border-primary hover:shadow-md cursor-pointer"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold",
            isCompleted ? "bg-success text-success-foreground" : "bg-secondary text-secondary-foreground"
          )}>
            {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : index + 1}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground">{unit.name}</h4>
            {unit.description && (
              <p className="text-sm text-muted-foreground">{unit.description}</p>
            )}
          </div>
          <Button 
            onClick={onClick}
            disabled={isLocked}
            size="sm"
            variant={isCompleted ? "outline" : "default"}
          >
            {isLocked ? <Lock className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
