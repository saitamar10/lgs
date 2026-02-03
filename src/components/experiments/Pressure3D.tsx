import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

/*
═══════════════════════════════════════════════════════════════
BASINÇ - 3D SANAL LABORATUVAR
═══════════════════════════════════════════════════════════════
KONU: Katı, sıvı ve gaz basıncı
AMAÇ: Basınç formülünü (P = F/A) ve farklı ortamlarda basıncı göstermek
*/

type PanelType = 'info' | 'observation' | null;
type PressureType = 'solid' | 'liquid' | 'gas';

// Basınç gösteren oklar
function PressureArrow({ position, direction, intensity }: { position: THREE.Vector3, direction: THREE.Vector3, intensity: number }) {
  return (
    <group position={position}>
      <Cylinder args={[0.05, 0.05, intensity * 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={intensity} />
      </Cylinder>
    </group>
  );
}

export function Pressure3D() {
  const [pressureType, setPressureType] = useState<PressureType>('solid');
  const [openPanel, setOpenPanel] = useState<PanelType>(null);

  const togglePanel = (panel: PanelType) => {
    setOpenPanel(openPanel === panel ? null : panel);
  };

  const getPressureInfo = () => {
    switch (pressureType) {
      case 'solid':
        return { name: 'Katı Basıncı', formula: 'P = F/A (Kütle × Yer çekimi / Alan)', color: 'text-blue-400' };
      case 'liquid':
        return { name: 'Sıvı Basıncı', formula: 'P = ρ × g × h (Derinlik arttıkça artar)', color: 'text-cyan-400' };
      case 'gas':
        return { name: 'Gaz Basıncı', formula: 'Her yöne eşit basınç uygular', color: 'text-purple-400' };
    }
  };

  const info = getPressureInfo();

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 relative">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <color attach="background" args={['#0a1929']} />
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={1.5} />

          {/* Basınç simülasyonu */}
          {pressureType === 'solid' && (
            <group>
              <Box args={[2, 0.3, 2]} position={[0, -1, 0]}>
                <meshStandardMaterial color="#1976d2" />
              </Box>
              {[...Array(8)].map((_, i) => (
                <PressureArrow
                  key={i}
                  position={new THREE.Vector3((i % 4 - 1.5) * 0.6, 0, Math.floor(i / 4) * 0.6 - 0.3)}
                  direction={new THREE.Vector3(0, -1, 0)}
                  intensity={0.8}
                />
              ))}
            </group>
          )}

          {pressureType === 'liquid' && (
            <group>
              <Cylinder args={[1.5, 1.5, 3]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#00bcd4" transparent opacity={0.6} />
              </Cylinder>
              {[...Array(12)].map((_, i) => {
                const y = (i % 4 - 1.5) * 0.6;
                return (
                  <PressureArrow
                    key={i}
                    position={new THREE.Vector3(Math.cos(i) * 1.2, y, Math.sin(i) * 1.2)}
                    direction={new THREE.Vector3(0, -1, 0)}
                    intensity={1 - (y + 1.5) / 3}
                  />
                );
              })}
            </group>
          )}

          {pressureType === 'gas' && (
            <group>
              <Sphere args={[2, 32, 32]}>
                <meshStandardMaterial color="#9c27b0" transparent opacity={0.3} wireframe />
              </Sphere>
              {[...Array(20)].map((_, i) => {
                const phi = Math.acos(-1 + (2 * i) / 20);
                const theta = Math.sqrt(20 * Math.PI) * phi;
                return (
                  <PressureArrow
                    key={i}
                    position={new THREE.Vector3(
                      Math.cos(theta) * Math.sin(phi) * 1.5,
                      Math.cos(phi) * 1.5,
                      Math.sin(theta) * Math.sin(phi) * 1.5
                    )}
                    direction={new THREE.Vector3(0, 1, 0)}
                    intensity={0.7}
                  />
                );
              })}
            </group>
          )}

          <Text position={[0, 4, 0]} fontSize={0.4} color="#FFC107" anchorX="center" anchorY="middle">
            BASINÇ
          </Text>

          <OrbitControls enableZoom={true} />
        </Canvas>

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

      <div className="bg-black/95 border-t-2 border-cyan-500 p-3 md:p-4">
        <div className="grid grid-cols-3 gap-2 mb-3">
          <button
            onClick={() => setPressureType('solid')}
            className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${
              pressureType === 'solid' ? 'bg-blue-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🧱 Katı
          </button>
          <button
            onClick={() => setPressureType('liquid')}
            className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${
              pressureType === 'liquid' ? 'bg-cyan-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            💧 Sıvı
          </button>
          <button
            onClick={() => setPressureType('gas')}
            className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${
              pressureType === 'gas' ? 'bg-purple-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            💨 Gaz
          </button>
        </div>

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
                  <li>• <strong>Basınç:</strong> Birim alana uygulanan kuvvet</li>
                  <li>• <strong>Katı:</strong> Sadece temas yüzeyine basınç</li>
                  <li>• <strong>Sıvı:</strong> Derinlik arttıkça basınç artar</li>
                  <li>• <strong>Gaz:</strong> Her yöne eşit basınç</li>
                  <li className="text-yellow-300">⚠️ P = F/A (Basınç = Kuvvet / Alan)</li>
                </ul>
              </>
            )}

            {openPanel === 'observation' && (
              <>
                <div className="bg-yellow-900/50 p-3 rounded">
                  <p className="font-bold text-sm">Basınç Tipi</p>
                  <p className={`text-lg font-bold ${info.color}`}>{info.name}</p>
                </div>
                <div className="bg-blue-900/50 p-3 rounded">
                  <p className="font-bold text-sm">Formül</p>
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
                  <li>• <strong>Katı:</strong> Sadece temas yüzeyine</li>
                  <li>• <strong>Sıvı:</strong> Derinlik arttıkça artar</li>
                  <li>• <strong>Gaz:</strong> Her yöne eşit</li>
                  <li className="text-yellow-300">⚠️ P = F/A</li>
                </ul>
              </>
            )}

            {openPanel === 'observation' && (
              <>
                <div className="bg-yellow-900/50 p-3 rounded-lg">
                  <p className="font-bold text-sm">Basınç Tipi</p>
                  <p className={`text-xl font-bold ${info.color}`}>{info.name}</p>
                </div>
                <div className="bg-blue-900/50 p-3 rounded-lg">
                  <p className="font-bold text-sm">Formül</p>
                  <p className="text-sm">{info.formula}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
