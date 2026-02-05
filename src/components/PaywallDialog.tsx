import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Sparkles, Loader2, Zap } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { getWhatsAppPaymentUrl } from '@/config/payment';

interface PaywallDialogProps {
  open: boolean;
  onClose: () => void;
}

export function PaywallDialog({ open, onClose }: PaywallDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  const handleSubscribe = async () => {
    setIsLoading(true);

    try {
      // WhatsApp üzerinden ödeme
      const planName = selectedPlan === 'monthly' ? 'Aylık Premium' : 'Yıllık Premium';
      const price = selectedPlan === 'monthly' ? '₺29.99' : '₺249.99';
      const whatsappUrl = getWhatsAppPaymentUrl(planName, price);

      toast.success('WhatsApp üzerinden ödeme için yönlendiriliyorsunuz...');

      // WhatsApp'a yönlendir
      window.open(whatsappUrl, '_blank');

      onClose();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const plans = [
    {
      id: 'monthly',
      name: 'Aylık Premium',
      price: '29.99',
      duration: 'Ay',
      badge: 'Popüler',
      icon: Zap,
      color: 'bg-blue-500',
    },
    {
      id: 'yearly',
      name: 'Yıllık Premium',
      price: '249.99',
      duration: 'Yıl',
      badge: '%30 İndirim',
      icon: Crown,
      color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      savings: 'Yılda 109.89 TL tasarruf!',
    },
  ];

  const features = [
    '🔓 Tüm konular anında açılır',
    '❤️ Sınırsız can - hiç beklemeden çalış',
    '🚫 Reklamsız deneyim',
    '🤖 Yapay zeka özel ders asistanı',
    '📊 Detaylı performans analizi',
    '🏆 Özel rozetler ve başarılar',
    '📱 Tüm cihazlardan erişim',
    '⚡ Yeni özellikler öncelikli',
  ];

  const selectedPlanData = plans.find(p => p.id === selectedPlan)!;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            Premium'a Geç
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Plan Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isSelected = selectedPlan === plan.id;

              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id as 'monthly' | 'yearly')}
                  className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
                    isSelected
                      ? 'border-primary bg-primary/5 scale-105'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {plan.badge && (
                    <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold">
                      {plan.badge}
                    </Badge>
                  )}

                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl ${plan.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {plan.price} TL / {plan.duration}
                      </p>
                    </div>
                  </div>

                  {plan.savings && (
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400 mt-2">
                      💰 {plan.savings}
                    </p>
                  )}

                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Features */}
          <div className="bg-secondary/50 p-6 rounded-xl">
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              Premium Özellikleri
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold text-lg py-6"
              disabled={isLoading}
              onClick={handleSubscribe}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  İşleniyor...
                </>
              ) : (
                <>
                  <Crown className="w-5 h-5 mr-2" />
                  WhatsApp'tan Satın Al - {selectedPlanData.price} TL
                </>
              )}
            </Button>
          </div>

          {/* Terms */}
          <p className="text-xs text-muted-foreground text-center">
            Abonelik otomatik olarak yenilenir. İstediğin zaman iptal edebilirsin.
            <br />
            Kullanım Koşulları ve Gizlilik Politikası geçerlidir.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
