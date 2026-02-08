import { useState, useMemo, Suspense, lazy } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Beaker, CheckCircle2, AlertTriangle, Loader2, Maximize2, Minimize2 } from 'lucide-react';
import { toast } from 'sonner';
import { useExperiment, generatePlaceholderExperiment, ExperimentStep } from '@/hooks/useExperiments';

// Lazy load 3D experiments
const ElectricCircuit3D = lazy(() => import('@/components/experiments/ElectricCircuit3D').then(m => ({ default: m.ElectricCircuit3D })));
const MatterStates3D = lazy(() => import('@/components/experiments/MatterStates3D').then(m => ({ default: m.MatterStates3D })));
const Photosynthesis3D = lazy(() => import('@/components/experiments/Photosynthesis3D').then(m => ({ default: m.Photosynthesis3D })));
const SeasonsClimate3D = lazy(() => import('@/components/experiments/SeasonsClimate3D').then(m => ({ default: m.SeasonsClimate3D })));
const DNAGeneticCode3D = lazy(() => import('@/components/experiments/DNAGeneticCode3D').then(m => ({ default: m.DNAGeneticCode3D })));
const Heredity3D = lazy(() => import('@/components/experiments/Heredity3D').then(m => ({ default: m.Heredity3D })));
const Mutation3D = lazy(() => import('@/components/experiments/Mutation3D').then(m => ({ default: m.Mutation3D })));
const Pressure3D = lazy(() => import('@/components/experiments/Pressure3D').then(m => ({ default: m.Pressure3D })));
const Biotechnology3D = lazy(() => import('@/components/experiments/Biotechnology3D').then(m => ({ default: m.Biotechnology3D })));
const PeriodicTable3D = lazy(() => import('@/components/experiments/PeriodicTable3D').then(m => ({ default: m.PeriodicTable3D })));
const Changes3D = lazy(() => import('@/components/experiments/Changes3D').then(m => ({ default: m.Changes3D })));
const ChemicalReactions3D = lazy(() => import('@/components/experiments/ChemicalReactions3D').then(m => ({ default: m.ChemicalReactions3D })));
const AcidsAndBases3D = lazy(() => import('@/components/experiments/AcidsAndBases3D').then(m => ({ default: m.AcidsAndBases3D })));
const SimpleMachines3D = lazy(() => import('@/components/experiments/SimpleMachines3D').then(m => ({ default: m.SimpleMachines3D })));

// Lazy load INTERACTIVE experiments (NEW!)
const InteractivePressure = lazy(() => import('@/components/experiments/InteractivePressure').then(m => ({ default: m.InteractivePressure })));
const InteractiveSimpleMachines = lazy(() => import('@/components/experiments/InteractiveSimpleMachines').then(m => ({ default: m.InteractiveSimpleMachines })));
const InteractiveElectricCircuit = lazy(() => import('@/components/experiments/InteractiveElectricCircuit').then(m => ({ default: m.InteractiveElectricCircuit })));
const InteractiveMatterStates = lazy(() => import('@/components/experiments/InteractiveMatterStates').then(m => ({ default: m.InteractiveMatterStates })));
const InteractivePhotosynthesis = lazy(() => import('@/components/experiments/InteractivePhotosynthesis').then(m => ({ default: m.InteractivePhotosynthesis })));

interface ExperimentViewProps {
  unitId: string;
  unitName: string;
  subjectName: string;
  onComplete: () => void;
  onExit: () => void;
}

