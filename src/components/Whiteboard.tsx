import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { MathText } from '@/lib/katex';
import { cn } from '@/lib/utils';
import { Eraser, Trash2, X } from 'lucide-react';

interface WhiteboardProps {
  isOpen: boolean;
  onClose: () => void;
  questionText?: string;
  questionId?: string;
}

const COLORS = [
  { name: 'Siyah', value: '#000000' },
  { name: 'Kırmızı', value: '#ef4444' },
  { name: 'Mavi', value: '#3b82f6' },
  { name: 'Yeşil', value: '#22c55e' },
  { name: 'Turuncu', value: '#f97316' },
  { name: 'Mor', value: '#a855f7' },
];

const BRUSH_SIZES = [2, 4, 6];

export function Whiteboard({ isOpen, onClose, questionText, questionId }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // UI state - sadece toolbar için
  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(4);
  const [isEraser, setIsEraser] = useState(false);

  // Çizim state'leri - ref ile (re-render yok)
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const colorRef = useRef('#000000');
  const brushRef = useRef(4);
  const eraserRef = useRef(false);
  const savedImageData = useRef<string | null>(null);

  // Ref'leri state ile senkronize et
  useEffect(() => { colorRef.current = currentColor; }, [currentColor]);
  useEffect(() => { brushRef.current = brushSize; }, [brushSize]);
  useEffect(() => { eraserRef.current = isEraser; }, [isEraser]);

  // Canvas boyutlandırma
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (savedImageData.current) {
      const img = new Image();
      img.onload = () => { ctx.drawImage(img, 0, 0); };
      img.src = savedImageData.current;
    }
  }, []);

  // Kapanırken çizimi kaydet
  const handleClose = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      savedImageData.current = canvas.toDataURL();
    }
    onClose();
  }, [onClose]);

  // Soru değişince tahtayı temizle
  useEffect(() => {
    savedImageData.current = null;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [questionId]);

  // Native event listener'lar - React render döngüsü dışında
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isOpen) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const getPos = (e: TouchEvent | MouseEvent): { x: number; y: number } => {
      const rect = canvas.getBoundingClientRect();
      if ('touches' in e) {
        const touch = e.touches[0] || e.changedTouches[0];
        return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
      }
      return { x: (e as MouseEvent).clientX - rect.left, y: (e as MouseEvent).clientY - rect.top };
    };

    const onStart = (e: TouchEvent | MouseEvent) => {
      e.preventDefault();
      const pos = getPos(e);
      lastPosRef.current = pos;
      isDrawingRef.current = true;

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, brushRef.current / 2, 0, Math.PI * 2);
      ctx.fillStyle = eraserRef.current ? '#ffffff' : colorRef.current;
      ctx.fill();
    };

    const onMove = (e: TouchEvent | MouseEvent) => {
      e.preventDefault();
      if (!isDrawingRef.current || !lastPosRef.current) return;

      const pos = getPos(e);

      ctx.beginPath();
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = eraserRef.current ? '#ffffff' : colorRef.current;
      ctx.lineWidth = eraserRef.current ? brushRef.current * 3 : brushRef.current;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      lastPosRef.current = pos;
    };

    const onEnd = () => {
      isDrawingRef.current = false;
      lastPosRef.current = null;
    };

    canvas.addEventListener('mousedown', onStart);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseup', onEnd);
    canvas.addEventListener('mouseleave', onEnd);
    canvas.addEventListener('touchstart', onStart, { passive: false });
    canvas.addEventListener('touchmove', onMove, { passive: false });
    canvas.addEventListener('touchend', onEnd);
    canvas.addEventListener('touchcancel', onEnd);

    return () => {
      canvas.removeEventListener('mousedown', onStart);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseup', onEnd);
      canvas.removeEventListener('mouseleave', onEnd);
      canvas.removeEventListener('touchstart', onStart);
      canvas.removeEventListener('touchmove', onMove);
      canvas.removeEventListener('touchend', onEnd);
      canvas.removeEventListener('touchcancel', onEnd);
    };
  }, [isOpen]);

  // Açılınca canvas boyutlandır
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(resizeCanvas, 50);
      window.addEventListener('resize', resizeCanvas);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', resizeCanvas);
      };
    }
  }, [isOpen, resizeCanvas]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    savedImageData.current = null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex flex-col">
      {/* Toolbar */}
      <div className="bg-card border-b border-border p-2 flex items-center gap-2 flex-wrap safe-area-top">
        <Button variant="ghost" size="icon" onClick={handleClose} className="shrink-0">
          <X className="w-5 h-5" />
        </Button>

        <div className="h-6 w-px bg-border" />

        {/* Renk seçenekleri */}
        <div className="flex items-center gap-1.5">
          {COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => { setCurrentColor(color.value); setIsEraser(false); }}
              className={cn(
                "w-7 h-7 rounded-full border-2 transition-all",
                currentColor === color.value && !isEraser
                  ? "border-foreground scale-110 ring-2 ring-primary/50"
                  : "border-border hover:scale-105"
              )}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>

        <div className="h-6 w-px bg-border" />

        {/* Fırça boyutu */}
        <div className="flex items-center gap-1">
          {BRUSH_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => setBrushSize(size)}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                brushSize === size
                  ? "bg-primary/20 border border-primary"
                  : "bg-muted hover:bg-muted-foreground/10"
              )}
              title={`${size}px`}
            >
              <div
                className="rounded-full bg-foreground"
                style={{ width: size + 2, height: size + 2 }}
              />
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-border" />

        <Button
          variant={isEraser ? "default" : "outline"}
          size="icon"
          onClick={() => setIsEraser(!isEraser)}
          title="Silgi"
        >
          <Eraser className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={clearCanvas}
          title="Tümünü Temizle"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Soru metni */}
      {questionText && (
        <div className="bg-card/95 border-b border-border px-4 py-2 max-h-24 overflow-y-auto">
          <p className="text-sm font-medium text-foreground leading-snug">
            <MathText>{questionText}</MathText>
          </p>
        </div>
      )}

      {/* Canvas */}
      <div ref={containerRef} className="flex-1 overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          className={cn(
            "w-full h-full",
            isEraser ? "cursor-cell" : "cursor-crosshair"
          )}
          style={{ touchAction: 'none' }}
        />
      </div>
    </div>
  );
}
