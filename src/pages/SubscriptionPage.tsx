import { useState } from 'react';
import { useSubscription, useUpgradeSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Crown, Check, X, Zap, Heart, Users, Bot, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getWhatsAppPaymentUrl } from '@/config/payment';

interface SubscriptionPageProps {
  onBack: () => void;
}

export function SubscriptionPage({ onBack }: SubscriptionPageProps) {
  const { data: subscription } = useSubscription();
  const upgradeMutation = useUpgradeSubscription();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [planToUpgrade, setPlanToUpgrade] = useState<{ id: string; name: string; planType: 'plus' | 'premium' } | null>(null);

  const isPremium = subscription?.plan_type !== 'free';

  const plans = [
    {
      id: 'free',
      name: 'Ücretsiz',
      price: '₺0',
      period: 'süresiz',
      planType: 'free' as const,
      features: [
        { text: '5 can ile öğren', included: true },
        { text: 'Tüm derslere erişim', included: true },
        { text: 'Temel özellikler', included: true },
        { text: 'Sınırsız can', included: false },
        { text: 'AI Koç', included: false },
        { text: 'Reklamsız deneyim', included: false },
        { text: 'Öncelikli destek', included: false },
      ],
      current: !isPremium || subscription?.plan_type === 'free',
    },
    {
      id: 'monthly',
      name: 'Plus Aylık',
      price: '₺49',
      period: 'ay',
      planType: 'plus' as const,
      features: [
        { text: 'Sınırsız can', included: true },
        { text: 'Tüm derslere erişim', included: true },
        { text: 'AI Koç', included: true },
        { text: 'Reklamsız deneyim', included: true },
        { text: 'Öncelikli destek', included: true },
        { text: 'Özel rozetler', included: true },
        { text: 'Detaylı istatistikler', included: true },
      ],
      badge: 'Popüler',
      current: isPremium && subscription?.plan_type === 'plus' && subscription?.expires_at &&
        (new Date(subscription.expires_at).getTime() - new Date(subscription.started_at || new Date()).getTime()) < 40 * 24 * 60 * 60 * 1000, // ~1 month
    },
    {
      id: 'yearly',
      name: 'Plus Yıllık',
      price: '₺399',
      period: 'yıl',
      planType: 'premium' as const,
      originalPrice: '₺588',
      discount: '%32 İndirim',
      features: [
        { text: 'Sınırsız can', included: true },
        { text: 'Tüm derslere erişim', included: true },
        { text: 'AI Koç', included: true },
        { text: 'Reklamsız deneyim', included: true },
        { text: 'Öncelikli destek', included: true },
        { text: 'Özel rozetler', included: true },
        { text: 'Detaylı istatistikler', included: true },
      ],
      badge: 'En İyi Değer',
      current: isPremium && subscription?.plan_type === 'premium',
    },
  ];

  const handleSubscribe = async (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    if (planId === 'free') {
      toast.info('Zaten ücretsiz plandaysan!');
      return;
    }

    // Ödeme onay dialogunu aç
    setPlanToUpgrade({
      id: plan.id,
      name: plan.name,
      planType: plan.planType
    });
    setShowPaymentDialog(true);
  };

  const handleConfirmPayment = async () => {
    if (!planToUpgrade) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // WhatsApp üzerinden ödeme (sadece web'de)
      const planName = planToUpgrade.name;
      const price = planToUpgrade.id === 'monthly' ? '₺49' : '₺399';
      const whatsappUrl = getWhatsAppPaymentUrl(planName, price);

      toast.success('WhatsApp üzerinden ödeme için yönlendiriliyorsunuz...');

      // WhatsApp'a yönlendir
      window.open(whatsappUrl, '_blank');

      setShowPaymentDialog(false);
      setPlanToUpgrade(null);

    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Ödeme işlemi başlatılamadı. Lütfen tekrar deneyin.');
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Gerçek iptal işlemi - cancelled_at kaydı
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          cancelled_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('plan_type', subscription?.plan_type || '');

      if (error) throw error;

      const expiryDate = subscription?.expires_at
        ? new Date(subscription.expires_at).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : '';

      toast.success(
        `Aboneliğiniz iptal edildi. ${expiryDate} tarihine kadar Plus özelliklerinden yararlanmaya devam edebilirsiniz.`,
        { duration: 5000 }
      );

      setShowCancelDialog(false);

      // Refresh subscription data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Cancel error:', error);
      toast.error('Abonelik iptal edilemedi. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-warning" />
              <h1 className="text-2xl font-bold">Abonelik & Ödeme</h1>
              {isPremium && (
                <Badge variant="secondary" className="bg-warning/20 text-warning">
                  <Crown className="w-3 h-3 mr-1" />
                  Plus Üye
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 lg:p-8">
        {/* Current Plan Status */}
        {isPremium && subscription && (
          <Card className="mb-8 bg-gradient-to-br from-warning/10 to-primary/10 border-warning/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-warning" />
                Aktif Aboneliğiniz
              </CardTitle>
              <CardDescription>
                Plan: {subscription.plan_type === 'plus' ? 'Plus Aylık' : subscription.plan_type === 'premium' ? 'Plus Yıllık' : 'Ücretsiz'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  {subscription.started_at && (
                    <p className="text-sm text-muted-foreground">
                      Başlangıç: {new Date(subscription.started_at).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                  {subscription.expires_at && (
                    <p className="text-sm text-muted-foreground">
                      Bitiş: {new Date(subscription.expires_at).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                  {!subscription.expires_at && (
                    <p className="text-sm text-muted-foreground">
                      Süresiz (Ücretsiz Plan)
                    </p>
                  )}
                </div>
                {subscription.plan_type !== 'free' && (
                  <Button variant="outline" size="sm" onClick={() => setShowCancelDialog(true)}>
                    Aboneliği İptal Et
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Premium Benefits */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Plus ile Neler Kazanırsın?</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Heart className="w-12 h-12 mx-auto mb-3 text-destructive" />
                <h3 className="font-semibold mb-2">Sınırsız Can</h3>
                <p className="text-sm text-muted-foreground">
                  Hiç bekleme, istediğin kadar öğren
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Bot className="w-12 h-12 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">AI Koç</h3>
                <p className="text-sm text-muted-foreground">
                  Kişisel yapay zeka koçunla öğren
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Zap className="w-12 h-12 mx-auto mb-3 text-warning" />
                <h3 className="font-semibold mb-2">Reklamsız</h3>
                <p className="text-sm text-muted-foreground">
                  Kesintisiz öğrenme deneyimi
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="w-12 h-12 mx-auto mb-3 text-success" />
                <h3 className="font-semibold mb-2">Özel İçerik</h3>
                <p className="text-sm text-muted-foreground">
                  Plus üyelere özel dersler
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Planını Seç</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={cn(
                  'relative',
                  plan.current && 'border-primary shadow-lg',
                  plan.badge && plan.id !== 'free' && 'border-warning'
                )}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-warning text-warning-foreground">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                {plan.current && (
                  <div className="absolute -top-3 right-4">
                    <Badge variant="default">Aktif Plan</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    {plan.originalPrice && (
                      <div className="text-sm text-muted-foreground line-through">
                        {plan.originalPrice}
                      </div>
                    )}
                    <div className="text-4xl font-bold">{plan.price}</div>
                    <div className="text-sm text-muted-foreground">/{plan.period}</div>
                    {plan.discount && (
                      <Badge variant="outline" className="mt-2 text-success border-success">
                        {plan.discount}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                        )}
                        <span
                          className={cn(
                            'text-sm',
                            !feature.included && 'text-muted-foreground'
                          )}
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.current ? 'outline' : 'default'}
                    disabled={plan.current || upgradeMutation.isPending}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {upgradeMutation.isPending ? 'Güncelleniyor...' : plan.current ? 'Mevcut Plan' : plan.id === 'free' ? 'Ücretsiz Plan' : 'Satın Al'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Sıkça Sorulan Sorular</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-1">Aboneliği iptal edebilir miyim?</h4>
              <p className="text-sm text-muted-foreground">
                Evet, istediğin zaman aboneliğini iptal edebilirsin. İptal sonrası mevcut dönemin sonuna kadar Plus özelliklerini kullanmaya devam edebilirsin.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Ödeme güvenli mi?</h4>
              <p className="text-sm text-muted-foreground">
                Tüm ödemeler SSL şifrelemesi ile korunur ve güvenli ödeme sağlayıcıları kullanılır.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Para iadesi var mı?</h4>
              <p className="text-sm text-muted-foreground">
                İlk 7 gün içinde memnun kalmazsan %100 para iadesi garantisi sunuyoruz.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cancel Subscription Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Aboneliği İptal Et</AlertDialogTitle>
            <AlertDialogDescription>
              Aboneliğinizi iptal etmek istediğinizden emin misiniz?
              <br /><br />
              <strong>Önemli:</strong> Aboneliğinizi iptal etseniz bile, kalan sürenizin sonuna kadar ({subscription?.expires_at && new Date(subscription.expires_at).toLocaleDateString('tr-TR')}) tüm Plus özelliklerinden yararlanmaya devam edeceksiniz.
              <br /><br />
              Süre bitiminde otomatik olarak:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Ücretsiz plana geçeceksiniz</li>
                <li>5 can sistemi aktif olacak</li>
                <li>AI Koç erişimi kapanacak</li>
                <li>Reklamlar gösterilecek</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Vazgeç</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelSubscription} className="bg-destructive hover:bg-destructive/90">
              Evet, İptal Et
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Payment Confirmation Dialog */}
      <AlertDialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ödeme Onayı</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{planToUpgrade?.name}</strong> planını satın almak istediğinizden emin misiniz?
              <br /><br />
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Plan:</span>
                  <strong>{planToUpgrade?.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Fiyat:</span>
                  <strong>{planToUpgrade?.id === 'monthly' ? '₺49/ay' : '₺399/yıl'}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Süre:</span>
                  <strong>{planToUpgrade?.id === 'monthly' ? '1 Ay' : '1 Yıl'}</strong>
                </div>
              </div>
              <br />
              <div className="text-sm text-muted-foreground">
                📱 <strong>Ödeme Yöntemi:</strong> WhatsApp üzerinden ödeme yapabilirsiniz.
                <br />
                Onayladıktan sonra WhatsApp üzerinden bizimle iletişime geçeceksiniz.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPlanToUpgrade(null)}>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmPayment}
              disabled={upgradeMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              WhatsApp'tan Devam Et
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
