import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Zap, Star, ArrowLeft } from 'lucide-react';
import { Mascot } from '@/components/Mascot';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface QuizCompleteProps {
  score: number;
  totalQuestions: number;
  xpEarned: number;
  onContinue: () => void;
}

export function QuizComplete({ score, totalQuestions, xpEarned, onContinue }: QuizCompleteProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const isPerfect = percentage === 100;
  const isGood = percentage >= 70;

  // Trigger confetti animation on mount for good scores
  useEffect(() => {
    if (isGood) {
      const duration = isPerfect ? 4000 : 2000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: isPerfect ? 7 : 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']
        });
        confetti({
          particleCount: isPerfect ? 7 : 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [isGood, isPerfect]);

  const getMascotMood = () => {
    if (isPerfect) return 'celebrating';
    if (isGood) return 'happy';
    return 'encouraging';
  };

  const getMascotMessage = () => {
    if (isPerfect) return 'Mükemmel! Sen bir dahisin! 🏆';
    if (isGood) return 'Harika iş çıkardın! Devam et! 🎉';
    return 'Endişelenme, pratik yaparsan daha iyi olursun! 💪';
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center animate-scale-in">
        <CardContent className="p-8">
          <div className={isPerfect ? "animate-bounce" : ""}>
            <Mascot 
              size="lg" 
              mood={getMascotMood()}
              message={getMascotMessage()}
              animate={isPerfect}
              className="mb-6"
            />
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-2 animate-fade-in">
            {isPerfect ? '🎊 Mükemmel! 🎊' : isGood ? 'Harika İş!' : 'İyi Deneme!'}
          </h2>
          
          <p className="text-muted-foreground mb-6">
            {isPerfect 
              ? 'Tüm soruları doğru bildin!' 
              : isGood 
                ? 'Çok iyi gidiyorsun, devam et!' 
                : 'Pratik yapmaya devam et!'}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-secondary rounded-xl p-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <Trophy className="w-6 h-6 mx-auto mb-2 text-warning" />
              <div className="text-2xl font-bold text-foreground">{percentage}%</div>
              <div className="text-xs text-muted-foreground">Başarı</div>
            </div>
            <div className="bg-secondary rounded-xl p-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Star className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">{score}/{totalQuestions}</div>
              <div className="text-xs text-muted-foreground">Doğru</div>
            </div>
            <div className="bg-secondary rounded-xl p-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Zap className="w-6 h-6 mx-auto mb-2 text-warning" />
              <div className="text-2xl font-bold text-foreground">+{xpEarned}</div>
              <div className="text-xs text-muted-foreground">XP</div>
            </div>
          </div>

          <Button onClick={onContinue} className="w-full h-14 text-lg font-bold">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Derslere Dön
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
