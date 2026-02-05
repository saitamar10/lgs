import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Zap, Lightbulb, Battery, Power } from 'lucide-react';

export function InteractiveElectricCircuit() {
  const [phase, setPhase] = useState<'intro' | 'series' | 'parallel'>('intro');
  const [voltage, setVoltage] = useState(4.5); // 1.5V x 3 pil
  const [switchClosed, setSwitchClosed] = useState(false);
  const [batteryCount, setBatteryCount] = useState(3);
  const [bulbCount, setBulbCount] = useState(1);
  const [circuitType, setCircuitType] = useState<'series' | 'parallel'>('series');

  // Hesaplamalar
  const totalVoltage = batteryCount * 1.5; // Her pil 1.5V
  const bulbResistance = 10; // Ohm (sabit)

  let current = 0;
  let voltagePerBulb = 0;
  let brightness = 0;

  if (switchClosed) {
    if (circuitType === 'series') {
      // Seri bağlantı: Toplam direnç artar
      const totalResistance = bulbResistance * bulbCount;
      current = totalVoltage / totalResistance; // I = V / R
      voltagePerBulb = totalVoltage / bulbCount;
      brightness = (voltagePerBulb / (1.5 * batteryCount)) * 100;
    } else {
      // Paralel bağlantı: Voltaj sabit kalır
      voltagePerBulb = totalVoltage;
      current = (totalVoltage / bulbResistance) * bulbCount;
      brightness = Math.min((voltagePerBulb / 4.5) * 100, 100);
    }
  }

  const renderIntro = () => (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto">
          <Zap className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Elektrik Devresi Deneyi</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Elektrik devresinin nasıl çalıştığını öğrenelim! Pil, ampul ve anahtar kullanarak
          seri ve paralel bağlantıların farklarını keşfedeceğiz.
        </p>
      </div>

      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Öğreneceklerimiz
        </h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Elektrik devresinin temel bileşenleri (pil, ampul, anahtar)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Kapalı devre ve açık devre farkı</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Seri ve paralel bağlantı arasındaki farklar</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Voltaj, akım ve direnç ilişkisi (Ohm Kanunu: V = I × R)</span>
          </li>
        </ul>
      </Card>

      <div className="flex gap-4 justify-center">
        <Button
          onClick={() => setPhase('series')}
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        >
          Seri Bağlantı Deneyi
        </Button>
        <Button
          onClick={() => {
            setPhase('parallel');
            setCircuitType('parallel');
          }}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
        >
          Paralel Bağlantı Deneyi
        </Button>
      </div>
    </div>
  );

  const renderCircuit = () => {
    const isSeriesPhase = phase === 'series';

    return (
      <div className="space-y-6 animate-in fade-in-50 duration-500">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {isSeriesPhase ? 'Seri Bağlantı' : 'Paralel Bağlantı'} Devresi
          </h2>
          <p className="text-gray-600 mt-2">
            {isSeriesPhase
              ? 'Ampuller arka arkaya bağlı. Voltaj paylaşılır.'
              : 'Ampuller yan yana bağlı. Voltaj her ampulde aynı.'}
          </p>
        </div>

        {/* Devre Görseli */}
        <Card className="p-8 bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="relative">
            {/* Piller */}
            <div className="flex gap-2 justify-center mb-8">
              {Array.from({ length: batteryCount }).map((_, i) => (
                <div
                  key={i}
                  className="relative w-16 h-24 bg-gradient-to-b from-zinc-700 to-zinc-800 rounded-lg flex items-center justify-center border-2 border-zinc-600"
                >
                  <Battery className="w-8 h-8 text-yellow-400" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    +
                  </div>
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    -
                  </div>
                </div>
              ))}
            </div>

            {/* Anahtar */}
            <div className="flex justify-center mb-8">
              <button
                onClick={() => setSwitchClosed(!switchClosed)}
                className={`relative w-32 h-16 rounded-xl border-4 transition-all duration-300 ${
                  switchClosed
                    ? 'bg-green-500 border-green-600 shadow-lg shadow-green-500/50'
                    : 'bg-red-500 border-red-600 shadow-lg shadow-red-500/50'
                }`}
              >
                <div className="flex flex-col items-center justify-center h-full text-white">
                  <Power className="w-6 h-6 mb-1" />
                  <span className="text-xs font-bold">
                    {switchClosed ? 'AÇIK' : 'KAPALI'}
                  </span>
                </div>
              </button>
            </div>

            {/* Ampuller */}
            <div className={`flex gap-4 justify-center ${circuitType === 'series' ? 'flex-row' : 'flex-col items-center'}`}>
              {Array.from({ length: bulbCount }).map((_, i) => (
                <div
                  key={i}
                  className="relative"
                >
                  <div
                    className={`w-20 h-20 rounded-full border-4 border-yellow-600 flex items-center justify-center transition-all duration-300 ${
                      switchClosed
                        ? `bg-yellow-400 shadow-lg shadow-yellow-500/50`
                        : 'bg-gray-200'
                    }`}
                    style={{
                      opacity: switchClosed ? Math.max(0.3, Math.min(brightness / 100, 1)) : 0.3,
                      boxShadow: switchClosed
                        ? `0 0 ${brightness / 2}px rgba(250, 204, 21, ${brightness / 100})`
                        : 'none'
                    }}
                  >
                    <Lightbulb
                      className={`w-10 h-10 transition-colors duration-300 ${
                        switchClosed ? 'text-orange-600' : 'text-gray-400'
                      }`}
                    />
                  </div>
                  {switchClosed && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-semibold text-gray-700 whitespace-nowrap">
                      {voltagePerBulb.toFixed(1)}V
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Kablolar (Görsel) */}
            {switchClosed && (
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full">
                  <defs>
                    <linearGradient id="currentFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            )}
          </div>
        </Card>

        {/* Kontroller */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pil Sayısı: {batteryCount} adet (Toplam: {totalVoltage.toFixed(1)}V)
            </label>
            <Slider
              value={[batteryCount]}
              onValueChange={([val]) => setBatteryCount(val)}
              min={1}
              max={6}
              step={1}
              className="mb-2"
            />
            <p className="text-xs text-gray-500">Her pil 1.5V üretir</p>
          </Card>

          <Card className="p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ampul Sayısı: {bulbCount} adet
            </label>
            <Slider
              value={[bulbCount]}
              onValueChange={([val]) => setBulbCount(val)}
              min={1}
              max={4}
              step={1}
              className="mb-2"
            />
            <p className="text-xs text-gray-500">
              {circuitType === 'series' ? 'Seri bağlı ampuller' : 'Paralel bağlı ampuller'}
            </p>
          </Card>
        </div>

        {/* Ölçüm Sonuçları */}
        {switchClosed && (
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <h3 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Ölçüm Sonuçları
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="text-sm text-gray-600 mb-1">Toplam Voltaj</div>
                <div className="text-2xl font-bold text-green-700">{totalVoltage.toFixed(1)}V</div>
                <div className="text-xs text-gray-500 mt-1">{batteryCount} × 1.5V</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="text-sm text-gray-600 mb-1">Devre Akımı</div>
                <div className="text-2xl font-bold text-blue-700">{current.toFixed(2)}A</div>
                <div className="text-xs text-gray-500 mt-1">I = V ÷ R</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="text-sm text-gray-600 mb-1">Ampul Parlaklığı</div>
                <div className="text-2xl font-bold text-yellow-700">{brightness.toFixed(0)}%</div>
                <div className="text-xs text-gray-500 mt-1">{voltagePerBulb.toFixed(1)}V/ampul</div>
              </div>
            </div>
          </Card>
        )}

        {/* Açıklama */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">
            {circuitType === 'series' ? '📚 Seri Bağlantı' : '📚 Paralel Bağlantı'}
          </h3>
          <div className="space-y-2 text-blue-800 text-sm">
            {circuitType === 'series' ? (
              <>
                <p>
                  <strong>Seri bağlantıda:</strong> Ampuller arka arkaya bağlanır.
                  Aynı akım tüm ampullerden geçer.
                </p>
                <p>
                  • Toplam voltaj ampuller arasında paylaşılır: {totalVoltage.toFixed(1)}V ÷ {bulbCount} = {voltagePerBulb.toFixed(1)}V
                </p>
                <p>
                  • Bir ampul bozulursa devre açılır ve diğerleri de söner
                </p>
                <p>
                  • Ampul sayısı arttıkça parlaklık azalır
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>Paralel bağlantıda:</strong> Ampuller yan yana bağlanır.
                  Her ampul pilin tam voltajını alır.
                </p>
                <p>
                  • Her ampul {totalVoltage.toFixed(1)}V alır (voltaj paylaşılmaz)
                </p>
                <p>
                  • Bir ampul bozulsa bile diğerleri çalışmaya devam eder
                </p>
                <p>
                  • Ampul sayısı artarsa toplam akım artar: {current.toFixed(2)}A
                </p>
              </>
            )}
          </div>
        </Card>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => {
              setPhase('intro');
              setSwitchClosed(false);
              setCircuitType('series');
            }}
            variant="outline"
          >
            ← Başa Dön
          </Button>
          <Button
            onClick={() => {
              if (isSeriesPhase) {
                setPhase('parallel');
                setCircuitType('parallel');
                setSwitchClosed(false);
              } else {
                setPhase('series');
                setCircuitType('series');
                setSwitchClosed(false);
              }
            }}
            className="bg-gradient-to-r from-purple-500 to-purple-600"
          >
            {isSeriesPhase ? 'Paralel Bağlantıyı Dene →' : '← Seri Bağlantıyı Dene'}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {phase === 'intro' && renderIntro()}
        {(phase === 'series' || phase === 'parallel') && renderCircuit()}
      </div>
    </div>
  );
}
