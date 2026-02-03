import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';

/*
═══════════════════════════════════════════════════════════════
FİZİKSEL VE KİMYASAL DEĞİŞİMLER - 3D SANAL LABORATUVAR
═══════════════════════════════════════════════════════════════
KONU: Fiziksel vs kimyasal değişim farkı
AMAÇ: İki değişim türünü karşılaştırmak
*/

type PanelType = 'info' | 'observation' | null;
type ChangeType = 'fiziksel' | 'kimyasal';

export function Changes3D() {
  const [changeType, setChangeType] = useState<ChangeType>('fiziksel');
  const [openPanel, setOpenPanel] = useState<PanelType>(null);

  const togglePanel = (panel: PanelType) => {
    setOpenPanel(openPanel === panel ? null : panel);
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 relative">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <color attach="background" args={['#0a1020']} />
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={1.5} />

          {changeType === 'fiziksel' ? (
            <>
              <Box args={[1.5, 1.5, 1.5]} position={[-2, 0, 0]}>
                <meshStandardMaterial color="#3b82f6" />
              </Box>
              <Sphere args={[1, 32, 32]} position={[2, 0, 0]}>
                <meshStandardMaterial color="#3b82f6" transparent opacity={0.6} />
              </Sphere>
              <Text position={[0, -2, 0]} fontSize={0.3} color="#22c55e" anchorX="center">
                Madde aynı (H₂O)
              </Text>
            </>
          ) : (
            <>
              <group position={[-2, 0, 0]}>
                <Sphere args={[0.3, 16, 16]} position={[-0.4, 0, 0]}>
                  <meshStandardMaterial color="#ef4444" />
                </Sphere>
                <Sphere args={[0.3, 16, 16]} position={[0.4, 0, 0]}>
                  <meshStandardMaterial color="#ef4444" />
                </Sphere>
              </group>
              <group position={[2, 0, 0]}>
                <Sphere args={[0.3, 16, 16]} position={[-0.4, 0, 0]}>
                  <meshStandardMaterial color="#22c55e" />
                </Sphere>
                <Sphere args={[0.3, 16, 16]} position={[0, 0, 0]}>
                  <meshStandardMaterial color="#3b82f6" />
                </Sphere>
                <Sphere args={[0.3, 16, 16]} position={[0.4, 0, 0]}>
                  <meshStandardMaterial color="#22c55e" />
                </Sphere>
              </group>
              <Text position={[0, -2, 0]} fontSize={0.3} color="#ef4444" anchorX="center">
                Yeni madde oluştu
              </Text>
            </>
          )}

          <Text position={[0, 3, 0]} fontSize={0.4} color="#FFC107" anchorX="center" anchorY="middle">
            FİZİKSEL VE KİMYASAL DEĞİŞİMLER
          </Text>

          <OrbitControls enableZoom={true} />
        </Canvas>

        <div className="absolute top-4 right-4 hidden md:flex gap-2">
          <button onClick={() => togglePanel('info')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${openPanel === 'info' ? 'bg-cyan-500 text-white' : 'bg-black/70 text-cyan-400 hover:bg-black/90'}`}>
            ℹ️ Bilgi
          </button>
          <button onClick={() => togglePanel('observation')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${openPanel === 'observation' ? 'bg-purple-500 text-white' : 'bg-black/70 text-purple-400 hover:bg-black/90'}`}>
            🔬 Gözlem
          </button>
        </div>
      </div>

      <div className="bg-black/95 border-t-2 border-cyan-500 p-3 md:p-4">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button onClick={() => setChangeType('fiziksel')} className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${changeType === 'fiziksel' ? 'bg-blue-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
            🧊 Fiziksel
          </button>
          <button onClick={() => setChangeType('kimyasal')} className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${changeType === 'kimyasal' ? 'bg-red-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
            🔥 Kimyasal
          </button>
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
                  <li>• <strong>Fiziksel:</strong> Sadece görünüm değişir (buz→su)</li>
                  <li>• <strong>Kimyasal:</strong> Yeni madde oluşur (yanma)</li>
                  <li>• Fiziksel değişim geri döner</li>
                  <li>• Kimyasal değişim zor/imkansız geri döner</li>
                  <li className="text-yellow-300">⚠️ Kağıt yanarsa kimyasal değişim!</li>
                </ul>
              </>
            )}

            {openPanel === 'observation' && (
              <>
                <div className="bg-blue-900/50 p-3 rounded">
                  <p className="font-bold text-sm">Değişim Tipi</p>
                  <p className={`text-lg font-bold ${changeType === 'fiziksel' ? 'text-blue-400' : 'text-red-400'}`}>
                    {changeType === 'fiziksel' ? 'Fiziksel Değişim' : 'Kimyasal Değişim'}
                  </p>
                  <p className="text-xs mt-1">{changeType === 'fiziksel' ? 'Madde aynı kalır' : 'Yeni madde oluşur'}</p>
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
                  <li>• <strong>Fiziksel:</strong> Sadece görünüm (buz→su)</li>
                  <li>• <strong>Kimyasal:</strong> Yeni madde (yanma)</li>
                  <li className="text-yellow-300">⚠️ Kağıt yanarsa kimyasal!</li>
                </ul>
              </>
            )}

            {openPanel === 'observation' && (
              <>
                <div className="bg-blue-900/50 p-3 rounded-lg">
                  <p className="font-bold text-sm">Değişim</p>
                  <p className={`text-xl font-bold ${changeType === 'fiziksel' ? 'text-blue-400' : 'text-red-400'}`}>
                    {changeType === 'fiziksel' ? 'Fiziksel' : 'Kimyasal'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
