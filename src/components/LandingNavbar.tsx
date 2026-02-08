import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, GraduationCap } from 'lucide-react';

interface LandingNavbarProps {
  onScrollToAuth?: () => void;
}

export function LandingNavbar({ onScrollToAuth }: LandingNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">LGS<span className="text-primary">Çalış</span></span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/hakkimizda" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted">
              Hakkımızda
            </Link>
            <Link to="/iletisim" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted">
              İletişim
            </Link>
            <Link to="/gizlilik-politikasi" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted">
              Gizlilik
            </Link>
            <Link to="/kullanim-kosullari" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted">
              Koşullar
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button onClick={onScrollToAuth} size="sm" className="font-semibold">
              Hemen Başla
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-1 animate-slide-up">
            <Link
              to="/hakkimizda"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
            >
              Hakkımızda
            </Link>
            <Link
              to="/iletisim"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
            >
              İletişim
            </Link>
            <Link
              to="/gizlilik-politikasi"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
            >
              Gizlilik Politikası
            </Link>
            <Link
              to="/kullanim-kosullari"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
            >
              Kullanım Koşulları
            </Link>
            <div className="pt-2 px-3">
              <Button onClick={() => { onScrollToAuth?.(); setMobileMenuOpen(false); }} className="w-full font-semibold">
                Hemen Başla
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
