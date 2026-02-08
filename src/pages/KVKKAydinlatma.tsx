import { LandingNavbar } from '@/components/LandingNavbar';
import { LandingFooter } from '@/components/LandingFooter';

export default function KVKKAydinlatma() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LandingNavbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">KVKK Aydınlatma Metni</h1>
        <p className="text-sm text-muted-foreground mb-8">6698 Sayılı Kişisel Verilerin Korunması Kanunu Kapsamında Aydınlatma Metni</p>

        <div className="prose prose-sm max-w-none text-foreground space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-3">1. Veri Sorumlusu</h2>
            <p className="text-muted-foreground leading-relaxed">
              6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz veri sorumlusu sıfatıyla LGSÇalış tarafından aşağıda açıklanan kapsamda işlenebilecektir. Bu aydınlatma metni, KVKK'nın 10. maddesi ile Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ kapsamında hazırlanmıştır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">2. İşlenen Kişisel Veriler</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">Platformumuz tarafından aşağıdaki kişisel veri kategorileri işlenmektedir:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Veri Kategorisi</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">İşlenen Veriler</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-medium text-foreground">Kimlik Bilgileri</td>
                    <td className="py-3 px-4">Ad, soyad, kullanıcı adı</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-medium text-foreground">İletişim Bilgileri</td>
                    <td className="py-3 px-4">E-posta adresi</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-medium text-foreground">Eğitim Bilgileri</td>
                    <td className="py-3 px-4">Quiz sonuçları, çalışma planı, XP puanı, seviye, doğru/yanlış istatistikleri</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-medium text-foreground">İşlem Güvenliği</td>
                    <td className="py-3 px-4">Şifre (hash'lenmiş), oturum bilgileri, IP adresi</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-medium text-foreground">Kullanım Verileri</td>
                    <td className="py-3 px-4">Giriş tarihleri, streak, günlük görevler, oturum süreleri</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-medium text-foreground">Finansal Bilgiler</td>
                    <td className="py-3 px-4">Abonelik planı türü (ödeme detayları üçüncü taraf tarafından işlenir)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">3. Kişisel Verilerin İşlenme Amaçları</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Üyelik hesabınızın oluşturulması ve yönetilmesi</li>
              <li>Eğitim hizmetlerinin sunulması ve kişiselleştirilmesi</li>
              <li>Yapay zeka destekli soru üretimi ve içerik önerisi</li>
              <li>Kişiselleştirilmiş çalışma planı oluşturulması</li>
              <li>Liderlik tablosu, başarı ve ödül sisteminin yönetimi</li>
              <li>Arkadaşlık ve düello özelliklerinin sunulması</li>
              <li>Abonelik ve ödeme işlemlerinin gerçekleştirilmesi</li>
              <li>Platform güvenliğinin sağlanması</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi</li>
              <li>İletişim ve bildirim gönderimi (açık rıza dahilinde)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">4. Kişisel Verilerin İşlenme Hukuki Sebepleri</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">KVKK'nın 5. maddesi uyarınca kişisel verileriniz aşağıdaki hukuki sebepler kapsamında işlenmektedir:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Açık rıza:</strong> Pazarlama amaçlı iletişim, çerez kullanımı</li>
              <li><strong className="text-foreground">Sözleşmenin ifası:</strong> Üyelik sözleşmesi kapsamında hizmet sunumu</li>
              <li><strong className="text-foreground">Meşru menfaat:</strong> Platform güvenliği, hizmet kalitesinin artırılması</li>
              <li><strong className="text-foreground">Hukuki yükümlülük:</strong> Yasal düzenlemelere uyum</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">5. Kişisel Verilerin Aktarılması</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Kişisel verileriniz, KVKK'nın 8. ve 9. maddeleri uyarınca aşağıdaki taraflara aktarılabilir:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Supabase Inc. (ABD):</strong> Veritabanı ve kimlik doğrulama hizmetleri (yeterli koruma önlemleri kapsamında)</li>
              <li><strong className="text-foreground">Anthropic (ABD):</strong> Yapay zeka soru üretimi hizmetleri (anonim veri aktarımı)</li>
              <li><strong className="text-foreground">Ödeme Hizmet Sağlayıcıları:</strong> Abonelik işlemleri için</li>
              <li><strong className="text-foreground">Yetkili Kamu Kurum ve Kuruluşları:</strong> Yasal zorunluluk halinde</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">6. Veri Sahibi Hakları</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
              <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme</li>
              <li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
              <li>KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
              <li>Düzeltme ve silme işlemlerinin, kişisel verilerinizin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
              <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
              <li>Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">7. Başvuru Yöntemi</h2>
            <p className="text-muted-foreground leading-relaxed">
              Yukarıda belirtilen haklarınızı kullanmak için <a href="mailto:ismetceberr@gmail.com" className="text-primary hover:underline">ismetceberr@gmail.com</a> adresine e-posta gönderebilir veya <a href="/iletisim" className="text-primary hover:underline">İletişim Formu</a> üzerinden başvuruda bulunabilirsiniz. Başvurunuz en geç 30 gün içinde ücretsiz olarak sonuçlandırılacaktır. İşlemin ayrıca bir maliyet gerektirmesi hâlinde, Kişisel Verileri Koruma Kurulunca belirlenen tarifedeki ücret alınabilir.
            </p>
          </section>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
