import { useState, useEffect, useRef } from 'react';
import { useProfile } from '@/hooks/useLeaderboard';
import { useStudyPlan, calculateDaysRemaining } from '@/hooks/useStudyPlan';
import { useSubscription } from '@/hooks/useSubscription';
import { useDailyTasks, useUserTaskProgress } from '@/hooks/useDailyTasks';
import { useRealtimeTasks } from '@/hooks/useRealtimeTasks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PlusUpgradeDialog } from './PlusUpgradeDialog';
import { PaywallDialog } from './PaywallDialog';
import { TasksDialog } from '@/components/TasksDialog';
import { Trophy, Zap, Lock, Calendar, Target, ChevronRight, Crown, Heart, Bot, Award, CheckCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

interface RightPanelProps {
  onNavigateToLeaderboard: () => void;
}

export function RightPanel({ onNavigateToLeaderboard }: RightPanelProps) {
  const { data: profile } = useProfile();
  const { data: studyPlan } = useStudyPlan();
  const { data: subscription } = useSubscription();
  const { data: tasks } = useDailyTasks();
  const { data: taskProgress } = useUserTaskProgress();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showAllTasks, setShowAllTasks] = useState(false);

  // Track completed tasks to avoid duplicate celebrations
  const celebratedTasksRef = useRef(new Set<string>());

  // Enable realtime updates for tasks
  useRealtimeTasks();

  const isPremium = subscription?.plan_type !== 'free';
  const daysRemaining = studyPlan ? calculateDaysRemaining(studyPlan.exam_date) : 0;

  // Get top 3 tasks to display
  const topTasks = tasks?.slice(0, 3) || [];

  // Helper to get task progress
  const getTaskProgress = (taskId: string) => {
    const progress = taskProgress?.find(p => p.task_id === taskId);
    return {
      current: progress?.progress || 0,
      completed: progress?.completed || false
    };
  };

  // Confetti animation when task is completed
  useEffect(() => {
    if (!taskProgress || !tasks) return;

    taskProgress.forEach(progress => {
      const task = tasks.find(t => t.id === progress.task_id);

      // Check if task is completed and hasn't been celebrated yet
      if (progress.completed && task && !celebratedTasksRef.current.has(progress.id)) {
        celebratedTasksRef.current.add(progress.id);

        // Trigger confetti animation
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']
        });

        // Show success toast
        toast.success(
          `🎉 "${task.title}" tamamlandı! +${task.xp_reward} XP`,
          {
            duration: 4000,
            position: 'top-center'
          }
        );
      }
    });
  }, [taskProgress, tasks]);

  return (
    <>
      <div className="w-80 p-4 space-y-4 hidden lg:block">
        {/* Plus Upgrade Card (for free users) */}
        {!isPremium && (
          <Card className="border-warning/50 bg-gradient-to-br from-warning/10 to-warning/5 overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Crown className="w-6 h-6 text-warning" />
                  <span className="font-bold text-warning">Plus Üyelik</span>
                </div>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-500 text-xs">
                  BETA
                </Badge>
              </div>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-destructive" />
                  <span>Sınırsız kalp</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary" />
                  <span>AI Koç tam erişim</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-warning" />
                  <span>Özel rozetler</span>
                </div>
              </div>
              <Button
                className="w-full bg-warning text-warning-foreground hover:bg-warning/90"
                onClick={() => setShowPaywall(true)}
              >
                <Crown className="w-4 h-4 mr-2" />
                Plus'a Katıl
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Premium User Card */}
        {isPremium && (
          <Card className="border-warning bg-gradient-to-br from-yellow-400/10 via-orange-500/10 to-warning/5 overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-warning" />
                  <span className="font-bold text-warning">Premium Aktif</span>
                </div>
                <Badge className="bg-warning text-black font-bold text-xs">
                  {subscription?.plan_type === 'premium' ? 'PREMIUM' : 'PLUS'}
                </Badge>
              </div>
              <div className="space-y-2 text-sm mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-semibold">
                    {subscription?.plan_type === 'premium' ? 'Yıllık' : 'Aylık'}
                  </span>
                </div>
                {subscription?.expires_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Yenilenme</span>
                    <span className="font-semibold text-xs">
                      {new Date(subscription.expires_at).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  Tüm premium özellikler aktif
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leaderboard Preview */}
        <Card className="border-warning/30 bg-gradient-to-br from-warning/5 to-warning/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-warning" />
                Puan Tabloları
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 text-sm mb-3">
              <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-warning" />
              </div>
              <p className="text-foreground font-medium">Arkadaşlarınla yarış ve zirvede ol! 🏆</p>
            </div>
            <Button
              className="w-full bg-warning hover:bg-warning/90 text-warning-foreground"
              onClick={onNavigateToLeaderboard}
            >
              Tabloya Git
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        {/* Daily Tasks */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Günlük Görevler</CardTitle>
              <Button
                variant="link"
                className="text-primary p-0 h-auto text-sm"
                onClick={() => setShowAllTasks(true)}
              >
                TÜMÜNÜ GÖSTER
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {topTasks.length > 0 ? (
              topTasks.map((task) => {
                const { current, completed } = getTaskProgress(task.id);
                const progressPercent = Math.min(100, (current / task.target_count) * 100);

                return (
                  <div key={task.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      {completed ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : (
                        <span className="text-lg">{task.icon}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm truncate ${completed ? 'text-success' : ''}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={progressPercent} className="flex-1 h-2" />
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {current}/{task.target_count}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4">
                <Target className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Henüz görev yok</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* LGS Countdown */}
        {studyPlan && (
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{daysRemaining}</p>
                  <p className="text-sm text-muted-foreground">gün kaldı</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                LGS: {new Date(studyPlan.exam_date).toLocaleDateString('tr-TR', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Study Tips */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="font-medium text-sm">Günlük İpucu</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Her gün düzenli çalışmak, son dakika stresinden kurtarır. Küçük adımlar büyük başarılar getirir! 💪
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <PlusUpgradeDialog open={showUpgrade} onClose={() => setShowUpgrade(false)} />
      <PaywallDialog open={showPaywall} onClose={() => setShowPaywall(false)} />
      <TasksDialog open={showAllTasks} onClose={() => setShowAllTasks(false)} />
    </>
  );
}
