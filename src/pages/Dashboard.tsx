import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { useSubjects, useUnits, Subject } from '@/hooks/useSubjects';
import { useQuestions, Question } from '@/hooks/useQuiz';
import { useAIQuestions, AIQuestion } from '@/hooks/useAIQuestions';
import { useLesson, LessonSlide } from '@/hooks/useLesson';
import { useStudyPlan } from '@/hooks/useStudyPlan';
import { useAllStageProgress, useSubmitStageResult, Difficulty, StageProgress, getNextStage } from '@/hooks/useStageProgress';
import { useUserHearts } from '@/hooks/useUserHearts';
import { useSubscription } from '@/hooks/useSubscription';
import { useStreak } from '@/hooks/useStreak';
import { useUpdateTaskProgress, useDailyTasks } from '@/hooks/useDailyTasks';
import { useDailyRecommendation } from '@/hooks/useDailyRecommendation';
import { useNotifications } from '@/hooks/useNotifications';
import { Sidebar } from '@/components/Sidebar';
import { MobileHeader } from '@/components/MobileHeader';
import { RightPanel } from '@/components/RightPanel';
import { SubjectHeader } from '@/components/SubjectHeader';
import { StageLearningPath } from '@/components/StageLearningPath';
import { QuizScreen } from '@/components/QuizScreen';
import { QuizComplete } from '@/components/QuizComplete';
import { Leaderboard } from '@/components/Leaderboard';
import { ExamDateSetup } from '@/components/ExamDateSetup';
import { NoHeartsDialog } from '@/components/NoHeartsDialog';
import { AICoachView } from '@/components/AICoachView';
import { VocabularyView } from '@/components/VocabularyView';
import { MockExamView } from '@/components/MockExamView';
import { DailyLoginDialog } from '@/components/DailyLoginDialog';
import { DailyRecommendationDialog } from '@/components/DailyRecommendationDialog';
import { ProfilePage } from '@/components/ProfilePage';
import { TopicLesson } from '@/components/TopicLesson';
import { TodaysPlanView } from '@/components/TodaysPlanView';
import { ExperimentView } from '@/components/ExperimentView';
import { FriendsPage } from '@/pages/FriendsPage';
import { SubscriptionPage } from '@/pages/SubscriptionPage';
import { MobileChatPage } from '@/components/MobileChatPage';
import { DesktopChatWidget } from '@/components/DesktopChatWidget';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { isScienceSubject } from '@/utils/subjectHelpers';

type View = 'dashboard' | 'units' | 'quiz' | 'complete' | 'leaderboard' | 'profile' | 'coach' | 'vocabulary' | 'mock-exam' | 'lesson' | 'todays-plan' | 'friends' | 'subscription' | 'experiment' | 'chat';

interface QuizState {
  unitId: string;
  unitName: string;
  subjectName: string;
  difficulty: Difficulty;
}

interface LessonState {
  unitId: string;
  unitName: string;
  subjectName: string;
}

interface ExperimentState {
  unitId: string;
  unitName: string;
  subjectName: string;
}

