import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUpgradeSubscription } from '@/hooks/useSubscription';
import { toast } from 'sonner';
import { Crown, Heart, Bot, Award, Shield, Loader2, Check, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getWhatsAppPaymentUrl } from '@/config/payment';

interface PlusUpgradeDialogProps {
  open: boolean;
  onClose: () => void;
}

const benefits = [
  { icon: Heart, label: 'Sınırsız Kalp', description: 'Hiç bitmez, sürekli çalış!' },
  { icon: Bot, label: 'AI Koç Tam Erişim', description: 'Sınırsız soru sor' },
  { icon: Award, label: 'Özel Rozetler', description: 'Plus üyelere özel rozetler' },
  { icon: Shield, label: 'Reklamsız Deneyim', description: 'Hiç reklam görmeden çalış' },
];

export function PlusUpgradeDialog({ open, onClose }: PlusUpgradeDialogProps) {
  const [selectedPlan, setSelectedPlan] = useState<'plus' | 'premium'>('plus');
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const upgradeSubscription = useUpgradeSubscription();


  const handleUpgrade = async () => {
    setIsProcessing(true);

    try {
      // WhatsApp üzerinden ödeme (sadece web'de)
      const planName = selectedPlan === 'plus' ? 'Plus Aylık' : 'Premium Yıllık';
      const price = selectedPlan === 'plus' ? '₺49.99' : '₺359.99';
      const whatsappUrl = getWhatsAppPaymentUrl(planName, price);

      toast.success('WhatsApp üzerinden ödeme için yönlendiriliyorsunuz...');

      // WhatsApp'a yönlendir
      window.open(whatsappUrl, '_blank');

      onClose();
      setShowPayment(false);
    } catch (error) {
      toast.error('Ödeme işlemi başarısız oldu');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setShowPayment(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-warning" />
            Plus Üyeliğe Katıl
          </DialogTitle>
          <DialogDescription>
            LGS hazırlığını bir üst seviyeye taşı!
          </DialogDescription>
        </DialogHeader>

        {!showPayment ? (
          <>
            {/* Benefits */}
            <div className="grid grid-cols-2 gap-3 my-4">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-secondary/50 rounded-lg">
                  <benefit.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">{benefit.label}</p>
                    <p className="text-xs text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Plan Selection */}
            <div className="space-y-3">
              <Card 
                className={cn(
                  "cursor-pointer transition-all",
                  selectedPlan === 'plus' && "border-primary ring-2 ring-primary/20"
                )}
                onClick={() => setSelectedPlan('plus')}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold">Plus Aylık</p>
                    <p className="text-sm text-muted-foreground">Tüm Plus özellikleri</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">₺49.99</p>
                    <p className="text-xs text-muted-foreground">/ay</p>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={cn(
                  "cursor-pointer transition-all",
                  selectedPlan === 'premium' && "border-primary ring-2 ring-primary/20"
                )}
                onClick={() => setSelectedPlan('premium')}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold">Premium Yıllık</p>
                    <p className="text-sm text-muted-foreground">%40 tasarruf!</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">₺359.99</p>
                    <p className="text-xs text-muted-foreground">/yıl (₺30/ay)</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button 
              className="w-full mt-4" 
              size="lg"
              onClick={() => setShowPayment(true)}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Ödemeye Geç
            </Button>
          </>
        ) : (
          <>
            {/* Payment Confirmation */}
            <div className="space-y-4 my-4">
              <div className="p-3 bg-secondary/50 rounded-lg flex items-center justify-between">
                <span className="font-medium">
                  {selectedPlan === 'plus' ? 'Plus Aylık' : 'Premium Yıllık'}
                </span>
                <span className="font-bold text-primary">
                  {selectedPlan === 'plus' ? '₺49.99' : '₺359.99'}
                </span>
              </div>

              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  📱 <strong>WhatsApp Ödeme</strong>
                  <br /><br />
                  Onayladıktan sonra WhatsApp üzerinden bizimle iletişime geçeceksiniz.
                  Ödeme bilgilerini size ileteceğiz.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowPayment(false)}
              >
                Geri
              </Button>
              <Button
                className="flex-1"
                onClick={handleUpgrade}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    İşleniyor...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    WhatsApp'a Devam Et
                  </>
                )}
              </Button>
            </div>
          </>
        )}

        <p className="text-xs text-center text-muted-foreground mt-2">
          İstediğin zaman iptal edebilirsin. Gizlilik politikamızı okuyun.
        </p>
      </DialogContent>
    </Dialog>
  );
}
