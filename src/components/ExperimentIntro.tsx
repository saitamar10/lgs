import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Microscope, Lightbulb, Target, Zap } from 'lucide-react';
import { getExperimentEmoji } from '@/utils/subjectHelpers';
import { ExperimentType } from '@/types/experiments';

interface ExperimentIntroProps {
  unitName: string;
  experimentType: ExperimentType;
  onStart: () => void;
  onCancel: () => void;
}

export function ExperimentIntro({
  unitName,
  experimentType,
  onStart,
  onCancel
}: ExperimentIntroProps) {
  const emoji = getExperimentEmoji(experimentType);

  const features = [
    {
      icon: Microscope,
      text: '3D interaktif deney ortamı'
    },
    {
      icon: Lightbulb,
      text: 'Adım adım rehberli öğrenme'
    },
    {
      icon: Target,
      text: 'Anında geri bildirim sistemi'
    },
    {
      icon: Zap,
      text: 'Başarı oranına göre XP kazanımı'
    }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-2 border-success/30 bg-gradient-to-br from-success/5 to-success/10">
        <CardContent className="p-8">
          {/* Animated Emoji */}
          <div className="flex justify-center mb-6">
            <div className="text-8xl animate-bounce">
              {emoji}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-3">
            Deneyi Yap ve Öğren
          </h1>
          <p className="text-xl text-center text-muted-foreground mb-8">
            {unitName}
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border hover:border-success/50 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-success" />
                </div>
                <p className="text-sm text-foreground font-medium pt-2">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div className="bg-info/10 border border-info/30 rounded-xl p-4 mb-6">
            <p className="text-sm text-foreground text-center">
              <span className="font-semibold">💡 İpucu:</span> Deneyi tamamlayarak
              <span className="text-success font-bold"> 50-150 XP </span>
              kazanabilirsin! Tüm adımları doğru yaparak maksimum puan al.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              Geri Dön
            </Button>
            <Button
              onClick={onStart}
              className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
              size="lg"
            >
              <Microscope className="w-5 h-5 mr-2" />
              Deneye Başla! 🔬
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
