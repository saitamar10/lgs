import { useState } from 'react';
import { Mascot } from '@/components/Mascot';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BookOpen, Target, Trophy, Languages, FileText, Rocket, Sparkles, Route } from 'lucide-react';

interface OnboardingStep {
  title: string;
  message: string;
  mood: 'happy' | 'thinking' | 'celebrating' | 'encouraging';
  icon: React.ReactNode;
}

const STEPS: OnboardingStep[] = [
  {
    title: 'Hoş geldin!',
    message: 'Merhaba! Ben senin çalışma arkadaşınım. Sana LGSÇalış\'ı tanıtayım!',
    mood: 'happy',
    icon: <Sparkles className="w-6 h-6 text-warning" />,
  },
  {
    title: 'Dersler',
    message: 'Sol taraftan derslerini seçebilirsin. Matematik, Fen, Türkçe ve daha fazlası!',
    mood: 'happy',
    icon: <BookOpen className="w-6 h-6 text-primary" />,
  },
  {
    title: 'Öğrenme Yolu',
    message: 'Her konuda Ders, Quiz ve Deney aşamaları var. Adım adım ilerle!',
    mood: 'thinking',
    icon: <Route className="w-6 h-6 text-info" />,
  },
  {
    title: 'Günlük Görevler',
    message: 'Her gün sana özel görevler veriyorum. Bunları tamamla, XP kazan!',
    mood: 'encouraging',
    icon: <Target className="w-6 h-6 text-success" />,
  },
  {
    title: 'Puan Tablosu',
    message: 'Arkadaşlarınla yarış! Kim daha çok XP kazanacak?',
    mood: 'celebrating',
    icon: <Trophy className="w-6 h-6 text-warning" />,
  },
  {
    title: 'Kelime Ezber',
    message: 'İngilizce kelime ezber modülü ile kelime hazineni geliştir!',
    mood: 'happy',
    icon: <Languages className="w-6 h-6 text-accent" />,
  },
  {
    title: 'Deneme Sınavı',
    message: 'Gerçek LGS formatında deneme sınavları ile kendini test et!',
    mood: 'thinking',
    icon: <FileText className="w-6 h-6 text-destructive" />,
  },
  {
    title: 'Hazırsın!',
    message: 'Harika! Artık hazırsın. Haydi başla!',
    mood: 'celebrating',
    icon: <Rocket className="w-6 h-6 text-primary" />,
  },
];

interface OnboardingOverlayProps {
  onComplete: () => void;
}

export function OnboardingOverlay({ onComplete }: OnboardingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('onboarding_complete', 'true');
    onComplete();
  };

  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md animate-scale-in" key={currentStep}>
        {/* Card */}
        <div className="bg-card rounded-2xl border-2 border-primary/30 shadow-2xl overflow-hidden">
          {/* Step dots */}
          <div className="flex justify-center gap-1.5 pt-4 px-4">
            {STEPS.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  idx === currentStep
                    ? 'w-6 bg-primary'
                    : idx < currentStep
                    ? 'w-2 bg-primary/50'
                    : 'w-2 bg-muted'
                )}
              />
            ))}
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col items-center text-center space-y-4">
            {/* Mascot */}
            <Mascot
              size="lg"
              mood={step.mood}
              animate
            />

            {/* Title with icon */}
            <div className="flex items-center gap-2">
              {step.icon}
              <h2 className="text-xl font-bold">{step.title}</h2>
            </div>

            {/* Message */}
            <p className="text-muted-foreground text-sm leading-relaxed">
              {step.message}
            </p>

            {/* Step counter */}
            <p className="text-xs text-muted-foreground">
              {currentStep + 1} / {STEPS.length}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between p-4 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleComplete}
              className="text-muted-foreground"
            >
              Atla
            </Button>
            <Button onClick={handleNext} size="sm">
              {isLastStep ? 'Başlayalım!' : 'Sonraki'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
