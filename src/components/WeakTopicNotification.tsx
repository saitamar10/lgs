import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, BookOpen, ChevronRight } from 'lucide-react';

interface WeakTopicNotificationProps {
  open: boolean;
  onClose: () => void;
  unitName: string;
  subjectName: string;
  onGoToLesson: () => void;
}

export function WeakTopicNotification({ 
  open, 
  onClose, 
  unitName, 
  subjectName,
  onGoToLesson 
}: WeakTopicNotificationProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-warning">
            <AlertTriangle className="w-5 h-5" />
            Zayıf Konu Tespit Edildi
          </DialogTitle>
          <DialogDescription>
            Bu konuda 2 kez hata yaptın
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="font-semibold">{unitName}</p>
                <p className="text-sm text-muted-foreground">{subjectName}</p>
                <p className="text-xs text-warning mt-1">
                  Zayıf konular listesine eklendi
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center mb-4">
            Endişelenme! Konu anlatımı ile bu konuyu tekrar öğrenebilirsin.
          </p>

          <Button 
            className="w-full" 
            size="lg"
            onClick={onGoToLesson}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Konu Anlatımı ile Toparlayalım
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>

          <Button 
            variant="ghost" 
            className="w-full mt-2"
            onClick={onClose}
          >
            Sonra Çalışırım
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
