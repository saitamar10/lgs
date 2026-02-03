import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Html, Cylinder, Torus } from '@react-three/drei';
import * as THREE from 'three';

/*
═══════════════════════════════════════════════════════════════
DNA VE GENETİK KOD - 3D SANAL LABORATUVAR
═══════════════════════════════════════════════════════════════
KONU: DNA çift sarmal yapıdadır, genetik bilgiyi bazlar taşır
AMAÇ: Hücre → DNA hiyerarşisini zoom ile görselleştirmek
*/

type ZoomLevel = 'cell' | 'nucleus' | 'chromosome' | 'dna' | 'gene';
type PanelType = 'info' | 'observation' | null;

interface BasePair {
  base1: 'A' | 'T' | 'G' | 'C';
  base2: 'A' | 'T' | 'G' | 'C';
  position: number;
}

const BASE_COLORS = {
  A: '#FF6B6B',
  T: '#4ECDC4',
  G: '#FFE66D',
  C: '#95E1D3',
};

// Hücre zarı
function CellMembrane() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.001;
  });

  return (
    <Sphere ref={ref} args={[5, 32, 32]}>
      <meshStandardMaterial color="#E3F2FD" transparent opacity={0.15} wireframe />
    </Sphere>
  );
}

// Çekirdek
function Nucleus() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (ref.current) ref.current.rotation.y -= 0.002;
  });

  return (
    <Sphere ref={ref} args={[2.5, 32, 32]}>
      <meshStandardMaterial color="#9C27B0" transparent opacity={0.3} emissive="#9C27B0" emissiveIntensity={0.2} />
    </Sphere>
  );
}

// Kromozom
function Chromosome() {
  const chromosomes = [];
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const radius = 1.2;
    chromosomes.push(
      <group
        key={i}
        position={[Math.cos(angle) * radius, Math.sin(angle * 0.5) * 0.3, Math.sin(angle) * radius]}
        rotation={[0, angle, Math.PI / 4]}
      >
        <Torus args={[0.3, 0.08, 16, 32]}>
          <meshStandardMaterial color="#FF5722" emissive="#FF5722" emissiveIntensity={0.3} />
        </Torus>
      </group>
    );
  }
  return <>{chromosomes}</>;
}

// DNA Çift Sarmalı
function DNADoubleHelix({ showBases }: { showBases: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.005;
  });

  const backbones = [];
  const basePairs: BasePair[] = [];
  const steps = 40;
  const sequence: ('A' | 'T' | 'G' | 'C')[] = ['A', 'T', 'G', 'C', 'G', 'C', 'A', 'T', 'T', 'A', 'G', 'C', 'C', 'G'];

  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    const angle = t * Math.PI * 4;
    const y = (t - 0.5) * 4;
    const radius = 0.5;

    const base1 = sequence[i % sequence.length];
    const base2 = base1 === 'A' ? 'T' : base1 === 'T' ? 'A' : base1 === 'G' ? 'C' : 'G';
    basePairs.push({ base1, base2, position: i });

    backbones.push(
      <Sphere key={`left-${i}`} args={[0.08, 8, 8]} position={[Math.cos(angle) * radius, y, Math.sin(angle) * radius]}>
        <meshStandardMaterial color="#64B5F6" />
      </Sphere>,
      <Sphere key={`right-${i}`} args={[0.08, 8, 8]} position={[Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius]}>
        <meshStandardMaterial color="#64B5F6" />
      </Sphere>
    );
  }

  const basePairElements = showBases
    ? basePairs.map((pair, i) => {
        const t = i / steps;
        const angle = t * Math.PI * 4;
        const y = (t - 0.5) * 4;
        const radius = 0.5;

        const pos1 = new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
        const pos2 = new THREE.Vector3(Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius);
        const midpoint = new THREE.Vector3().addVectors(pos1, pos2).multiplyScalar(0.5);

        return (
          <group key={`pair-${i}`}>
            <Sphere args={[0.12, 12, 12]} position={pos1.toArray()}>
              <meshStandardMaterial color={BASE_COLORS[pair.base1]} emissive={BASE_COLORS[pair.base1]} emissiveIntensity={0.4} />
            </Sphere>
            <Sphere args={[0.12, 12, 12]} position={pos2.toArray()}>
              <meshStandardMaterial color={BASE_COLORS[pair.base2]} emissive={BASE_COLORS[pair.base2]} emissiveIntensity={0.4} />
            </Sphere>
            <Cylinder args={[0.03, 0.03, radius * 2, 8]} position={midpoint.toArray()} rotation={[0, 0, Math.PI / 2 + angle]}>
              <meshBasicMaterial color="#9E9E9E" transparent opacity={0.5} />
            </Cylinder>
            {i % 3 === 0 && (
              <>
                <Html position={pos1.toArray()} center>
                  <div className="text-white text-xs font-bold bg-black/50 px-1 rounded">{pair.base1}</div>
                </Html>
                <Html position={pos2.toArray()} center>
                  <div className="text-white text-xs font-bold bg-black/50 px-1 rounded">{pair.base2}</div>
                </Html>
              </>
            )}
          </group>
        );
      })
    : [];

  return (
    <group ref={ref}>
      {backbones}
      {basePairElements}
    </group>
  );
}

