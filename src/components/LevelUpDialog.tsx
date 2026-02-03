import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy, Zap, Star } from 'lucide-react';
import { Mascot } from './Mascot';

interface LevelUpDialogProps {
  open: boolean;
  onClose: () => void;
  newLevel: number;
}

export function LevelUpDialog({ open, onClose, newLevel }: LevelUpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="text-center space-y-6 py-4">
          {/* Celebration Animation */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-warning/20 rounded-full animate-ping" />
            </div>
            <Mascot size="xl" mood="celebrating" animate />
          </div>

          {/* Level Badge */}
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-gradient-to-br from-primary via-accent to-warning rounded-full flex items-center justify-center shadow-2xl animate-bounce-in">
              <div className="text-center">
                <Trophy className="w-12 h-12 text-white mx-auto mb-1" />
                <span className="text-4xl font-bold text-white">{newLevel}</span>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-warning rounded-full flex items-center justify-center animate-spin-slow">
              <Star className="w-5 h-5 text-warning-foreground fill-current" />
            </div>
          </div>

          {/* Title */}
          <div>
            <h2 className="text-3xl font-bold mb-2">Seviye Atladın! 🎉</h2>
            <p className="text-lg text-muted-foreground">
              Artık <span className="text-primary font-bold">Seviye {newLevel}</span> oldun!
            </p>
          </div>

          {/* Rewards */}
          <div className="bg-secondary/50 rounded-xl p-4 space-y-2">
            <p className="text-sm font-semibold mb-3">Ödüller:</p>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-primary" />
              <span>+50 Bonus XP</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="w-4 h-4 text-warning" />
              <span>Yeni rozet kazandın</span>
            </div>
          </div>

          {/* Continue Button */}
          <Button onClick={onClose} size="lg" className="w-full">
            Harika! Devam Et
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
