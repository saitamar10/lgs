import { LandingNavbar } from '@/components/LandingNavbar';
import { LandingFooter } from '@/components/LandingFooter';

export default function CerezPolitikasi() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LandingNavbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Çerez Politikası</h1>
        <p className="text-sm text-muted-foreground mb-8">Son güncelleme: 8 Şubat 2025</p>

        <div className="prose prose-sm max-w-none text-foreground space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-3">1. Çerez Nedir?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Çerezler (cookies), web siteleri tarafından tarayıcınıza gönderilen ve cihazınızda saklanan küçük metin dosyalarıdır. Çerezler, web sitesinin düzgün çalışmasını sağlamak, kullanıcı deneyimini iyileştirmek ve site kullanımı hakkında bilgi toplamak amacıyla kullanılır. Çerezler, kişisel bilgilerinize erişim sağlamaz ve cihazınıza zarar vermez.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">2. Kullanılan Çerez Türleri</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">LGSÇalış platformunda aşağıdaki çerez türleri kullanılmaktadır:</p>

            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-base mb-2 text-foreground">Zorunlu Çerezler</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  Bu çerezler platformun temel işlevlerinin çalışması için gereklidir. Bu çerezler olmadan platform düzgün çalışamaz ve devre dışı bırakılamazlar.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-3 font-semibold text-foreground">Çerez Adı</th>
                        <th className="text-left py-2 px-3 font-semibold text-foreground">Amaç</th>
                        <th className="text-left py-2 px-3 font-semibold text-foreground">Süre</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border">
                        <td className="py-2 px-3 font-mono">sb-auth-token</td>
                        <td className="py-2 px-3">Supabase oturum kimlik doğrulama</td>
                        <td className="py-2 px-3">Oturum</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 px-3 font-mono">sb-refresh-token</td>
                        <td className="py-2 px-3">Oturum yenileme</td>
                        <td className="py-2 px-3">7 gün</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 px-3 font-mono">study_plan_created</td>
                        <td className="py-2 px-3">Çalışma planı durumu</td>
                        <td className="py-2 px-3">Kalıcı</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-base mb-2 text-foreground">İşlevsel Çerezler</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  Bu çerezler, tercihlerinizi hatırlayarak daha iyi bir deneyim sunmamızı sağlar. Örneğin, tema tercihiniz (karanlık/aydınlık mod) ve dil ayarlarınız.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-3 font-semibold text-foreground">Çerez Adı</th>
                        <th className="text-left py-2 px-3 font-semibold text-foreground">Amaç</th>
                        <th className="text-left py-2 px-3 font-semibold text-foreground">Süre</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border">
                        <td className="py-2 px-3 font-mono">theme</td>
                        <td className="py-2 px-3">Tema tercihi (karanlık/aydınlık)</td>
                        <td className="py-2 px-3">1 yıl</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 px-3 font-mono">selected_subject</td>
                        <td className="py-2 px-3">Son seçilen ders</td>
                        <td className="py-2 px-3">Oturum</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-base mb-2 text-foreground">Performans/Analitik Çerezler</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  Bu çerezler, platformun nasıl kullanıldığını anlamamıza ve performansı iyileştirmemize yardımcı olur. Toplanan veriler anonimleştirilmiştir ve kimliğinizi belirlemek için kullanılmaz.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-3 font-semibold text-foreground">Çerez Adı</th>
                        <th className="text-left py-2 px-3 font-semibold text-foreground">Amaç</th>
                        <th className="text-left py-2 px-3 font-semibold text-foreground">Süre</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border">
                        <td className="py-2 px-3 font-mono">_analytics</td>
                        <td className="py-2 px-3">Sayfa görüntüleme ve kullanım istatistikleri</td>
                        <td className="py-2 px-3">2 yıl</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">3. Üçüncü Taraf Çerezleri</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Platformumuz, hizmet sağlamak amacıyla aşağıdaki üçüncü taraf hizmetlerinin çerezlerini kullanabilir:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Supabase:</strong> Kimlik doğrulama ve veritabanı hizmetleri için oturum çerezleri</li>
              <li><strong className="text-foreground">Google OAuth:</strong> Google ile giriş yapıldığında kimlik doğrulama çerezleri</li>
              <li><strong className="text-foreground">Apple OAuth:</strong> Apple ile giriş yapıldığında kimlik doğrulama çerezleri</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Üçüncü taraf çerezleri, ilgili hizmet sağlayıcılarının gizlilik politikalarına tabidir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">4. LocalStorage Kullanımı</h2>
            <p className="text-muted-foreground leading-relaxed">
              Çerezlere ek olarak, platformumuz tarayıcınızın LocalStorage özelliğini kullanarak bazı tercihleri ve önbellek verilerini saklar. Bu veriler arasında çalışma planı önbelleği, streak bilgisi, tema tercihi ve oturum bilgileri bulunur. LocalStorage verileri yalnızca tarayıcınızda saklanır ve sunucularımıza gönderilmez.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">5. Çerezleri Yönetme</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Tarayıcınızın ayarlarından çerezleri yönetebilir, silebilir veya engellemeyi seçebilirsiniz. Ancak, zorunlu çerezleri devre dışı bırakmanız platformun düzgün çalışmasını engelleyebilir.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-3">Popüler tarayıcılarda çerez ayarları:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Google Chrome:</strong> Ayarlar &gt; Gizlilik ve Güvenlik &gt; Çerezler ve diğer site verileri</li>
              <li><strong className="text-foreground">Mozilla Firefox:</strong> Ayarlar &gt; Gizlilik ve Güvenlik &gt; Çerezler ve Site Verileri</li>
              <li><strong className="text-foreground">Safari:</strong> Tercihler &gt; Gizlilik &gt; Çerezler ve web sitesi verileri</li>
              <li><strong className="text-foreground">Microsoft Edge:</strong> Ayarlar &gt; Gizlilik, arama ve hizmetler &gt; Çerezler</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">6. Değişiklikler</h2>
            <p className="text-muted-foreground leading-relaxed">
              Bu Çerez Politikası zaman zaman güncellenebilir. Değişiklikler bu sayfada yayınlanacaktır. Politikayı düzenli olarak kontrol etmenizi öneririz.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">7. İletişim</h2>
            <p className="text-muted-foreground leading-relaxed">
              Çerez politikamız hakkında sorularınız için <a href="mailto:ismetceberr@gmail.com" className="text-primary hover:underline">ismetceberr@gmail.com</a> adresinden veya <a href="/iletisim" className="text-primary hover:underline">İletişim Formu</a> üzerinden bize ulaşabilirsiniz.
            </p>
          </section>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
