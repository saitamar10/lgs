import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Html, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

/*
═══════════════════════════════════════════════════════════════
ELEKTRİK DEVRESİ - 3D SANAL LABORATUVAR
═══════════════════════════════════════════════════════════════
KONU: Kapalı devrede elektron akışı
AMAÇ: Pil, ampul ve kabloların elektrik devresini görmek
*/

type PanelType = 'info' | 'observation' | null;

// Elektron partikülü
function Electron({ path, speed, delay }: { path: THREE.Vector3[], speed: number, delay: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const time = (state.clock.elapsedTime * speed + delay) % path.length;
    const index = Math.floor(time);
    const nextIndex = (index + 1) % path.length;
    const t = time - index;
    ref.current.position.lerpVectors(path[index], path[nextIndex], t);
  });

  return (
    <Sphere ref={ref} args={[0.1, 16, 16]}>
      <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
    </Sphere>
  );
}

// Pil
function Battery({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Box args={[0.8, 0.4, 0.3]}>
        <meshStandardMaterial color="#ef4444" />
      </Box>
      <Box args={[0.1, 0.2, 0.1]} position={[0.4, 0, 0]}>
        <meshStandardMaterial color="#fbbf24" />
      </Box>
      <Box args={[0.1, 0.1, 0.1]} position={[-0.4, 0, 0]}>
        <meshStandardMaterial color="#6b7280" />
      </Box>
      <Html position={[0.4, 0.4, 0]} center>
        <div className="text-white text-xs font-bold">+</div>
      </Html>
      <Html position={[-0.4, 0.4, 0]} center>
        <div className="text-white text-xs font-bold">-</div>
      </Html>
    </group>
  );
}

// Ampul
function LightBulb({ position, isOn }: { position: [number, number, number], isOn: boolean }) {
  return (
    <group position={position}>
      <Sphere args={[0.3, 32, 32]}>
        <meshPhysicalMaterial
          color={isOn ? "#fef08a" : "#d1d5db"}
          transparent
          opacity={0.6}
          roughness={0.1}
          transmission={0.9}
        />
      </Sphere>
      <Sphere args={[0.1, 16, 16]}>
        <meshStandardMaterial
          color={isOn ? "#fbbf24" : "#6b7280"}
          emissive={isOn ? "#fbbf24" : "#000000"}
          emissiveIntensity={isOn ? 2 : 0}
        />
      </Sphere>
      {isOn && <pointLight position={[0, 0, 0]} intensity={2} distance={5} color="#fbbf24" />}
      <Cylinder args={[0.15, 0.15, 0.2]} position={[0, -0.4, 0]}>
        <meshStandardMaterial color="#9ca3af" />
      </Cylinder>
    </group>
  );
}

// Kablo
function Wire({ start, end }: { start: [number, number, number], end: [number, number, number] }) {
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);
  const direction = new THREE.Vector3().subVectors(endVec, startVec);
  const length = direction.length();
  const midpoint = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
  const axis = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, direction.normalize());

  return (
    <Cylinder args={[0.05, 0.05, length]} position={midpoint.toArray()} quaternion={quaternion}>
      <meshStandardMaterial color="#78716c" metalness={0.8} roughness={0.2} />
    </Cylinder>
  );
}

