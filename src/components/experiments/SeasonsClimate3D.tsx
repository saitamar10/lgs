import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

/*
═══════════════════════════════════════════════════════════════
MEVSİMLER VE İKLİM - 3D SANAL LABORATUVAR
═══════════════════════════════════════════════════════════════
KONU: Mevsimler Dünya'nın 23.5° eğik ekseni nedeniyle oluşur
AMAÇ: Eksen eğikliği ile mevsim ilişkisini görselleştirmek
*/

type Season = 'spring' | 'summer' | 'autumn' | 'winter';
type PanelType = 'info' | 'observation' | 'science' | 'daily' | null;

interface SeasonData {
  name: string;
  angle: number;
  northSeason: string;
  southSeason: string;
  date: string;
  northTemp: string;
  southTemp: string;
}

const SEASONS: Record<Season, SeasonData> = {
  spring: {
    name: 'İlkbahar Ekinoksu',
    angle: 0,
    northSeason: 'İLKBAHAR',
    southSeason: 'SONBAHAR',
    date: '21 Mart',
    northTemp: 'Ilıman',
    southTemp: 'Ilıman'
  },
  summer: {
    name: 'Yaz Gündönümü',
    angle: Math.PI / 2,
    northSeason: 'YAZ',
    southSeason: 'KIŞ',
    date: '21 Haziran',
    northTemp: 'Sıcak ↑',
    southTemp: 'Soğuk ↓'
  },
  autumn: {
    name: 'Sonbahar Ekinoksu',
    angle: Math.PI,
    northSeason: 'SONBAHAR',
    southSeason: 'İLKBAHAR',
    date: '23 Eylül',
    northTemp: 'Ilıman',
    southTemp: 'Ilıman'
  },
  winter: {
    name: 'Kış Gündönümü',
    angle: (3 * Math.PI) / 2,
    northSeason: 'KIŞ',
    southSeason: 'YAZ',
    date: '21 Aralık',
    northTemp: 'Soğuk ↓',
    southTemp: 'Sıcak ↑'
  }
};

// Güneş
function Sun() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.001;
    }
  });

  return (
    <group>
      <Sphere ref={ref} args={[1.2, 64, 64]}>
        <meshStandardMaterial
          color="#FDB813"
          emissive="#FDB813"
          emissiveIntensity={2}
        />
      </Sphere>
      <pointLight position={[0, 0, 0]} intensity={4} distance={100} color="#FDB813" />
    </group>
  );
}

// Paralel güneş ışınları
function SunRays({ earthPosition }: { earthPosition: THREE.Vector3 }) {
  const rays = [];
  const rayCount = 12;

  for (let i = 0; i < rayCount; i++) {
    const offset = (i - rayCount / 2) * 0.4;
    rays.push(
      <mesh key={i} position={[earthPosition.x - 3, offset, earthPosition.z]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 2, 8]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.6} />
      </mesh>
    );
  }

  return <>{rays}</>;
}

// Dünya (23.5° eğik eksenli)
function Earth({ season }: { season: SeasonData }) {
  const earthRef = useRef<THREE.Group>(null);
  const TILT_ANGLE = (23.5 * Math.PI) / 180;
  const ORBIT_RADIUS = 7;

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.005;
    }
  });

  const position = new THREE.Vector3(
    Math.cos(season.angle) * ORBIT_RADIUS,
    0,
    Math.sin(season.angle) * ORBIT_RADIUS
  );

  return (
    <group position={position}>
      <group ref={earthRef} rotation={[TILT_ANGLE, 0, 0]}>
        {/* Dünya */}
        <Sphere args={[0.8, 64, 64]}>
          <meshStandardMaterial color="#1E88E5" emissive="#0D47A1" emissiveIntensity={0.1} />
        </Sphere>

        {/* Kıtalar */}
        <Sphere args={[0.81, 32, 32]}>
          <meshStandardMaterial color="#4CAF50" transparent opacity={0.4} />
        </Sphere>

        {/* Bulutlar */}
        <Sphere args={[0.83, 32, 32]}>
          <meshStandardMaterial color="#FFFFFF" transparent opacity={0.2} />
        </Sphere>

        {/* Kutuplar */}
        <Sphere args={[0.35, 32, 32]} position={[0, 0.65, 0]}>
          <meshStandardMaterial color="#E3F2FD" />
        </Sphere>
        <Sphere args={[0.35, 32, 32]} position={[0, -0.65, 0]}>
          <meshStandardMaterial color="#E3F2FD" />
        </Sphere>

        {/* Eksen */}
        <mesh>
          <cylinderGeometry args={[0.02, 0.02, 2.2]} />
          <meshBasicMaterial color="#9E9E9E" transparent opacity={0.5} />
        </mesh>

        {/* Kuzey/Güney işaretleri - sadece 3D sahnede */}
        <Html position={[0, 1.3, 0]} center>
          <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
            KUZEY
          </div>
        </Html>
        <Html position={[0, -1.3, 0]} center>
          <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            GÜNEY
          </div>
        </Html>
      </group>

      <SunRays earthPosition={position} />
    </group>
  );
}

