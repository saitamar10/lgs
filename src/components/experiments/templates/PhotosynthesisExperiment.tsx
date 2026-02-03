import { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Lightbulb, Droplet, Wind, CheckCircle } from 'lucide-react';
import { ExperimentState } from '@/types/experiments';
import * as THREE from 'three';

interface PhotosynthesisExperimentProps {
  onStepComplete: (stepId: string, correct: boolean) => void;
  experimentState: ExperimentState;
}

// 3D Plant Component
function Plant({ lightLevel, waterLevel, co2Level }: { lightLevel: number; waterLevel: number; co2Level: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [bubbles, setBubbles] = useState<Array<{ id: number; y: number }>>([]);

  // Calculate plant health based on conditions
  const health = Math.min(100, (lightLevel + waterLevel + co2Level) / 3);
  const isHealthy = health > 70;

  // Plant color based on health
  const plantColor = isHealthy ? '#22c55e' : health > 40 ? '#84cc16' : '#a3a3a3';

  // Scale based on health
  const scale = 0.5 + (health / 100) * 0.5;

  // Gentle wave animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  // Generate oxygen bubbles when healthy
  useFrame(() => {
    if (isHealthy && Math.random() > 0.95) {
      setBubbles(prev => [...prev.slice(-5), { id: Date.now(), y: 0 }]);
    }
    setBubbles(prev => prev.map(b => ({ ...b, y: b.y + 0.02 })).filter(b => b.y < 3));
  });

  return (
    <group>
      {/* Pot */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.5, 0.6, 0.4, 32]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>

      {/* Soil */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.48, 0.48, 0.05, 32]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* Stem */}
      <mesh ref={meshRef} position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 1, 16]} />
        <meshStandardMaterial color="#228b22" />
      </mesh>

      {/* Leaves (simplified) */}
      <group scale={scale}>
        {[0, 120, 240].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <mesh
              key={i}
              position={[Math.cos(rad) * 0.3, 0.5 + i * 0.2, Math.sin(rad) * 0.3]}
              rotation={[0, rad, Math.PI / 4]}
            >
              <boxGeometry args={[0.4, 0.01, 0.3]} />
              <meshStandardMaterial color={plantColor} />
            </mesh>
          );
        })}
      </group>

      {/* Oxygen bubbles */}
      {bubbles.map(bubble => (
        <mesh key={bubble.id} position={[0, bubble.y, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#60a5fa" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

export function PhotosynthesisExperiment({ onStepComplete, experimentState }: PhotosynthesisExperimentProps) {
  const [lightLevel, setLightLevel] = useState(30);
  const [waterLevel, setWaterLevel] = useState(30);
  const [co2Level, setCo2Level] = useState(30);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 'light', title: 'Işık seviyesini ayarla', target: 70, icon: Lightbulb, current: lightLevel, set: setLightLevel },
    { id: 'water', title: 'Su seviyesini ayarla', target: 70, icon: Droplet, current: waterLevel, set: setWaterLevel },
    { id: 'co2', title: 'CO₂ seviyesini ayarla', target: 70, icon: Wind, current: co2Level, set: setCo2Level },
  ];

  const currentStepData = steps[currentStep];
  const isStepComplete = currentStepData && currentStepData.current >= currentStepData.target;

  const handleNextStep = () => {
    if (isStepComplete) {
      onStepComplete(currentStepData.id, true);
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const allStepsComplete = lightLevel >= 70 && waterLevel >= 70 && co2Level >= 70;

  return (
    <div className="flex flex-col md:flex-row h-full gap-4">
      {/* 3D Scene */}
      <div className="flex-1 bg-gradient-to-b from-sky-200 to-green-100 rounded-xl overflow-hidden relative">
        <Canvas
          camera={{ position: [2, 2, 2], fov: 50 }}
          style={{ height: '100%' }}
        >
          <ambientLight intensity={0.3 + (lightLevel / 100) * 0.7} />
          <directionalLight position={[5, 5, 5]} intensity={lightLevel / 100} castShadow />
          <Plant lightLevel={lightLevel} waterLevel={waterLevel} co2Level={co2Level} />
          <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2} />
          <Environment preset="park" />
        </Canvas>

        {/* Health Indicator */}
        <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
          <p className="text-sm font-semibold">
            Fotosentez: {allStepsComplete ? (
              <span className="text-success">✓ Aktif</span>
            ) : (
              <span className="text-muted-foreground">○ Beklemede</span>
            )}
          </p>
        </div>
      </div>

      {/* Controls Panel */}
      <Card className="w-full md:w-80 p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold mb-2">Adım {currentStep + 1}/{steps.length}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {currentStepData?.title}
          </p>
        </div>

        {/* Current Step Control */}
        {currentStepData && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <currentStepData.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Seviye: %{currentStepData.current}</p>
                <p className="text-xs text-muted-foreground">Hedef: %{currentStepData.target}</p>
              </div>
            </div>

            <Slider
              value={[currentStepData.current]}
              onValueChange={(value) => currentStepData.set(value[0])}
              max={100}
              step={1}
              className="w-full"
            />

            {isStepComplete && (
              <div className="bg-success/10 border border-success/30 rounded-lg p-3 animate-slide-up">
                <p className="text-sm text-success font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Harika! Doğru seviye
                </p>
              </div>
            )}
          </div>
        )}

        {/* All Steps Overview */}
        <div className="space-y-2 pt-4 border-t border-border">
          <p className="text-xs font-semibold text-muted-foreground">Tüm Değerler:</p>
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <step.icon className="w-4 h-4 text-muted-foreground" />
                <span className={idx === currentStep ? 'font-semibold' : 'text-muted-foreground'}>
                  {step.title.split(' ')[0]}
                </span>
              </div>
              <span className={step.current >= step.target ? 'text-success font-bold' : 'text-muted-foreground'}>
                %{step.current}
              </span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        {currentStep < steps.length - 1 ? (
          <Button
            onClick={handleNextStep}
            disabled={!isStepComplete}
            className="w-full"
            size="lg"
          >
            {isStepComplete ? 'Sonraki Adım →' : 'Hedef seviyeye ulaş'}
          </Button>
        ) : (
          <Button
            onClick={() => onStepComplete('complete', allStepsComplete)}
            disabled={!allStepsComplete}
            className="w-full bg-success hover:bg-success/90"
            size="lg"
          >
            {allStepsComplete ? 'Deneyi Tamamla! 🎉' : 'Tüm değerleri ayarla'}
          </Button>
        )}
      </Card>
    </div>
  );
}
