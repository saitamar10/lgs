import { useDailyTasks, useUserTaskProgress } from '@/hooks/useDailyTasks';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Coins, Zap, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TasksDialogProps {
  open: boolean;
  onClose: () => void;
}

export function TasksDialog({ open, onClose }: TasksDialogProps) {
  const { data: tasks, isLoading: tasksLoading } = useDailyTasks();
  const { data: progress, isLoading: progressLoading } = useUserTaskProgress();

  const getTaskProgress = (taskId: string) => {
    return progress?.find(p => p.task_id === taskId);
  };

  const isLoading = tasksLoading || progressLoading;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🎯 Günlük Görevler
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : tasks?.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Bugün için görev yok.
            </p>
          ) : (
            tasks?.map((task) => {
              const taskProgress = getTaskProgress(task.id);
              const currentProgress = taskProgress?.progress || 0;
              const isCompleted = taskProgress?.completed || false;
              const progressPercent = Math.min(100, (currentProgress / task.target_count) * 100);

              return (
                <Card 
                  key={task.id} 
                  className={cn(
                    "overflow-hidden transition-all",
                    isCompleted && "bg-success/10 border-success"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
                        isCompleted ? "bg-success/20" : "bg-secondary"
                      )}>
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-success" />
                        ) : (
                          task.icon
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={cn(
                            "font-semibold",
                            isCompleted && "text-success"
                          )}>
                            {task.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="flex items-center gap-0.5 text-primary">
                              <Zap className="w-3 h-3" />
                              {task.xp_reward}
                            </span>
                            <span className="flex items-center gap-0.5 text-warning">
                              <Coins className="w-3 h-3" />
                              {task.coin_reward}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {task.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Progress value={progressPercent} className="flex-1 h-2" />
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {currentProgress}/{task.target_count}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <div className="text-center text-xs text-muted-foreground mt-4">
          Görevler her gün gece yarısı sıfırlanır
        </div>
      </DialogContent>
    </Dialog>
  );
}
