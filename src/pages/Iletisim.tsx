import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { LandingNavbar } from '@/components/LandingNavbar';
import { LandingFooter } from '@/components/LandingFooter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, MessageSquare, Clock, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Iletisim() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      await emailjs.send(
        'service_4yk74er',
        'template_ivktu8p',
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: `Konu: ${formData.subject}\nE-posta: ${formData.email}\n\n${formData.message}`,
        },
        'RofbCHWZaYUEQrWrg'
      );
      toast({ title: "Mesajınız Gönderildi", description: "En kısa sürede size dönüş yapacağız." });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast({ variant: "destructive", title: "Gönderilemedi", description: "Bir hata oluştu. Lütfen tekrar deneyin." });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LandingNavbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/8 to-background py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">Bize Ulaşın</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sorularınız, önerileriniz veya geri bildirimleriniz için bizimle iletişime geçebilirsiniz. Size en kısa sürede dönüş yapacağız.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {/* İletişim Bilgileri */}
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-2xl p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-base mb-2">E-posta</h3>
                  <p className="text-sm text-muted-foreground mb-2">Genel sorular ve destek için:</p>
                  <a href="mailto:ismetceberr@gmail.com" className="text-sm text-primary hover:underline font-medium">ismetceberr@gmail.com</a>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
                    <MessageSquare className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h3 className="font-bold text-base mb-2">Canlı Destek</h3>
                  <p className="text-sm text-muted-foreground mb-2">Platform içi AI Coach ile anında yardım alın.</p>
                  <span className="text-sm text-emerald-500 font-medium">Giriş yaparak erişebilirsiniz</span>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="font-bold text-base mb-2">Yanıt Süresi</h3>
                  <p className="text-sm text-muted-foreground">
                    E-posta yanıtlarımız genellikle 24 saat içinde döner. Hafta sonları yanıt süremiz biraz daha uzun olabilir.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6">
                  <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6 text-violet-500" />
                  </div>
                  <h3 className="font-bold text-base mb-2">Konum</h3>
                  <p className="text-sm text-muted-foreground">
                    İstanbul, Türkiye
                  </p>
                </div>
              </div>

              {/* İletişim Formu */}
              <div className="md:col-span-2">
                <div className="bg-card border border-border rounded-2xl p-8">
                  <h2 className="text-xl font-bold mb-6">İletişim Formu</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="name">Adınız Soyadınız</Label>
                        <Input
                          id="name"
                          placeholder="Adınızı girin"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-posta Adresiniz</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="ornek@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Konu</Label>
                      <Input
                        id="subject"
                        placeholder="Mesajınızın konusu"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Mesajınız</Label>
                      <textarea
                        id="message"
                        placeholder="Mesajınızı detaylı şekilde yazın..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        rows={6}
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      />
                    </div>
                    <Button type="submit" className="w-full h-11 font-semibold" disabled={isSending}>
                      {isSending ? 'Gönderiliyor...' : 'Mesajı Gönder'}
                    </Button>
                  </form>
                </div>

                {/* SSS */}
                <div className="bg-card border border-border rounded-2xl p-8 mt-6">
                  <h2 className="text-xl font-bold mb-6">Sık Sorulan Sorular</h2>
                  <div className="space-y-5">
                    {[
                      { q: "LGSÇalış ücretsiz mi?", a: "Evet, temel özellikler ücretsizdir. Günlük sınırlı can hakkı ile tüm derslere ve quiz'lere erişebilirsiniz. Premium plan ile sınırsız erişim ve ekstra özellikler sunarız." },
                      { q: "İçerikler MEB müfredatına uygun mu?", a: "Evet, tüm içeriklerimiz 8. sınıf MEB müfredatına uygun olarak hazırlanmaktadır. Müfredat değişikliklerinde içeriklerimiz güncellenir." },
                      { q: "Yapay zeka soruları nasıl üretiliyor?", a: "Gelişmiş AI modelleri kullanarak, konuya ve seviyenize uygun özgün sorular üretiyoruz. Her quiz'de farklı sorularla karşılaşırsınız." },
                      { q: "Hesabımı nasıl silebilirim?", a: "Profil ayarlarından hesap silme talebinde bulunabilirsiniz. Verileriniz 30 gün içinde kalıcı olarak silinir." },
                      { q: "Veli olarak çocuğumun ilerlemesini takip edebilir miyim?", a: "Şu anda veli paneli geliştirme aşamasındadır. İlerleme takibi için çocuğunuzun profil sayfasını birlikte inceleyebilirsiniz." },
                    ].map((faq, i) => (
                      <div key={i} className="border-b border-border pb-4 last:border-0 last:pb-0">
                        <h3 className="font-semibold text-sm mb-2">{faq.q}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
