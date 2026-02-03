import { Subject } from '@/hooks/useSubjects';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SubjectCardProps {
  subject: Subject;
  onClick: () => void;
  progress?: number;
}

const colorMap: Record<string, string> = {
  primary: 'bg-primary hover:bg-primary/90',
  accent: 'bg-accent hover:bg-accent/90',
  warning: 'bg-warning hover:bg-warning/90',
  info: 'bg-info hover:bg-info/90',
  destructive: 'bg-destructive hover:bg-destructive/90',
  secondary: 'bg-secondary hover:bg-secondary/90'
};

export function SubjectCard({ subject, onClick, progress = 0 }: SubjectCardProps) {
  const bgClass = colorMap[subject.color || 'primary'] || colorMap.primary;

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-0 overflow-hidden",
        bgClass
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="text-4xl">{subject.icon}</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-primary-foreground">{subject.name}</h3>
            <p className="text-sm text-primary-foreground/80 mt-1">{subject.description}</p>
          </div>
        </div>
        {progress > 0 && (
          <div className="mt-4">
            <div className="h-2 bg-background/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-background rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-primary-foreground/80 mt-1">{progress}% tamamlandı</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
