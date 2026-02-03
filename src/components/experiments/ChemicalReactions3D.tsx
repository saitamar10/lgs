import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

/*
═══════════════════════════════════════════════════════════════
KİMYASAL TEPKİMELER - 3D SANAL LABORATUVAR
═══════════════════════════════════════════════════════════════
KONU: Tepkime türleri (birleşme, ayrışma, yer değiştirme)
AMAÇ: Kimyasal tepkimeleri görselleştirmek
*/

type PanelType = 'info' | 'observation' | null;
type ReactionType = 'birlestirme' | 'ayrisma' | 'yer-degistirme';

export function ChemicalReactions3D() {
  const [reactionType, setReactionType] = useState<ReactionType>('birlestirme');
  const [openPanel, setOpenPanel] = useState<PanelType>(null);

  const togglePanel = (panel: PanelType) => {
    setOpenPanel(openPanel === panel ? null : panel);
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 relative">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <color attach="background" args={['#0a0a20']} />
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={1.5} />

          {reactionType === 'birlestirme' && (
            <>
              <Sphere args={[0.4, 16, 16]} position={[-2.5, 0, 0]}>
                <meshStandardMaterial color="#ef4444" />
              </Sphere>
              <Sphere args={[0.4, 16, 16]} position={[-1, 0, 0]}>
                <meshStandardMaterial color="#3b82f6" />
              </Sphere>
              <Text position={[0, 0, 0]} fontSize={0.5} color="#fff">+</Text>
              <group position={[2, 0, 0]}>
                <Sphere args={[0.3, 16, 16]} position={[-0.3, 0, 0]}>
                  <meshStandardMaterial color="#ef4444" />
                </Sphere>
                <Sphere args={[0.3, 16, 16]} position={[0.3, 0, 0]}>
                  <meshStandardMaterial color="#3b82f6" />
                </Sphere>
              </group>
              <Text position={[0, -2, 0]} fontSize={0.25} color="#22c55e" anchorX="center">A + B → AB</Text>
            </>
          )}

          {reactionType === 'ayrisma' && (
            <>
              <group position={[-2, 0, 0]}>
                <Sphere args={[0.3, 16, 16]} position={[-0.3, 0, 0]}>
                  <meshStandardMaterial color="#ef4444" />
                </Sphere>
                <Sphere args={[0.3, 16, 16]} position={[0.3, 0, 0]}>
                  <meshStandardMaterial color="#3b82f6" />
                </Sphere>
              </group>
              <Text position={[0, 0, 0]} fontSize={0.5} color="#fff">→</Text>
              <Sphere args={[0.4, 16, 16]} position={[1.5, 0, 0]}>
                <meshStandardMaterial color="#ef4444" />
              </Sphere>
              <Sphere args={[0.4, 16, 16]} position={[2.8, 0, 0]}>
                <meshStandardMaterial color="#3b82f6" />
              </Sphere>
              <Text position={[0, -2, 0]} fontSize={0.25} color="#fbbf24" anchorX="center">AB → A + B</Text>
            </>
          )}

          {reactionType === 'yer-degistirme' && (
            <>
              <group position={[-2.5, 0, 0]}>
                <Sphere args={[0.25, 16, 16]} position={[-0.25, 0, 0]}>
                  <meshStandardMaterial color="#ef4444" />
                </Sphere>
                <Sphere args={[0.25, 16, 16]} position={[0.25, 0, 0]}>
                  <meshStandardMaterial color="#3b82f6" />
                </Sphere>
              </group>
              <group position={[-1, 0, 0]}>
                <Sphere args={[0.25, 16, 16]} position={[-0.25, 0, 0]}>
                  <meshStandardMaterial color="#22c55e" />
                </Sphere>
                <Sphere args={[0.25, 16, 16]} position={[0.25, 0, 0]}>
                  <meshStandardMaterial color="#a855f7" />
                </Sphere>
              </group>
              <Text position={[0.5, 0, 0]} fontSize={0.4} color="#fff">→</Text>
              <group position={[2, 0, 0]}>
                <Sphere args={[0.25, 16, 16]} position={[-0.25, 0, 0]}>
                  <meshStandardMaterial color="#ef4444" />
                </Sphere>
                <Sphere args={[0.25, 16, 16]} position={[0.25, 0, 0]}>
                  <meshStandardMaterial color="#a855f7" />
                </Sphere>
              </group>
              <group position={[3.5, 0, 0]}>
                <Sphere args={[0.25, 16, 16]} position={[-0.25, 0, 0]}>
                  <meshStandardMaterial color="#22c55e" />
                </Sphere>
                <Sphere args={[0.25, 16, 16]} position={[0.25, 0, 0]}>
                  <meshStandardMaterial color="#3b82f6" />
                </Sphere>
              </group>
              <Text position={[0, -2, 0]} fontSize={0.2} color="#a855f7" anchorX="center">AB + CD → AD + CB</Text>
            </>
          )}

          <Text position={[0, 3, 0]} fontSize={0.4} color="#FFC107" anchorX="center" anchorY="middle">
            KİMYASAL TEPKİMELER
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
          <button onClick={() => setReactionType('birlestirme')} className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${reactionType === 'birlestirme' ? 'bg-green-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>➕ Birleştirme</button>
          <button onClick={() => setReactionType('ayrisma')} className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${reactionType === 'ayrisma' ? 'bg-yellow-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>➖ Ayrışma</button>
          <button onClick={() => setReactionType('yer-degistirme')} className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${reactionType === 'yer-degistirme' ? 'bg-purple-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>🔄 Yer Değiştirme</button>
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
                  <li>• <strong>Birleştirme:</strong> A + B → AB</li>
                  <li>• <strong>Ayrışma:</strong> AB → A + B</li>
                  <li>• <strong>Yer Değiştirme:</strong> AB + CD → AD + CB</li>
                  <li>• Tepkimelerde enerji alışverişi olur</li>
                  <li className="text-yellow-300">⚠️ Madde korunumu yasası geçerlidir!</li>
                </ul>
              </>
            )}

            {openPanel === 'observation' && (
              <>
                <div className="bg-green-900/50 p-3 rounded">
                  <p className="font-bold text-sm">Tepkime Tipi</p>
                  <p className="text-lg font-bold text-green-400">
                    {reactionType === 'birlestirme' ? 'Birleştirme' : reactionType === 'ayrisma' ? 'Ayrışma' : 'Yer Değiştirme'}
                  </p>
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
                  <li>• <strong>Birleştirme:</strong> A + B → AB</li>
                  <li>• <strong>Ayrışma:</strong> AB → A + B</li>
                  <li>• <strong>Yer Değiştirme:</strong> Atomlar yer değiştirir</li>
                  <li className="text-yellow-300">⚠️ Madde korunur!</li>
                </ul>
              </>
            )}

            {openPanel === 'observation' && (
              <div className="bg-green-900/50 p-3 rounded-lg">
                <p className="font-bold text-sm">Tepkime</p>
                <p className="text-xl font-bold text-green-400">
                  {reactionType === 'birlestirme' ? 'Birleştirme' : reactionType === 'ayrisma' ? 'Ayrışma' : 'Yer Değiştirme'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
