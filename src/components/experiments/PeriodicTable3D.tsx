import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere } from '@react-three/drei';

/*
═══════════════════════════════════════════════════════════════
PERİYODİK SİSTEM - 3D SANAL LABORATUVAR
═══════════════════════════════════════════════════════════════
KONU: Element grupları ve periyotlar
AMAÇ: Periyodik cetveli 3D görselleştirmek
*/

type PanelType = 'info' | 'observation' | null;
type ElementGroup = 'alkali' | 'toprak-alkali' | 'halojen' | 'soy-gaz';

export function PeriodicTable3D() {
  const [selectedGroup, setSelectedGroup] = useState<ElementGroup>('alkali');
  const [openPanel, setOpenPanel] = useState<PanelType>(null);

  const togglePanel = (panel: PanelType) => {
    setOpenPanel(openPanel === panel ? null : panel);
  };

  const getGroupInfo = () => {
    switch (selectedGroup) {
      case 'alkali':
        return { name: 'Alkali Metaller', elements: ['Li', 'Na', 'K'], color: '#ef4444', desc: '1A grubu, 1 değerlik elektronu' };
      case 'toprak-alkali':
        return { name: 'Toprak Alkali Metaller', elements: ['Be', 'Mg', 'Ca'], color: '#f97316', desc: '2A grubu, 2 değerlik elektronu' };
      case 'halojen':
        return { name: 'Halojenler', elements: ['F', 'Cl', 'Br'], color: '#22c55e', desc: '7A grubu, 7 değerlik elektronu' };
      case 'soy-gaz':
        return { name: 'Soy Gazlar', elements: ['He', 'Ne', 'Ar'], color: '#a855f7', desc: '8A grubu, 8 değerlik elektronu (tam)' };
    }
  };

  const info = getGroupInfo();

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 relative">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <color attach="background" args={['#0a0a1a']} />
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={1.5} />

          {info.elements.map((el, i) => (
            <group key={i} position={[(i - 1) * 2, 0, 0]}>
              <Box args={[1.5, 1.5, 0.3]}>
                <meshStandardMaterial color={info.color} emissive={info.color} emissiveIntensity={0.3} />
              </Box>
              <Text position={[0, 0, 0.2]} fontSize={0.5} color="#ffffff" anchorX="center" anchorY="middle">
                {el}
              </Text>
              {[...Array(i + 1)].map((_, j) => (
                <Sphere key={j} args={[0.08, 12, 12]} position={[(j - i / 2) * 0.3, -1, 0]}>
                  <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
                </Sphere>
              ))}
            </group>
          ))}

          <Text position={[0, 3, 0]} fontSize={0.4} color="#00D9FF" anchorX="center" anchorY="middle">
            PERİYODİK SİSTEM
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
          <button onClick={() => setSelectedGroup('alkali')} className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${selectedGroup === 'alkali' ? 'bg-red-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
            🔴 Alkali
          </button>
          <button onClick={() => setSelectedGroup('toprak-alkali')} className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${selectedGroup === 'toprak-alkali' ? 'bg-orange-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
            🟠 T.Alkali
          </button>
          <button onClick={() => setSelectedGroup('halojen')} className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${selectedGroup === 'halojen' ? 'bg-green-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
            🟢 Halojen
          </button>
          <button onClick={() => setSelectedGroup('soy-gaz')} className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${selectedGroup === 'soy-gaz' ? 'bg-purple-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
            🟣 Soy Gaz
          </button>
        </div>

        <div className="flex md:hidden gap-2 mt-2">
          <button onClick={() => togglePanel('observation')} className={`flex-1 py-3 rounded-lg font-bold text-sm ${openPanel === 'observation' ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
            🔬 Gözlem
          </button>
          <button onClick={() => togglePanel('info')} className={`flex-1 py-3 rounded-lg font-bold text-sm ${openPanel === 'info' ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
            ℹ️ Bilgi
          </button>
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
                  <li>• <strong>Periyodik Sistem:</strong> Elementlerin düzenlenişi</li>
                  <li>• <strong>Grup:</strong> Dikey sütunlar (aynı değerlik)</li>
                  <li>• <strong>Periyot:</strong> Yatay satırlar</li>
                  <li>• Aynı gruptakiler benzer özellikler gösterir</li>
                  <li className="text-yellow-300">⚠️ 118 element var!</li>
                </ul>
              </>
            )}

            {openPanel === 'observation' && (
              <>
                <div className="bg-purple-900/50 p-3 rounded">
                  <p className="font-bold text-sm">Grup</p>
                  <p className="text-lg font-bold" style={{ color: info.color }}>{info.name}</p>
                  <p className="text-xs mt-1">{info.desc}</p>
                </div>
                <div className="bg-blue-900/50 p-3 rounded">
                  <p className="font-bold text-sm">Elementler</p>
                  <p className="text-sm">{info.elements.join(', ')}</p>
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
                  <li>• <strong>Grup:</strong> Dikey (aynı değerlik)</li>
                  <li>• <strong>Periyot:</strong> Yatay satırlar</li>
                  <li className="text-yellow-300">⚠️ 118 element!</li>
                </ul>
              </>
            )}

            {openPanel === 'observation' && (
              <>
                <div className="bg-purple-900/50 p-3 rounded-lg">
                  <p className="font-bold text-sm">Grup</p>
                  <p className="text-xl font-bold" style={{ color: info.color }}>{info.name}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