export function ElectricCircuit3D() {
  const [isOn, setIsOn] = useState(true);
  const [openPanel, setOpenPanel] = useState<PanelType>(null);

  const circuitPath = [
    new THREE.Vector3(2, 0, 0),
    new THREE.Vector3(2, 2, 0),
    new THREE.Vector3(0, 2, 0),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, -2, 0),
    new THREE.Vector3(-2, -2, 0),
    new THREE.Vector3(-2, 0, 0),
    new THREE.Vector3(-2, 2, 0),
    new THREE.Vector3(2, 2, 0),
    new THREE.Vector3(2, 0, 0),
  ];

  const togglePanel = (panel: PanelType) => {
    setOpenPanel(openPanel === panel ? null : panel);
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* 3D Sahne */}
      <div className="flex-1 relative">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <color attach="background" args={['#0f172a']} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />

          <Battery position={[2, 0, 0]} />
          <LightBulb position={[0, 0, 0]} isOn={isOn} />

          <Wire start={[2.4, 0, 0]} end={[2.4, 2, 0]} />
          <Wire start={[2, 2, 0]} end={[0, 2, 0]} />
          <Wire start={[0, 0.5, 0]} end={[0, 2, 0]} />
          <Wire start={[0, -0.5, 0]} end={[0, -2, 0]} />
          <Wire start={[0, -2, 0]} end={[-2, -2, 0]} />
          <Wire start={[-2.4, 0, 0]} end={[-2.4, -2, 0]} />

          {isOn && (
            <>
              {[...Array(8)].map((_, i) => (
                <Electron key={i} path={circuitPath} speed={0.5} delay={i * 1.2} />
              ))}
            </>
          )}

          <Text position={[0, 4, 0]} fontSize={0.35} color="#22d3ee" anchorX="center" anchorY="middle">
            ELEKTRİK DEVRESİ
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
        {/* Anahtar - Mobil dostu büyük buton */}
        <div className="flex justify-center">
          <button
            onClick={() => setIsOn(!isOn)}
            className={`px-8 py-4 md:py-3 rounded-lg font-bold text-base transition-all ${
              isOn ? 'bg-warning text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {isOn ? '💡 KAPAT' : '🔌 AÇ'}
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
                  <li>• Elektrik <strong>kapalı devre</strong>de akar</li>
                  <li>• <strong>Pil</strong> enerji kaynağıdır</li>
                  <li>• <strong>Elektronlar</strong> negatiften (+) pozitife akar</li>
                  <li>• <strong>Ampul</strong> elektriği ışığa çevirir</li>
                  <li>• Devre açıksa elektrik akmaz</li>
                  <li className="text-yellow-300">⚠️ Kapalı devre = Elektrik akar!</li>
                </ul>
              </>
            )}

            {openPanel === 'observation' && (
              <>
                <div className="bg-blue-900/50 p-3 rounded">
                  <p className="font-bold text-sm">Devre Durumu</p>
                  <p className="text-lg font-bold text-cyan-300">{isOn ? 'KAPALI (Akım var)' : 'AÇIK (Akım yok)'}</p>
                </div>
                <div className="bg-yellow-900/50 p-3 rounded">
                  <p className="font-bold text-sm">Ampul</p>
                  <p className="text-sm">{isOn ? '💡 Yanıyor' : '⚫ Sönük'}</p>
                </div>
                <div className="bg-purple-900/50 p-3 rounded">
                  <p className="font-bold text-sm">Elektronlar</p>
                  <p className="text-xs">{isOn ? 'Hareket ediyor (mavi küreler)' : 'Durgun'}</p>
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
                  <li>• Elektrik <strong>kapalı devre</strong>de akar</li>
                  <li>• <strong>Pil</strong> enerji kaynağı</li>
                  <li>• <strong>Elektronlar</strong> (-) → (+) yönde akar</li>
                  <li>• <strong>Ampul</strong> ışık verir</li>
                  <li className="text-yellow-300">⚠️ Kapalı devre = Akım var!</li>
                </ul>
              </>
            )}

            {openPanel === 'observation' && (
              <>
                <div className="bg-blue-900/50 p-3 rounded-lg">
                  <p className="font-bold text-sm">Devre Durumu</p>
                  <p className="text-xl font-bold text-cyan-300">{isOn ? 'KAPALI' : 'AÇIK'}</p>
                  <p className="text-sm">{isOn ? 'Akım var ✓' : 'Akım yok ✗'}</p>
                </div>
                <div className="bg-yellow-900/50 p-3 rounded-lg">
                  <p className="font-bold text-sm">Ampul</p>
                  <p className="text-lg">{isOn ? '💡 Yanıyor' : '⚫ Sönük'}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