// Yörünge
function Orbit() {
  const points = [];
  const ORBIT_RADIUS = 7;

  for (let i = 0; i <= 128; i++) {
    const angle = (i / 128) * Math.PI * 2;
    points.push(
      new THREE.Vector3(
        Math.cos(angle) * ORBIT_RADIUS,
        0,
        Math.sin(angle) * ORBIT_RADIUS
      )
    );
  }

  const curve = new THREE.CatmullRomCurve3(points);
  const tubeGeometry = new THREE.TubeGeometry(curve, 128, 0.04, 8, true);

  return (
    <mesh geometry={tubeGeometry}>
      <meshBasicMaterial color="#616161" transparent opacity={0.3} />
    </mesh>
  );
}

export function SeasonsClimate3D() {
  const [currentSeason, setCurrentSeason] = useState<Season>('spring');
  const [openPanel, setOpenPanel] = useState<PanelType>(null);

  const season = SEASONS[currentSeason];

  const togglePanel = (panel: PanelType) => {
    setOpenPanel(openPanel === panel ? null : panel);
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* 3D Sahne - Her zaman ana odak */}
      <div className="flex-1 relative">
        <Canvas camera={{ position: [0, 12, 18], fov: 45 }}>
          <color attach="background" args={['#000814']} />
          <ambientLight intensity={0.3} />

          <Sun />
          <Earth season={season} />
          <Orbit />

          {/* Yıldızlar */}
          {[...Array(200)].map((_, i) => (
            <Sphere
              key={i}
              args={[0.02, 8, 8]}
              position={[
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50,
              ]}
            >
              <meshBasicMaterial color="#FFFFFF" />
            </Sphere>
          ))}

          <Text position={[0, 8, 0]} fontSize={0.5} color="#00D9FF" anchorX="center" anchorY="middle">
            MEVSİMLER - EKSEN EĞİKLİĞİ 23.5°
          </Text>

          <OrbitControls enableZoom={true} maxDistance={30} minDistance={10} />
        </Canvas>

        {/* Masaüstü: Sağ üst bilgi butonu */}
        <div className="absolute top-4 right-4 hidden md:flex gap-2">
          <button
            onClick={() => togglePanel('info')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              openPanel === 'info'
                ? 'bg-cyan-500 text-white'
                : 'bg-black/70 text-cyan-400 hover:bg-black/90'
            }`}
          >
            ℹ️ Bilgi
          </button>
          <button
            onClick={() => togglePanel('observation')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              openPanel === 'observation'
                ? 'bg-purple-500 text-white'
                : 'bg-black/70 text-purple-400 hover:bg-black/90'
            }`}
          >
            🔬 Gözlem
          </button>
        </div>
      </div>

      {/* Kontrol Paneli - Her zaman görünür, alt kısımda */}
      <div className="bg-black/95 border-t-2 border-cyan-500 p-3 md:p-4">
        {/* Mevsim Seçici - Büyük butonlar (mobil dostu) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
          <button
            onClick={() => setCurrentSeason('spring')}
            className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${
              currentSeason === 'spring'
                ? 'bg-green-500 text-white scale-105'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🌸 İlkbahar
            <div className="text-[10px] opacity-80">21 Mart</div>
          </button>
          <button
            onClick={() => setCurrentSeason('summer')}
            className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${
              currentSeason === 'summer'
                ? 'bg-yellow-500 text-white scale-105'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            ☀️ Yaz
            <div className="text-[10px] opacity-80">21 Haziran</div>
          </button>
          <button
            onClick={() => setCurrentSeason('autumn')}
            className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${
              currentSeason === 'autumn'
                ? 'bg-orange-500 text-white scale-105'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🍂 Sonbahar
            <div className="text-[10px] opacity-80">23 Eylül</div>
          </button>
          <button
            onClick={() => setCurrentSeason('winter')}
            className={`px-3 py-3 md:py-2 rounded-lg text-sm font-bold transition-all ${
              currentSeason === 'winter'
                ? 'bg-blue-500 text-white scale-105'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            ❄️ Kış
            <div className="text-[10px] opacity-80">21 Aralık</div>
          </button>
        </div>

        {/* Mobil: Alt bilgi butonları */}
        <div className="flex md:hidden gap-2 mt-2">
          <button
            onClick={() => togglePanel('observation')}
            className={`flex-1 py-3 rounded-lg font-bold text-sm ${
              openPanel === 'observation'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            🔬 Gözlem
          </button>
          <button
            onClick={() => togglePanel('info')}
            className={`flex-1 py-3 rounded-lg font-bold text-sm ${
              openPanel === 'info'
                ? 'bg-cyan-500 text-white'
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            ℹ️ Bilgi
          </button>
        </div>
      </div>

      {/* MASAÜSTÜ: Sağ panel - max %30 genişlik */}
      {openPanel && (
        <div className="hidden md:block absolute top-20 right-4 w-80 max-h-[70vh] overflow-y-auto bg-black/95 backdrop-blur-sm rounded-lg border-2 border-cyan-500 shadow-xl">
          <div className="sticky top-0 bg-black/95 p-3 border-b border-cyan-500 flex justify-between items-center">
            <h3 className="font-bold text-cyan-400">
              {openPanel === 'info' && 'ℹ️ Bilimsel Açıklama'}
              {openPanel === 'observation' && '🔬 Gözlem'}
            </h3>
            <button
              onClick={() => setOpenPanel(null)}
              className="text-white hover:text-red-400 text-xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="p-4 text-white text-sm space-y-3">
            {openPanel === 'info' && (
              <>
                <p className="font-bold text-green-400">Şu anda ne görüyorsun?</p>
                <ul className="space-y-2 text-xs">
                  <li>• Mevsimler <strong>uzaklık değil, eksen eğikliği</strong> ile oluşur</li>
                  <li>• Dünya'nın ekseni <strong>23.5°</strong> eğiktir</li>
                  <li>• Güneş ışınları paralel gelir</li>
                  <li>• Işınlar dik → YAZ, eğik → KIŞ</li>
                  <li className="text-yellow-300">⚠️ Aynı anda Kuzey-Güney farklı mevsim!</li>
                </ul>
              </>
            )}

            {openPanel === 'observation' && (
              <>
                <div className="bg-blue-900/50 p-3 rounded">
                  <p className="font-bold text-sm">Kuzey Yarımküre</p>
                  <p className="text-lg font-bold text-blue-300">{season.northSeason}</p>
                  <p className="text-xs">{season.northTemp}</p>
                </div>
                <div className="bg-red-900/50 p-3 rounded">
                  <p className="font-bold text-sm">Güney Yarımküre</p>
                  <p className="text-lg font-bold text-red-300">{season.southSeason}</p>
                  <p className="text-xs">{season.southTemp}</p>
                </div>
                <div className="bg-purple-900/50 p-3 rounded">
                  <p className="font-bold text-sm">Tarih</p>
                  <p className="text-lg">{season.date}</p>
                </div>
                <div className="bg-orange-900/50 p-3 rounded">
                  <p className="font-bold text-sm">Günlük Hayat</p>
                  <ul className="text-xs space-y-1 mt-1">
                    <li>• Türkiye'de yaz → Avustralya'da kış</li>
                    <li>• 21 Haziran en uzun gün (Kuzey)</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* MOBİL: Bottom sheet - max %40 yükseklik */}
      {openPanel && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/98 backdrop-blur-sm border-t-4 border-cyan-500 rounded-t-3xl shadow-2xl max-h-[40vh] overflow-y-auto z-50 animate-slide-up">
          <div className="sticky top-0 bg-black/95 p-4 border-b border-cyan-500 flex justify-between items-center">
            <h3 className="font-bold text-cyan-400 text-base">
              {openPanel === 'info' && 'ℹ️ Bilimsel Açıklama'}
              {openPanel === 'observation' && '🔬 Gözlem'}
            </h3>
            <button
              onClick={() => setOpenPanel(null)}
              className="text-white text-2xl font-bold w-10 h-10 flex items-center justify-center"
            >
              ×
            </button>
          </div>

          <div className="p-4 text-white space-y-3">
            {openPanel === 'info' && (
              <>
                <p className="font-bold text-green-400 text-sm">Şu anda ne görüyorsun?</p>
                <ul className="space-y-2 text-sm">
                  <li>• Mevsimler <strong>eksen eğikliği</strong> ile oluşur</li>
                  <li>• Dünya ekseni <strong>23.5° eğik</strong></li>
                  <li>• Işınlar dik → YAZ, eğik → KIŞ</li>
                  <li className="text-yellow-300">⚠️ Kuzey-Güney farklı mevsim!</li>
                </ul>
              </>
            )}

            {openPanel === 'observation' && (
              <>
                <div className="bg-blue-900/50 p-3 rounded-lg">
                  <p className="font-bold text-sm">Kuzey Yarımküre</p>
                  <p className="text-xl font-bold text-blue-300">{season.northSeason}</p>
                  <p className="text-sm">{season.northTemp}</p>
                </div>
                <div className="bg-red-900/50 p-3 rounded-lg">
                  <p className="font-bold text-sm">Güney Yarımküre</p>
                  <p className="text-xl font-bold text-red-300">{season.southSeason}</p>
                  <p className="text-sm">{season.southTemp}</p>
                </div>
                <div className="bg-orange-900/50 p-3 rounded-lg">
                  <p className="font-bold text-sm">Günlük Hayat</p>
                  <ul className="text-sm space-y-1 mt-1">
                    <li>• Türkiye'de yaz → Avustralya'da kış</li>
                    <li>• 21 Haziran en uzun gün</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
