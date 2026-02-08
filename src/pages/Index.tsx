import { useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { AuthForms } from '@/components/AuthForms';
import { Dashboard } from '@/pages/Dashboard';
import { LandingNavbar } from '@/components/LandingNavbar';
import { LandingFooter } from '@/components/LandingFooter';
import { Loader2, BookOpen, Brain, Trophy, Users, Zap, Shield, Star, Target, TrendingUp, Sparkles } from 'lucide-react';
import { Mascot } from '@/components/Mascot';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { user, loading } = useAuth();
  const authRef = useRef<HTMLDivElement>(null);

  const scrollToAuth = () => {
    authRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Mascot size="lg" mood="happy" animate />
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mt-4 mb-2" />
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <LandingNavbar onScrollToAuth={scrollToAuth} />

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-primary/4" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              {/* Left */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-6">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">AI Destekli LGSÇalış</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-tight tracking-tight">
                  Oyun gibi öğren,
                  <br />
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">sınavda başar!</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Yapay zeka destekli kişiselleştirilmiş öğrenme deneyimi ile LGS'ye hazırlan.
                  Tüm 8. sınıf müfredatı, interaktif dersler ve arkadaşlarınla yarışma!
                </p>

                {/* Stats */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                  <div className="flex items-center gap-2 bg-card border border-border px-4 py-2.5 rounded-xl shadow-sm">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold">63+ Konu</span>
                  </div>
                  <div className="flex items-center gap-2 bg-card border border-border px-4 py-2.5 rounded-xl shadow-sm">
                    <Brain className="w-4 h-4 text-violet-500" />
                    <span className="text-sm font-semibold">AI Soru Üretimi</span>
                  </div>
                  <div className="flex items-center gap-2 bg-card border border-border px-4 py-2.5 rounded-xl shadow-sm">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-semibold">Liderlik Tablosu</span>
                  </div>
                  <div className="flex items-center gap-2 bg-card border border-border px-4 py-2.5 rounded-xl shadow-sm">
                    <Users className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-semibold">Arkadaş Düellosu</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
                  <Button onClick={scrollToAuth} size="lg" className="w-full sm:w-auto px-8 h-12 font-bold text-base">
                    Ücretsiz Başla
                  </Button>
                  <p className="text-xs text-muted-foreground">Kredi kartı gerekmez</p>
                </div>
              </div>

              {/* Right - Auth */}
              <div className="w-full max-w-md" ref={authRef}>
                <AuthForms />
              </div>
            </div>
          </div>
        </section>

        {/* Nasıl Çalışır */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Nasıl Çalışır?</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                3 adımda LGS hazırlığına başla. Her gün biraz çalış, büyük fark yarat.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card border border-border rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <div className="inline-flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold mb-4">1</div>
                <h3 className="font-bold text-lg mb-3">Sınav Tarihini Gir</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  LGS tarihini belirle, yapay zeka sana özel günlük çalışma planı oluştursun. Hangi konuyu ne zaman çalışacağını biz planlayalım.
                </p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Zap className="w-8 h-8 text-emerald-500" />
                </div>
                <div className="inline-flex items-center justify-center w-8 h-8 bg-emerald-500 text-white rounded-full text-sm font-bold mb-4">2</div>
                <h3 className="font-bold text-lg mb-3">Oyun Gibi Öğren</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Konu anlatımı, interaktif dersler ve AI tarafından üretilen sorularla pratik yap. Her doğru cevap XP kazandırır, seviye atla!
                </p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <TrendingUp className="w-8 h-8 text-amber-500" />
                </div>
                <div className="inline-flex items-center justify-center w-8 h-8 bg-amber-500 text-white rounded-full text-sm font-bold mb-4">3</div>
                <h3 className="font-bold text-lg mb-3">Yarış ve Başar</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Arkadaşlarınla düello yap, liderlik tablosunda yüksel! Streak'ini koru, rozetler kazan ve motivasyonunu hiç kaybetme.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Özellikler Grid */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Neden LGSÇalış?</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Geleneksel test kitaplarının ötesinde, modern ve etkili öğrenme araçları.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Brain className="w-6 h-6" />,
                  color: "text-violet-500 bg-violet-500/10",
                  title: "AI Soru Üretimi",
                  desc: "Yapay zeka senin seviyene uygun sorular üretir. Her quiz'de farklı ve güncel sorularla karşılaş."
                },
                {
                  icon: <BookOpen className="w-6 h-6" />,
                  color: "text-blue-500 bg-blue-500/10",
                  title: "İnteraktif Konu Anlatımı",
                  desc: "AI destekli konu anlatımları, görsel slaytlar ve İnkılap Tarihi için animasyonlu doodle anlatımlar."
                },
                {
                  icon: <Target className="w-6 h-6" />,
                  color: "text-primary bg-primary/10",
                  title: "Kişisel Çalışma Planı",
                  desc: "Sınav tarihine göre otomatik plan. Günlük hedefler, haftalık tekrar ve zayıf konulara odaklanma."
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  color: "text-emerald-500 bg-emerald-500/10",
                  title: "Arkadaş Düellosu",
                  desc: "Arkadaşlarına meydan oku! Aynı konuda yarışın, kim daha iyi bilecek görelim."
                },
                {
                  icon: <Star className="w-6 h-6" />,
                  color: "text-amber-500 bg-amber-500/10",
                  title: "XP ve Seviye Sistemi",
                  desc: "Her doğru cevap XP kazandırır. Seviye atla, rozetler kazan, streak'ini koru."
                },
                {
                  icon: <Shield className="w-6 h-6" />,
                  color: "text-red-500 bg-red-500/10",
                  title: "MEB Müfredatına Uygun",
                  desc: "Tüm içerik 8. sınıf MEB müfredatına uygun. Matematik, Fen, Türkçe, Tarih, İngilizce ve Din Kültürü."
                },
              ].map((feature, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-base mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dersler */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Tüm LGS Dersleri</h2>
              <p className="text-muted-foreground text-lg">8. sınıf müfredatının tamamı, tek platformda.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: "Matematik", emoji: "📐", color: "from-blue-500/20 to-blue-600/10" },
                { name: "Fen Bilimleri", emoji: "🔬", color: "from-green-500/20 to-green-600/10" },
                { name: "Türkçe", emoji: "📖", color: "from-orange-500/20 to-orange-600/10" },
                { name: "İnkılap Tarihi", emoji: "🏛️", color: "from-red-500/20 to-red-600/10" },
                { name: "İngilizce", emoji: "🌍", color: "from-purple-500/20 to-purple-600/10" },
                { name: "Din Kültürü", emoji: "📿", color: "from-teal-500/20 to-teal-600/10" },
              ].map((subject, i) => (
                <div key={i} className={`bg-gradient-to-br ${subject.color} border border-border rounded-2xl p-6 text-center hover:scale-105 transition-transform cursor-default`}>
                  <div className="text-4xl mb-3">{subject.emoji}</div>
                  <h3 className="font-bold text-sm">{subject.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Hazır mısın?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Binlerce öğrenci LGSÇalış ile hedeflerine ulaşıyor. Sen de hemen başla, üstelik ücretsiz!
            </p>
            <Button onClick={scrollToAuth} size="lg" className="px-10 h-12 font-bold text-base">
              Ücretsiz Hesap Oluştur
            </Button>
          </div>
        </section>

        <LandingFooter />
      </div>
    );
  }

  return <Dashboard />;
};

export default Index;
