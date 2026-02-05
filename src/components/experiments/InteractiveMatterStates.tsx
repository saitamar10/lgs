import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Thermometer, Snowflake, Droplet, Wind } from 'lucide-react';

type MatterState = 'solid' | 'liquid' | 'gas';

export function InteractiveMatterStates() {
  const [phase, setPhase] = useState<'intro' | 'experiment'>('intro');
  const [temperature, setTemperature] = useState(-10); // Celsius
  const [substance, setSubstance] = useState<'water' | 'iron' | 'nitrogen'>('water');

  // Madde özellikleri
  const substances = {
    water: {
      name: 'Su (H₂O)',
      meltingPoint: 0,
      boilingPoint: 100,
      solidName: 'Buz',
      liquidName: 'Su',
      gasName: 'Su Buharı',
      color: {
        solid: '#E0F2FE',
        liquid: '#3B82F6',
        gas: '#DBEAFE'
      }
    },
    iron: {
      name: 'Demir (Fe)',
      meltingPoint: 1538,
      boilingPoint: 2862,
      solidName: 'Katı Demir',
      liquidName: 'Erimiş Demir',
      gasName: 'Demir Buharı',
      color: {
        solid: '#71717A',
        liquid: '#EF4444',
        gas: '#FCA5A5'
      }
    },
    nitrogen: {
      name: 'Azot (N₂)',
      meltingPoint: -210,
      boilingPoint: -196,
      solidName: 'Katı Azot',
      liquidName: 'Sıvı Azot',
      gasName: 'Azot Gazı',
      color: {
        solid: '#DBEAFE',
        liquid: '#60A5FA',
        gas: '#E0E7FF'
      }
    }
  };

  const currentSubstance = substances[substance];

  // Mevcut hali belirle
  const getMatterState = (): MatterState => {
    if (temperature < currentSubstance.meltingPoint) return 'solid';
    if (temperature < currentSubstance.boilingPoint) return 'liquid';
    return 'gas';
  };

  const state = getMatterState();

  // Molekül sayısı ve animasyon hızı
  const getMoleculeCount = () => {
    if (state === 'solid') return 25;
    if (state === 'liquid') return 20;
    return 15;
  };

  const getAnimationSpeed = () => {
    if (state === 'solid') return 0.5;
    if (state === 'liquid') return 2;
    return 4;
  };

  const getStateColor = () => {
    return currentSubstance.color[state];
  };

  const getStateName = () => {
    if (state === 'solid') return currentSubstance.solidName;
    if (state === 'liquid') return currentSubstance.liquidName;
    return currentSubstance.gasName;
  };

  const getStateIcon = () => {
    if (state === 'solid') return <Snowflake className="w-8 h-8" />;
    if (state === 'liquid') return <Droplet className="w-8 h-8" />;
    return <Wind className="w-8 h-8" />;
  };

  const renderIntro = () => (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
          <Thermometer className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Maddenin Halleri Deneyi</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Sıcaklığı değiştirerek maddenin hallerini gözlemleyelim!
          Katı, sıvı ve gaz hallerini keşfedeceğiz.
        </p>
      </div>

      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <Thermometer className="w-5 h-5" />
          Öğreneceklerimiz
        </h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Maddenin üç hali: Katı, Sıvı, Gaz</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Sıcaklığın moleküllerin hareketi üzerindeki etkisi</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Erime noktası ve kaynama noktası kavramları</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Farklı maddelerin farklı erime ve kaynama noktaları</span>
          </li>
        </ul>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card
          className={`p-6 cursor-pointer transition-all border-2 ${
            substance === 'water'
              ? 'border-blue-500 bg-blue-50 shadow-lg'
              : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => setSubstance('water')}
        >
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-400 rounded-full mx-auto flex items-center justify-center">
              <Droplet className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold">Su (H₂O)</h4>
            <p className="text-sm text-gray-600">
              Erime: 0°C<br />
              Kaynama: 100°C
            </p>
          </div>
        </Card>

        <Card
          className={`p-6 cursor-pointer transition-all border-2 ${
            substance === 'iron'
              ? 'border-gray-500 bg-gray-50 shadow-lg'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setSubstance('iron')}
        >
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-gray-600 rounded-full mx-auto flex items-center justify-center">
              <div className="w-6 h-6 bg-gray-400 rounded" />
            </div>
            <h4 className="font-bold">Demir (Fe)</h4>
            <p className="text-sm text-gray-600">
              Erime: 1538°C<br />
              Kaynama: 2862°C
            </p>
          </div>
        </Card>

        <Card
          className={`p-6 cursor-pointer transition-all border-2 ${
            substance === 'nitrogen'
              ? 'border-indigo-500 bg-indigo-50 shadow-lg'
              : 'border-gray-200 hover:border-indigo-300'
          }`}
          onClick={() => setSubstance('nitrogen')}
        >
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-indigo-400 rounded-full mx-auto flex items-center justify-center">
              <Wind className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold">Azot (N₂)</h4>
            <p className="text-sm text-gray-600">
              Erime: -210°C<br />
              Kaynama: -196°C
            </p>
          </div>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={() => setPhase('experiment')}
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
        >
          Deneye Başla
        </Button>
      </div>
    </div>
  );

  const renderExperiment = () => {
    const moleculeCount = getMoleculeCount();
    const animationSpeed = getAnimationSpeed();

    return (
      <div className="space-y-6 animate-in fade-in-50 duration-500">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">{currentSubstance.name}</h2>
          <p className="text-gray-600 mt-2">
            Sıcaklığı değiştirerek maddenin hallerini gözlemle
          </p>
        </div>

        {/* Molekül Görselleştirme */}
        <Card className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 border-2">
          <div className="relative w-full aspect-square max-w-md mx-auto rounded-2xl overflow-hidden border-4 border-gray-300"
            style={{
              backgroundColor: getStateColor(),
              transition: 'background-color 0.5s ease'
            }}
          >
            {/* Moleküller */}
            <div className="absolute inset-0 p-4">
              {Array.from({ length: moleculeCount }).map((_, i) => {
                // Katıda düzenli diziliş
                if (state === 'solid') {
                  const cols = 5;
                  const row = Math.floor(i / cols);
                  const col = i % cols;
                  const spacing = 60;
                  return (
                    <div
                      key={i}
                      className="absolute w-8 h-8 rounded-full shadow-lg"
                      style={{
                        backgroundColor: state === 'solid' ? '#60A5FA' : '#3B82F6',
                        left: `${col * spacing + 20}px`,
                        top: `${row * spacing + 20}px`,
                        animation: `vibrate ${1 / animationSpeed}s ease-in-out infinite`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  );
                }

                // Sıvıda ve gazda rastgele hareket
                const randomX = Math.random() * 100;
                const randomY = Math.random() * 100;
                const randomDelay = Math.random() * 2;

                return (
                  <div
                    key={i}
                    className="absolute w-8 h-8 rounded-full shadow-lg"
                    style={{
                      backgroundColor: state === 'liquid' ? '#3B82F6' : '#93C5FD',
                      left: `${randomX}%`,
                      top: `${randomY}%`,
                      animation: state === 'liquid'
                        ? `float ${3 / animationSpeed}s ease-in-out infinite`
                        : `scatter ${2 / animationSpeed}s ease-in-out infinite`,
                      animationDelay: `${randomDelay}s`,
                      opacity: state === 'gas' ? 0.6 : 1
                    }}
                  />
                );
              })}
            </div>

            {/* Durum Göstergesi */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
              <div style={{ color: getStateColor() === '#DBEAFE' || getStateColor() === '#E0F2FE' ? '#3B82F6' : getStateColor() }}>
                {getStateIcon()}
              </div>
              <div>
                <div className="text-xs text-gray-600">Hal</div>
                <div className="font-bold">{getStateName()}</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Sıcaklık Kontrolü */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="font-semibold flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-red-500" />
                Sıcaklık Kontrolü
              </label>
              <div className="text-right">
                <div className="text-3xl font-bold text-red-600">{temperature}°C</div>
              </div>
            </div>

            <Slider
              value={[temperature]}
              onValueChange={([val]) => setTemperature(val)}
              min={substance === 'nitrogen' ? -220 : substance === 'water' ? -20 : 0}
              max={substance === 'nitrogen' ? -180 : substance === 'water' ? 120 : 3000}
              step={substance === 'iron' ? 10 : 1}
              className="mb-4"
            />

            {/* Kritik Noktalar */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-3 rounded-lg border-2 transition-all ${
                temperature < currentSubstance.meltingPoint
                  ? 'bg-blue-100 border-blue-500'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="text-xs text-gray-600">Erime Noktası</div>
                <div className="text-xl font-bold text-blue-600">
                  {currentSubstance.meltingPoint}°C
                </div>
              </div>
              <div className={`p-3 rounded-lg border-2 transition-all ${
                temperature >= currentSubstance.meltingPoint && temperature < currentSubstance.boilingPoint
                  ? 'bg-orange-100 border-orange-500'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="text-xs text-gray-600">Kaynama Noktası</div>
                <div className="text-xl font-bold text-orange-600">
                  {currentSubstance.boilingPoint}°C
                </div>
              </div>
            </div>

            {/* Hızlı Sıcaklık Ayarları */}
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setTemperature(currentSubstance.meltingPoint - 10)}
                className="flex-1"
              >
                ❄️ Katı Halde
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setTemperature((currentSubstance.meltingPoint + currentSubstance.boilingPoint) / 2)}
                className="flex-1"
              >
                💧 Sıvı Halde
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setTemperature(currentSubstance.boilingPoint + 10)}
                className="flex-1"
              >
                💨 Gaz Halde
              </Button>
            </div>
          </div>
        </Card>

        {/* Açıklama */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
          <h3 className="font-semibold text-purple-900 mb-3">
            📚 {state === 'solid' ? 'Katı Hal' : state === 'liquid' ? 'Sıvı Hal' : 'Gaz Hali'}
          </h3>
          <div className="space-y-2 text-purple-800 text-sm">
            {state === 'solid' && (
              <>
                <p>
                  <strong>Katı halde:</strong> Moleküller birbirine çok yakın ve düzenli dizilmiştir.
                </p>
                <p>• Moleküller yerlerinde titreyerek hareket eder (düşük kinetik enerji)</p>
                <p>• Belirli şekil ve hacim vardır</p>
                <p>• Sıkıştırılması zordur</p>
                <p className="mt-3 text-blue-700">
                  💡 Sıcaklığı <strong>{currentSubstance.meltingPoint}°C</strong> üzerine çıkar → Erime başlar
                </p>
              </>
            )}
            {state === 'liquid' && (
              <>
                <p>
                  <strong>Sıvı halde:</strong> Moleküller birbirine yakın ama düzensiz dizilmiştir.
                </p>
                <p>• Moleküller kayarak hareket eder (orta kinetik enerji)</p>
                <p>• Belirli hacim vardır ama şekil alır</p>
                <p>• Akıcıdır, kaba göre şekil alır</p>
                <p className="mt-3 text-orange-700">
                  💡 Sıcaklığı <strong>{currentSubstance.boilingPoint}°C</strong> üzerine çıkar → Buharlaşma başlar
                </p>
              </>
            )}
            {state === 'gas' && (
              <>
                <p>
                  <strong>Gaz halde:</strong> Moleküller çok uzak ve tamamen düzensizdir.
                </p>
                <p>• Moleküller hızla hareket eder (yüksek kinetik enerji)</p>
                <p>• Belirli şekil ve hacim yoktur</p>
                <p>• Bulunduğu kabın tamamını doldurur</p>
                <p>• Kolayca sıkıştırılabilir</p>
                <p className="mt-3 text-red-700">
                  💡 Sıcaklığı <strong>{currentSubstance.boilingPoint}°C</strong> altına indir → Yoğunlaşma başlar
                </p>
              </>
            )}
          </div>
        </Card>

        {/* Molekül Hızı Göstergesi */}
        <Card className="p-6 bg-green-50 border-green-200">
          <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
            <Wind className="w-5 h-5" />
            Molekül Hareketi
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-800">Hareket Hızı:</span>
              <span className="font-bold text-green-900">{animationSpeed.toFixed(1)}x</span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(animationSpeed / 4) * 100}%` }}
              />
            </div>
            <p className="text-xs text-green-700 mt-2">
              Sıcaklık arttıkça moleküllerin kinetik enerjisi ve hareket hızı artar
            </p>
          </div>
        </Card>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => {
              setPhase('intro');
              setTemperature(-10);
            }}
            variant="outline"
          >
            ← Madde Seç
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {phase === 'intro' && renderIntro()}
        {phase === 'experiment' && renderExperiment()}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes vibrate {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(2px, 2px); }
          50% { transform: translate(-2px, -2px); }
          75% { transform: translate(-2px, 2px); }
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(10px, -10px); }
          50% { transform: translate(-10px, 10px); }
          75% { transform: translate(5px, 5px); }
        }

        @keyframes scatter {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(30px, -30px); }
          50% { transform: translate(-30px, 30px); }
          75% { transform: translate(20px, -20px); }
        }
      `}</style>
    </div>
  );
}
