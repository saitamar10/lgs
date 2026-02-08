import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">LGS<span className="text-primary">Çalış</span></span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Oyun gibi öğren, sınavda başar! LGS'ye hazırlık artık çok daha eğlenceli.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Platform</h4>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Ana Sayfa</Link></li>
              <li><Link to="/hakkimizda" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Hakkımızda</Link></li>
              <li><Link to="/iletisim" className="text-sm text-muted-foreground hover:text-foreground transition-colors">İletişim</Link></li>
            </ul>
          </div>

          {/* Dersler */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Dersler</h4>
            <ul className="space-y-2.5">
              <li><span className="text-sm text-muted-foreground">Matematik</span></li>
              <li><span className="text-sm text-muted-foreground">Fen Bilimleri</span></li>
              <li><span className="text-sm text-muted-foreground">Türkçe</span></li>
              <li><span className="text-sm text-muted-foreground">T.C. İnkılap Tarihi</span></li>
              <li><span className="text-sm text-muted-foreground">İngilizce</span></li>
              <li><span className="text-sm text-muted-foreground">Din Kültürü</span></li>
            </ul>
          </div>

          {/* Yasal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Yasal</h4>
            <ul className="space-y-2.5">
              <li><Link to="/gizlilik-politikasi" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Gizlilik Politikası</Link></li>
              <li><Link to="/kullanim-kosullari" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Kullanım Koşulları</Link></li>
              <li><Link to="/kvkk" className="text-sm text-muted-foreground hover:text-foreground transition-colors">KVKK Aydınlatma</Link></li>
              <li><Link to="/cerez-politikasi" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Çerez Politikası</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} LGSÇalış. Tüm hakları saklıdır.
          </p>
          <p className="text-xs text-muted-foreground">
            MEB müfredatına uygun, bağımsız bir eğitim platformudur.
          </p>
        </div>
      </div>
    </footer>
  );
}
