import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Cone } from '@react-three/drei';
import * as THREE from 'three';

/*
═══════════════════════════════════════════════════════════════
FOTOSENTEZ - 3D SANAL LABORATUVAR
═══════════════════════════════════════════════════════════════
KONU: Bitkiler güneş ışığıyla glikoz ve oksijen üretir
AMAÇ: CO2 + H2O → Glikoz + O2 sürecini görselleştirmek
*/

type PanelType = 'info' | 'observation' | null;

// Güneş ışını
function SunRay({ delay }: { delay: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime + delay;
    ref.current.position.y = 4 - (time % 8);
    ref.current.material.opacity = Math.max(0, 1 - (time % 8) / 8);
  });

  return (
    <Cone ref={ref} args={[0.1, 0.5, 8]} rotation={[Math.PI, 0, 0]}>
      <meshBasicMaterial color="#fbbf24" transparent />
    </Cone>
  );
}

// CO2 molekülü
function CO2Molecule({ position, targetY }: { position: THREE.Vector3; targetY: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current) return;
    if (ref.current.position.y < targetY) {
      ref.current.position.y += 0.01;
    } else {
      ref.current.position.y = position.y;
    }
  });

  return (
    <group ref={ref} position={position}>
      <Sphere args={[0.15, 16, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1f2937" />
      </Sphere>
      <Sphere args={[0.12, 16, 16]} position={[-0.3, 0, 0]}>
        <meshStandardMaterial color="#ef4444" />
      </Sphere>
      <Sphere args={[0.12, 16, 16]} position={[0.3, 0, 0]}>
        <meshStandardMaterial color="#ef4444" />
      </Sphere>
    </group>
  );
}

// O2 molekülü
function O2Molecule({ position }: { position: THREE.Vector3 }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.y += 0.015;
    if (ref.current.position.y > 3) {
      ref.current.position.y = position.y;
    }
  });

  return (
    <group ref={ref} position={position}>
      <Sphere args={[0.12, 16, 16]} position={[-0.15, 0, 0]}>
        <meshStandardMaterial color="#06b6d4" />
      </Sphere>
      <Sphere args={[0.12, 16, 16]} position={[0.15, 0, 0]}>
        <meshStandardMaterial color="#06b6d4" />
      </Sphere>
    </group>
  );
}

