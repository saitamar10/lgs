import { Subject } from '@/hooks/useSubjects';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubjectHeaderProps {
  subject: Subject;
  unitName?: string;
  unitIndex?: number;
  totalUnits?: number;
  onBack?: () => void;
}

const colorMap: Record<string, string> = {
  primary: 'bg-primary',
  accent: 'bg-accent',
  warning: 'bg-warning',
  info: 'bg-info',
  destructive: 'bg-destructive',
  secondary: 'bg-secondary'
};

export function SubjectHeader({ subject, unitName, unitIndex, totalUnits, onBack }: SubjectHeaderProps) {
  const bgClass = colorMap[subject.color || 'primary'];

  return (
    <div className={cn("rounded-2xl p-4 text-primary-foreground", bgClass)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div>
            {unitIndex !== undefined && totalUnits !== undefined && (
              <p className="text-sm opacity-80 mb-0.5">
                ← {unitIndex + 1}. KISIM, {totalUnits} ÜNİTE
              </p>
            )}
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span>{subject.icon}</span>
              {unitName || subject.name}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
