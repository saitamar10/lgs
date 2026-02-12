import { useState } from 'react';
import { getPayTRIframeUrl } from '@/config/payment';
import { Button } from '@/components/ui/button';
import { X, Loader2 } from 'lucide-react';

interface PayTRPaymentDialogProps {
  token: string;
  onClose: () => void;
}

export function PayTRPaymentDialog({ token, onClose }: PayTRPaymentDialogProps) {
  const [loading, setLoading] = useState(true);
  const iframeUrl = getPayTRIframeUrl(token);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-lg relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold">Guvenli Odeme</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* iFrame */}
        <div className="relative" style={{ minHeight: '460px' }}>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background">
              <div className="text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                <p className="text-sm text-muted-foreground">Odeme formu yukleniyor...</p>
              </div>
            </div>
          )}
          <iframe
            src={iframeUrl}
            id="paytriframe"
            frameBorder="0"
            scrolling="yes"
            style={{ width: '100%', height: '460px' }}
            onLoad={() => setLoading(false)}
          />
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            256-bit SSL ile korunan guvenli odeme
          </p>
        </div>
      </div>
    </div>
  );
}
