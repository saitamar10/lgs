import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Target, Zap, BookOpen } from 'lucide-react';
import { useCreateStudyPlan, calculateDaysRemaining, calculateDailyTopics } from '@/hooks/useStudyPlan';
import { useToast } from '@/hooks/use-toast';

interface ExamDateSetupProps {
  totalTopics: number;
  onComplete: () => void;
}

export function ExamDateSetup({ totalTopics, onComplete }: ExamDateSetupProps) {
  const [examDate, setExamDate] = useState('2026-06-07'); // Default LGS date
  const [dailyGoal, setDailyGoal] = useState(50);
  const createStudyPlan = useCreateStudyPlan();
  const { toast } = useToast();

  const daysRemaining = calculateDaysRemaining(examDate);
  const dailyTopics = calculateDailyTopics(daysRemaining, totalTopics);

  const handleSubmit = async () => {
    try {
      await createStudyPlan.mutateAsync({
        examDate,
        dailyGoalXp: dailyGoal
      });
      toast({
        title: "Plan Oluşturuldu! 🎯",
        description: `${daysRemaining} gün içinde ${totalTopics} konu tamamlanacak.`
      });
      onComplete();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Plan oluşturulamadı."
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg animate-bounce-in">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">🎓</span>
          </div>
          <CardTitle className="text-2xl">LGS'ye Hazır mısın?</CardTitle>
          <CardDescription>
            Sınav tarihini gir, sana özel çalışma planı oluşturalım
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Exam Date */}
          <div className="space-y-2">
            <Label htmlFor="exam-date" className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              LGS Sınav Tarihi
            </Label>
            <Input
              id="exam-date"
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Daily Goal */}
          <div className="space-y-2">
            <Label htmlFor="daily-goal" className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Günlük XP Hedefi
            </Label>
            <div className="flex gap-2">
              {[30, 50, 100].map((goal) => (
                <Button
                  key={goal}
                  variant={dailyGoal === goal ? "default" : "outline"}
                  onClick={() => setDailyGoal(goal)}
                  className="flex-1"
                >
                  {goal} XP
                </Button>
              ))}
            </div>
          </div>

          {/* Plan Preview */}
          <div className="bg-secondary rounded-xl p-4 space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Çalışma Planın
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-primary">{daysRemaining}</div>
                <div className="text-xs text-muted-foreground">Gün Kaldı</div>
              </div>
              <div className="bg-card rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-warning">{totalTopics}</div>
                <div className="text-xs text-muted-foreground">Toplam Konu</div>
              </div>
              <div className="bg-card rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-accent">{dailyTopics}</div>
                <div className="text-xs text-muted-foreground">Günlük Konu</div>
              </div>
              <div className="bg-card rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-success flex items-center justify-center gap-1">
                  <Zap className="w-5 h-5" />
                  {dailyGoal}
                </div>
                <div className="text-xs text-muted-foreground">Günlük XP</div>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSubmit}
            className="w-full h-14 text-lg font-bold"
            disabled={createStudyPlan.isPending}
          >
            {createStudyPlan.isPending ? "Oluşturuluyor..." : "Başla! 🚀"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
