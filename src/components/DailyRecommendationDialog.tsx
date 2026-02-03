import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDailyRecommendation } from '@/hooks/useDailyRecommendation';
import { BookOpen, Zap, Target, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DailyRecommendationDialogProps {
  open: boolean;
  onClose: () => void;
  onStartSubject: (subjectId: string) => void;
}

const colorMap: Record<string, string> = {
  primary: 'bg-primary/20 text-primary',
  accent: 'bg-accent/20 text-accent-foreground',
  warning: 'bg-warning/20 text-warning',
  info: 'bg-info/20 text-info',
  destructive: 'bg-destructive/20 text-destructive',
  secondary: 'bg-secondary text-secondary-foreground'
};

export function DailyRecommendationDialog({ 
  open, 
  onClose, 
  onStartSubject 
}: DailyRecommendationDialogProps) {
  const recommendation = useDailyRecommendation();

  const handleStart = () => {
    if (recommendation.subject) {
      onStartSubject(recommendation.subject.id);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Bugünkü Önerimiz
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {recommendation.subject ? (
            <div className="text-center">
              {/* Subject Icon */}
              <div className={cn(
                "w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl",
                colorMap[recommendation.subject.color || 'primary']
              )}>
                {recommendation.subject.icon}
              </div>

              {/* Subject Name */}
              <h3 className="text-xl font-bold mb-2">
                {recommendation.subject.name}
              </h3>

              {/* Motivation Message */}
              <p className="text-muted-foreground text-sm mb-6">
                {recommendation.message}
              </p>

              {/* Benefits */}
              <div className="flex justify-center gap-6 mb-6 text-sm">
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-warning" />
                  <span>+50 XP</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span>5 Soru</span>
                </div>
              </div>

              {/* Start Button */}
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleStart}
              >
                Hemen Başla
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>

              {/* Skip */}
              <Button 
                variant="ghost" 
                className="w-full mt-2 text-muted-foreground"
                onClick={onClose}
              >
                Şimdilik Geç
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-pulse">
                <div className="w-16 h-16 bg-secondary rounded-2xl mx-auto mb-4" />
                <div className="h-4 bg-secondary rounded w-32 mx-auto" />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
