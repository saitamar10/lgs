import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Html, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

/*
═══════════════════════════════════════════════════════════════
KALITIM - 3D SANAL LABORATUVAR
═══════════════════════════════════════════════════════════════
KONU: Mendel'in kalıtım kuralları, dominant-çekinik aleller
AMAÇ: Punnett karesi ile yavru genotiplerini görselleştirmek
*/

type Allele = 'K' | 'm'; // K=Kahverengi (Dominant), m=Mavi (Çekinik)
type Genotype = 'KK' | 'Km' | 'mm';
type PanelType = 'info' | 'observation' | null;

interface Organism {
  genotype: Genotype;
  phenotype: 'Kahverengi' | 'Mavi';
  color: string;
}

const getOrganism = (genotype: Genotype): Organism => {
  if (genotype === 'KK' || genotype === 'Km') {
    return { genotype, phenotype: 'Kahverengi', color: '#8B4513' };
  }
  return { genotype, phenotype: 'Mavi', color: '#4169E1' };
};

const getGametes = (genotype: Genotype): Allele[] => {
  if (genotype === 'KK') return ['K', 'K'];
  if (genotype === 'mm') return ['m', 'm'];
  return ['K', 'm'];
};

const combineAlleles = (allele1: Allele, allele2: Allele): Genotype => {
  if (allele1 === 'K' && allele2 === 'K') return 'KK';
  if (allele1 === 'm' && allele2 === 'm') return 'mm';
  return 'Km';
};

// Anne veya Baba organizma
function ParentOrganism({ organism, position, label }: { organism: Organism; position: [number, number, number]; label: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.003;
  });

  return (
    <group ref={ref} position={position}>
      <Sphere args={[0.6, 32, 32]}>
        <meshStandardMaterial color={organism.color} emissive={organism.color} emissiveIntensity={0.3} />
      </Sphere>
      {/* Gözler */}
      <Sphere args={[0.15, 16, 16]} position={[-0.2, 0.2, 0.5]}>
        <meshStandardMaterial color="#FFFFFF" />
      </Sphere>
      <Sphere args={[0.15, 16, 16]} position={[0.2, 0.2, 0.5]}>
        <meshStandardMaterial color="#FFFFFF" />
      </Sphere>
      <Sphere args={[0.08, 16, 16]} position={[-0.2, 0.2, 0.6]}>
        <meshStandardMaterial color={organism.color} />
      </Sphere>
      <Sphere args={[0.08, 16, 16]} position={[0.2, 0.2, 0.6]}>
        <meshStandardMaterial color={organism.color} />
      </Sphere>
      {/* Etiket */}
      <Html position={[0, 1, 0]} center>
        <div className="bg-purple-600/90 text-white px-2 py-1 rounded text-xs font-bold">{label}</div>
      </Html>
    </group>
  );
}

// Gamet hücresi
function Gamete({ allele, position }: { allele: Allele; position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) ref.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.002;
  });

  return (
    <group position={position}>
      <Sphere ref={ref} args={[0.25, 16, 16]}>
        <meshStandardMaterial
          color={allele === 'K' ? '#FFD700' : '#87CEEB'}
          transparent
          opacity={0.8}
          emissive={allele === 'K' ? '#FFD700' : '#87CEEB'}
          emissiveIntensity={0.4}
        />
      </Sphere>
      <Html position={[0, 0, 0]} center>
        <div className="text-white text-sm font-bold bg-black/70 px-2 py-1 rounded">{allele}</div>
      </Html>
    </group>
  );
}

// Yavru organizma
function OffspringOrganism({ organism, position, index }: { organism: Organism; position: [number, number, number]; index: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.004;
  });

  return (
    <group ref={ref} position={position}>
      <Sphere args={[0.4, 24, 24]}>
        <meshStandardMaterial color={organism.color} emissive={organism.color} emissiveIntensity={0.3} />
      </Sphere>
      {/* Gözler */}
      <Sphere args={[0.1, 12, 12]} position={[-0.15, 0.15, 0.35]}>
        <meshStandardMaterial color="#FFFFFF" />
      </Sphere>
      <Sphere args={[0.1, 12, 12]} position={[0.15, 0.15, 0.35]}>
        <meshStandardMaterial color="#FFFFFF" />
      </Sphere>
      <Sphere args={[0.05, 12, 12]} position={[-0.15, 0.15, 0.4]}>
        <meshStandardMaterial color={organism.color} />
      </Sphere>
      <Sphere args={[0.05, 12, 12]} position={[0.15, 0.15, 0.4]}>
        <meshStandardMaterial color={organism.color} />
      </Sphere>
      {/* Etiket */}
      <Html position={[0, -0.7, 0]} center>
        <div className="bg-black/80 text-white px-2 py-1 rounded text-xs font-bold">{organism.genotype}</div>
      </Html>
    </group>
  );
}