export function Dashboard() {
  const { user } = useAuth();
  const { requestPermission, permission } = useNotifications();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [lessonState, setLessonState] = useState<LessonState | null>(null);
  const [experimentState, setExperimentState] = useState<ExperimentState | null>(null);
  const [quizResult, setQuizResult] = useState<{ score: number; total: number; xp: number } | null>(null);
  const [showExamSetup, setShowExamSetup] = useState(false);
  const [showNoHeartsDialog, setShowNoHeartsDialog] = useState(false);
  const [showDailyLoginDialog, setShowDailyLoginDialog] = useState(false);
  const [showDailyRecommendation, setShowDailyRecommendation] = useState(false);
  const [dailyLoginData, setDailyLoginData] = useState<{ streak: number; isNewRecord: boolean; usedFreeze: boolean } | null>(null);
  const [aiQuestions, setAiQuestions] = useState<AIQuestion[]>([]);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [lessonSlides, setLessonSlides] = useState<LessonSlide[]>([]);
  const [isGeneratingLesson, setIsGeneratingLesson] = useState(false);

  // Request notification permission on first load
  useEffect(() => {
    if (user && permission === 'default') {
      requestPermission();
    }
  }, [user, permission, requestPermission]);

  const { data: subjects, isLoading: subjectsLoading } = useSubjects();
  const { data: units, isLoading: unitsLoading } = useUnits(selectedSubject?.id);
  const { data: questions, isLoading: questionsLoading } = useQuestions(quizState?.unitId);
  const { data: studyPlan, isLoading: studyPlanLoading } = useStudyPlan();
  const { data: allProgress } = useAllStageProgress();
  const { data: dailyTasks } = useDailyTasks();
  const submitResult = useSubmitStageResult();
  const updateTaskProgress = useUpdateTaskProgress();
  const { generateQuestions } = useAIQuestions();
  const { generateLesson } = useLesson();
  const dailyRecommendation = useDailyRecommendation();

  const { data: subscription } = useSubscription();
  const { checkIn, currentStreak, longestStreak } = useStreak();

  const {
    hearts,
    maxHearts,
    hasHearts,
    useHeart,
    watchAd,
    formattedTimeUntilNextHeart,
    isRegenerating
  } = useUserHearts();

  const isPremium = subscription?.plan_type !== 'free';

  // Auto check-in on load and show daily login dialog + recommendation
  useEffect(() => {
    const performCheckIn = async () => {
      if (!user) return;
      
      try {
        const result = await checkIn();
        if (result && !result.alreadyCheckedIn) {
          setDailyLoginData({
            streak: result.streak || 1,
            isNewRecord: result.isNewRecord || false,
            usedFreeze: result.usedFreeze || false
          });
          setShowDailyLoginDialog(true);
          
          // Show daily recommendation after login dialog is closed (via timeout)
          setTimeout(() => {
            setShowDailyRecommendation(true);
          }, 3000);
        }
      } catch (error) {
        console.error('Check-in error:', error);
      }
    };

    // Small delay to ensure streak data is loaded
    const timer = setTimeout(performCheckIn, 500);
    return () => clearTimeout(timer);
  }, [user]);

  // Create progress map for quick lookup
  const progressMap = useMemo(() => {
    const map = new Map<string, StageProgress>();
    allProgress?.forEach(p => map.set(p.unit_id, p));
    return map;
  }, [allProgress]);

  // Calculate total topics for study plan
  const totalTopics = subjects?.reduce((acc, _) => acc + 10, 0) || 63;

  // Show exam setup if no study plan exists
  useEffect(() => {
    if (!studyPlanLoading && !studyPlan && user) {
      setShowExamSetup(true);
    }
  }, [studyPlan, studyPlanLoading, user]);

  // Auto-select first subject
  useEffect(() => {
    if (subjects && subjects.length > 0 && !selectedSubject) {
      setSelectedSubject(subjects[0]);
    }
  }, [subjects, selectedSubject]);

  const handleSelectSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setCurrentView('dashboard');
  };

  const handleStartQuiz = async (unitId: string, unitName: string, difficulty: Difficulty) => {
    // Premium users have unlimited hearts
    if (!isPremium && !hasHearts) {
      setShowNoHeartsDialog(true);
      return;
    }

    const subjectName = selectedSubject?.name || 'Genel';
    setQuizState({ unitId, unitName, subjectName, difficulty });
    setIsGeneratingQuestions(true);
    setCurrentView('quiz');

    // Generate AI questions
    const difficultyMap: Record<Difficulty, number> = {
      'easy': 1,
      'medium': 2,
      'hard': 3,
      'exam': 2
    };

    try {
      const questions = await generateQuestions({
        subjectName,
        unitName,
        difficulty: difficultyMap[difficulty],
        count: difficulty === 'exam' ? 10 : 5
      });

      if (questions.length > 0) {
        setAiQuestions(questions);
      } else {
        toast.error('Sorular üretilemedi, mevcut sorular kullanılıyor');
      }
    } catch (error) {
      console.error('Failed to generate questions:', error);
      toast.error('AI soru üretiminde hata oluştu');
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const handleQuizComplete = async (score: number, total: number, xp: number) => {
    // Use 1 heart when completing a stage (if not premium)
    if (!isPremium) {
      useHeart();
    }
    
    setQuizResult({ score, total, xp });
    
    if (quizState) {
      await submitResult.mutateAsync({
        unitId: quizState.unitId,
        difficulty: quizState.difficulty,
        score,
        totalQuestions: total,
        xpEarned: xp
      });

      // Update task progress
      const quizTask = dailyTasks?.find(t => t.task_type === 'quiz' && t.title.includes('Quiz'));
      if (quizTask) {
        updateTaskProgress.mutate({ taskId: quizTask.id, increment: 1 });
      }

      // Check for correct answers task
      const correctTask = dailyTasks?.find(t => t.task_type === 'quiz' && t.title.includes('Doğru'));
      if (correctTask && score >= 5) {
        updateTaskProgress.mutate({ taskId: correctTask.id, increment: 1 });
      }
    }
    
    setCurrentView('complete');
  };

  const handleBackToDashboard = () => {
    setQuizState(null);
    setQuizResult(null);
    setAiQuestions([]);
    setLessonState(null);
    setLessonSlides([]);
    setCurrentView('dashboard');
  };

  const handleStartLesson = async (unitId: string, unitName: string) => {
    const subjectName = selectedSubject?.name || 'Genel';
    setLessonState({ unitId, unitName, subjectName });
    setIsGeneratingLesson(true);
    setCurrentView('lesson');

    try {
      const slides = await generateLesson(subjectName, unitName);
      if (slides.length > 0) {
        setLessonSlides(slides);
      } else {
        toast.error('Ders içeriği oluşturulamadı');
      }
    } catch (error) {
      console.error('Lesson generation error:', error);
      toast.error('Ders içeriği yüklenirken hata oluştu');
    } finally {
      setIsGeneratingLesson(false);
    }
  };

  const handleStartExperiment = async (unitId: string, unitName: string) => {
    const subjectName = selectedSubject?.name || 'Fen Bilimleri';
    setExperimentState({ unitId, unitName, subjectName });
    setCurrentView('experiment');
  };

  const handleNavigate = (view: 'dashboard' | 'leaderboard' | 'profile' | 'coach' | 'vocabulary' | 'mock-exam' | 'todays-plan' | 'friends' | 'subscription') => {
    setCurrentView(view);
  };

  // Get difficulty label for quiz screen
  const getDifficultyLabel = (difficulty: Difficulty): string => {
    switch (difficulty) {
      case 'easy': return 'Kolay';
      case 'medium': return 'Orta';
      case 'hard': return 'Zor';
      case 'exam': return 'Genel Deneme';
    }
  };

  // Use AI questions if available, otherwise fallback to DB questions
  const quizQuestions = useMemo(() => {
    // If AI questions are available, use them
    if (aiQuestions.length > 0) {
      return aiQuestions.map(q => ({
        id: q.id,
        unit_id: quizState?.unitId || '',
        question_text: q.question_text,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        xp_value: q.xp_value,
        image_url: q.image_url
      }));
    }

    // Fallback to DB questions
    if (!questions || !quizState) return [];
    
    const difficultyMap: Record<Difficulty, number> = {
      'easy': 1,
      'medium': 2,
      'hard': 3,
      'exam': 0
    };

    if (quizState.difficulty === 'exam') {
      return questions.slice(0, 10);
    }

    const targetDifficulty = difficultyMap[quizState.difficulty];
    const filtered = questions.filter(q => q.difficulty === targetDifficulty);
    
    return filtered.length >= 3 ? filtered : questions.slice(0, 5);
  }, [aiQuestions, questions, quizState]);

  // Show exam setup
  if (showExamSetup) {
    return (
      <ExamDateSetup 
        totalTopics={totalTopics} 
        onComplete={() => setShowExamSetup(false)} 
      />
    );
  }

  // Quiz view - full screen
  if (currentView === 'quiz' && quizState) {
    // Show loading state while generating questions
    if (isGeneratingQuestions) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center animate-pulse">
            <div className="text-6xl mb-4">🤖</div>
            <h2 className="text-xl font-bold mb-2">Sorular Hazırlanıyor...</h2>
            <p className="text-muted-foreground">AI yeni nesil sorular üretiyor</p>
          </div>
        </div>
      );
    }

    if (quizQuestions.length > 0) {
      return (
        <QuizScreen
          questions={quizQuestions}
          unitId={quizState.unitId}
          unitName={quizState.unitName}
          subjectId={selectedSubject?.id || ''}
          subjectName={quizState.subjectName}
          currentHearts={isPremium ? 999 : hearts}
          maxHearts={isPremium ? 999 : maxHearts}
          onComplete={handleQuizComplete}
          onExit={handleBackToDashboard}
          onGoToLesson={() => {
            // Navigate to lesson for this unit
            handleStartLesson(quizState.unitId, quizState.unitName);
          }}
        />
      );
    }
  }

  // Quiz complete view
  if (currentView === 'complete' && quizResult) {
    return (
      <QuizComplete
        score={quizResult.score}
        totalQuestions={quizResult.total}
        xpEarned={quizResult.xp}
        onContinue={handleBackToDashboard}
      />
    );
  }

  // Today's Plan view
  if (currentView === 'todays-plan') {
    return <TodaysPlanView
      onBack={() => setCurrentView('dashboard')}
      onStartUnit={(unitId, unitName, subjectId) => {
        // Navigate to unit
        const subject = subjects?.find(s => s.id === subjectId);
        if (subject) {
          setSelectedSubject(subject);
          if (unitId) {
            handleStartLesson(unitId, unitName);
          } else {
            setCurrentView('dashboard');
          }
        }
      }}
    />;
  }

  // AI Coach view
  if (currentView === 'coach') {
    return <AICoachView onBack={() => setCurrentView('dashboard')} />;
  }

  // Vocabulary view
  if (currentView === 'vocabulary') {
    return <VocabularyView onBack={() => setCurrentView('dashboard')} />;
  }

  // Mock Exam view
  if (currentView === 'mock-exam') {
    return <MockExamView onBack={() => setCurrentView('dashboard')} />;
  }

  // Friends view
  if (currentView === 'friends') {
    return <FriendsPage onBack={() => setCurrentView('dashboard')} />;
  }

  // Subscription view
  if (currentView === 'subscription') {
    return <SubscriptionPage onBack={() => setCurrentView('dashboard')} />;
  }

  // Chat view
  if (currentView === 'chat') {
    return <MobileChatPage onBack={() => setCurrentView('dashboard')} />;
  }

  // Experiment view
  if (currentView === 'experiment' && experimentState) {
    return (
      <ExperimentView
        unitId={experimentState.unitId}
        unitName={experimentState.unitName}
        subjectName={experimentState.subjectName}
        onComplete={() => {
          // After experiment, go to quiz
          setExperimentState(null);
          handleStartQuiz(experimentState.unitId, experimentState.unitName, 'easy');
        }}
        onExit={handleBackToDashboard}
      />
    );
  }

  // Profile view - use full ProfilePage component
  if (currentView === 'profile') {
    return (
      <ProfilePage 
        onBack={() => setCurrentView('dashboard')} 
        onNavigateToUnit={(unitId, unitName, subjectId) => {
          // Find subject and navigate to lesson
          const subject = subjects?.find(s => s.id === subjectId);
          if (subject) {
            setSelectedSubject(subject);
            handleStartLesson(unitId, unitName);
          }
        }}
      />
    );
  }

  // Lesson view
  if (currentView === 'lesson' && lessonState) {
    // Show loading while generating lesson
    if (isGeneratingLesson) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center animate-pulse">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-xl font-bold mb-2">Ders Hazırlanıyor...</h2>
            <p className="text-muted-foreground">AI konu anlatımı oluşturuyor</p>
          </div>
        </div>
      );
    }

    if (lessonSlides.length > 0) {
      return (
        <TopicLesson
          unitName={lessonState.unitName}
          subjectName={lessonState.subjectName}
          slides={lessonSlides}
          onComplete={() => {
            // Ders tamamlandığında quiz'e yönlendir
            setLessonSlides([]);
            handleStartQuiz(lessonState.unitId, lessonState.unitName, 'easy');
          }}
          onExit={handleBackToDashboard}
        />
      );
    }
  }

  // Get current unit index for header
  const currentUnitIndex = units?.findIndex(u => {
    const progress = progressMap.get(u.id);
    return getNextStage(progress || null) !== null;
  }) ?? 0;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          subjects={subjects || []}
          currentSubject={selectedSubject}
          currentView={currentView}
          onSelectSubject={handleSelectSubject}
          onNavigate={handleNavigate}
        />
      </div>

      {/* Mobile Header */}
      <MobileHeader
        subjects={subjects || []}
        currentSubject={selectedSubject}
        currentView={currentView}
        onSelectSubject={handleSelectSubject}
        onNavigate={handleNavigate}
        onStartUnit={(unitId, unitName, subjectId) => {
          const subject = subjects?.find(s => s.id === subjectId);
          if (subject) {
            setSelectedSubject(subject);
            if (unitId) {
              handleStartLesson(unitId, unitName);
            } else {
              setCurrentView('dashboard');
            }
          }
        }}
      />

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Mobile Header spacing */}
        <div className="h-14 lg:hidden" />

        <div className="max-w-3xl mx-auto p-4">
          {/* Leaderboard View */}
          {currentView === 'leaderboard' && (
            <div className="animate-slide-up">
              <Leaderboard currentUserId={user?.id} />
            </div>
          )}
          {/* Dashboard - Stage-based Learning Path */}
          {currentView === 'dashboard' && selectedSubject && (
            <div className="animate-slide-up">
              {/* Subject Header */}
              <SubjectHeader 
                subject={selectedSubject}
                unitIndex={currentUnitIndex}
                totalUnits={units?.length || 0}
              />

              {/* Stage Learning Path */}
              {unitsLoading ? (
                <div className="flex flex-col items-center gap-6 py-12">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="w-16 h-16 rounded-full" />
                  ))}
                </div>
              ) : units && units.length > 0 ? (
                <StageLearningPath
                  units={units}
                  progressMap={progressMap}
                  onSelectStage={handleStartQuiz}
                  onStartLesson={handleStartLesson}
                  onStartExperiment={handleStartExperiment}
                  isScienceSubject={isScienceSubject(selectedSubject?.id || '', selectedSubject?.name || '')}
                  isPremium={isPremium}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Bu ders için henüz ünite eklenmedi.</p>
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {subjectsLoading && (
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="text-center">
                <div className="text-4xl mb-4 animate-bounce">📚</div>
                <p className="text-muted-foreground">Dersler yükleniyor...</p>
              </div>
            </div>
          )}

          {/* Loading Quiz */}
          {currentView === 'quiz' && questionsLoading && (
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="text-center">
                <div className="text-4xl mb-4 animate-bounce">📝</div>
                <p className="text-muted-foreground">Sorular yükleniyor...</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Right Panel - Desktop Only */}
      <RightPanel onNavigateToLeaderboard={() => setCurrentView('leaderboard')} />

      {/* No Hearts Dialog */}
      <NoHeartsDialog
        open={showNoHeartsDialog}
        onClose={() => setShowNoHeartsDialog(false)}
        hearts={hearts}
        maxHearts={maxHearts}
        timeUntilNextHeart={formattedTimeUntilNextHeart}
        isRegenerating={isRegenerating}
        onWatchAd={watchAd}
        onExit={() => setShowNoHeartsDialog(false)}
      />

      {/* Daily Login Dialog */}
      <DailyLoginDialog
        open={showDailyLoginDialog}
        onClose={() => setShowDailyLoginDialog(false)}
        streak={dailyLoginData?.streak || currentStreak || 1}
        isNewRecord={dailyLoginData?.isNewRecord}
        usedFreeze={dailyLoginData?.usedFreeze}
      />

      {/* Daily Recommendation Dialog */}
      <DailyRecommendationDialog
        open={showDailyRecommendation}
        onClose={() => setShowDailyRecommendation(false)}
        onStartSubject={(subjectId) => {
          const subject = subjects?.find(s => s.id === subjectId);
          if (subject) {
            setSelectedSubject(subject);
            setCurrentView('dashboard');
          }
        }}
      />

      {/* Desktop Chat Widget (Facebook-style) & Mobile Chat Button */}
      <DesktopChatWidget onOpenMobileChat={() => setCurrentView('chat')} />
    </div>
  );
}
