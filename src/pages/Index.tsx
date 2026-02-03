import { useAuth } from '@/lib/auth';
import { AuthForms } from '@/components/AuthForms';
import { Dashboard } from '@/pages/Dashboard';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in">
              <span className="text-4xl">🎓</span>
            </div>
          </div>
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-primary/10 to-background">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Left - Info */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
                  <span className="text-2xl">🎓</span>
                  <span className="font-semibold text-primary">LGS Hazırlık</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Oyun gibi öğren,<br />
                  <span className="text-primary">sınavda başar!</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto lg:mx-0">
                  Duolingo tarzı eğlenceli öğrenme deneyimi ile LGS'ye hazırlan. 
                  Tüm 8. sınıf müfredatı, kişiselleştirilmiş çalışma planı ve 
                  arkadaşlarınla yarışma!
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                  <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-xl shadow-sm">
                    <span className="text-success text-lg">✓</span>
                    <span className="text-sm font-medium">63+ Konu</span>
                  </div>
                  <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-xl shadow-sm">
                    <span className="text-warning text-lg">🎯</span>
                    <span className="text-sm font-medium">Kişisel Plan</span>
                  </div>
                  <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-xl shadow-sm">
                    <span className="text-info text-lg">🏆</span>
                    <span className="text-sm font-medium">Liderlik Tablosu</span>
                  </div>
                </div>
              </div>

              {/* Right - Auth Form */}
              <div className="w-full max-w-md">
                <AuthForms />
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center mb-12">Nasıl Çalışır?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📅</span>
              </div>
              <h3 className="font-bold mb-2">1. Sınav Tarihini Gir</h3>
              <p className="text-sm text-muted-foreground">
                LGS tarihini gir, sana özel çalışma planı oluşturulsun.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎮</span>
              </div>
              <h3 className="font-bold mb-2">2. Oyun Gibi Öğren</h3>
              <p className="text-sm text-muted-foreground">
                Her doğru cevap XP kazandırır. Yanlışlar tekrar sorulur.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-warning/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏆</span>
              </div>
              <h3 className="font-bold mb-2">3. Yarış ve Başar</h3>
              <p className="text-sm text-muted-foreground">
                Liderlik tablosunda arkadaşlarınla yarış, motivasyonunu koru!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <Dashboard />;
};

export default Index;
