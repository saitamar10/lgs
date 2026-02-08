import { LandingNavbar } from '@/components/LandingNavbar';
import { LandingFooter } from '@/components/LandingFooter';

export default function GizlilikPolitikasi() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LandingNavbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Gizlilik Politikası</h1>
        <p className="text-sm text-muted-foreground mb-8">Son güncelleme: 8 Şubat 2025</p>

        <div className="prose prose-sm max-w-none text-foreground space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-3">1. Giriş</h2>
            <p className="text-muted-foreground leading-relaxed">
              LGSÇalış ("biz", "bizim" veya "Platform") olarak kullanıcılarımızın gizliliğine büyük önem veriyoruz. Bu Gizlilik Politikası, platformumuzu kullanırken toplanan, kullanılan ve korunan kişisel verileriniz hakkında sizi bilgilendirmek amacıyla hazırlanmıştır. Platformumuzu kullanarak bu politikayı kabul etmiş sayılırsınız.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">2. Toplanan Veriler</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">Platformumuz aşağıdaki kişisel verileri toplayabilir:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Kimlik Bilgileri:</strong> Ad, soyad, kullanıcı adı, e-posta adresi.</li>
              <li><strong className="text-foreground">Hesap Bilgileri:</strong> Şifre (şifrelenmiş olarak), profil fotoğrafı, tercih edilen dil.</li>
              <li><strong className="text-foreground">Eğitim Verileri:</strong> Çalışılan dersler, quiz sonuçları, XP puanları, seviye bilgisi, çalışma planı verileri, doğru/yanlış cevap istatistikleri.</li>
              <li><strong className="text-foreground">Kullanım Verileri:</strong> Giriş tarihleri, streak bilgisi, günlük görev ilerlemesi, oturum süreleri.</li>
              <li><strong className="text-foreground">Sosyal Veriler:</strong> Arkadaş listesi, düello sonuçları, liderlik tablosu sıralaması.</li>
              <li><strong className="text-foreground">Teknik Veriler:</strong> IP adresi, tarayıcı türü, cihaz bilgisi, çerez verileri.</li>
              <li><strong className="text-foreground">Ödeme Bilgileri:</strong> Abonelik planı türü (ödeme bilgileri üçüncü taraf ödeme sağlayıcıları tarafından işlenir).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">3. Verilerin Kullanım Amaçları</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">Toplanan veriler aşağıdaki amaçlarla kullanılır:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Kullanıcı hesabının oluşturulması ve yönetimi</li>
              <li>Kişiselleştirilmiş çalışma planı ve ders önerileri sunma</li>
              <li>Yapay zeka destekli soru üretimi ve seviyeye uygun içerik sağlama</li>
              <li>Liderlik tablosu, streak ve başarı sistemi yönetimi</li>
              <li>Arkadaş düellosu ve sosyal özellikler sunma</li>
              <li>Platform performansını iyileştirme ve hata giderme</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi</li>
              <li>Bildirim ve iletişim gönderme (izin dahilinde)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">4. Verilerin Paylaşımı</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Kişisel verileriniz aşağıdaki durumlar dışında üçüncü taraflarla paylaşılmaz:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Hizmet Sağlayıcılar:</strong> Supabase (veritabanı ve kimlik doğrulama), Anthropic (yapay zeka soru üretimi), ödeme işlemcileri.</li>
              <li><strong className="text-foreground">Yasal Zorunluluk:</strong> Mahkeme kararı veya yasal düzenleme gereği yetkili makamlarla.</li>
              <li><strong className="text-foreground">Sosyal Özellikler:</strong> Kullanıcı adı, XP puanı ve seviye bilgisi liderlik tablosunda diğer kullanıcılara görünür.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Kişisel verileriniz hiçbir koşulda reklam amaçlı üçüncü taraflara satılmaz veya kiralanmaz.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">5. Veri Güvenliği</h2>
            <p className="text-muted-foreground leading-relaxed">
              Verilerinizin güvenliği için endüstri standardı güvenlik önlemleri uygulanmaktadır. Tüm veriler SSL/TLS şifreleme ile iletilir, şifreler bcrypt algoritması ile hash'lenir ve veritabanı erişimi Row Level Security (RLS) ile korunur. Düzenli güvenlik denetimleri yapılmaktadır. Ancak, internet üzerinden hiçbir veri iletiminin %100 güvenli olmadığını belirtmek isteriz.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">6. Çerezler</h2>
            <p className="text-muted-foreground leading-relaxed">
              Platformumuz, oturum yönetimi ve kullanıcı deneyimini iyileştirmek amacıyla çerezler kullanmaktadır. Zorunlu çerezler platformun çalışması için gereklidir. Analitik çerezler kullanım istatistiklerini toplamak amacıyla kullanılır. Detaylı bilgi için <a href="/cerez-politikasi" className="text-primary hover:underline">Çerez Politikamızı</a> inceleyebilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">7. Kullanıcı Hakları</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenmişse buna ilişkin bilgi talep etme</li>
              <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Eksik veya yanlış işlenen verilerin düzeltilmesini isteme</li>
              <li>Kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
              <li>Verilerinizin aktarıldığı üçüncü kişileri öğrenme</li>
              <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">8. Çocukların Gizliliği</h2>
            <p className="text-muted-foreground leading-relaxed">
              LGSÇalış, 13 yaş ve üzeri öğrencilere yönelik bir eğitim platformudur. 13 yaşın altındaki çocukların platformu kullanabilmesi için veli/vasi onayı gerekmektedir. 13 yaşın altındaki bir çocuğun verilerinin toplandığını fark etmemiz halinde, bu veriler derhal silinir. Veli/vasiler, çocuklarının verilerine ilişkin tüm haklarını kullanabilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">9. Verilerin Saklanması</h2>
            <p className="text-muted-foreground leading-relaxed">
              Kişisel verileriniz, hesabınız aktif olduğu sürece saklanır. Hesabınızı silmeniz halinde, yasal zorunluluklar (vergi mevzuatı, hukuki uyuşmazlıklar vb.) saklı kalmak kaydıyla, verileriniz 30 gün içinde kalıcı olarak silinir. Anonim hale getirilmiş istatistiksel veriler bu kapsamın dışındadır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">10. Politika Değişiklikleri</h2>
            <p className="text-muted-foreground leading-relaxed">
              Bu Gizlilik Politikası zaman zaman güncellenebilir. Önemli değişiklikler yapıldığında, platform üzerinden ve/veya e-posta yoluyla bilgilendirilirsiniz. Güncellenmiş politikayı kabul etmemeniz halinde platformu kullanmayı bırakabilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">11. İletişim</h2>
            <p className="text-muted-foreground leading-relaxed">
              Gizlilik politikamız hakkında sorularınız veya talepleriniz için bizimle iletişime geçebilirsiniz:
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
