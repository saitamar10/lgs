import { LandingNavbar } from '@/components/LandingNavbar';
import { LandingFooter } from '@/components/LandingFooter';

export default function KullanimKosullari() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LandingNavbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Kullanım Koşulları</h1>
        <p className="text-sm text-muted-foreground mb-8">Son güncelleme: 8 Şubat 2025</p>

        <div className="prose prose-sm max-w-none text-foreground space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-3">1. Kabul ve Kapsam</h2>
            <p className="text-muted-foreground leading-relaxed">
              Bu Kullanım Koşulları, LGSÇalış platformunu ("Platform") kullanan tüm kullanıcılar ("Kullanıcı", "siz") için geçerlidir. Platforma kayıt olarak veya platformu kullanarak bu koşulları kabul etmiş sayılırsınız. Bu koşulları kabul etmiyorsanız, platformu kullanmamanız gerekmektedir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">2. Hizmet Tanımı</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              LGSÇalış, 8. sınıf öğrencilerinin Liselere Geçiş Sınavı'na (LGS) hazırlanmasını destekleyen çevrimiçi bir eğitim platformudur. Platform aşağıdaki hizmetleri sunar:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Yapay zeka destekli kişiselleştirilmiş konu anlatımları ve soru üretimi</li>
              <li>İnteraktif quiz ve değerlendirme sistemleri</li>
              <li>Kişiselleştirilmiş günlük çalışma planları</li>
              <li>Liderlik tablosu ve sosyal öğrenme özellikleri (arkadaş düellosu)</li>
              <li>XP, seviye, streak ve başarı sistemi</li>
              <li>AI Coach (yapay zeka destekli koçluk)</li>
              <li>Kelime çalışma aracı (İngilizce)</li>
              <li>Fen Bilimleri için sanal deney simülasyonları</li>
              <li>İnkılap Tarihi için interaktif görsel anlatımlar</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">3. Hesap Oluşturma</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Platformu kullanmak için bir hesap oluşturmanız gerekmektedir. Hesap oluşturma sırasında:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Doğru ve güncel bilgiler vermeniz gerekmektedir.</li>
              <li>E-posta adresinizin size ait ve aktif olması gerekmektedir.</li>
              <li>Hesap güvenliğinizden siz sorumlusunuz. Şifrenizi kimseyle paylaşmayın.</li>
              <li>Hesabınızda yetkisiz bir erişim fark ederseniz derhal bize bildirmeniz gerekmektedir.</li>
              <li>Her kullanıcı yalnızca bir hesap oluşturabilir.</li>
              <li>13 yaşın altındaki kullanıcılar, yalnızca veli/vasi onayı ile hesap oluşturabilir.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">4. Kullanım Kuralları</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">Platform kullanılırken aşağıdaki kurallar geçerlidir:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Platformu yalnızca eğitim amaçlı kullanabilirsiniz.</li>
              <li>Başka kullanıcıların hesaplarına erişmeye çalışamazsınız.</li>
              <li>Platform içeriklerini izinsiz kopyalayamaz, dağıtamaz veya ticari amaçla kullanamazsınız.</li>
              <li>Bot, otomasyon aracı veya sahte hesaplar kullanarak sistemi manipüle edemezsiniz.</li>
              <li>Diğer kullanıcılara karşı hakaret, taciz veya uygunsuz davranışta bulunamazsınız.</li>
              <li>Platformun teknik altyapısına zarar vermeye çalışamazsınız.</li>
              <li>Quiz sonuçlarını veya liderlik tablosunu hileli yöntemlerle manipüle edemezsiniz.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">5. Abonelik ve Ödeme</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Platform, ücretsiz ve premium olmak üzere iki kullanım modeli sunar:
            </p>
            <h3 className="font-semibold text-base mb-2 mt-4">Ücretsiz Plan</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Günlük sınırlı sayıda can (kalp) hakkı</li>
              <li>Tüm derslere ve quiz'lere erişim</li>
              <li>Temel AI soru üretimi</li>
            </ul>
            <h3 className="font-semibold text-base mb-2 mt-4">Premium Plan (LGSÇalış Plus)</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Sınırsız can hakkı</li>
              <li>Gelişmiş AI soru üretimi ve konu anlatımı</li>
              <li>Öncelikli destek</li>
              <li>Reklamsız deneyim</li>
              <li>Streak dondurucu ve özel rozetler</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Premium abonelik aylık veya yıllık olarak satın alınabilir. Abonelik, iptal edilmediği sürece otomatik olarak yenilenir. İptal işlemi, mevcut dönem sonuna kadar geçerlidir; kalan süre için iade yapılmaz. Fiyat değişiklikleri en az 30 gün önceden bildirilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">6. Fikri Mülkiyet</h2>
            <p className="text-muted-foreground leading-relaxed">
              Platform üzerindeki tüm içerik (sorular, konu anlatımları, görseller, tasarımlar, yazılım kodu, logolar, marka adı) LGSÇalış'a aittir veya lisanslıdır. Bu içerikler telif hakkı, ticari marka ve diğer fikri mülkiyet hakları ile korunmaktadır. İçeriklerin izinsiz kullanımı, kopyalanması, dağıtılması veya değiştirilmesi yasaktır ve yasal işlem başlatılabilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">7. Yapay Zeka İçerikleri</h2>
            <p className="text-muted-foreground leading-relaxed">
              Platformda yapay zeka (AI) tarafından üretilen sorular, konu anlatımları ve öneriler bulunmaktadır. AI tarafından üretilen içerikler bilgilendirme amaçlıdır ve hata içerebilir. MEB müfredatına uygunluk hedeflenmiş olsa da, resmi MEB kaynakları ile çelişki durumunda resmi kaynaklar esas alınmalıdır. AI tarafından üretilen içeriklerin doğruluğu konusunda mutlak garanti verilmemektedir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">8. Sorumluluk Sınırlaması</h2>
            <p className="text-muted-foreground leading-relaxed">
              LGSÇalış, eğitim desteği sunmak amacıyla tasarlanmış bir platformdur. Platform, LGS sınav sonuçları hakkında herhangi bir garanti vermez. Teknik sorunlar, kesintiler veya veri kaybından kaynaklanan dolaylı zararlardan sorumlu değildir. Kullanıcıların kendi çalışma programlarını ve sınav stratejilerini belirlemelerini tavsiye eder. Platform, mücbir sebepler (doğal afet, altyapı arızası, siber saldırı vb.) nedeniyle oluşan kesintilerden sorumlu tutulamaz.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">9. Hesap Askıya Alma ve Kapatma</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Aşağıdaki durumlarda hesabınız askıya alınabilir veya kapatılabilir:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Kullanım kurallarının ihlali</li>
              <li>Sahte veya yanıltıcı bilgi ile hesap oluşturma</li>
              <li>Sistemi hileli yöntemlerle manipüle etme</li>
              <li>Diğer kullanıcılara zarar verme</li>
              <li>Yasal yükümlülüklere aykırı davranış</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Hesap kapatma öncesinde kullanıcıya bildirim yapılır. İtiraz hakkı saklıdır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">10. Değişiklikler</h2>
            <p className="text-muted-foreground leading-relaxed">
              Bu Kullanım Koşulları zaman zaman güncellenebilir. Önemli değişiklikler platform üzerinden duyurulur. Değişiklik sonrasında platformu kullanmaya devam etmeniz, güncellenmiş koşulları kabul ettiğiniz anlamına gelir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">11. Uygulanacak Hukuk</h2>
            <p className="text-muted-foreground leading-relaxed">
              Bu Kullanım Koşulları, Türkiye Cumhuriyeti mevzuatına tabi olup, uyuşmazlıklarda İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">12. İletişim</h2>
            <p className="text-muted-foreground leading-relaxed">
              Kullanım koşulları hakkında sorularınız için:
            </p>
            <ul className="list-none space-y-1 text-muted-foreground mt-2">
              <li>E-posta: <a href="mailto:ismetceberr@gmail.com" className="text-primary hover:underline">ismetceberr@gmail.com</a></li>
              <li>İletişim Formu: <a href="/iletisim" className="text-primary hover:underline">İletişim Sayfası</a></li>
            </ul>
          </section>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
