import { cn } from '@/lib/utils';
import mascotHappy from '@/assets/mascot.png';
import mascotThinking from '@/assets/mascot-thinking.png';
import mascotCelebrating from '@/assets/mascot-celebrating.png';
import mascotEncouraging from '@/assets/mascot-encouraging.png';

interface MascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  mood?: 'happy' | 'thinking' | 'celebrating' | 'encouraging';
  message?: string;
  className?: string;
  animate?: boolean;
}

const sizeMap = {
  sm: 64,
  md: 100,
  lg: 150,
  xl: 200,
};

const moodImageMap: Record<string, string> = {
  happy: mascotHappy,
  thinking: mascotThinking,
  celebrating: mascotCelebrating,
  encouraging: mascotEncouraging,
};

export function Mascot({
  size = 'md',
  mood = 'happy',
  message,
  className,
  animate = true,
}: MascotProps) {
  const dimension = sizeMap[size];
  const imageSrc = moodImageMap[mood] || mascotHappy;

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      {/* Mascot Character */}
      <div
        className={cn(
          'relative flex items-center justify-center transition-transform',
          animate && 'hover:scale-110 cursor-pointer'
        )}
      >
        <img
          src={imageSrc}
          alt="LGS Maskot"
          width={dimension}
          height={dimension}
          className={cn(
            'select-none object-contain mix-blend-multiply dark:mix-blend-screen',
            animate && mood === 'celebrating' && 'animate-bounce',
          )}
          draggable={false}
        />
      </div>

      {/* Speech Bubble */}
      {message && (
        <div className="relative bg-card border-2 border-primary/20 rounded-xl px-4 py-3 shadow-lg max-w-xs animate-scale-in">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-card" />
          <p className="text-sm text-foreground text-center font-medium">{message}</p>
        </div>
      )}
    </div>
  );
}
