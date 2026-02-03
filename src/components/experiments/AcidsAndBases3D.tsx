import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Cylinder } from '@react-three/drei';

/*
═══════════════════════════════════════════════════════════════
ASİTLER VE BAZLAR - 3D SANAL LABORATUVAR
═══════════════════════════════════════════════════════════════
KONU: Asit-baz özellikleri ve pH skalası
AMAÇ: Asit ve bazları görselleştirmek
*/

type PanelType = 'info' | 'observation' | null;
type SubstanceType = 'asit' | 'notr' | 'baz';

export function AcidsAndBases3D() {
  const [substance, setSubstance] = useState<SubstanceType>('notr');
  const [openPanel, setOpenPanel] = useState<PanelType>(null);

  const togglePanel = (panel: PanelType) => {
    setOpenPanel(openPanel === panel ? null : panel);
  };

  const getInfo = () => {
    switch (substance) {
      case 'asit':
        return { name: 'Asit', pH: '0-6', color: '#ef4444', example: 'Limon suyu, Sirke', litmus: 'Kırmızı' };
      case 'notr':
        return { name: 'Nötr', pH: '7', color: '#22c55e', example: 'Su', litmus: 'Değişmez' };
      case 'baz':
        return { name: 'Baz', pH: '8-14', color: '#3b82f6', example: 'Sabun, Deterjan', litmus: 'Mavi' };
    }
  };

  const info = getInfo();

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 relative">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <color attach="background" args={['#0a0a15']} />
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={1.5} />

          {/* pH Skalası */}
          <group position={[0, -2, 0]}>
            {[...Array(15)].map((_, i) => {
              const x = (i - 7) * 0.4;
              const color = i < 7 ? '#ef4444' : i === 7 ? '#22c55e' : '#3b82f6';
              const isActive = (substance === 'asit' && i < 7) || (substance === 'notr' && i === 7) || (substance === 'baz' && i > 7);
              return (
                <Cylinder key={i} args={[0.15, 0.15, isActive ? 1.5 : 0.8]} position={[x, 0, 0]}>
                  <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={isActive ? 0.8 : 0.2}
                  />
                </Cylinder>
              );
            })}
          </group>

          {/* Ana Molekül */}
          <group position={[0, 1, 0]}>
            <Sphere args={[0.8, 32, 32]}>
              <meshStandardMaterial color={info.color} emissive={info.color} emissiveIntensity={0.5} transparent opacity={0.8} />
            </Sphere>
            {substance === 'asit' && (
              <>
                <Sphere args={[0.15, 16, 16]} position={[0.5, 0.5, 0]}>
                  <meshStandardMaterial color="#fbbf24" />
                </Sphere>
                <Text position={[0.7, 0.5, 0]} fontSize={0.3} color="#fff">H⁺</Text>
              </>
            )}
            {substance === 'baz' && (
              <>
                <Sphere args={[0.15, 16, 16]} position={[0.5, 0.5, 0]}>
                  <meshStandardMaterial color="#06b6d4" />
                </Sphere>
                <Text position={[0.7, 0.5, 0]} fontSize={0.3} color="#fff">OH⁻</Text>
              </>
            )}
          </group>

          <Text position={[0, 3.5, 0]} fontSize={0.4} color="#00D9FF" anchorX="center" anchorY="middle">
            ASİTLER VE BAZLAR
          </Text>

          <OrbitControls enableZoom={true} />
        </Canvas>

        <div className="absolute top-4 right-4 hidden md:flex gap-2">
          <button onClick={() => togglePanel('info')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${openPanel === 'info' ? 'bg-cyan-500 text-white' : 'bg-black/70 text-cyan-400 hover:bg-black/90'}`}>ℹ️ Bilgi</button>
          <button onClick={() => togglePanel('observation')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${openPanel === 'observation' ? 'bg-purple-500 text-white' : 'bg-black/70 text-purple-400 hover:bg-black/90'}`}>🔬 Gözlem</button>
        </div>
      </div>

      <div className="bg-black/95 border-t-2 border-cyan-500 p-3 md:p-4">
        <div className="grid grid-cols-3 gap-2 mb-3">
          <button onClick={() => setSubstance('asit')} className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${substance === 'asit' ? 'bg-red-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>🔴 Asit</button>
          <button onClick={() => setSubstance('notr')} className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${substance === 'notr' ? 'bg-green-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>🟢 Nötr</button>
          <button onClick={() => setSubstance('baz')} className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${substance === 'baz' ? 'bg-blue-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>🔵 Baz</button>
        </div>

        <div className="flex md:hidden gap-2 mt-2">
          <button onClick={() => togglePanel('observation')} className={`flex-1 py-3 rounded-lg font-bold text-sm ${openPanel === 'observation' ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300'}`}>🔬 Gözlem</button>
          <button onClick={() => togglePanel('info')} className={`flex-1 py-3 rounded-lg font-bold text-sm ${openPanel === 'info' ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300'}`}>ℹ️ Bilgi</button>
        </div>
      </div>

      {openPanel && (
        <div className="hidden md:block absolute top-20 right-4 w-80 max-h-[70vh] overflow-y-auto bg-black/95 backdrop-blur-sm rounded-lg border-2 border-cyan-500 shadow-xl">
          <div className="sticky top-0 bg-black/95 p-3 border-b border-cyan-500 flex justify-between items-center">
            <h3 className="font-bold text-cyan-400">{openPanel === 'info' && 'ℹ️ Bilimsel Açıklama'}{openPanel === 'observation' && '🔬 Gözlem'}</h3>
            <button onClick={() => setOpenPanel(null)} className="text-white hover:text-red-400 text-xl font-bold">×</button>
          </div>

          <div className="p-4 text-white text-sm space-y-3">
            {openPanel === 'info' && (
              <>
                <p className="font-bold text-green-400">Şu anda ne görüyorsun?</p>
                <ul className="space-y-2 text-xs">
                  <li>• <strong>Asit:</strong> Ekşi tadı var, H⁺ verir (pH 0-6)</li>
                  <li>• <strong>Baz:</strong> Acı/sabunumsu, OH⁻ verir (pH 8-14)</li>
                  <li>• <strong>Nötr:</strong> pH = 7</li>
                  <li>• Turnusol kağıdı ile test edilir</li>
                  <li className="text-yellow-300">⚠️ Asit + Baz = Tuz + Su</li>
                </ul>
              </>
            )}

            {openPanel === 'observation' && (
              <>
                <div className="bg-purple-900/50 p-3 rounded">
                  <p className="font-bold text-sm">Madde Tipi</p>
                  <p className="text-lg font-bold" style={{ color: info.color }}>{info.name}</p>
                  <p className="text-xs mt-1">pH: {info.pH}</p>
                </div>
                <div className="bg-blue-900/50 p-3 rounded">
                  <p className="font-bold text-sm">Örnekler</p>
                  <p className="text-xs">{info.example}</p>
                  <p className="text-xs mt-1">Turnusol: {info.litmus}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {openPanel && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/98 backdrop-blur-sm border-t-4 border-cyan-500 rounded-t-3xl shadow-2xl max-h-[40vh] overflow-y-auto z-50">
          <div className="sticky top-0 bg-black/95 p-4 border-b border-cyan-500 flex justify-between items-center">
            <h3 className="font-bold text-cyan-400 text-base">{openPanel === 'info' && 'ℹ️ Bilimsel Açıklama'}{openPanel === 'observation' && '🔬 Gözlem'}</h3>
            <button onClick={() => setOpenPanel(null)} className="text-white text-2xl font-bold w-10 h-10 flex items-center justify-center">×</button>
          </div>

          <div className="p-4 text-white space-y-3">
            {openPanel === 'info' && (
              <>
                <p className="font-bold text-green-400 text-sm">Şu anda ne görüyorsun?</p>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Asit:</strong> H⁺ verir (pH 0-6)</li>
                  <li>• <strong>Baz:</strong> OH⁻ verir (pH 8-14)</li>
                  <li>• <strong>Nötr:</strong> pH = 7</li>
                  <li className="text-yellow-300">⚠️ Asit + Baz = Tuz + Su</li>
                </ul>
              </>
            )}

            {openPanel === 'observation' && (
              <>
                <div className="bg-purple-900/50 p-3 rounded-lg">
                  <p className="font-bold text-sm">Madde</p>
                  <p className="text-xl font-bold" style={{ color: info.color }}>{info.name}</p>
                  <p className="text-sm mt-1">pH: {info.pH}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