export function Heredity3D() {
  const [motherGenotype, setMotherGenotype] = useState<Genotype>('Km');
  const [fatherGenotype, setFatherGenotype] = useState<Genotype>('Km');
  const [openPanel, setOpenPanel] = useState<PanelType>(null);

  const mother = getOrganism(motherGenotype);
  const father = getOrganism(fatherGenotype);
  const motherGametes = getGametes(motherGenotype);
  const fatherGametes = getGametes(fatherGenotype);

  const offspring = [
    combineAlleles(fatherGametes[0], motherGametes[0]),
    combineAlleles(fatherGametes[0], motherGametes[1]),
    combineAlleles(fatherGametes[1], motherGametes[0]),
    combineAlleles(fatherGametes[1], motherGametes[1]),
  ].map(getOrganism);

  const brownCount = offspring.filter(o => o.phenotype === 'Kahverengi').length;
  const blueCount = offspring.filter(o => o.phenotype === 'Mavi').length;
  const brownPercent = (brownCount / 4) * 100;
  const bluePercent = (blueCount / 4) * 100;

  const togglePanel = (panel: PanelType) => {
    setOpenPanel(openPanel === panel ? null : panel);
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* 3D Sahne */}
      <div className="flex-1 relative">
        <Canvas camera={{ position: [0, 3, 12], fov: 50 }}>
          <color attach="background" args={['#1a0033']} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <pointLight position={[-10, 5, -10]} intensity={0.8} />

          {/* Anne & Baba */}
          <ParentOrganism organism={mother} position={[-4, 2, 0]} label="ANNE" />
          <ParentOrganism organism={father} position={[4, 2, 0]} label="BABA" />

          {/* Gametler */}
          <Gamete allele={motherGametes[0]} position={[-4.5, 0, 0]} />
          <Gamete allele={motherGametes[1]} position={[-3.5, 0, 0]} />
          <Gamete allele={fatherGametes[0]} position={[3.5, 0, 0]} />
          <Gamete allele={fatherGametes[1]} position={[4.5, 0, 0]} />

          {/* Yavru organizmaları */}
          <OffspringOrganism organism={offspring[0]} position={[-2.5, -3, 0]} index={0} />
          <OffspringOrganism organism={offspring[1]} position={[-0.8, -3, 0]} index={1} />
          <OffspringOrganism organism={offspring[2]} position={[0.8, -3, 0]} index={2} />
          <OffspringOrganism organism={offspring[3]} position={[2.5, -3, 0]} index={3} />

          <Text position={[0, 5, 0]} fontSize={0.4} color="#FF69B4" anchorX="center" anchorY="middle">
            KALITIM - MENDEL KURALLARI
          </Text>

          <OrbitControls enableZoom={true} maxDistance={20} minDistance={5} />
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
        {/* Genotip Seçimi - Mobil dostu */}
        <div className="space-y-3">
          <div>
            <p className="text-xs text-pink-300 font-bold mb-2">ANNE GENOTİPİ:</p>
            <div className="grid grid-cols-3 gap-2">
              {(['KK', 'Km', 'mm'] as Genotype[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setMotherGenotype(g)}
                  className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${
                    motherGenotype === g ? 'bg-pink-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-blue-300 font-bold mb-2">BABA GENOTİPİ:</p>
            <div className="grid grid-cols-3 gap-2">
              {(['KK', 'Km', 'mm'] as Genotype[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setFatherGenotype(g)}
                  className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${
                    fatherGenotype === g ? 'bg-blue-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {g}
                </button>
              ))}
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
                  <li>• Kalıtımda her özellik için <strong>2 alel</strong> vardır</li>
                  <li>• <strong>Dominant</strong> alel (K) çekinik aleli (m) baskılar</li>
                  <li>• <strong>K</strong> = Kahverengi (büyük harf)</li>
                  <li>• <strong>m</strong> = Mavi (küçük harf)</li>
                  <li>• KK veya Km → Kahverengi göz</li>
                  <li>• mm → Mavi göz</li>
                  <li className="text-yellow-300">⚠️ Punnett karesi 4 olası kombinasyon gösterir!</li>
                </ul>
              </>
            )}

            {openPanel === 'observation' && (
              <>
                <div className="bg-pink-900/50 p-3 rounded">
                  <p className="font-bold text-sm">Anne</p>
                  <p className="text-lg font-bold text-pink-300">{motherGenotype} → {mother.phenotype}</p>
                </div>
                <div className="bg-blue-900/50 p-3 rounded">
                  <p className="font-bold text-sm">Baba</p>
                  <p className="text-lg font-bold text-blue-300">{fatherGenotype} → {father.phenotype}</p>
                </div>
                <div className="bg-green-900/50 p-3 rounded">
                  <p className="font-bold text-sm">Yavru İstatistikleri</p>
                  <p className="text-xs mt-1">🟤 Kahverengi: {brownCount}/4 (%{brownPercent})</p>
                  <p className="text-xs">🔵 Mavi: {blueCount}/4 (%{bluePercent})</p>
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
                  <li>• Her özellik için <strong>2 alel</strong> vardır</li>
                  <li>• <strong>Dominant (K)</strong> çekinik (m) aleli baskılar</li>
                  <li>• KK veya Km → Kahverengi</li>
                  <li>• mm → Mavi göz</li>
                  <li className="text-yellow-300">⚠️ Punnett karesi 4 kombinasyon!</li>
                </ul>
              </>
            )}

            {openPanel === 'observation' && (
              <>
                <div className="bg-pink-900/50 p-3 rounded-lg">
                  <p className="font-bold text-sm">Anne</p>
                  <p className="text-xl font-bold text-pink-300">{motherGenotype}</p>
                  <p className="text-sm">{mother.phenotype} göz</p>
                </div>
                <div className="bg-blue-900/50 p-3 rounded-lg">
                  <p className="font-bold text-sm">Baba</p>
                  <p className="text-xl font-bold text-blue-300">{fatherGenotype}</p>
                  <p className="text-sm">{father.phenotype} göz</p>
                </div>
                <div className="bg-green-900/50 p-3 rounded-lg">
                  <p className="font-bold text-sm">Yavru İstatistikleri</p>
                  <p className="text-sm mt-1">🟤 Kahverengi: {brownCount}/4 (%{brownPercent})</p>
                  <p className="text-sm">🔵 Mavi: {blueCount}/4 (%{bluePercent})</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
