import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Cylinder, Torus } from '@react-three/drei';
import * as THREE from 'three';

/*
═══════════════════════════════════════════════════════════════
BİYOTEKNOLOJİ - 3D SANAL LABORATUVAR
═══════════════════════════════════════════════════════════════
KONU: Gen aktarımı, GMO, klonlama
AMAÇ: Biyoteknoloji uygulamalarını görselleştirmek
*/

type PanelType = 'info' | 'observation' | null;
type BiotechType = 'gen-aktarim' | 'gmo' | 'klonlama';

function DNAHelix({ color, position }: { color: string, position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.01;
  });

  return (
    <group ref={ref} position={position}>
      {[...Array(10)].map((_, i) => {
        const y = (i - 5) * 0.3;
        const angle = i * 0.5;
        return (
          <group key={i}>
            <Sphere args={[0.08, 12, 12]} position={[Math.cos(angle) * 0.3, y, Math.sin(angle) * 0.3]}>
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
            </Sphere>
          </group>
        );
      })}
    </group>
  );
}

export function Biotechnology3D() {
  const [biotechType, setBiotechType] = useState<BiotechType>('gen-aktarim');
  const [openPanel, setOpenPanel] = useState<PanelType>(null);

  const togglePanel = (panel: PanelType) => {
    setOpenPanel(openPanel === panel ? null : panel);
  };

  const getInfo = () => {
    switch (biotechType) {
      case 'gen-aktarim':
        return { name: 'Gen Aktarımı', desc: 'İstenen gen başka organizmaya aktarılır', color: 'text-blue-400' };
      case 'gmo':
        return { name: 'GMO (Transgenik)', desc: 'Genetiği değiştirilmiş organizma', color: 'text-green-400' };
      case 'klonlama':
        return { name: 'Klonlama', desc: 'Genetik olarak aynı kopyalar', color: 'text-purple-400' };
    }
  };

  const info = getInfo();

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 relative">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <color attach="background" args={['#0a1520']} />
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={1.5} />

          {biotechType === 'gen-aktarim' && (
            <>
              <DNAHelix color="#3b82f6" position={[-2, 0, 0]} />
              <DNAHelix color="#22c55e" position={[2, 0, 0]} />
              <Sphere args={[0.2, 16, 16]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} />
              </Sphere>
            </>
          )}

          {biotechType === 'gmo' && (
            <group>
              <DNAHelix color="#22c55e" position={[0, 0, 0]} />
              <Torus args={[1.5, 0.1, 16, 32]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
              </Torus>
            </group>
          )}

          {biotechType === 'klonlama' && (
            <>
              <DNAHelix color="#a855f7" position={[-1.5, 0, 0]} />
              <DNAHelix color="#a855f7" position={[0, 0, 0]} />
              <DNAHelix color="#a855f7" position={[1.5, 0, 0]} />
            </>
          )}

          <Text position={[0, 4, 0]} fontSize={0.4} color="#00D9FF" anchorX="center" anchorY="middle">
            BİYOTEKNOLOJİ
          </Text>

          <OrbitControls enableZoom={true} />
        </Canvas>

        <div className="absolute top-4 right-4 hidden md:flex gap-2">
          <button
            onClick={() => togglePanel('info')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              openPanel === 'info' ? 'bg-cyan-500 text-white' : 'bg-black/70 text-cyan-400 hover:bg-black/90'
            }`}>
            ℹ️ Bilgi
          </button>
          <button
            onClick={() => togglePanel('observation')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              openPanel === 'observation' ? 'bg-purple-500 text-white' : 'bg-black/70 text-purple-400 hover:bg-black/90'
            }`}>
            🔬 Gözlem
          </button>
        </div>
      </div>

      <div className="bg-black/95 border-t-2 border-cyan-500 p-3 md:p-4">
        <div className="grid grid-cols-3 gap-2 mb-3">
          <button
            onClick={() => setBiotechType('gen-aktarim')}
            className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${
              biotechType === 'gen-aktarim' ? 'bg-blue-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}>
            🧬 Gen Aktarım
          </button>
          <button
            onClick={() => setBiotechType('gmo')}
            className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${
              biotechType === 'gmo' ? 'bg-green-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}>
            🌱 GMO
          </button>
          <button
            onClick={() => setBiotechType('klonlama')}
            className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${
              biotechType === 'klonlama' ? 'bg-purple-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}>
            👥 Klonlama
          </button>
        </div>

        <div className="flex md:hidden gap-2 mt-2">
          <button
            onClick={() => togglePanel('observation')}
            className={`flex-1 py-3 rounded-lg font-bold text-sm ${
              openPanel === 'observation' ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300'
            }`}>
            🔬 Gözlem
          </button>
          <button
            onClick={() => togglePanel('info')}
            className={`flex-1 py-3 rounded-lg font-bold text-sm ${
              openPanel === 'info' ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300'
            }`}>
            ℹ️ Bilgi
          </button>
        </div>
      </div>

      {openPanel && (
        <div className="hidden md:block absolute top-20 right-4 w-80 max-h-[70vh] overflow-y-auto bg-black/95 backdrop-blur-sm rounded-lg border-2 border-cyan-500 shadow-xl">
          <div className="sticky top-0 bg-black/95 p-3 border-b border-cyan-500 flex justify-between items-center">
            <h3 className="font-bold text-cyan-400">
              {openPanel === 'info' && 'ℹ️ Bilimsel Açıklama'}
              {openPanel === 'observation' && '🔬 Gözlem'}
            </h3>
            <button onClick={() => setOpenPanel(null)} className="text-white hover:text-red-400 text-xl font-bold">×</button>
          </div>

          <div className="p-4 text-white text-sm space-y-3">
            {openPanel === 'info' && (
              <>
                <p className="font-bold text-green-400">Şu anda ne görüyorsun?</p>
                <ul className="space-y-2 text-xs">
                  <li>• <strong>Biyoteknoloji:</strong> Canlıları teknolojik amaçla kullanma</li>
                  <li>• <strong>Gen Aktarımı:</strong> Yararlı gen ekleme</li>
                  <li>• <strong>GMO:</strong> Transgenik organizma</li>
                  <li>• <strong>Klonlama:</strong> Aynı genetik kopya</li>
                  <li className="text-yellow-300">⚠️ İnsulin, aşı üretiminde kullanılır!</li>
                </ul>
              </>
            )}

            {openPanel === 'observation' && (
              <>
                <div className="bg-blue-900/50 p-3 rounded">
                  <p className="font-bold text-sm">Uygulama</p>
                  <p className={`text-lg font-bold ${info.color}`}>{info.name}</p>
                  <p className="text-xs mt-1">{info.desc}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {openPanel && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/98 backdrop-blur-sm border-t-4 border-cyan-500 rounded-t-3xl shadow-2xl max-h-[40vh] overflow-y-auto z-50">
          <div className="sticky top-0 bg-black/95 p-4 border-b border-cyan-500 flex justify-between items-center">
            <h3 className="font-bold text-cyan-400 text-base">
              {openPanel === 'info' && 'ℹ️ Bilimsel Açıklama'}
              {openPanel === 'observation' && '🔬 Gözlem'}
            </h3>
            <button onClick={() => setOpenPanel(null)} className="text-white text-2xl font-bold w-10 h-10 flex items-center justify-center">×</button>
          </div>

          <div className="p-4 text-white space-y-3">
            {openPanel === 'info' && (
              <>
                <p className="font-bold text-green-400 text-sm">Şu anda ne görüyorsun?</p>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Gen Aktarımı:</strong> Yararlı gen ekleme</li>
                  <li>• <strong>GMO:</strong> Transgenik organizma</li>
                  <li>• <strong>Klonlama:</strong> Aynı kopya</li>
                  <li className="text-yellow-300">⚠️ İlaç üretiminde kullanılır!</li>
                </ul>
              </>
            )}

            {openPanel === 'observation' && (
              <>
                <div className="bg-blue-900/50 p-3 rounded-lg">
                  <p className="font-bold text-sm">Uygulama</p>
                  <p className={`text-xl font-bold ${info.color}`}>{info.name}</p>
                  <p className="text-sm mt-1">{info.desc}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
