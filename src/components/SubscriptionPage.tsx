import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PaywallDialog } from '@/components/PaywallDialog';
import {
  Crown,
  Calendar,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowLeft,
  Zap,
  Shield,
  Heart,
  Bot
} from 'lucide-react';

interface SubscriptionPageProps {
  onBack: () => void;
}

export function SubscriptionPage({ onBack }: SubscriptionPageProps) {
  const { user } = useAuth();
  const { data: subscription, isLoading } = useSubscription();
  const [showPaywall, setShowPaywall] = useState(false);

  const isPremium = subscription?.plan_type !== 'free';
  const planName = subscription?.plan_type === 'premium' ? 'Premium Yıllık' :
                   subscription?.plan_type === 'plus' ? 'Plus Aylık' : 'Ücretsiz';

  const features = [
    { icon: Heart, label: 'Sınırsız Kalp', free: false, premium: true },
    { icon: Shield, label: 'Reklamsız Deneyim', free: false, premium: true },
    { icon: Bot, label: 'AI Koç Tam Erişim', free: false, premium: true },
    { icon: Sparkles, label: 'Özel Rozetler', free: false, premium: true },
    { icon: Zap, label: 'Tüm Konular Açık', free: false, premium: true },
    { icon: Crown, label: 'Premium Destek', free: false, premium: true },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border p-4 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Abonelikler</h1>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-500">
              BETA
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Current Plan Card */}
        <Card className={isPremium ? "border-2 border-warning bg-gradient-to-br from-warning/5 to-warning/10" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isPremium ? 'bg-warning' : 'bg-secondary'}`}>
                  <Crown className={`w-6 h-6 ${isPremium ? 'text-white' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <CardTitle className="text-2xl">{planName}</CardTitle>
                  <CardDescription>
                    {isPremium ? 'Premium özelliklerinin keyfini çıkar!' : 'Ücretsiz plan kullanıyorsun'}
                  </CardDescription>
                </div>
              </div>
              {isPremium && (
                <Badge className="bg-warning text-black font-bold">
                  AKTİF
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Subscription Details */}
            {isPremium && subscription?.expires_at && (
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <Calendar className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Yenilenme Tarihi</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(subscription.expires_at).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}

            {/* Features List */}
            <div className="space-y-2">
              <p className="font-semibold text-sm">Özellikler:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {features.map((feature, i) => {
                  const hasFeature = isPremium ? feature.premium : feature.free;
                  return (
                    <div key={i} className={`flex items-center gap-2 p-2 rounded-lg ${hasFeature ? 'bg-green-500/10' : 'bg-secondary/30'}`}>
                      {hasFeature ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                      )}
                      <feature.icon className={`w-4 h-4 ${hasFeature ? 'text-primary' : 'text-muted-foreground'} shrink-0`} />
                      <span className={`text-sm ${hasFeature ? 'font-medium' : 'text-muted-foreground'}`}>
                        {feature.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA Button */}
            {!isPremium && (
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold"
                onClick={() => setShowPaywall(true)}
              >
                <Crown className="w-5 h-5 mr-2" />
                Premium'a Geç
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Pricing Plans */}
        {!isPremium && (
          <div>
            <h2 className="text-xl font-bold mb-4">Premium Planlar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Monthly Plan */}
              <Card className="hover:border-primary transition-all cursor-pointer" onClick={() => setShowPaywall(true)}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg">Aylık Plan</CardTitle>
                    <Badge variant="outline">Plus</Badge>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">₺29.99</span>
                    <span className="text-muted-foreground">/ay</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Seç
                  </Button>
                </CardContent>
              </Card>

              {/* Yearly Plan */}
              <Card className="border-2 border-warning hover:border-warning/80 transition-all cursor-pointer relative" onClick={() => setShowPaywall(true)}>
                <Badge className="absolute -top-3 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold">
                  %30 İndirim
                </Badge>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg">Yıllık Plan</CardTitle>
                    <Badge className="bg-warning text-black">Premium</Badge>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">₺249.99</span>
                    <span className="text-muted-foreground">/yıl</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Aylık sadece ₺20.83
                  </p>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-warning hover:bg-warning/90 text-black font-bold">
                    En İyi Fiyat!
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* FAQ or Info Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sık Sorulan Sorular</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold text-sm mb-1">Aboneliğimi iptal edebilir miyim?</p>
              <p className="text-sm text-muted-foreground">
                Evet, istediğin zaman iptal edebilirsin. İptal ettiğinde mevcut dönem sonuna kadar premium özelliklerini kullanmaya devam edersin.
              </p>
            </div>
            <div>
              <p className="font-semibold text-sm mb-1">Ödeme güvenli mi?</p>
              <p className="text-sm text-muted-foreground">
                Tüm ödemeler 256-bit SSL şifreleme ile güvence altındadır. Kart bilgileriniz güvenle saklanır.
              </p>
            </div>
            <div>
              <p className="font-semibold text-sm mb-1">Premium özellikler neler?</p>
              <p className="text-sm text-muted-foreground">
                Sınırsız kalp, reklamsız deneyim, AI koç, tüm konulara erişim ve daha fazlası!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Beta Notice */}
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="bg-blue-500 text-white">BETA</Badge>
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">Beta Sürüm</p>
                <p className="text-xs text-muted-foreground">
                  Abonelik sistemi beta aşamasındadır. Test modunda ödeme yapmadan premium özellikleri deneyebilirsiniz.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <PaywallDialog open={showPaywall} onClose={() => setShowPaywall(false)} />
    </div>
  );
}
