import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Calculator } from 'lucide-react';

/*
═══════════════════════════════════════════════════════════════
İNTERAKTİF BASİT MAKİNELER DENEYİ - KALDIRAC & MAKARA
═══════════════════════════════════════════════════════════════
KONU: Kaldıraç dengesi, Kuvvet ve Yol Kazancı
AMAÇ: Kullanıcı kaldıraç kollarını ayarlayarak mekanik avantajı görsün
*/

type MachineType = 'lever' | 'pulley';

export function InteractiveSimpleMachines() {
  const [machineType, setMachineType] = useState<MachineType>('lever');

  // Kaldıraç değişkenleri
  const [loadWeight, setLoadWeight] = useState(100); // kg
  const [loadDistance, setLoadDistance] = useState(1); // m (destek noktasından uzaklık)
  const [effortDistance, setEffortDistance] = useState(3); // m (destek noktasından uzaklık)

  // Makara değişkenleri
  const [pulleyWeight, setPulleyWeight] = useState(50); // kg
  const [pulleyCount, setPulleyCount] = useState(1); // Makara sayısı

  // Kaldıraç hesaplamaları
  const requiredForce = (loadWeight * loadDistance) / effortDistance; // F1 × d1 = F2 × d2
  const mechanicalAdvantage = effortDistance / loadDistance; // MA = d2 / d1
  const forceGain = mechanicalAdvantage;
  const distanceRatio = effortDistance / loadDistance;

  // Makara hesaplamaları
  const pulleyForce = pulleyWeight / pulleyCount; // Makara sayısı arttıkça kuvvet azalır
  const pulleyMA = pulleyCount; // Mekanik avantaj = makara sayısı

  const renderLever = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">⚖️ Kaldıraç Deneyi</h2>
        <p className="text-sm text-muted-foreground">
          Destek noktasından uzaklıkları değiştirerek az kuvvetle çok yük kaldırın!
        </p>
      </div>

      {/* Kaldıraç Görseli */}
      <div className="relative h-72 bg-gradient-to-b from-amber-50 to-background dark:from-amber-950 dark:to-background rounded-xl border-2 border-amber-300 dark:border-amber-700 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Zemin çizgisi */}
          <div className="absolute bottom-8 left-0 right-0 h-1 bg-muted" />

          {/* Destek noktası (üçgen) */}
          <div className="absolute bottom-8" style={{ left: '50%', transform: 'translateX(-50%)' }}>
            <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[35px] border-b-gray-600" />
          </div>

          {/* Kaldıraç çubuğu */}
          <div
            className="absolute bg-amber-700 rounded-full transition-all duration-500"
            style={{
              width: `${(loadDistance + effortDistance) * 80}px`,
              height: '12px',
              bottom: '80px',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />

          {/* Yük (Sol taraf) */}
          <div
            className="absolute transition-all duration-500"
            style={{
              left: `calc(50% - ${loadDistance * 80}px)`,
              bottom: '90px',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
                📦
              </div>
              <Badge variant="destructive" className="mt-2">{loadWeight} kg</Badge>
            </div>
          </div>

          {/* Kuvvet (Sağ taraf) */}
          <div
            className="absolute transition-all duration-500"
            style={{
              left: `calc(50% + ${effortDistance * 80}px)`,
              bottom: '90px',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="text-center">
              <div className="text-5xl">💪</div>
              <Badge className="mt-2">{requiredForce.toFixed(1)} kg</Badge>
            </div>
          </div>

          {/* Mesafe göstergeleri */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 text-xs">
            <div className="text-center">
              <div className="text-destructive font-bold">{loadDistance} m</div>
              <div className="text-muted-foreground">Yük kolu</div>
            </div>
            <div className="w-2 h-2 bg-gray-600 rounded-full" />
            <div className="text-center">
              <div className="text-primary font-bold">{effortDistance} m</div>
              <div className="text-muted-foreground">Kuvvet kolu</div>
            </div>
          </div>
        </div>
      </div>

      {/* Kontroller */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Yük Ağırlığı */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Yük Ağırlığı</label>
              <Badge variant="secondary">{loadWeight} kg</Badge>
            </div>
            <Slider
              value={[loadWeight]}
              onValueChange={(v) => setLoadWeight(v[0])}
              min={20}
              max={200}
              step={10}
              className="w-full"
            />
          </div>

          {/* Yük Mesafesi (Destek noktasından) */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Yük Kolu (d₁)</label>
              <Badge variant="destructive">{loadDistance} m</Badge>
            </div>
            <Slider
              value={[loadDistance]}
              onValueChange={(v) => setLoadDistance(v[0])}
              min={0.5}
              max={3}
              step={0.5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">Destek noktasından yüke olan mesafe</p>
          </div>

          {/* Kuvvet Mesafesi */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Kuvvet Kolu (d₂)</label>
              <Badge>{effortDistance} m</Badge>
            </div>
            <Slider
              value={[effortDistance]}
              onValueChange={(v) => setEffortDistance(v[0])}
              min={0.5}
              max={5}
              step={0.5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">Destek noktasından kuvvet noktasına mesafe</p>
          </div>

          {/* Hesaplamalar */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-primary/10 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Gereken Kuvvet</p>
              <p className="text-xl font-bold">{requiredForce.toFixed(1)} kg</p>
            </div>
            <div className="bg-success/10 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Kuvvet Kazancı</p>
              <p className="text-xl font-bold">×{mechanicalAdvantage.toFixed(2)}</p>
            </div>
          </div>

          {/* Formül */}
          <div className="bg-secondary rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-4 h-4" />
              <p className="text-sm font-bold">Kaldıraç Dengesi</p>
            </div>
            <p className="text-sm font-mono text-center">
              F₁ × d₁ = F₂ × d₂
            </p>
            <p className="text-sm font-mono text-center mt-1">
              {loadWeight} × {loadDistance} = {requiredForce.toFixed(1)} × {effortDistance}
            </p>
            <p className="text-xs text-muted-foreground text-center mt-2">
              {(loadWeight * loadDistance).toFixed(1)} = {(requiredForce * effortDistance).toFixed(1)} ✓
            </p>
          </div>

          {/* Sonuç Açıklaması */}
          <div className="bg-info/10 border border-info/30 rounded-lg p-4">
            <h3 className="font-bold mb-2">📊 Sonuç</h3>
            <ul className="text-sm space-y-1">
              <li>• <strong>{loadWeight} kg</strong> yükü kaldırmak için <strong>{requiredForce.toFixed(1)} kg</strong> kuvvet yeterli</li>
              <li>• Kuvvet kolu {distanceRatio.toFixed(1)}× daha uzun olduğu için <strong>×{forceGain.toFixed(2)} kuvvet kazancı</strong> sağlıyorsunuz</li>
              <li>• Ancak kuvvet uygulanan mesafe {distanceRatio.toFixed(1)}× daha fazla (yol kaybı)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPulley = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">⭕ Makara Sistemi</h2>
        <p className="text-sm text-muted-foreground">
          Makara sayısını artırarak daha az kuvvetle yük kaldırın!
        </p>
      </div>

      {/* Makara Görseli */}
      <div className="relative h-80 bg-gradient-to-b from-blue-50 to-background dark:from-blue-950 dark:to-background rounded-xl border-2 border-blue-300 dark:border-blue-700 overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center pt-8">
          {/* Tavan */}
          <div className="w-full h-2 bg-gray-600" />

          {/* Makara(lar) */}
          <div className="flex flex-col gap-4 mt-4">
            {[...Array(Math.min(pulleyCount, 4))].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border-4 border-gray-600 bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-gray-800" />
                </div>
                {/* İp */}
                <div className="w-1 h-12 bg-yellow-600" />
              </div>
            ))}
          </div>

          {/* Yük */}
          <div className="mt-4">
            <div className="w-20 h-20 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              📦
            </div>
            <Badge variant="destructive" className="mt-2 mx-auto block w-fit">
              {pulleyWeight} kg
            </Badge>
          </div>

          {/* Kuvvet göstergesi */}
          <div className="absolute top-4 right-4">
            <div className="text-center bg-background/90 backdrop-blur rounded-lg p-3 border-2 border-primary">
              <div className="text-3xl mb-1">💪</div>
              <div className="text-sm text-muted-foreground">Gereken Kuvvet</div>
              <div className="text-xl font-bold text-primary">{pulleyForce.toFixed(1)} kg</div>
            </div>
          </div>
        </div>
      </div>

      {/* Kontroller */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Yük Ağırlığı */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Yük Ağırlığı</label>
              <Badge variant="secondary">{pulleyWeight} kg</Badge>
            </div>
            <Slider
              value={[pulleyWeight]}
              onValueChange={(v) => setPulleyWeight(v[0])}
              min={10}
              max={200}
              step={10}
              className="w-full"
            />
          </div>

          {/* Makara Sayısı */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Makara Sayısı</label>
              <Badge>{pulleyCount} adet</Badge>
            </div>
            <Slider
              value={[pulleyCount]}
              onValueChange={(v) => setPulleyCount(v[0])}
              min={1}
              max={4}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">Her makara kuvveti paylaşır</p>
          </div>

          {/* Hesaplamalar */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-primary/10 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Gereken Kuvvet</p>
              <p className="text-xl font-bold">{pulleyForce.toFixed(1)} kg</p>
            </div>
            <div className="bg-success/10 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Mekanik Avantaj</p>
              <p className="text-xl font-bold">×{pulleyMA}</p>
            </div>
          </div>

          {/* Formül */}
          <div className="bg-secondary rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-4 h-4" />
              <p className="text-sm font-bold">Makara Sistemi</p>
            </div>
            <p className="text-sm font-mono text-center">
              Gereken Kuvvet = Yük ÷ Makara Sayısı
            </p>
            <p className="text-sm font-mono text-center mt-1">
              F = {pulleyWeight} ÷ {pulleyCount} = {pulleyForce.toFixed(1)} kg
            </p>
          </div>

          {/* Sonuç Açıklaması */}
          <div className="bg-info/10 border border-info/30 rounded-lg p-4">
            <h3 className="font-bold mb-2">📊 Sonuç</h3>
            <ul className="text-sm space-y-1">
              <li>• <strong>{pulleyWeight} kg</strong> yükü kaldırmak için sadece <strong>{pulleyForce.toFixed(1)} kg</strong> kuvvet gerekiyor</li>
              <li>• {pulleyCount} makara kullanarak <strong>×{pulleyMA} kuvvet kazancı</strong> sağlıyorsunuz</li>
              <li>• Her makara yükün bir kısmını paylaşır</li>
              <li>• Ancak ipi {pulleyCount}× daha fazla çekmeniz gerekir (yol kaybı)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Makine Seçimi */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => setMachineType('lever')}
          variant={machineType === 'lever' ? 'default' : 'outline'}
          className="h-auto py-4"
        >
          <div className="text-center">
            <div className="text-3xl mb-1">⚖️</div>
            <div className="font-bold">Kaldıraç</div>
            <div className="text-xs opacity-70">Destek + Kuvvet kolları</div>
          </div>
        </Button>
        <Button
          onClick={() => setMachineType('pulley')}
          variant={machineType === 'pulley' ? 'default' : 'outline'}
          className="h-auto py-4"
        >
          <div className="text-center">
            <div className="text-3xl mb-1">⭕</div>
            <div className="font-bold">Makara</div>
            <div className="text-xs opacity-70">Kuvvet yönünü değiştirir</div>
          </div>
        </Button>
      </div>

      {/* Deney İçeriği */}
      {machineType === 'lever' && renderLever()}
      {machineType === 'pulley' && renderPulley()}

      {/* Genel Bilgi */}
      <Card className="bg-gradient-to-br from-primary/5 to-background">
        <CardContent className="pt-6">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <span>💡</span> Basit Makineler Kuralı
          </h3>
          <div className="space-y-2 text-sm">
            <p className="font-semibold">İş = Kuvvet × Yol</p>
            <p>Basit makineler işi <strong>kolaylaştırır</strong> ama <strong>azaltmaz!</strong></p>
            <ul className="space-y-1 mt-2 ml-4">
              <li>• Kuvvet kazancı varsa → Yol kaybı vardır</li>
              <li>• Yol kazancı varsa → Kuvvet kaybı vardır</li>
              <li>• Toplam iş her zaman aynı kalır</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
