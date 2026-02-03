import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Calendar, Target, TrendingDown, BookOpen, Clock, Zap, X } from 'lucide-react';
import { useStudyPlan, calculateDaysRemaining } from '@/hooks/useStudyPlan';
import { useDailyRecommendation } from '@/hooks/useDailyRecommendation';
import { useWeakTopics } from '@/hooks/useWeakTopics';
import { useSubjects } from '@/hooks/useSubjects';
import { useAllStageProgress, isUnitComplete } from '@/hooks/useStageProgress';
import { useRealtimeTasks } from '@/hooks/useRealtimeTasks';
import { cn } from '@/lib/utils';

interface MobileTodaysPlanSheetProps {
  open: boolean;
  onClose: () => void;
  onStartUnit: (unitId: string, unitName: string, subjectId: string) => void;
}

const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const daySubjectMap: Record<number, string> = {
  0: 'Matematik',
  1: 'Türkçe',
  2: 'Matematik',
  3: 'Fen Bilimleri',
  4: 'T.C. İnkılap Tarihi',
  5: 'İngilizce',
  6: 'Din Kültürü'
};

export function MobileTodaysPlanSheet({ open, onClose, onStartUnit }: MobileTodaysPlanSheetProps) {
  const { data: studyPlan } = useStudyPlan();
  const { subject: recommendedSubject, message: dailyMessage } = useDailyRecommendation();
  const { data: weakTopics } = useWeakTopics();
  const { data: subjects } = useSubjects();
  const { data: allProgress } = useAllStageProgress();

  // Enable realtime updates
  useRealtimeTasks();

  // Calculate days remaining to LGS
  const daysRemaining = studyPlan ? calculateDaysRemaining(studyPlan.exam_date) : 0;
  const examDate = studyPlan?.exam_date ? new Date(studyPlan.exam_date) : new Date('2026-06-14');

  // Create progress map
  const progressMap = useMemo(() => {
    const map = new Map();
    allProgress?.forEach(p => map.set(p.unit_id, p));
    return map;
  }, [allProgress]);

  // Calculate incomplete units
  const { incompleteUnits, totalUnits } = useMemo(() => {
    if (!subjects) return { incompleteUnits: 0, totalUnits: 0 };

    let incomplete = 0;
    let total = 0;

    subjects.forEach(() => {
      const unitsPerSubject = 10;
      total += unitsPerSubject;
      const subjectProgress = Array.from(progressMap.values()).filter(p =>
        subjects.find(s => s.id === (p as any).subject_id)
      );
      const completedCount = subjectProgress.filter(p => isUnitComplete(p)).length;
      incomplete += Math.max(0, unitsPerSubject - completedCount);
    });

    return { incompleteUnits: incomplete, totalUnits: total };
  }, [subjects, progressMap]);

  // Calculate weekly targets
  const weeksRemaining = Math.max(1, Math.ceil(daysRemaining / 7));
  const topicsPerWeek = Math.ceil(incompleteUnits / weeksRemaining);
  const testsPerWeek = topicsPerWeek * 2;

  // Generate 7-day plan
  const weeklyPlan = useMemo(() => {
    const today = new Date();
    const plan = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayOfWeek = date.getDay();

      plan.push({
        date,
        dayName: dayNames[dayOfWeek],
        subject: daySubjectMap[dayOfWeek],
        isToday: i === 0
      });
    }

    return plan;
  }, []);

  const topWeakTopics = weakTopics?.slice(0, 3) || [];

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <DrawerTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Bugünkü Programım
            </DrawerTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DrawerHeader>

        <div className="overflow-y-auto p-4 space-y-4">
          {/* LGS Countdown - Compact */}
          <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">LGS'ye</p>
                    <h3 className="text-2xl font-bold text-primary">{daysRemaining} Gün</h3>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">İlerleme</p>
                  <p className="text-xl font-bold">
                    {totalUnits > 0 ? Math.round(((totalUnits - incompleteUnits) / totalUnits) * 100) : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Focus - Large */}
          {recommendedSubject && (
            <Card className="border-success/30 bg-gradient-to-br from-success/10 to-success/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-success" />
                  <h3 className="font-bold">Bugünün Dersi</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{dailyMessage}</p>

                <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{recommendedSubject.emoji}</span>
                    <div>
                      <p className="font-bold">{recommendedSubject.name}</p>
                      <p className="text-xs text-muted-foreground">Önerilen</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      onStartUnit('', recommendedSubject.name, recommendedSubject.id);
                      onClose();
                    }}
                    className="bg-success hover:bg-success/90"
                    size="sm"
                  >
                    Başla
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Weekly Target */}
          <Card className="border-warning/30 bg-gradient-to-br from-warning/10 to-warning/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-warning" />
                <h3 className="font-bold">Bu Hafta</h3>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-3 bg-card rounded-lg border border-border text-center">
                  <p className="text-2xl font-bold text-primary">{topicsPerWeek}</p>
                  <p className="text-xs text-muted-foreground">Konu</p>
                </div>
                <div className="p-3 bg-card rounded-lg border border-border text-center">
                  <p className="text-2xl font-bold text-accent">{testsPerWeek}</p>
                  <p className="text-xs text-muted-foreground">Test</p>
                </div>
              </div>

              <div className="p-2 bg-info/10 border border-info/30 rounded-lg">
                <p className="text-xs text-center">
                  <span className="font-bold">{daysRemaining} gün</span> kaldı
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Weak Topics - Scrollable */}
          {topWeakTopics.length > 0 && (
            <Card className="border-destructive/30 bg-gradient-to-br from-destructive/10 to-destructive/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingDown className="w-5 h-5 text-destructive" />
                  <h3 className="font-bold">Öncelikli Konular</h3>
                </div>

                <div className="space-y-2">
                  {topWeakTopics.map((topic, index) => (
                    <div
                      key={topic.id}
                      className="flex items-center justify-between p-3 bg-card rounded-lg border border-border"
                      onClick={() => {
                        onStartUnit(topic.unit_id, topic.unit_name, topic.subject_id);
                        onClose();
                      }}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Badge variant="outline" className="text-xs shrink-0">
                          #{index + 1}
                        </Badge>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">{topic.unit_name}</p>
                          <p className="text-xs text-muted-foreground truncate">{topic.subject_name}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="shrink-0">
                        Çalış
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 7-Day Plan - Compact */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-accent" />
                <h3 className="font-bold">7 Günlük Plan</h3>
              </div>

              <div className="space-y-2">
                {weeklyPlan.map((day, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-lg border",
                      day.isToday
                        ? "bg-primary/10 border-primary/50"
                        : "bg-card border-border"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex flex-col items-center justify-center text-xs",
                        day.isToday ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                        <span className="font-bold">
                          {day.date.toLocaleDateString('tr-TR', { day: 'numeric' })}
                        </span>
                        <span className="text-[10px]">
                          {day.date.toLocaleDateString('tr-TR', { month: 'short' })}
                        </span>
                      </div>
                      <div>
                        <p className={cn(
                          "text-sm font-semibold",
                          day.isToday && "text-primary"
                        )}>
                          {day.dayName}
                        </p>
                        <p className="text-xs text-muted-foreground">{day.subject}</p>
                      </div>
                    </div>
                    {day.isToday && (
                      <Badge className="bg-success text-xs">Bugün</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
