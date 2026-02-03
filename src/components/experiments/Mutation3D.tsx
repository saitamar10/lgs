import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Html, Torus } from '@react-three/drei';
import * as THREE from 'three';

/*
═══════════════════════════════════════════════════════════════
MUTASYON VE MODİFİKASYON - 3D SANAL LABORATUVAR
═══════════════════════════════════════════════════════════════
KONU: DNA'da mutasyonlar ve gen modifikasyonu
AMAÇ: Mutasyon türlerini ve etkilerini görselleştirmek
*/

type PanelType = 'info' | 'observation' | null;
type MutationType = 'normal' | 'nokta' | 'delesyon' | 'insersiyon';

const BASE_COLORS = {
  A: '#FF6B6B',
  T: '#4ECDC4',
  G: '#FFE66D',
  C: '#95E1D3',
};

// DNA İpliği
function DNAStrand({ sequence, mutation, position }: { sequence: string[], mutation: MutationType, position: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.003;
  });

  return (
    <group ref={ref}>
      {sequence.map((base, i) => {
        const isMutated = mutation !== 'normal' && i === position;
        const y = (i - sequence.length / 2) * 0.4;

        return (
          <group key={i} position={[0, y, 0]}>
            <Sphere args={[isMutated ? 0.18 : 0.12, 16, 16]}>
              <meshStandardMaterial
                color={isMutated ? '#FF0000' : BASE_COLORS[base as keyof typeof BASE_COLORS]}
                emissive={isMutated ? '#FF0000' : BASE_COLORS[base as keyof typeof BASE_COLORS]}
                emissiveIntensity={isMutated ? 0.8 : 0.3}
              />
            </Sphere>
            <Html position={[0, 0, 0]} center>
              <div className={`text-xs font-bold px-1 rounded ${isMutated ? 'bg-red-500 text-white' : 'bg-black/50 text-white'}`}>
                {base}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

export function Mutation3D() {
  const [mutationType, setMutationType] = useState<MutationType>('normal');
  const [openPanel, setOpenPanel] = useState<PanelType>(null);

  const normalSequence = ['A', 'T', 'G', 'C', 'G', 'A', 'T', 'C'];
  const mutationPosition = 3;

  const getSequence = () => {
    switch (mutationType) {
      case 'nokta':
        const nokta = [...normalSequence];
        nokta[mutationPosition] = 'A'; // C → A değişimi
        return nokta;
      case 'delesyon':
        const delesyon = [...normalSequence];
        delesyon.splice(mutationPosition, 1); // Bir baz silinir
        return delesyon;
      case 'insersiyon':
        const insersiyon = [...normalSequence];
        insersiyon.splice(mutationPosition, 0, 'T'); // Fazladan baz eklenir
        return insersiyon;
      default:
        return normalSequence;
    }
  };

  const togglePanel = (panel: PanelType) => {
    setOpenPanel(openPanel === panel ? null : panel);
  };

  const getMutationInfo = () => {
    switch (mutationType) {
      case 'nokta':
        return { name: 'Nokta Mutasyonu', desc: 'Tek bir baz değişti (C→A)', color: 'text-orange-400' };
      case 'delesyon':
        return { name: 'Delesyon', desc: 'Bir baz silindi', color: 'text-red-400' };
      case 'insersiyon':
        return { name: 'İnsersiyon', desc: 'Fazladan baz eklendi', color: 'text-purple-400' };
      default:
        return { name: 'Normal DNA', desc: 'Mutasyon yok', color: 'text-green-400' };
    }
  };

  const mutationInfo = getMutationInfo();

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* 3D Sahne */}
      <div className="flex-1 relative">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <color attach="background" args={['#0a0520']} />
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} />

          <DNAStrand sequence={getSequence()} mutation={mutationType} position={mutationPosition} />

          <Text position={[0, 5, 0]} fontSize={0.4} color="#00D9FF" anchorX="center" anchorY="middle">
            MUTASYON VE MODİFİKASYON
          </Text>

          <OrbitControls enableZoom={true} />
        </Canvas>

        {/* Masaüstü: Bilgi butonları */}
        <div className="absolute top-4 right-4 hidden md:flex gap-2">
          <button
            onClick={() => togglePanel('info')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              openPanel === 'info' ? 'bg-cyan-500 text-white' : 'bg-black/70 text-cyan-400 hover:bg-black/90'
            }`}
          >
            ℹ️ Bilgi
          </button>
          <button
            onClick={() => togglePanel('observation')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              openPanel === 'observation' ? 'bg-purple-500 text-white' : 'bg-black/70 text-purple-400 hover:bg-black/90'
            }`}
          >
            🔬 Gözlem
          </button>
        </div>
      </div>

      {/* Kontrol Paneli */}
      <div className="bg-black/95 border-t-2 border-cyan-500 p-3 md:p-4">
        {/* Mutasyon Tipleri */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
          <button
            onClick={() => setMutationType('normal')}
            className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${
              mutationType === 'normal' ? 'bg-green-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            ✅ Normal
          </button>
          <button
            onClick={() => setMutationType('nokta')}
            className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${
              mutationType === 'nokta' ? 'bg-orange-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🔶 Nokta
          </button>
          <button
            onClick={() => setMutationType('delesyon')}
            className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${
              mutationType === 'delesyon' ? 'bg-red-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            ➖ Delesyon
          </button>
          <button
            onClick={() => setMutationType('insersiyon')}
            className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${
              mutationType === 'insersiyon' ? 'bg-purple-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            ➕ İnsersiyon
          </button>
        </div>

        {/* Mobil: Bilgi butonları */}
        <div className="flex md:hidden gap-2 mt-2">
          <button
            onClick={() => togglePanel('observation')}
            className={`flex-1 py-3 rounded-lg font-bold text-sm ${
              openPanel === 'observation' ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            🔬 Gözlem
          </button>
          <button
            onClick={() => togglePanel('info')}
            className={`flex-1 py-3 rounded-lg font-bold text-sm ${
              openPanel === 'info' ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            ℹ️ Bilgi
          </button>
        </div>
      </div>

      {/* MASAÜSTÜ: Sağ panel */}
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
                  <li>• <strong>Mutasyon:</strong> DNA diziliminde değişiklik</li>
                  <li>• <strong>Nokta Mutasyonu:</strong> Tek baz değişir</li>
                  <li>• <strong>Delesyon:</strong> Baz silinir</li>
                  <li>• <strong>İnsersiyon:</strong> Fazla baz eklenir</li>
                  <li>• Kırmızı baz → Mutasyonlu bölge</li>
                  <li className="text-yellow-300">⚠️ Mutasyonlar kalıtsal hastalıklara yol açabilir!</li>
                </ul>
              </>
            )}

            {openPanel === 'observation' && (
              <>
                <div className="bg-purple-900/50 p-3 rounded">
                  <p className="font-bold text-sm">Mutasyon Tipi</p>
                  <p className={`text-lg font-bold ${mutationInfo.color}`}>{mutationInfo.name}</p>
                  <p className="text-xs mt-1">{mutationInfo.desc}</p>
                </div>
                <div className="bg-blue-900/50 p-3 rounded">
                  <p className="font-bold text-sm">DNA Dizilimi</p>
                  <p className="text-xs font-mono">{getSequence().join('-')}</p>
                  <p className="text-xs mt-1">Toplam: {getSequence().length} baz</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* MOBİL: Bottom sheet */}
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
                  <li>• <strong>Mutasyon:</strong> DNA'da değişiklik</li>
                  <li>• <strong>Nokta:</strong> Tek baz değişir</li>
                  <li>• <strong>Delesyon:</strong> Baz silinir</li>
                  <li>• <strong>İnsersiyon:</strong> Baz eklenir</li>
                  <li className="text-yellow-300">⚠️ Hastalıklara yol açabilir!</li>
                </ul>
              </>
            )}

            {openPanel === 'observation' && (
              <>
                <div className="bg-purple-900/50 p-3 rounded-lg">
                  <p className="font-bold text-sm">Mutasyon Tipi</p>
                  <p className={`text-xl font-bold ${mutationInfo.color}`}>{mutationInfo.name}</p>
                  <p className="text-sm mt-1">{mutationInfo.desc}</p>
                </div>
                <div className="bg-blue-900/50 p-3 rounded-lg">
                  <p className="font-bold text-sm">DNA Dizilimi</p>
                  <p className="text-sm font-mono">{getSequence().join('-')}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
