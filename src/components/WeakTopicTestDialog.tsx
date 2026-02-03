import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Target, Award } from 'lucide-react';
import { WeakTopic } from '@/hooks/useWeakTopics';

interface WeakTopicTestDialogProps {
  open: boolean;
  onClose: () => void;
  weakTopic: WeakTopic | null;
  onStartTest: (unitId: string, unitName: string) => void;
}

export function WeakTopicTestDialog({
  open,
  onClose,
  weakTopic,
  onStartTest
}: WeakTopicTestDialogProps) {
  if (!weakTopic) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Zayıf Konu Testi
          </DialogTitle>
          <DialogDescription>
            Bu konu sınavlarda zorlandığın bir konu. Özel test ile pekiştirelim!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Topic Info */}
          <div className="bg-secondary/50 p-4 rounded-lg">
            <p className="font-bold text-lg mb-1">{weakTopic.unit_name}</p>
            <p className="text-sm text-muted-foreground">{weakTopic.subject_name}</p>
            <div className="flex items-center gap-2 mt-3">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <span className="text-sm">
                {weakTopic.mistake_count} kez yanlış yapıldı
              </span>
            </div>
          </div>

          {/* Test Info */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Özel Test Modu</p>
                <p className="text-xs text-muted-foreground">
                  Bu konuya özel 10 soruluk bir test hazırlandı
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-success mt-0.5" />
              <div>
                <p className="font-medium text-sm">Hedef: %80+ Başarı</p>
                <p className="text-xs text-muted-foreground">
                  3 kez üst üste başarılı olursan, zayıf konu listesinden çıkacak!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            İptal
          </Button>
          <Button
            onClick={() => {
              onStartTest(weakTopic.unit_id, weakTopic.unit_name);
              onClose();
            }}
            className="flex-1 bg-warning hover:bg-warning/90"
          >
            Teste Başla
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
