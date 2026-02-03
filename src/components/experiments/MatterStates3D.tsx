import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useState } from 'react';

/*
═══════════════════════════════════════════════════════════════
MADDENİN HALLERİ - 3D SANAL LABORATUVAR
═══════════════════════════════════════════════════════════════
KONU: Katı, sıvı, gaz hallerinde molekül hareketi
AMAÇ: Sıcaklık değişimiyle hal değişimini görselleştirmek
*/

type MatterState = 'solid' | 'liquid' | 'gas';
type PanelType = 'info' | 'observation' | null;

// Molekül
function Molecule({
  position,
  state,
  index,
}: {
  position: THREE.Vector3;
  state: MatterState;
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const velocity = useRef(new THREE.Vector3(
    (Math.random() - 0.5) * 0.02,
    (Math.random() - 0.5) * 0.02,
    (Math.random() - 0.5) * 0.02
  ));
  const basePosition = useRef(position.clone());

  useFrame(() => {
    if (!ref.current) return;

    switch (state) {
      case 'solid':
        const vibration = Math.sin(Date.now() * 0.005 + index) * 0.02;
        ref.current.position.copy(basePosition.current);
        ref.current.position.x += vibration;
        ref.current.position.y += vibration * 0.5;
        break;

      case 'liquid':
        ref.current.position.add(velocity.current);
        if (Math.abs(ref.current.position.x - basePosition.current.x) > 0.5) velocity.current.x *= -1;
        if (Math.abs(ref.current.position.y - basePosition.current.y) > 0.5) velocity.current.y *= -1;
        if (Math.abs(ref.current.position.z - basePosition.current.z) > 0.3) velocity.current.z *= -1;
        break;

      case 'gas':
        ref.current.position.add(velocity.current.clone().multiplyScalar(5));
        const bounds = 2;
        if (Math.abs(ref.current.position.x) > bounds) {
          velocity.current.x *= -1;
          ref.current.position.x = Math.sign(ref.current.position.x) * bounds;
        }
        if (Math.abs(ref.current.position.y) > bounds) {
          velocity.current.y *= -1;
          ref.current.position.y = Math.sign(ref.current.position.y) * bounds;
        }
        if (Math.abs(ref.current.position.z) > bounds) {
          velocity.current.z *= -1;
          ref.current.position.z = Math.sign(ref.current.position.z) * bounds;
        }
        break;
    }
  });

  const size = state === 'solid' ? 0.15 : state === 'liquid' ? 0.13 : 0.1;
  const color = state === 'solid' ? '#3b82f6' : state === 'liquid' ? '#06b6d4' : '#a855f7';

  return (
    <Sphere ref={ref} args={[size, 16, 16]} position={position}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
    </Sphere>
  );
}

export function MatterStates3D() {
  const [temperature, setTemperature] = useState(0);
  const [openPanel, setOpenPanel] = useState<PanelType>(null);

  const state: MatterState = temperature < 0 ? 'solid' : temperature < 100 ? 'liquid' : 'gas';

  const molecules = useMemo(() => {
    const positions: THREE.Vector3[] = [];

    if (state === 'solid') {
      for (let x = -1; x <= 1; x += 0.4) {
        for (let y = -1; y <= 1; y += 0.4) {
          for (let z = -1; z <= 1; z += 0.4) {
            positions.push(new THREE.Vector3(x, y, z));
          }
        }
      }
    } else if (state === 'liquid') {
      for (let i = 0; i < 100; i++) {
        positions.push(
          new THREE.Vector3(
            (Math.random() - 0.5) * 1.5,
            (Math.random() - 0.5) * 1.0,
            (Math.random() - 0.5) * 1.5
          )
        );
      }
    } else {
      for (let i = 0; i < 50; i++) {
        positions.push(
          new THREE.Vector3(
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4
          )
        );
      }
    }

    return positions;
  }, [state]);

  const togglePanel = (panel: PanelType) => {
    setOpenPanel(openPanel === panel ? null : panel);
  };

  const getStateEmoji = () => {
    if (state === 'solid') return '❄️';
    if (state === 'liquid') return '💧';
    return '💨';
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* 3D Sahne */}
      <div className="flex-1 relative">
        <Canvas camera={{ position: [5, 3, 5], fov: 50 }}>
          <color attach="background" args={['#0f172a']} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1} />

          {molecules.map((pos, i) => (
            <Molecule key={`${state}-${i}`} position={pos} state={state} index={i} />
          ))}

          <Text position={[0, 3, 0]} fontSize={0.4} color="#22d3ee" anchorX="center" anchorY="middle">
            {state === 'solid' && 'KATI HAL (BUZ)'}
            {state === 'liquid' && 'SIVI HAL (SU)'}
            {state === 'gas' && 'GAZ HAL (BUHAR)'}
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
        {/* Sıcaklık Kontrolü - Mobil dostu */}
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getStateEmoji()}</span>
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white font-bold">{temperature}°C</span>
              <span className="text-cyan-400 font-bold text-base">
                {state === 'solid' && 'KATI'}
                {state === 'liquid' && 'SIVI'}
                {state === 'gas' && 'GAZ'}
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="150"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #06b6d4 50%, #a855f7 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>-50°C</span>
              <span>0°C</span>
              <span>100°C</span>
              <span>150°C</span>
            </div>
          </div>
        </div>

        {/* Mobil: Bilgi butonları */}
        <div className="flex md:hidden gap-2 mt-3">
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
                  <li>• <strong>Katı:</strong> Moleküller yerinde titreşir</li>
                  <li>• <strong>Sıvı:</strong> Moleküller serbestçe hareket eder</li>
                  <li>• <strong>Gaz:</strong> Moleküller hızla her yöne dağılır</li>
                  <li>• Sıcaklık arttıkça moleküller daha hızlı hareket eder</li>
                  <li className="text-yellow-300">⚠️ Su: 0°C altı buz, 0-100°C sıvı, 100°C üstü buhar!</li>
                </ul>
              </>
            )}

            {openPanel === 'observation' && (
              <>
                <div className="bg-blue-900/50 p-3 rounded">
                  <p className="font-bold text-sm">Sıcaklık</p>
                  <p className="text-2xl font-bold text-cyan-300">{temperature}°C</p>
                </div>
                <div className="bg-purple-900/50 p-3 rounded">
                  <p className="font-bold text-sm">Maddenin Hali</p>
                  <p className="text-lg font-bold">
                    {state === 'solid' && '❄️ KATI'}
                    {state === 'liquid' && '💧 SIVI'}
                    {state === 'gas' && '💨 GAZ'}
                  </p>
                </div>
                <div className="bg-green-900/50 p-3 rounded">
                  <p className="font-bold text-sm">Molekül Hareketi</p>
                  <p className="text-xs">
                    {state === 'solid' && 'Titreşim (yavaş)'}
                    {state === 'liquid' && 'Serbest hareket (orta)'}
                    {state === 'gas' && 'Hızlı dağılma (çok hızlı)'}
                  </p>
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
                  <li>• <strong>Katı:</strong> Moleküller yerinde titreşir</li>
                  <li>• <strong>Sıvı:</strong> Serbestçe hareket eder</li>
                  <li>• <strong>Gaz:</strong> Hızla her yöne dağılır</li>
                  <li className="text-yellow-300">⚠️ Sıcaklık arttıkça hareket hızlanır!</li>
                </ul>
              </>
            )}

            {openPanel === 'observation' && (
              <>
                <div className="bg-blue-900/50 p-3 rounded-lg">
                  <p className="font-bold text-sm">Sıcaklık</p>
                  <p className="text-3xl font-bold text-cyan-300">{temperature}°C</p>
                </div>
                <div className="bg-purple-900/50 p-3 rounded-lg">
                  <p className="font-bold text-sm">Maddenin Hali</p>
                  <p className="text-2xl font-bold">
                    {state === 'solid' && '❄️ KATI'}
                    {state === 'liquid' && '💧 SIVI'}
                    {state === 'gas' && '💨 GAZ'}
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
