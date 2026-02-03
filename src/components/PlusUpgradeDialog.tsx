import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpgradeSubscription } from '@/hooks/useSubscription';
import { toast } from 'sonner';
import { Crown, Heart, Bot, Award, Shield, Loader2, Check, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  // Mock card details (for demo)
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handleUpgrade = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Upgrade subscription
      await upgradeSubscription.mutateAsync(selectedPlan);
      
      toast.success('🎉 Plus üyeliğiniz aktif edildi!');
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
            {/* Payment Form */}
            <div className="space-y-4 my-4">
              <div className="p-3 bg-secondary/50 rounded-lg flex items-center justify-between">
                <span className="font-medium">
                  {selectedPlan === 'plus' ? 'Plus Aylık' : 'Premium Yıllık'}
                </span>
                <span className="font-bold text-primary">
                  {selectedPlan === 'plus' ? '₺49.99' : '₺359.99'}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="cardNumber">Kart Numarası</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    maxLength={19}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="expiry">Son Kullanma</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      maxLength={4}
                      type="password"
                    />
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                🔒 Ödeme bilgileriniz 256-bit SSL ile şifrelenir
              </p>
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
                disabled={isProcessing || !cardNumber || !expiry || !cvv}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    İşleniyor...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Ödemeyi Tamamla
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
