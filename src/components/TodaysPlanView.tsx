import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Target, TrendingDown, BookOpen, Clock, Zap } from 'lucide-react';
import { useStudyPlan, calculateDaysRemaining } from '@/hooks/useStudyPlan';
import { useDailyRecommendation } from '@/hooks/useDailyRecommendation';
import { useWeakTopics } from '@/hooks/useWeakTopics';
import { useSubjects, useUnits } from '@/hooks/useSubjects';
import { useAllStageProgress, isUnitComplete } from '@/hooks/useStageProgress';
import { useRealtimeTasks } from '@/hooks/useRealtimeTasks';
import { cn } from '@/lib/utils';

interface TodaysPlanViewProps {
  onBack: () => void;
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

export function TodaysPlanView({ onBack, onStartUnit }: TodaysPlanViewProps) {
  const { data: studyPlan } = useStudyPlan();
  const { subject: recommendedSubject, message: dailyMessage } = useDailyRecommendation();
  const { data: weakTopics } = useWeakTopics();
  const { data: subjects } = useSubjects();
  const { data: allProgress } = useAllStageProgress();

  // Enable realtime updates for tasks and progress
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

  // Calculate total incomplete units across all subjects
  const { incompleteUnits, totalUnits } = useMemo(() => {
    if (!subjects) return { incompleteUnits: 0, totalUnits: 0 };

    let incomplete = 0;
    let total = 0;

    subjects.forEach(subject => {
      // This is a simplified calculation - in real app we'd fetch all units
      // For now, assume 10 units per subject
      const unitsPerSubject = 10;
      total += unitsPerSubject;

      // Estimate incomplete based on current progress
      const subjectProgress = Array.from(progressMap.values()).filter(p =>
        subjects.find(s => s.id === subject.id)
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

  const topWeakTopics = weakTopics?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Header */}
      <div className="sticky top-0 bg-card/95 backdrop-blur border-b border-border p-4 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold">Bugünkü Programım</h2>
              <p className="text-xs text-muted-foreground">Kişiselleştirilmiş öğrenme planı</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-4">
        {/* LGS Countdown Card */}
        <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">LGS Sınavına</p>
                  <h3 className="text-3xl font-bold text-primary">{daysRemaining} Gün</h3>
                  <p className="text-xs text-muted-foreground">
                    {examDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">İlerleme</p>
                <p className="text-2xl font-bold">
                  {totalUnits > 0 ? Math.round(((totalUnits - incompleteUnits) / totalUnits) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Focus Card */}
        <Card className="border-success/30 bg-gradient-to-br from-success/10 to-success/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-success" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Bugünün Dersi</h3>
                <p className="text-sm text-muted-foreground">{dailyMessage}</p>
              </div>
            </div>

            {recommendedSubject && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{recommendedSubject.emoji}</div>
                    <div>
                      <p className="font-bold">{recommendedSubject.name}</p>
                      <p className="text-sm text-muted-foreground">Önerilen ders</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      // Navigate to first incomplete unit of this subject
                      // For now, we'll just trigger with subject info
                      onStartUnit('', recommendedSubject.name, recommendedSubject.id);
                    }}
                    className="bg-success hover:bg-success/90"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Başla
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Target Card */}
        <Card className="border-warning/30 bg-gradient-to-br from-warning/10 to-warning/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-warning" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Haftalık Hedef</h3>
                <p className="text-sm text-muted-foreground">Bu haftayı tamamlamak için</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-card rounded-lg border border-border text-center">
                <p className="text-3xl font-bold text-primary">{topicsPerWeek}</p>
                <p className="text-sm text-muted-foreground mt-1">Konu Çalış</p>
              </div>
              <div className="p-4 bg-card rounded-lg border border-border text-center">
                <p className="text-3xl font-bold text-accent">{testsPerWeek}</p>
                <p className="text-sm text-muted-foreground mt-1">Test Çöz</p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-info/10 border border-info/30 rounded-lg">
              <p className="text-sm text-center">
                Kalan <span className="font-bold">{daysRemaining} güne</span> göre bu hafta{' '}
                <span className="font-bold text-primary">{topicsPerWeek} konu</span> +{' '}
                <span className="font-bold text-accent">{testsPerWeek} test</span> çözmen gerekiyor
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Weak Topics Card */}
        {topWeakTopics.length > 0 && (
          <Card className="border-destructive/30 bg-gradient-to-br from-destructive/10 to-destructive/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-destructive/20 rounded-full flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Öncelikli Konular</h3>
                  <p className="text-sm text-muted-foreground">Zayıf olduğun konuları güçlendir</p>
                </div>
              </div>

              <div className="space-y-2">
                {topWeakTopics.map((topic, index) => (
                  <div
                    key={topic.id}
                    className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:border-destructive/50 transition-all cursor-pointer"
                    onClick={() => onStartUnit(topic.unit_id, topic.unit_name, topic.subject_id)}
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                      <div>
                        <p className="font-semibold text-sm">{topic.unit_name}</p>
                        <p className="text-xs text-muted-foreground">{topic.subject_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="text-xs">
                        {topic.mistake_count} hata
                      </Badge>
                      <Button size="sm" variant="outline">
                        Çalış
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Weekly Plan Calendar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-lg">7 Günlük Plan</h3>
                <p className="text-sm text-muted-foreground">Haftalık ders rotasyonu</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {weeklyPlan.map((day, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border transition-all",
                    day.isToday
                      ? "bg-primary/10 border-primary/50 shadow-md"
                      : "bg-card border-border hover:border-accent/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex flex-col items-center justify-center",
                      day.isToday ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                      <p className="text-xs font-medium">
                        {day.date.toLocaleDateString('tr-TR', { day: 'numeric' })}
                      </p>
                      <p className="text-xs">
                        {day.date.toLocaleDateString('tr-TR', { month: 'short' })}
                      </p>
                    </div>
                    <div>
                      <p className={cn(
                        "font-semibold",
                        day.isToday && "text-primary"
                      )}>
                        {day.dayName}
                        {day.isToday && " (Bugün)"}
                      </p>
                      <p className="text-sm text-muted-foreground">{day.subject}</p>
                    </div>
                  </div>
                  {day.isToday && (
                    <Badge className="bg-success">Aktif</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Goal XP Progress */}
        {studyPlan && (
          <Card className="border-accent/30 bg-gradient-to-br from-accent/10 to-accent/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Günlük Hedef</h3>
                  <p className="text-sm text-muted-foreground">
                    {studyPlan.daily_goal_xp} XP kazanmayı hedefle
                  </p>
                </div>
              </div>
              <Progress value={0} className="h-3" />
              <p className="text-xs text-muted-foreground text-center mt-2">
                Bugün 0 / {studyPlan.daily_goal_xp} XP
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
