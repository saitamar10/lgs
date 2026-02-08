import { cn } from '@/lib/utils';

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

const MascotSVG = ({ mood, dimension }: { mood: string; dimension: number }) => {
  const isHappy = mood === 'happy';
  const isThinking = mood === 'thinking';
  const isCelebrating = mood === 'celebrating';
  const isEncouraging = mood === 'encouraging';

  return (
    <svg
      viewBox="0 0 200 260"
      width={dimension}
      height={dimension * 1.3}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="select-none"
    >
      <style>{`
        @keyframes mascot-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes mascot-blink {
          0%, 42%, 44%, 100% { transform: scaleY(1); }
          43% { transform: scaleY(0.05); }
        }
        @keyframes mascot-wave {
          0%, 40%, 100% { transform: rotate(0deg); }
          10% { transform: rotate(-25deg); }
          20% { transform: rotate(10deg); }
          30% { transform: rotate(-20deg); }
        }
        @keyframes mascot-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          30% { transform: translateY(-12px) scale(1.05); }
          50% { transform: translateY(0) scale(0.95); }
          70% { transform: translateY(-6px) scale(1.02); }
        }
        @keyframes mascot-think-tilt {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(4deg); }
        }
        @keyframes star-twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.6); }
        }
        .mascot-body { animation: mascot-float 3s ease-in-out infinite; }
        .mascot-eyes { animation: mascot-blink 4s ease-in-out infinite; transform-origin: center; }
        .mascot-wave-arm { animation: mascot-wave 2s ease-in-out infinite; transform-origin: 155px 145px; }
        .mascot-celebrating { animation: mascot-bounce 1s ease-in-out infinite; }
        .mascot-thinking { animation: mascot-think-tilt 3s ease-in-out infinite; transform-origin: center; }
        .star-effect { animation: star-twinkle 1.5s ease-in-out infinite; }
      `}</style>

      <g className={cn(
        "mascot-body",
        isCelebrating && "mascot-celebrating",
        isThinking && "mascot-thinking"
      )}>
        {/* Shadow */}
        <ellipse cx="100" cy="252" rx="40" ry="6" fill="currentColor" opacity="0.08" />

        {/* --- LEGS --- */}
        {/* Left leg */}
        <rect x="72" y="210" width="20" height="30" rx="8" fill="#1e3a5f" />
        {/* Right leg */}
        <rect x="108" y="210" width="20" height="30" rx="8" fill="#1e3a5f" />
        {/* Left shoe */}
        <ellipse cx="82" cy="243" rx="16" ry="8" fill="#334155" />
        {/* Right shoe */}
        <ellipse cx="118" cy="243" rx="16" ry="8" fill="#334155" />

        {/* --- BODY / T-SHIRT --- */}
        <path d="M60 145 Q60 130, 80 125 L120 125 Q140 130, 140 145 L140 215 Q140 225, 130 225 L70 225 Q60 225, 60 215 Z" fill="#22c55e" />
        {/* Shirt collar */}
        <path d="M85 125 L100 140 L115 125" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
        {/* Shirt pocket */}
        <rect x="108" y="155" width="18" height="14" rx="3" fill="#16a34a" opacity="0.5" />
        {/* LGS text on shirt */}
        <text x="100" y="190" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white" opacity="0.9">LGS</text>

        {/* --- LEFT ARM --- */}
        <g>
          <path
            d="M60 140 C45 150, 38 170, 42 185 Q44 190, 48 188 C52 180, 50 165, 55 155"
            fill="#f5c9a8"
            stroke="#e8b796"
            strokeWidth="1"
          />
          {/* Left hand */}
          <circle cx="44" cy="186" r="8" fill="#f5c9a8" />

          {/* Book in left hand (thinking/encouraging) */}
          {(isThinking || isEncouraging) && (
            <g>
              <rect x="28" y="178" width="22" height="16" rx="2" fill="#3b82f6" />
              <rect x="30" y="180" width="18" height="12" rx="1" fill="#60a5fa" />
              <line x1="39" y1="180" x2="39" y2="192" stroke="#2563eb" strokeWidth="1.5" />
            </g>
          )}
        </g>

        {/* --- RIGHT ARM --- */}
        <g className={cn((isHappy || isCelebrating) && "mascot-wave-arm")}>
          <path
            d="M140 140 C155 150, 162 170, 158 185 Q156 190, 152 188 C148 180, 150 165, 145 155"
            fill="#f5c9a8"
            stroke="#e8b796"
            strokeWidth="1"
          />
          {/* Right hand */}
          <circle cx="156" cy="186" r="8" fill="#f5c9a8" />

          {/* Pencil in hand (encouraging) */}
          {isEncouraging && (
            <g>
              <rect x="152" y="168" width="5" height="24" rx="1" fill="#fbbf24" transform="rotate(-15, 155, 180)" />
              <polygon points="152,192 155,198 158,192" fill="#374151" transform="rotate(-15, 155, 190)" />
            </g>
          )}
        </g>

        {/* --- HEAD --- */}
        {/* Head shape */}
        <ellipse cx="100" cy="85" rx="42" ry="45" fill="#f5c9a8" />

        {/* --- HAIR (Dark, Turkish style) --- */}
        <path d="M58 78 Q58 35, 100 30 Q142 35, 142 78 Q140 60, 125 52 Q110 46, 100 48 Q90 46, 75 52 Q60 60, 58 78 Z" fill="#2c1810" />
        {/* Hair bangs */}
        <path d="M68 68 Q72 50, 85 48 Q78 55, 75 68 Z" fill="#3d2317" />
        <path d="M82 62 Q88 45, 100 44 Q95 50, 90 62 Z" fill="#3d2317" />
        <path d="M95 60 Q102 42, 115 44 Q108 48, 102 60 Z" fill="#3d2317" />
        <path d="M110 62 Q118 46, 130 52 Q122 54, 118 65 Z" fill="#3d2317" />
        {/* Side hair */}
        <path d="M58 78 Q55 85, 58 95 Q60 88, 62 82 Z" fill="#2c1810" />
        <path d="M142 78 Q145 85, 142 95 Q140 88, 138 82 Z" fill="#2c1810" />

        {/* --- EARS --- */}
        <ellipse cx="58" cy="88" rx="7" ry="9" fill="#f0b898" />
        <ellipse cx="142" cy="88" rx="7" ry="9" fill="#f0b898" />

        {/* --- EYEBROWS --- */}
        {isThinking ? (
          <>
            <path d="M72 68 Q80 62, 90 66" fill="none" stroke="#2c1810" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M110 64 Q120 60, 128 66" fill="none" stroke="#2c1810" strokeWidth="2.5" strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d="M72 70 Q80 64, 90 68" fill="none" stroke="#2c1810" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M110 68 Q120 64, 128 70" fill="none" stroke="#2c1810" strokeWidth="2.5" strokeLinecap="round" />
          </>
        )}

        {/* --- EYES --- */}
        <g className="mascot-eyes">
          {/* Left eye white */}
          <ellipse cx="82" cy="82" rx="12" ry="13" fill="white" />
          {/* Right eye white */}
          <ellipse cx="118" cy="82" rx="12" ry="13" fill="white" />

          {isThinking ? (
            <>
              {/* Looking up-right */}
              <circle cx="85" cy="79" r="6" fill="#2c1810" />
              <circle cx="121" cy="79" r="6" fill="#2c1810" />
              <circle cx="87" cy="77" r="2" fill="white" />
              <circle cx="123" cy="77" r="2" fill="white" />
            </>
          ) : (
            <>
              {/* Normal forward look */}
              <circle cx="84" cy="83" r="7" fill="#2c1810" />
              <circle cx="120" cy="83" r="7" fill="#2c1810" />
              <circle cx="86" cy="81" r="2.5" fill="white" />
              <circle cx="122" cy="81" r="2.5" fill="white" />
            </>
          )}
        </g>

        {/* --- NOSE --- */}
        <ellipse cx="100" cy="94" rx="4" ry="3" fill="#e8a888" />

        {/* --- MOUTH --- */}
        {isHappy && (
          <path d="M88 103 Q100 114, 112 103" fill="none" stroke="#c0392b" strokeWidth="2.5" strokeLinecap="round" />
        )}
        {isCelebrating && (
          <>
            <path d="M86 102 Q100 118, 114 102" fill="#c0392b" />
            <path d="M90 102 Q100 108, 110 102" fill="white" opacity="0.8" />
          </>
        )}
        {isThinking && (
          <ellipse cx="105" cy="106" rx="4" ry="3" fill="#c0392b" opacity="0.7" />
        )}
        {isEncouraging && (
          <path d="M86 103 Q100 116, 114 103" fill="none" stroke="#c0392b" strokeWidth="3" strokeLinecap="round" />
        )}

        {/* --- CHEEKS (blush) --- */}
        <ellipse cx="66" cy="96" rx="8" ry="5" fill="#ff9999" opacity="0.3" />
        <ellipse cx="134" cy="96" rx="8" ry="5" fill="#ff9999" opacity="0.3" />

        {/* --- BACKPACK STRAPS --- */}
        <path d="M75 125 L70 155" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
        <path d="M125 125 L130 155" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />

        {/* --- THINKING BUBBLE --- */}
        {isThinking && (
          <g>
            <circle cx="155" cy="55" r="4" fill="#e2e8f0" />
            <circle cx="165" cy="43" r="6" fill="#e2e8f0" />
            <circle cx="178" cy="28" r="11" fill="#e2e8f0" />
            <text x="178" y="33" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#64748b">?</text>
          </g>
        )}

        {/* --- CELEBRATION EFFECTS --- */}
        {isCelebrating && (
          <g>
            <g className="star-effect">
              <circle cx="38" cy="60" r="4" fill="#fbbf24" />
              <circle cx="38" cy="60" r="2" fill="#fef3c7" />
            </g>
            <g className="star-effect" style={{ animationDelay: '0.3s' }}>
              <circle cx="162" cy="40" r="5" fill="#22c55e" />
              <circle cx="162" cy="40" r="2.5" fill="#bbf7d0" />
            </g>
            <g className="star-effect" style={{ animationDelay: '0.6s' }}>
              <circle cx="45" cy="110" r="3" fill="#3b82f6" />
              <circle cx="45" cy="110" r="1.5" fill="#bfdbfe" />
            </g>
            <g className="star-effect" style={{ animationDelay: '0.9s' }}>
              <circle cx="158" cy="100" r="4" fill="#f59e0b" />
              <circle cx="158" cy="100" r="2" fill="#fef3c7" />
            </g>
          </g>
        )}
      </g>
    </svg>
  );
};

export function Mascot({
  size = 'md',
  mood = 'happy',
  message,
  className,
  animate = true,
}: MascotProps) {
  const dimension = sizeMap[size];

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      {/* Mascot Character */}
      <div
        className={cn(
          'relative flex items-center justify-center transition-transform',
          animate && 'hover:scale-110 cursor-pointer'
        )}
      >
        <MascotSVG mood={mood} dimension={dimension} />
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
