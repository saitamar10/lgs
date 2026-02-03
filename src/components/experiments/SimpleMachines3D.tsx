import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Cylinder, Sphere, Torus } from '@react-three/drei';
import * as THREE from 'three';

/*
═══════════════════════════════════════════════════════════════
BASİT MAKİNELER - 3D SANAL LABORATUVAR
═══════════════════════════════════════════════════════════════
KONU: Kaldıraç, makara, eğik düzlem
AMAÇ: Basit makineleri ve mekanik avantajı göstermek
*/

type PanelType = 'info' | 'observation' | null;
type MachineType = 'kaldirac' | 'makara' | 'egik-duzlem';

function Lever() {
  return (
    <group>
      <Box args={[4, 0.2, 0.3]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#78716c" />
      </Box>
      <Cylinder args={[0.15, 0.15, 1]} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#292524" />
      </Cylinder>
      <Sphere args={[0.3, 16, 16]} position={[-1.5, 0.3, 0]}>
        <meshStandardMaterial color="#ef4444" />
      </Sphere>
      <Sphere args={[0.2, 16, 16]} position={[1.5, 0.3, 0]}>
        <meshStandardMaterial color="#22c55e" />
      </Sphere>
    </group>
  );
}

function Pulley() {
  return (
    <group>
      <Torus args={[0.5, 0.1, 16, 32]} position={[0, 1.5, 0]}>
        <meshStandardMaterial color="#78716c" />
      </Torus>
      <Cylinder args={[0.05, 0.05, 2]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#fbbf24" />
      </Cylinder>
      <Box args={[0.5, 0.5, 0.5]} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#ef4444" />
      </Box>
    </group>
  );
}

function InclinedPlane() {
  return (
    <group>
      <Box args={[3, 0.2, 1]} position={[0, 0, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <meshStandardMaterial color="#78716c" />
      </Box>
      <Sphere args={[0.3, 16, 16]} position={[-0.8, 0.8, 0]}>
        <meshStandardMaterial color="#ef4444" />
      </Sphere>
    </group>
  );
}

export function SimpleMachines3D() {
  const [machineType, setMachineType] = useState<MachineType>('kaldirac');
  const [openPanel, setOpenPanel] = useState<PanelType>(null);

  const togglePanel = (panel: PanelType) => {
    setOpenPanel(openPanel === panel ? null : panel);
  };

  const getInfo = () => {
    switch (machineType) {
      case 'kaldirac':
        return { name: 'Kaldıraç', desc: 'Destek noktası ile ağır yükleri kaldırır', formula: 'F₁ × d₁ = F₂ × d₂' };
      case 'makara':
        return { name: 'Makara', desc: 'Halatla yükü yukarı çeker', formula: 'Kuvvet yönünü değiştirir' };
      case 'egik-duzlem':
        return { name: 'Eğik Düzlem', desc: 'Yokuş çıkarak yükü kaldırır', formula: 'Mesafe artar, kuvvet azalır' };
    }
  };

  const info = getInfo();

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 relative">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <color attach="background" args={['#1a1a2e']} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1} />

          {machineType === 'kaldirac' && <Lever />}
          {machineType === 'makara' && <Pulley />}
          {machineType === 'egik-duzlem' && <InclinedPlane />}

          <Text position={[0, 3, 0]} fontSize={0.4} color="#FFC107" anchorX="center" anchorY="middle">
            BASİT MAKİNELER
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
          <button onClick={() => setMachineType('kaldirac')} className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${machineType === 'kaldirac' ? 'bg-orange-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>⚖️ Kaldıraç</button>
          <button onClick={() => setMachineType('makara')} className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${machineType === 'makara' ? 'bg-blue-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>⭕ Makara</button>
          <button onClick={() => setMachineType('egik-duzlem')} className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${machineType === 'egik-duzlem' ? 'bg-purple-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>📐 E.Düzlem</button>
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
                  <li>• <strong>Basit Makineler:</strong> İşi kolaylaştırır</li>
                  <li>• <strong>Kaldıraç:</strong> Destek + kuvvet kolları</li>
                  <li>• <strong>Makara:</strong> Kuvvet yönünü değiştirir</li>
                  <li>• <strong>Eğik Düzlem:</strong> Mesafe artar, kuvvet azalır</li>
                  <li className="text-yellow-300">⚠️ İş = Kuvvet × Yol</li>
                </ul>
              </>
            )}

            {openPanel === 'observation' && (
              <>
                <div className="bg-orange-900/50 p-3 rounded">
                  <p className="font-bold text-sm">Makine Tipi</p>
                  <p className="text-lg font-bold text-orange-400">{info.name}</p>
                  <p className="text-xs mt-1">{info.desc}</p>
                </div>
                <div className="bg-blue-900/50 p-3 rounded">
                  <p className="font-bold text-sm">İlke</p>
                  <p className="text-xs">{info.formula}</p>
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
                  <li>• <strong>Kaldıraç:</strong> Destek + kuvvet</li>
                  <li>• <strong>Makara:</strong> Yön değiştirir</li>
                  <li>• <strong>E.Düzlem:</strong> Mesafe↑ kuvvet↓</li>
                  <li className="text-yellow-300">⚠️ İş = Kuvvet × Yol</li>
                </ul>
              </>
            )}

            {openPanel === 'observation' && (
              <div className="bg-orange-900/50 p-3 rounded-lg">
                <p className="font-bold text-sm">Makine</p>
                <p className="text-xl font-bold text-orange-400">{info.name}</p>
                <p className="text-sm mt-1">{info.desc}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