// H2O molekülü
function H2OMolecule({ position, targetY }: { position: THREE.Vector3; targetY: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current) return;
    if (ref.current.position.y < targetY) {
      ref.current.position.y += 0.008;
    } else {
      ref.current.position.y = position.y;
    }
  });

  return (
    <group ref={ref} position={position}>
      <Sphere args={[0.15, 16, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#ef4444" />
      </Sphere>
      <Sphere args={[0.1, 16, 16]} position={[-0.25, 0.15, 0]}>
        <meshStandardMaterial color="#f3f4f6" />
      </Sphere>
      <Sphere args={[0.1, 16, 16]} position={[0.25, 0.15, 0]}>
        <meshStandardMaterial color="#f3f4f6" />
      </Sphere>
    </group>
  );
}

// Glikoz molekülü
function GlucoseMolecule({ position }: { position: THREE.Vector3 }) {
  const ref = useRef<THREE.Group>(null);
  const [scale, setScale] = useState(0);

  useFrame(() => {
    if (!ref.current) return;
    if (scale < 1) {
      setScale(scale + 0.01);
      ref.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={ref} position={position} scale={0}>
      <Sphere args={[0.2, 16, 16]}>
        <meshStandardMaterial color="#84cc16" emissive="#84cc16" emissiveIntensity={0.3} />
      </Sphere>
    </group>
  );
}

// Bitki yaprağı
function PlantLeaf({ isPhotosynthesizing }: { isPhotosynthesizing: boolean }) {
  return (
    <group position={[0, 0, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshStandardMaterial
          color={isPhotosynthesizing ? '#22c55e' : '#84cc16'}
          emissive={isPhotosynthesizing ? '#22c55e' : '#000000'}
          emissiveIntensity={isPhotosynthesizing ? 0.2 : 0}
        />
      </mesh>

      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 0.5;
        return (
          <Sphere
            key={i}
            args={[0.08, 16, 16]}
            position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
          >
            <meshStandardMaterial
              color="#15803d"
              emissive={isPhotosynthesizing ? '#22c55e' : '#000000'}
              emissiveIntensity={isPhotosynthesizing ? 0.5 : 0}
            />
          </Sphere>
        );
      })}

      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 2]} />
        <meshStandardMaterial color="#15803d" />
      </mesh>

      <mesh position={[-0.2, -2.8, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.05, 0.02, 0.8]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[0, -2.8, 0]}>
        <cylinderGeometry args={[0.05, 0.02, 0.8]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[0.2, -2.8, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.05, 0.02, 0.8]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
    </group>
  );
}

export function Photosynthesis3D() {
  const [isDay, setIsDay] = useState(true);
  const [openPanel, setOpenPanel] = useState<PanelType>(null);

  const togglePanel = (panel: PanelType) => {
    setOpenPanel(openPanel === panel ? null : panel);
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* 3D Sahne */}
      <div className="flex-1 relative">
        <Canvas camera={{ position: [4, 2, 4], fov: 50 }}>
          <color attach="background" args={[isDay ? '#87ceeb' : '#1e293b']} />
          <ambientLight intensity={isDay ? 0.6 : 0.2} />
          {isDay && <directionalLight position={[5, 8, 5]} intensity={1.5} />}

          {isDay && (
            <group position={[3, 5, -2]}>
              <Sphere args={[0.5, 32, 32]}>
                <meshBasicMaterial color="#fbbf24" />
              </Sphere>
              <pointLight intensity={2} distance={10} color="#fbbf24" />
            </group>
          )}

          {isDay && (
            <>
              <SunRay delay={0} />
              <SunRay delay={2} />
              <SunRay delay={4} />
              <SunRay delay={6} />
            </>
          )}

          <PlantLeaf isPhotosynthesizing={isDay} />

          {isDay && (
            <>
              <CO2Molecule position={new THREE.Vector3(1, -2, 0)} targetY={0.5} />
              <CO2Molecule position={new THREE.Vector3(-1, -2.5, 0)} targetY={0.5} />
              <H2OMolecule position={new THREE.Vector3(0, -3.5, 0)} targetY={0} />
              <H2OMolecule position={new THREE.Vector3(0.2, -4, 0)} targetY={0} />
              <O2Molecule position={new THREE.Vector3(-0.8, 0.5, 0)} />
              <O2Molecule position={new THREE.Vector3(0.8, 0.3, 0)} />
              <GlucoseMolecule position={new THREE.Vector3(0, 0, 0)} />
            </>
          )}

          <Text position={[0, 3.5, 0]} fontSize={0.3} color="#22c55e" anchorX="center" anchorY="middle">
            FOTOSENTEZ
          </Text>

          <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="#92400e" />
          </mesh>

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
        {/* Gündüz/Gece - Mobil dostu büyük buton */}
        <div className="flex justify-center">
          <button
            onClick={() => setIsDay(!isDay)}
            className={`px-8 py-4 md:py-3 rounded-lg font-bold text-base transition-all ${
              isDay ? 'bg-warning text-white scale-105' : 'bg-primary text-white'
            }`}
          >
            {isDay ? '☀️ GÜNDÜZ' : '🌙 GECE'}
          </button>
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
                  <li>• Bitkiler <strong>güneş ışığı</strong> ile besin üretir</li>
                  <li>• <strong>CO₂</strong> (karbondioksit) havadan alınır</li>
                  <li>• <strong>H₂O</strong> (su) köklerden gelir</li>
                  <li>• <strong>Glikoz</strong> (besin) üretilir</li>
                  <li>• <strong>O₂</strong> (oksijen) salınır</li>
                  <li className="text-yellow-300">⚠️ Gece fotosentez OLMAZ!</li>
                </ul>
              </>
            )}

            {openPanel === 'observation' && (
              <>
                <div className="bg-yellow-900/50 p-3 rounded">
                  <p className="font-bold text-sm">Durum</p>
                  <p className="text-lg font-bold">{isDay ? '☀️ GÜNDÜZ' : '🌙 GECE'}</p>
                </div>
                <div className="bg-green-900/50 p-3 rounded">
                  <p className="font-bold text-sm">Fotosentez</p>
                  <p className="text-sm">{isDay ? '✓ Aktif' : '✗ Pasif'}</p>
                </div>
                {isDay && (
                  <div className="bg-blue-900/50 p-3 rounded">
                    <p className="font-bold text-sm">Süreç</p>
                    <p className="text-xs">CO₂ + H₂O → Glikoz + O₂</p>
                  </div>
                )}
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
                  <li>• Bitkiler <strong>güneş ışığı</strong> ile besin üretir</li>
                  <li>• <strong>CO₂ + H₂O</strong> → Glikoz + O₂</li>
                  <li>• Yeşil yapraklar fotosentez yapar</li>
                  <li className="text-yellow-300">⚠️ Gece fotosentez olmaz!</li>
                </ul>
              </>
            )}

            {openPanel === 'observation' && (
              <>
                <div className="bg-yellow-900/50 p-3 rounded-lg">
                  <p className="font-bold text-sm">Durum</p>
                  <p className="text-2xl font-bold">{isDay ? '☀️ GÜNDÜZ' : '🌙 GECE'}</p>
                </div>
                <div className="bg-green-900/50 p-3 rounded-lg">
                  <p className="font-bold text-sm">Fotosentez</p>
                  <p className="text-xl font-bold">{isDay ? '✓ Aktif' : '✗ Pasif'}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
