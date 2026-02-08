import { LandingNavbar } from '@/components/LandingNavbar';
import { LandingFooter } from '@/components/LandingFooter';
import { GraduationCap, Target, Users, Brain, Heart, Sparkles } from 'lucide-react';

export default function Hakkimizda() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LandingNavbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/8 to-background py-16 md:py-24">
          <div className="absolute top-10 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-6">
              <GraduationCap className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Hakkımızda</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-6 leading-tight">
              Her Öğrencinin Başarma Hakkı Var
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              LGSÇalış, 8. sınıf öğrencilerinin LGS sınavına eğlenceli ve etkili bir şekilde hazırlanmasını sağlayan, yapay zeka destekli modern bir eğitim platformudur.
            </p>
          </div>
        </section>

        {/* Hikaye */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Hikayemiz</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    LGSÇalış, LGS hazırlık sürecinin öğrenciler için ne kadar stresli ve monoton olabildiğini gözlemleyen bir ekip tarafından kuruldu. Geleneksel test kitapları ve soru bankalarının ötesinde, öğrencilerin gerçekten motive olacağı bir öğrenme deneyimi yaratmak istedik.
                  </p>
                  <p>
                    Duolingo'nun dil öğreniminde yarattığı devrimi, LGS hazırlığına taşıma vizyonuyla yola çıktık. Gamifikasyon, yapay zeka ve modern eğitim bilimini bir araya getirerek, öğrencilerin oyun oynar gibi çalışabileceği bir platform geliştirdik.
                  </p>
                  <p>
                    Bugün binlerce öğrenci, her gün LGSÇalış ile çalışarak hedeflerine bir adım daha yaklaşıyor. Her quiz, her doğru cevap ve her seviye atlama, onları sınav gününe daha hazır hale getiriyor.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-2xl p-6 text-center">
                  <div className="text-3xl font-extrabold text-primary mb-1">63+</div>
                  <div className="text-sm text-muted-foreground">Konu</div>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 text-center">
                  <div className="text-3xl font-extrabold text-emerald-500 mb-1">6</div>
                  <div className="text-sm text-muted-foreground">Ders</div>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 text-center">
                  <div className="text-3xl font-extrabold text-violet-500 mb-1">AI</div>
                  <div className="text-sm text-muted-foreground">Soru Üretimi</div>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 text-center">
                  <div className="text-3xl font-extrabold text-amber-500 mb-1">7/24</div>
                  <div className="text-sm text-muted-foreground">Erişim</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Değerlerimiz */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Değerlerimiz</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Her kararımızda öğrencilerimizin başarısını ve mutluluğunu ön planda tutuyoruz.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Target className="w-7 h-7" />,
                  color: "text-primary bg-primary/10",
                  title: "Erişilebilirlik",
                  desc: "Kaliteli eğitim herkesin hakkı. Ücretsiz planımız ile tüm öğrenciler temel özelliklere erişebilir. Coğrafi konum, ekonomik durum fark etmeksizin her öğrenci LGSÇalış'ı kullanabilir."
                },
                {
                  icon: <Brain className="w-7 h-7" />,
                  color: "text-violet-500 bg-violet-500/10",
                  title: "Bilimsel Yaklaşım",
                  desc: "İçeriklerimiz MEB müfredatına uygun olarak hazırlanır. Aralıklı tekrar, aktif hatırlama ve kişiselleştirilmiş öğrenme gibi bilimsel olarak kanıtlanmış yöntemleri kullanıyoruz."
                },
                {
                  icon: <Heart className="w-7 h-7" />,
                  color: "text-red-500 bg-red-500/10",
                  title: "Öğrenci Odaklılık",
                  desc: "Platformumuzu öğrencilerin geri bildirimleriyle sürekli geliştiriyoruz. Her özellik, öğrencilerin daha iyi öğrenmesi ve motivasyonunu koruması için tasarlanır."
                },
                {
                  icon: <Sparkles className="w-7 h-7" />,
                  color: "text-amber-500 bg-amber-500/10",
                  title: "Yenilikçilik",
                  desc: "Yapay zeka, gamifikasyon ve modern web teknolojilerini kullanarak sürekli yenilikçi özellikler geliştiriyoruz. Eğitim teknolojisinin sınırlarını zorluyoruz."
                },
                {
                  icon: <Users className="w-7 h-7" />,
                  color: "text-emerald-500 bg-emerald-500/10",
                  title: "Topluluk",
                  desc: "Öğrenme bireysel bir süreç olsa da, birlikte daha güçlüyüz. Arkadaş düelloları, liderlik tablosu ve sosyal özelliklerle öğrencileri bir araya getiriyoruz."
                },
                {
                  icon: <GraduationCap className="w-7 h-7" />,
                  color: "text-blue-500 bg-blue-500/10",
                  title: "Güvenilirlik",
                  desc: "Verileriniz güvende, içeriklerimiz doğru ve platformumuz kararlı. Öğrencilerin ve velilerin bize güvenle emanet ettiği sorumluluğun farkındayız."
                },
              ].map((value, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${value.color}`}>
                    {value.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Müfredat */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">MEB Müfredatına Uygun İçerik</h2>
            <div className="bg-card border border-border rounded-2xl p-8">
              <p className="text-muted-foreground leading-relaxed mb-6">
                LGSÇalış'taki tüm içerikler, Milli Eğitim Bakanlığı 8. sınıf müfredatına uygun olarak hazırlanmaktadır. Platformumuzda aşağıdaki dersler yer almaktadır:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: "Matematik", topics: "Çarpanlar ve Katlar, Üslü İfadeler, Kareköklü İfadeler, Veri Analizi, Olasılık, Cebirsel İfadeler, Denklemler, Eşitsizlikler, Üçgenler, Dönüşüm Geometrisi, Geometrik Cisimler" },
                  { name: "Fen Bilimleri", topics: "Mevsimler ve İklim, DNA ve Genetik Kod, Basınç, Madde ve Endüstri, Basit Makineler, Enerji Dönüşümleri, Elektrik Yükleri, Periyodik Sistem" },
                  { name: "Türkçe", topics: "Sözcükte Anlam, Cümlede Anlam, Paragraf, Yazım Kuralları, Noktalama İşaretleri, Fiil Çekimleri, Söz Sanatları" },
                  { name: "T.C. İnkılap Tarihi", topics: "Bir Kahraman Doğuyor, Millî Uyanış, Hazırlık Dönemi, TBMM, Kurtuluş Savaşı Cepheleri, Mudanya ve Lozan, Atatürk İnkılapları, Atatürkçülük" },
                  { name: "İngilizce", topics: "Friendship, Teen Life, Cooking, Communication, The Internet, Adventures, Tourism, Chores" },
                  { name: "Din Kültürü", topics: "Kaza ve Kader, Zekât ve Sadaka, Din ve Hayat, Hz. Muhammed'in Hayatı" },
                ].map((ders, i) => (
                  <div key={i} className="bg-muted/50 rounded-xl p-4">
                    <h4 className="font-bold text-sm mb-2">{ders.name}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{ders.topics}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-6 text-center">
                * İçerikler düzenli olarak güncellenmekte ve MEB müfredat değişikliklerine uygun hale getirilmektedir.
              </p>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