// Gen bölgesi
function GeneSegment() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1.2, 1.5, 1.2]} />
      <meshStandardMaterial color="#FFC107" transparent opacity={0.2} emissive="#FFC107" emissiveIntensity={0.5} />
    </mesh>
  );
}

export function DNAGeneticCode3D() {
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('cell');
  const [openPanel, setOpenPanel] = useState<PanelType>(null);

  const getCameraPosition = (): [number, number, number] => {
    switch (zoomLevel) {
      case 'cell': return [0, 0, 15];
      case 'nucleus': return [0, 0, 8];
      case 'chromosome': return [0, 0, 4];
      case 'dna': return [0, 0, 2.5];
      case 'gene': return [0, 0, 1.5];
    }
  };

  const getZoomDescription = (): string => {
    switch (zoomLevel) {
      case 'cell': return 'HÜCRE - Canlının temel birimi';
      case 'nucleus': return 'ÇEKIRDEK - Genetik materyal burada';
      case 'chromosome': return 'KROMOZOM - DNA paketlenmiş halde';
      case 'dna': return 'DNA - Çift sarmal, bazlar görünüyor';
      case 'gene': return 'GEN - Protein kodlayan DNA bölgesi';
    }
  };

  const togglePanel = (panel: PanelType) => {
    setOpenPanel(openPanel === panel ? null : panel);
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* 3D Sahne */}
      <div className="flex-1 relative">
        <Canvas camera={{ position: getCameraPosition(), fov: 50 }}>
          <color attach="background" args={['#0a0e27']} />
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          {(zoomLevel === 'cell') && <CellMembrane />}
          {(zoomLevel === 'cell' || zoomLevel === 'nucleus') && <Nucleus />}
          {(zoomLevel === 'nucleus' || zoomLevel === 'chromosome') && <Chromosome />}
          {(zoomLevel === 'chromosome' || zoomLevel === 'dna' || zoomLevel === 'gene') && (
            <DNADoubleHelix showBases={zoomLevel === 'dna' || zoomLevel === 'gene'} />
          )}
          {zoomLevel === 'gene' && <GeneSegment />}

          <Text position={[0, 7, 0]} fontSize={0.4} color="#00D9FF" anchorX="center" anchorY="middle">
            DNA VE GENETİK KOD
          </Text>

          <OrbitControls enableZoom={true} maxDistance={20} minDistance={1} />
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
        {/* Zoom Seviyeleri - Mobil dostu büyük butonlar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
          <button
            onClick={() => setZoomLevel('cell')}
            className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${
              zoomLevel === 'cell' ? 'bg-blue-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🔵 HÜCRE
          </button>
          <button
            onClick={() => setZoomLevel('nucleus')}
            className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${
              zoomLevel === 'nucleus' ? 'bg-purple-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🟣 ÇEKİRDEK
          </button>
          <button
            onClick={() => setZoomLevel('chromosome')}
            className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${
              zoomLevel === 'chromosome' ? 'bg-red-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🔴 KROMOZOM
          </button>
          <button
            onClick={() => setZoomLevel('dna')}
            className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${
              zoomLevel === 'dna' ? 'bg-green-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🟢 DNA
          </button>
          <button
            onClick={() => setZoomLevel('gene')}
            className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all col-span-2 md:col-span-1 ${
              zoomLevel === 'gene' ? 'bg-yellow-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🟡 GEN
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
                  <li>• DNA <strong>çift sarmal</strong> yapıdadır</li>
                  <li>• 4 farklı baz vardır: <span style={{ color: BASE_COLORS.A }}>A</span>, <span style={{ color: BASE_COLORS.T }}>T</span>, <span style={{ color: BASE_COLORS.G }}>G</span>, <span style={{ color: BASE_COLORS.C }}>C</span></li>
                  <li>• Bazlar SADECE belirli şekilde eşleşir: <strong>A-T</strong> ve <strong>G-C</strong></li>
                  <li>• Bazların sırası <strong>genetik şifre</strong>yi oluşturur</li>
                  <li className="text-yellow-300">⚠️ Hücre → Çekirdek → Kromozom → DNA → Gen</li>
                </ul>
              </>
            )}

            {openPanel === 'observation' && (
              <>
                <div className="bg-blue-900/50 p-3 rounded">
                  <p className="font-bold text-sm">Şu an görülen seviye</p>
                  <p className="text-lg font-bold text-cyan-300">{zoomLevel.toUpperCase()}</p>
                </div>
                <div className="bg-purple-900/50 p-3 rounded">
                  <p className="font-bold text-sm">Açıklama</p>
                  <p className="text-xs">{getZoomDescription()}</p>
                </div>
                {(zoomLevel === 'dna' || zoomLevel === 'gene') && (
                  <div className="bg-green-900/50 p-3 rounded">
                    <p className="font-bold text-sm">Baz Eşleşmeleri</p>
                    <div className="grid grid-cols-2 gap-1 mt-1">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: BASE_COLORS.A }}></div>
                        <span className="text-xs">A ↔ T</span>
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: BASE_COLORS.T }}></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: BASE_COLORS.G }}></div>
                        <span className="text-xs">G ↔ C</span>
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: BASE_COLORS.C }}></div>
                      </div>
                    </div>
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
                  <li>• DNA <strong>çift sarmal</strong> yapıdadır</li>
                  <li>• Bazlar: <strong>A-T</strong> ve <strong>G-C</strong> eşleşir</li>
                  <li>• Bazların sırası <strong>genetik şifre</strong></li>
                  <li className="text-yellow-300">⚠️ Hücre → DNA → Gen hiyerarşisi!</li>
                </ul>
              </>
            )}

            {openPanel === 'observation' && (
              <>
                <div className="bg-blue-900/50 p-3 rounded-lg">
                  <p className="font-bold text-sm">Şu an görülen</p>
                  <p className="text-xl font-bold text-cyan-300">{zoomLevel.toUpperCase()}</p>
                  <p className="text-sm mt-1">{getZoomDescription()}</p>
                </div>
                {(zoomLevel === 'dna' || zoomLevel === 'gene') && (
                  <div className="bg-green-900/50 p-3 rounded-lg">
                    <p className="font-bold text-sm">Baz Eşleşmeleri</p>
                    <div className="flex gap-3 mt-2">
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: BASE_COLORS.A }}></div>
                        <span className="text-sm">A ↔ T</span>
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: BASE_COLORS.T }}></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: BASE_COLORS.G }}></div>
                        <span className="text-sm">G ↔ C</span>
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: BASE_COLORS.C }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
