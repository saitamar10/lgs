import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Mascot } from '@/components/Mascot';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, X, BookOpen, Lightbulb, Target, CheckCircle } from 'lucide-react';

interface LessonSlide {
  title: string;
  content: string;
  icon: 'intro' | 'concept' | 'example' | 'tip' | 'summary';
  highlight?: string;
  mascotMood?: 'happy' | 'thinking' | 'celebrating' | 'encouraging';
  mascotMessage?: string;
}

interface TopicLessonProps {
  unitName: string;
  subjectName: string;
  slides: LessonSlide[];
  onComplete: () => void;
  onExit: () => void;
}

const iconMap = {
  intro: BookOpen,
  concept: Lightbulb,
  example: Target,
  tip: Lightbulb,
  summary: CheckCircle
};

const slideColors = {
  intro: 'from-primary/20 to-primary/5',
  concept: 'from-info/20 to-info/5',
  example: 'from-success/20 to-success/5',
  tip: 'from-warning/20 to-warning/5',
  summary: 'from-secondary to-secondary/50'
};

export function TopicLesson({
  unitName,
  subjectName,
  slides,
  onComplete,
  onExit
}: TopicLessonProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const progress = ((currentSlide + 1) / slides.length) * 100;
  const slide = slides[currentSlide];
  const SlideIcon = iconMap[slide.icon];

  const goToSlide = (index: number, dir: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(dir);
    
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimating(false);
    }, 300);
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      goToSlide(currentSlide + 1, 'next');
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1, 'prev');
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, isAnimating]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border p-4 z-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <Button variant="ghost" size="icon" onClick={onExit}>
              <X className="w-5 h-5" />
            </Button>
            <Progress value={progress} className="flex-1 h-3" />
            <span className="text-sm font-medium text-muted-foreground">
              {currentSlide + 1}/{slides.length}
            </span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {subjectName} • {unitName}
          </p>
        </div>
      </div>

      {/* Slide Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div 
          className={cn(
            "w-full max-w-lg transition-all duration-300",
            isAnimating && direction === 'next' && "translate-x-4 opacity-0",
            isAnimating && direction === 'prev' && "-translate-x-4 opacity-0"
          )}
        >
          {/* Slide Card */}
          <div className={cn(
            "bg-gradient-to-br rounded-3xl p-6 md:p-8 shadow-xl border border-border",
            slideColors[slide.icon]
          )}>
            {/* Icon Badge */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-card shadow-lg flex items-center justify-center">
                <SlideIcon className="w-8 h-8 text-primary" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-6">
              {slide.title}
            </h2>

            {/* Content */}
            <div className="space-y-4">
              {/* Main content - preserve whitespace and formatting for examples */}
              <div className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line text-left">
                {slide.content}
              </div>

              {/* Highlight Box */}
              {slide.highlight && (
                <div className="bg-card rounded-xl p-4 border-2 border-primary/30 mt-4">
                  <p className="text-primary font-semibold text-lg text-center">
                    💡 {slide.highlight}
                  </p>
                </div>
              )}
            </div>

            {/* Mascot */}
            {slide.mascotMessage && (
              <div className="mt-8 flex justify-center">
                <Mascot 
                  size="md" 
                  mood={slide.mascotMood || 'happy'}
                  message={slide.mascotMessage}
                  animate={false}
                />
              </div>
            )}
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index, index > currentSlide ? 'next' : 'prev')}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === currentSlide 
                    ? "w-6 bg-primary" 
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky bottom-0 bg-card border-t border-border p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="flex-1 h-12"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Geri
          </Button>

          <Button
            onClick={handleNext}
            className="flex-1 h-12 font-bold"
          >
            {currentSlide === slides.length - 1 ? (
              <>
                <CheckCircle className="w-5 h-5 mr-1" />
                Quiz'e Başla
              </>
            ) : (
              <>
                İleri
                <ChevronRight className="w-5 h-5 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper to generate lesson slides from AI or predefined content
export function generateDefaultSlides(unitName: string): LessonSlide[] {
  return [
    {
      title: `${unitName}`,
      content: 'Bu konuyu öğrenmeye hazır mısın? Adım adım birlikte keşfedeceğiz!',
      icon: 'intro',
      mascotMood: 'happy',
      mascotMessage: 'Hadi başlayalım! 🚀'
    },
    {
      title: 'Temel Kavram',
      content: 'Bu konunun temelini oluşturan en önemli kavramı anlayalım.',
      icon: 'concept',
      highlight: 'Kavramları anlamak, soruları çözmenin ilk adımıdır!',
      mascotMood: 'thinking'
    },
    {
      title: 'Örnek Uygulama',
      content: 'Şimdi öğrendiklerimizi bir örnek üzerinde uygulayalım.',
      icon: 'example',
      mascotMood: 'encouraging',
      mascotMessage: 'Yapabilirsin! 💪'
    },
    {
      title: 'İpucu',
      content: 'LGS sınavında bu konuyla ilgili dikkat etmen gereken önemli bir nokta var.',
      icon: 'tip',
      highlight: 'Soru kökünü dikkatlice oku!',
      mascotMood: 'thinking'
    },
    {
      title: 'Özet',
      content: 'Tebrikler! Bu konunun temellerini öğrendin. Şimdi quiz ile pratik yapabilirsin!',
      icon: 'summary',
      mascotMood: 'celebrating',
      mascotMessage: 'Harika iş çıkardın! 🎉'
    }
  ];
}
