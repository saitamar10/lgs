import { cn } from '@/lib/utils';

interface MascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  mood?: 'happy' | 'thinking' | 'celebrating' | 'encouraging';
  message?: string;
  className?: string;
  animate?: boolean;
}

// Modern SVG maskot karakteri - LGS öğrencisi temalı
const MascotSVG = ({ mood, size }: { mood: string; size: string }) => {
  const sizeMap = {
    sm: 48,
    md: 80,
    lg: 128,
    xl: 192
  };

  const dimension = sizeMap[size as keyof typeof sizeMap] || 80;

  // Farklı ruh hallerine göre emoji/karakter
  const moodEmojis = {
    happy: '🎓',
    thinking: '🤔',
    celebrating: '🎉',
    encouraging: '💪'
  };

  return (
    <div
      className="relative rounded-full bg-gradient-to-br from-primary/20 via-accent/20 to-warning/20 flex items-center justify-center border-4 border-primary/30 shadow-xl animate-pulse"
      style={{ width: dimension, height: dimension }}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-transparent animate-ping opacity-75" />
      <span style={{ fontSize: dimension * 0.6 }} className="relative z-10 animate-bounce">
        {moodEmojis[mood as keyof typeof moodEmojis] || '🎓'}
      </span>
    </div>
  );
};

export function Mascot({
  size = 'md',
  mood = 'happy',
  message,
  className,
  animate = true
}: MascotProps) {
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* Maskot Character */}
      <div className={cn(
        "relative flex items-center justify-center transition-transform",
        animate && mood === 'celebrating' && "animate-bounce",
        animate && "hover:scale-110"
      )}>
        <MascotSVG mood={mood} size={size} />
      </div>

      {/* Speech Bubble */}
      {message && (
        <div className="relative bg-card border-2 border-primary/20 rounded-xl px-4 py-3 shadow-lg max-w-xs animate-slide-up">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-card" />
          <p className="text-sm text-foreground text-center font-medium">{message}</p>
        </div>
      )}
    </div>
  );
}
