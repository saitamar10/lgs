import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

/*
═══════════════════════════════════════════════════════════════
İNTERAKTİF BASINÇ DENEYİ - BALON + RAPTİYE
═══════════════════════════════════════════════════════════════
KONU: Basınç = Kuvvet / Alan
AMAÇ: Kullanıcı raptiye sayısını değiştirerek basıncın değişimini görsün
*/

type ExperimentPhase = 'intro' | 'single-pin' | 'multi-pin' | 'compare';

export function InteractivePressure() {
  const [phase, setPhase] = useState<ExperimentPhase>('intro');
  const [force, setForce] = useState(50); // Newton
  const [pinCount, setPinCount] = useState(1);
  const [balloonPopped, setBalloonPopped] = useState(false);

  // Basınç hesaplama (P = F / A)
  const singlePinArea = 0.01; // cm²
  const totalArea = singlePinArea * pinCount;
  const pressure = force / totalArea; // N/cm²

  // Balon patlar mı?
  const MAX_PRESSURE = 300; // N/cm² - Balonun dayanabileceği maksimum basınç
  const willPop = pressure > MAX_PRESSURE;

  const handleTestBalloon = () => {
    if (willPop) {
      setBalloonPopped(true);
      setTimeout(() => setBalloonPopped(false), 2000);
    }
  };

  const renderIntro = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="text-6xl">🎈</div>
        <h2 className="text-2xl font-bold">Basınç Deneyi</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Bir balonu raptiyeye bastırırsak ne olur? Balonun patlaması basınca bağlıdır!
          Basınç = Kuvvet ÷ Alan formülünü keşfedelim.
        </p>
      </div>

      <div className="bg-info/10 border border-info/30 rounded-lg p-4">
        <h3 className="font-bold mb-2 flex items-center gap-2">
          <span>🔬</span> Deney Sorusu
        </h3>
        <p className="text-sm">
          Bir balonu 1 raptiyeye mi yoksa 20 raptiyeye mi bastırırsak patlar?
        </p>
      </div>

      <div className="flex gap-3">
        <Button onClick={() => setPhase('single-pin')} className="flex-1">
          1 Raptiye ile Dene
        </Button>
        <Button onClick={() => setPhase('multi-pin')} variant="outline" className="flex-1">
          Çok Raptiye ile Dene
        </Button>
      </div>
    </div>
  );

  const renderExperiment = () => (
    <div className="space-y-6">
      {/* Balon Görseli */}
      <div className="relative h-64 bg-gradient-to-b from-sky-100 to-sky-50 dark:from-sky-950 dark:to-background rounded-xl border-2 border-sky-300 dark:border-sky-700 flex items-center justify-center overflow-hidden">
        {/* Balon */}
        <div className={`relative transition-all duration-500 ${balloonPopped ? 'scale-0 opacity-0' : 'scale-100'}`}>
          <div className="text-9xl animate-bounce-slow">🎈</div>
          {balloonPopped && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl animate-ping">💥</div>
            </div>
          )}
        </div>

        {/* Raptiyeler */}
        <div className="absolute bottom-4 flex gap-1 justify-center">
          {phase === 'single-pin' && (
            <div className="text-4xl">📌</div>
          )}
          {phase === 'multi-pin' && (
            <div className="flex flex-wrap gap-1 max-w-xs justify-center">
              {[...Array(Math.min(pinCount, 25))].map((_, i) => (
                <div key={i} className="text-2xl">📌</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Kontroller */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Kuvvet Kontrolü */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Uygulanan Kuvvet (F)</label>
              <Badge variant="secondary">{force} N</Badge>
            </div>
            <Slider
              value={[force]}
              onValueChange={(v) => setForce(v[0])}
              min={10}
              max={200}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Balonun üstüne ne kadar kuvvet uyguluyorsunuz?
            </p>
          </div>

          {/* Raptiye Sayısı (Sadece multi-pin modunda) */}
          {phase === 'multi-pin' && (
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Raptiye Sayısı</label>
                <Badge variant="secondary">{pinCount} adet</Badge>
              </div>
              <Slider
                value={[pinCount]}
                onValueChange={(v) => setPinCount(v[0])}
                min={1}
                max={30}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Raptiye sayısı arttıkça yüzey alanı artar
              </p>
            </div>
          )}

          {/* Hesaplamalar */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-primary/10 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Toplam Alan (A)</p>
              <p className="text-lg font-bold">{totalArea.toFixed(2)} cm²</p>
            </div>
            <div className="bg-primary/10 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Basınç (P)</p>
              <p className="text-lg font-bold">{pressure.toFixed(1)} N/cm²</p>
            </div>
          </div>

          {/* Formül */}
          <div className="bg-secondary rounded-lg p-4 text-center">
            <p className="text-sm font-mono font-bold">
              P = F ÷ A = {force} ÷ {totalArea.toFixed(2)} = {pressure.toFixed(1)} N/cm²
            </p>
          </div>

          {/* Uyarı */}
          {willPop && (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold">Dikkat!</p>
                <p>Basınç çok yüksek ({pressure.toFixed(1)} N/cm²). Balon patlayabilir!</p>
              </div>
            </div>
          )}

          {/* Test Butonu */}
          <Button
            onClick={handleTestBalloon}
            className="w-full"
            variant={willPop ? "destructive" : "default"}
          >
            {willPop ? '💥 Balonu Test Et (Patlayacak!)' : '✅ Balonu Test Et (Güvenli)'}
          </Button>
        </CardContent>
      </Card>

      {/* Sonuç Açıklaması */}
      {balloonPopped && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 animate-fade-in">
          <h3 className="font-bold mb-2">💥 Balon Patladı!</h3>
          <p className="text-sm">
            Basınç çok yüksekti! {phase === 'single-pin' ? 'Tek raptiyede yüzey alanı çok küçük olduğu için basınç çok yüksek oldu.' : 'Raptiye sayısını artırarak yüzey alanını artırın.'}
          </p>
        </div>
      )}

      {!balloonPopped && !willPop && (
        <div className="bg-success/10 border border-success/30 rounded-lg p-4 animate-fade-in">
          <h3 className="font-bold mb-2">✅ Balon Patlamadı!</h3>
          <p className="text-sm">
            Basınç yeterince düşük! {phase === 'multi-pin' ? 'Raptiye sayısı arttıkça yüzey alanı arttı ve basınç azaldı.' : 'Kuvvet yeterince düşük veya yüzey alanı yeterince büyük.'}
          </p>
        </div>
      )}

      {/* Navigasyon */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setPhase('intro')} className="flex-1">
          Başa Dön
        </Button>
        <Button onClick={() => setPhase('compare')} className="flex-1">
          Karşılaştır
        </Button>
      </div>
    </div>
  );

  const renderComparison = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">📊 Karşılaştırma</h2>

      <div className="grid md:grid-cols-2 gap-4">
        {/* 1 Raptiye */}
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">📌</div>
              <h3 className="font-bold">1 Raptiye</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Alan:</span>
                <span className="font-bold">0.01 cm²</span>
              </div>
              <div className="flex justify-between">
                <span>Kuvvet:</span>
                <span className="font-bold">50 N</span>
              </div>
              <div className="flex justify-between text-destructive">
                <span>Basınç:</span>
                <span className="font-bold">5000 N/cm²</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-destructive/10 rounded-lg text-center">
              <p className="text-sm font-bold">💥 Balon Patlar!</p>
              <p className="text-xs mt-1">Basınç çok yüksek</p>
            </div>
          </CardContent>
        </Card>

        {/* 20 Raptiye */}
        <Card className="border-success/50">
          <CardContent className="pt-6">
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">
                <div className="grid grid-cols-5 gap-1">
                  {[...Array(20)].map((_, i) => (
                    <span key={i} className="text-2xl">📌</span>
                  ))}
                </div>
              </div>
              <h3 className="font-bold">20 Raptiye</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Alan:</span>
                <span className="font-bold">0.20 cm²</span>
              </div>
              <div className="flex justify-between">
                <span>Kuvvet:</span>
                <span className="font-bold">50 N</span>
              </div>
              <div className="flex justify-between text-success">
                <span>Basınç:</span>
                <span className="font-bold">250 N/cm²</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-success/10 rounded-lg text-center">
              <p className="text-sm font-bold">✅ Balon Patlamaz!</p>
              <p className="text-xs mt-1">Basınç düşük ve güvenli</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sonuç */}
      <div className="bg-primary/10 rounded-lg p-6">
        <h3 className="font-bold mb-3 text-lg">🎯 Deney Sonucu</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">1.</span>
            <span>Aynı kuvvet altında, yüzey alanı arttıkça basınç azalır</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">2.</span>
            <span>20 raptiye kullanıldığında yüzey alanı 20 kat artar, basınç 20 kat azalır</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">3.</span>
            <span>Yayılan kuvvet = Daha az basınç = Balon patlamaz!</span>
          </li>
        </ul>
        <div className="mt-4 p-3 bg-background rounded-lg text-center">
          <p className="font-mono font-bold">P = F ÷ A</p>
          <p className="text-xs text-muted-foreground mt-1">Basınç = Kuvvet ÷ Alan</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setPhase('intro')} className="flex-1">
          Başa Dön
        </Button>
        <Button onClick={() => setPhase('single-pin')} className="flex-1">
          Tekrar Dene
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      {phase === 'intro' && renderIntro()}
      {(phase === 'single-pin' || phase === 'multi-pin') && renderExperiment()}
      {phase === 'compare' && renderComparison()}
    </div>
  );
}