export function ExperimentView({ unitId, unitName, subjectName, onComplete, onExit }: ExperimentViewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fetch experiment from database
  const { data: experimentData, isLoading } = useExperiment(unitId);

  // Use database experiment or generate placeholder
  const experiment: ExperimentStep[] = useMemo(() => {
    if (experimentData && experimentData.steps) {
      return experimentData.steps;
    }
    // Fallback to placeholder
    return generatePlaceholderExperiment(unitName, subjectName);
  }, [experimentData, unitName, subjectName]);

  // Determine which 3D experiment to show
  const get3DExperiment = () => {
    const unitLower = unitName.toLowerCase();
    const subjectLower = subjectName.toLowerCase();

    if (subjectLower.includes('fen') || subjectLower.includes('science')) {
      // Fotosentez & Bitkiler - INTERACTIVE (NEW!)
      if (unitLower.includes('fotosentez') || unitLower.includes('bitki') || unitLower.includes('yaprak') || unitLower.includes('klorofil')) {
        return 'interactive-photosynthesis';
      }
      // Elektrik - INTERACTIVE (NEW!)
      if (unitLower.includes('elektrik') || unitLower.includes('devre') || unitLower.includes('ampul') || unitLower.includes('pil') || unitLower.includes('akım')) {
        return 'interactive-electric';
      }
      // Maddenin halleri - INTERACTIVE (NEW!)
      if (unitLower.includes('madde') || unitLower.includes('hal') || unitLower.includes('katı') || unitLower.includes('sıvı') || unitLower.includes('gaz') || unitLower.includes('buhar')) {
        return 'interactive-matter';
      }
      // Mevsimler ve İklim
      if (unitLower.includes('mevsim') || unitLower.includes('iklim') || unitLower.includes('dünya') || unitLower.includes('yörünge') || unitLower.includes('güneş')) {
        return 'seasons';
      }
      // DNA ve Genetik Kod
      if (unitLower.includes('dna') || unitLower.includes('genetik kod') || unitLower.includes('kromozom')) {
        return 'dna';
      }
      // Kalıtım
      if (unitLower.includes('kalıtım') || unitLower.includes('mendel') || unitLower.includes('alel') || unitLower.includes('dominant') || unitLower.includes('çekinik')) {
        return 'heredity';
      }
      // Mutasyon ve Modifikasyon
      if (unitLower.includes('mutasyon') || unitLower.includes('modifikasyon') || unitLower.includes('delesyon') || unitLower.includes('insersiyon')) {
        return 'mutation';
      }
      // Basınç - INTERACTIVE (NEW!)
      if (unitLower.includes('basınç') || unitLower.includes('basinc')) {
        return 'interactive-pressure';
      }
      // Basit Makineler - INTERACTIVE (NEW!)
      if (unitLower.includes('makine') || unitLower.includes('kaldıraç') || unitLower.includes('makara')) {
        return 'interactive-machines';
      }
      // Biyoteknoloji
      if (unitLower.includes('biyoteknoloji') || unitLower.includes('gmo') || unitLower.includes('klonlama') || unitLower.includes('gen aktarım')) {
        return 'biotechnology';
      }
      // Periyodik Sistem
      if (unitLower.includes('periyodik') || unitLower.includes('element') || unitLower.includes('alkali') || unitLower.includes('halojen')) {
        return 'periodic';
      }
      // Fiziksel ve Kimyasal Değişimler
      if (unitLower.includes('fiziksel') || unitLower.includes('kimyasal') || unitLower.includes('değişim')) {
        return 'changes';
      }
      // Kimyasal Tepkimeler
      if (unitLower.includes('tepkime') || unitLower.includes('reaksiyon')) {
        return 'reactions';
      }
      // Asitler ve Bazlar
      if (unitLower.includes('asit') || unitLower.includes('baz') || unitLower.includes('ph')) {
        return 'acids';
      }
      // Fallback: Genel Fen deneyi için matter states göster
      return 'matter';
    }
    return null;
  };

  const experiment3D = get3DExperiment();

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
        toast.success('Tam ekran modu açıldı');
      }).catch(() => {
        toast.error('Tam ekran modu desteklenmiyor');
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
        toast.info('Tam ekran modundan çıkıldı');
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Deney yükleniyor...</p>
        </div>
      </div>
    );
  }


  const progressPercentage = ((currentStep + 1) / experiment.length) * 100;

  const handleNext = () => {
    if (currentStep < experiment.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.success('Deney tamamlandı! 🎉');
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = experiment[currentStep];

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'intro':
        return '🔬';
      case 'materials':
        return '📦';
      case 'procedure':
        return '📝';
      case 'observation':
        return '👁️';
      case 'conclusion':
        return '✅';
      default:
        return '🔬';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onExit}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <Beaker className="w-5 h-5 text-info" />
                  <h1 className="text-lg font-bold">{unitName}</h1>
                </div>
                <p className="text-sm text-muted-foreground">{subjectName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                className="hidden md:flex"
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-4 h-4 mr-2" />
                    Çıkış
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-4 h-4 mr-2" />
                    Tam Ekran
                  </>
                )}
              </Button>
              <Badge variant="outline">
                {currentStep + 1} / {experiment.length}
              </Badge>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 lg:p-8">
        <div className="space-y-6 animate-slide-up">
          {/* Step Card */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="text-4xl">{getStepIcon(currentStepData.type)}</div>
                <div className="flex-1">
                  <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
                  <CardDescription className="mt-1">
                    Adım {currentStep + 1} / {experiment.length}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Safety Warning */}
              {currentStepData.safety && (
                <div className="flex items-start gap-3 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Güvenlik Uyarısı</p>
                    <p className="text-sm mt-1">{currentStepData.safety}</p>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-line text-base leading-relaxed">
                  {currentStepData.content}
                </p>
              </div>

              {/* 3D Interactive Experiment - FULL SCREEN - Show on all steps */}
              {experiment3D && (
                <div className="my-6">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary">
                      <Beaker className="w-5 h-5" />
                      <h3 className="font-bold">🎮 3D Simülasyon</h3>
                    </div>
                    {/* Mobile Fullscreen Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleFullscreen}
                      className="md:hidden"
                    >
                      {isFullscreen ? (
                        <>
                          <Minimize2 className="w-4 h-4 mr-2" />
                          Normal
                        </>
                      ) : (
                        <>
                          <Maximize2 className="w-4 h-4 mr-2" />
                          Tam Ekran
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="rounded-xl bg-background border-4 border-primary/30 overflow-hidden" style={{ height: isFullscreen ? '100vh' : '650px', minHeight: '350px' }}>
                    <Suspense fallback={
                      <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/10 to-background">
                        <div className="text-center">
                          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                          <p className="text-lg font-semibold">3D Deney yükleniyor...</p>
                        </div>
                      </div>
                    }>
                      {experiment3D === 'electric' && <ElectricCircuit3D />}
                      {experiment3D === 'matter' && <MatterStates3D />}
                      {experiment3D === 'photosynthesis' && <Photosynthesis3D />}
                      {experiment3D === 'seasons' && <SeasonsClimate3D />}
                      {experiment3D === 'dna' && <DNAGeneticCode3D />}
                      {experiment3D === 'heredity' && <Heredity3D />}
                      {experiment3D === 'mutation' && <Mutation3D />}
                      {experiment3D === 'pressure' && <Pressure3D />}
                      {experiment3D === 'biotechnology' && <Biotechnology3D />}
                      {experiment3D === 'periodic' && <PeriodicTable3D />}
                      {experiment3D === 'changes' && <Changes3D />}
                      {experiment3D === 'reactions' && <ChemicalReactions3D />}
                      {experiment3D === 'acids' && <AcidsAndBases3D />}
                      {experiment3D === 'machines' && <SimpleMachines3D />}
                      {experiment3D === 'interactive-pressure' && <InteractivePressure />}
                      {experiment3D === 'interactive-machines' && <InteractiveSimpleMachines />}
                      {experiment3D === 'interactive-electric' && <InteractiveElectricCircuit />}
                      {experiment3D === 'interactive-matter' && <InteractiveMatterStates />}
                      {experiment3D === 'interactive-photosynthesis' && <InteractivePhotosynthesis />}
                    </Suspense>
                  </div>
                </div>
              )}

              {/* Image Placeholder for non-3D experiments */}
              {currentStepData.image && !experiment3D && (
                <div className="rounded-lg bg-muted h-64 flex items-center justify-center">
                  <p className="text-muted-foreground">Deney Görseli</p>
                </div>
              )}

              {/* Completion Check */}
              {currentStepData.type === 'conclusion' && (
                <div className="flex items-start gap-3 p-4 bg-success/10 border border-success/20 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Deney Tamamlandı!</p>
                    <p className="text-sm mt-1">
                      Artık bu konuyu daha iyi anlıyorsun. Konuyu pekiştirmek için quiz'e geçebilirsin.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Önceki
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1"
            >
              {currentStep === experiment.length - 1 ? (
                <>
                  Tamamla
                  <CheckCircle2 className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Sonraki
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Steps Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Deney Adımları</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {experiment.map((step, idx) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(idx)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      idx === currentStep
                        ? 'bg-primary text-primary-foreground'
                        : idx < currentStep
                        ? 'bg-success/20 text-success'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {idx + 1}. {step.title}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
