import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Sun, Droplet, Wind, Sprout, Leaf, TrendingUp } from 'lucide-react';

export function InteractivePhotosynthesis() {
  const [phase, setPhase] = useState<'intro' | 'experiment'>('intro');
  const [lightIntensity, setLightIntensity] = useState(70); // 0-100%
  const [waterLevel, setWaterLevel] = useState(80); // 0-100%
  const [co2Level, setCo2Level] = useState(60); // 0-100%

  // Fotosentez oranı hesaplama (en düşük faktör sınırlar - Liebig'in Minimum Yasası)
  const limitingFactor = Math.min(lightIntensity, waterLevel, co2Level);
  const photosynthesisRate = limitingFactor; // 0-100%

  // Ürün hesaplamaları
  const oxygenProduced = (photosynthesisRate / 100) * 6; // mol O2
  const glucoseProduced = (photosynthesisRate / 100) * 1; // mol C6H12O6

  // Bitki sağlığı (tüm faktörlerin ortalaması)
  const plantHealth = (lightIntensity + waterLevel + co2Level) / 3;

  // Yaprak rengi (sağlığa göre)
  const getLeafColor = () => {
    if (plantHealth > 70) return '#22c55e'; // Koyu yeşil
    if (plantHealth > 40) return '#84cc16'; // Açık yeşil
    if (plantHealth > 20) return '#eab308'; // Sarı
    return '#ef4444'; // Kırmızı/kahverengi
  };

  // Hangi faktör sınırlayıcı?
  const getLimitingFactor = () => {
    if (lightIntensity <= waterLevel && lightIntensity <= co2Level) return 'light';
    if (waterLevel <= lightIntensity && waterLevel <= co2Level) return 'water';
    return 'co2';
  };

  const renderIntro = () => (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
          <Leaf className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Fotosentez Deneyi</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Bitkiler nasıl besin üretir? Işık, su ve karbondioksit kullanarak fotosentez sürecini keşfedelim!
        </p>
      </div>

      <Card className="p-6 bg-green-50 border-green-200">
        <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
          <Sprout className="w-5 h-5" />
          Öğreneceklerimiz
        </h3>
        <ul className="space-y-2 text-green-800">
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">•</span>
            <span>Fotosentez için gerekli faktörler (Işık, Su, CO₂)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">•</span>
            <span>Fotosentez denklemi: 6CO₂ + 6H₂O + Işık → C₆H₁₂O₆ + 6O₂</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">•</span>
            <span>Liebig'in Minimum Yasası (Sınırlayıcı faktör)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">•</span>
            <span>Klorofil ve ışık emilimi</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">•</span>
            <span>Glikoz ve oksijen üretimi</span>
          </li>
        </ul>
      </Card>

      <div className="flex justify-center">
        <Button
          onClick={() => setPhase('experiment')}
          size="lg"
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
        >
          Deneye Başla
        </Button>
      </div>
    </div>
  );

  const renderExperiment = () => {
    const limitingFactorName = getLimitingFactor();

    return (
      <div className="space-y-6 animate-in fade-in-50 duration-500">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Fotosentez Simülasyonu</h2>
          <p className="text-gray-600 mt-2">
            Işık, su ve CO₂ miktarını ayarlayarak fotosentez oranını kontrol et
          </p>
        </div>

        {/* Bitki Görseli */}
        <Card className="p-8 bg-gradient-to-br from-sky-50 to-green-50">
          <div className="relative w-full max-w-md mx-auto">
            {/* Güneş */}
            <div
              className="absolute -top-8 right-4 transition-all duration-500"
              style={{
                opacity: lightIntensity / 100,
                transform: `scale(${0.5 + (lightIntensity / 200)})`
              }}
            >
              <Sun className="w-16 h-16 text-yellow-400" />
              <div className="absolute inset-0 bg-yellow-300 rounded-full blur-xl opacity-50" />
            </div>

            {/* CO2 Bulutları */}
            <div className="absolute top-0 left-0 flex gap-2">
              {Array.from({ length: Math.ceil(co2Level / 25) }).map((_, i) => (
                <div
                  key={i}
                  className="text-2xl animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  💨
                </div>
              ))}
            </div>

            {/* Bitki */}
            <div className="relative aspect-square flex items-end justify-center">
              {/* Saksı */}
              <div className="absolute bottom-0 w-48 h-32 bg-gradient-to-b from-amber-600 to-amber-700 rounded-b-full" />

              {/* Toprak */}
              <div className="absolute bottom-0 w-48 h-20 bg-gradient-to-b from-amber-800 to-amber-900 rounded-b-full" />

              {/* Gövde */}
              <div className="absolute bottom-16 w-4 h-32 bg-gradient-to-b from-green-700 to-green-800 rounded-t-lg z-10" />

              {/* Yapraklar */}
              <div className="absolute bottom-32 flex gap-8 z-20">
                {/* Sol yaprak */}
                <div
                  className="relative"
                  style={{
                    color: getLeafColor(),
                    transform: `scale(${0.7 + (plantHealth / 200)})`,
                    transition: 'all 0.5s ease'
                  }}
                >
                  <Leaf className="w-20 h-20 -rotate-45" />
                </div>

                {/* Sağ yaprak */}
                <div
                  className="relative"
                  style={{
                    color: getLeafColor(),
                    transform: `scale(${0.7 + (plantHealth / 200)}) scaleX(-1)`,
                    transition: 'all 0.5s ease'
                  }}
                >
                  <Leaf className="w-20 h-20 rotate-45" />
                </div>
              </div>

              {/* Oksijen kabarcıkları */}
              {photosynthesisRate > 20 && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-2">
                  {Array.from({ length: Math.ceil(photosynthesisRate / 30) }).map((_, i) => (
                    <div
                      key={i}
                      className="text-3xl animate-bounce"
                      style={{ animationDelay: `${i * 0.3}s` }}
                    >
                      🫧
                    </div>
                  ))}
                </div>
              )}

              {/* Su damlası (yağmur) */}
              {waterLevel > 30 && (
                <div className="absolute bottom-24 right-8">
                  <Droplet
                    className="w-8 h-8 text-blue-400 animate-pulse"
                    style={{ opacity: waterLevel / 100 }}
                  />
                </div>
              )}
            </div>

            {/* Bitki Sağlığı Göstergesi */}
            <div className="mt-8 text-center">
              <div className="text-sm text-gray-600 mb-1">Bitki Sağlığı</div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${plantHealth}%`,
                    backgroundColor: getLeafColor()
                  }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">{plantHealth.toFixed(0)}%</div>
            </div>
          </div>
        </Card>

        {/* Kontroller */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sun className="w-5 h-5 text-yellow-500" />
              <label className="font-semibold text-sm">Işık Şiddeti</label>
            </div>
            <Slider
              value={[lightIntensity]}
              onValueChange={([val]) => setLightIntensity(val)}
              min={0}
              max={100}
              step={1}
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>Karanlık</span>
              <span className="font-bold text-yellow-600">{lightIntensity}%</span>
              <span>Tam Güneş</span>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Droplet className="w-5 h-5 text-blue-500" />
              <label className="font-semibold text-sm">Su Miktarı</label>
            </div>
            <Slider
              value={[waterLevel]}
              onValueChange={([val]) => setWaterLevel(val)}
              min={0}
              max={100}
              step={1}
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>Kuru</span>
              <span className="font-bold text-blue-600">{waterLevel}%</span>
              <span>Bol Su</span>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Wind className="w-5 h-5 text-gray-500" />
              <label className="font-semibold text-sm">CO₂ Miktarı</label>
            </div>
            <Slider
              value={[co2Level]}
              onValueChange={([val]) => setCo2Level(val)}
              min={0}
              max={100}
              step={1}
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>Az</span>
              <span className="font-bold text-gray-700">{co2Level}%</span>
              <span>Çok</span>
            </div>
          </Card>
        </div>

        {/* Fotosentez Oranı */}
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <h3 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Fotosentez Hızı
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-800">Oranı:</span>
              <span className="text-3xl font-bold text-green-600">{photosynthesisRate.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${photosynthesisRate}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Ürünler */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-4">📊 Üretilen Maddeler</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="text-sm text-gray-600 mb-1">Oksijen (O₂)</div>
              <div className="text-2xl font-bold text-blue-600">{oxygenProduced.toFixed(2)} mol</div>
              <div className="text-xs text-gray-500 mt-1">Solunuma gider</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="text-sm text-gray-600 mb-1">Glikoz (C₆H₁₂O₆)</div>
              <div className="text-2xl font-bold text-green-600">{glucoseProduced.toFixed(2)} mol</div>
              <div className="text-xs text-gray-500 mt-1">Besin olarak kullanılır</div>
            </div>
          </div>
        </Card>

        {/* Sınırlayıcı Faktör Uyarısı */}
        {photosynthesisRate < 80 && (
          <Card className="p-4 bg-orange-50 border-orange-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg">⚠️</span>
              </div>
              <div>
                <p className="font-semibold text-orange-900 mb-1">Sınırlayıcı Faktör: {
                  limitingFactorName === 'light' ? '☀️ Işık Şiddeti' :
                  limitingFactorName === 'water' ? '💧 Su Miktarı' : '💨 CO₂ Miktarı'
                }</p>
                <p className="text-sm text-orange-800">
                  {limitingFactorName === 'light' && 'Işık şiddetini artırarak fotosentez oranını yükseltebilirsin!'}
                  {limitingFactorName === 'water' && 'Su miktarını artırarak fotosentez oranını yükseltebilirsin!'}
                  {limitingFactorName === 'co2' && 'CO₂ miktarını artırarak fotosentez oranını yükseltebilirsin!'}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Fotosentez Denklemi */}
        <Card className="p-6 bg-purple-50 border-purple-200">
          <h3 className="font-semibold text-purple-900 mb-3">🧪 Fotosentez Denklemi</h3>
          <div className="bg-white p-4 rounded-lg border-2 border-purple-300">
            <p className="text-center font-mono text-lg">
              <span className="text-gray-700">6CO₂</span>
              {' + '}
              <span className="text-blue-600">6H₂O</span>
              {' + '}
              <span className="text-yellow-600">Işık Enerjisi</span>
              {' → '}
              <span className="text-green-600">C₆H₁₂O₆</span>
              {' + '}
              <span className="text-blue-500">6O₂</span>
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div>
                <p className="font-semibold text-purple-900">Girdiler:</p>
                <ul className="text-purple-800 space-y-1 mt-2">
                  <li>• Karbondioksit (CO₂)</li>
                  <li>• Su (H₂O)</li>
                  <li>• Işık Enerjisi</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-purple-900">Çıktılar:</p>
                <ul className="text-purple-800 space-y-1 mt-2">
                  <li>• Glikoz (C₆H₁₂O₆)</li>
                  <li>• Oksijen (O₂)</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => {
              setPhase('intro');
              setLightIntensity(70);
              setWaterLevel(80);
              setCo2Level(60);
            }}
            variant="outline"
          >
            ← Başa Dön
          </Button>
          <Button
            onClick={() => {
              setLightIntensity(100);
              setWaterLevel(100);
              setCo2Level(100);
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            🌟 Optimal Koşullar
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {phase === 'intro' && renderIntro()}
        {phase === 'experiment' && renderExperiment()}
      </div>
    </div>
  );
}
