import { useState, useEffect, useMemo } from 'react';
import { Question } from '@/hooks/useQuiz';
import { useAddWeakTopic } from '@/hooks/useWeakTopics';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { WeakTopicNotification } from './WeakTopicNotification';
import { Stopwatch, calculateSpeedBonus } from './Stopwatch';
import { MathText } from '@/lib/katex';
import { cn } from '@/lib/utils';
import { X, Heart, Zap, Clock, PenLine } from 'lucide-react';
import { Whiteboard } from './Whiteboard';
import { toast } from 'sonner';
import mascotHappy from '@/assets/mascot.png';
import mascotEncouraging from '@/assets/mascot-encouraging.png';

interface QuizScreenProps {
  questions: Question[];
  unitId: string;
  unitName: string;
  subjectId: string;
  subjectName: string;
  currentHearts: number;
  maxHearts: number;
  onComplete: (score: number, totalQuestions: number, xpEarned: number, timeSeconds?: number) => void;
  onExit: () => void;
  onGoToLesson?: () => void;
  challengeMode?: boolean;
}

export function QuizScreen({
  questions,
  unitId,
  unitName,
  subjectId,
  subjectName,
  currentHearts,
  maxHearts,
  onComplete,
  onExit,
  onGoToLesson,
  challengeMode = false
}: QuizScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [lastAnswerWasCorrect, setLastAnswerWasCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0); // Kronometre - ileri sayım
  const [stopwatchActive, setStopwatchActive] = useState(true);
  const [startTime] = useState<number>(Date.now()); // Challenge start time

  // Beyaz tahta (whiteboard) state
  const [showWhiteboard, setShowWhiteboard] = useState(false);

  // Track mistakes per question for weak topic detection
  const [questionMistakes, setQuestionMistakes] = useState<Map<string, number>>(new Map());
  const [showWeakTopicDialog, setShowWeakTopicDialog] = useState(false);
  const [weakTopicAdded, setWeakTopicAdded] = useState(false);

  const addWeakTopic = useAddWeakTopic();

  // Question queue - wrong answers get pushed to end
  const [questionQueue, setQuestionQueue] = useState<Question[]>([]);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<string>>(new Set());

  // Initialize question queue
  useEffect(() => {
    setQuestionQueue([...questions]);
  }, [questions]);

  const currentQuestion = questionQueue[currentIndex];
  // Use lastAnswerWasCorrect for UI when showing result
  const isCorrect = showResult ? lastAnswerWasCorrect : false;

  // Calculate progress based on how many unique questions answered correctly
  const progress = useMemo(() => {
    return (answeredCorrectly.size / questions.length) * 100;
  }, [answeredCorrectly.size, questions.length]);

  const handleSelectAnswer = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  // Store the question being displayed during result phase
  const [displayedQuestion, setDisplayedQuestion] = useState<Question | null>(null);

  const handleCheck = () => {
    if (selectedAnswer === null) return;

    // Store the current question for display during result phase
    setDisplayedQuestion(currentQuestion);

    // Calculate isCorrect at the moment of check with current values
    const isAnswerCorrect = selectedAnswer === currentQuestion.correct_answer;

    setShowResult(true);
    setLastAnswerWasCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      // First time correct for this question
      if (!answeredCorrectly.has(currentQuestion.id)) {
        setCorrectCount(prev => prev + 1);
        // Calculate XP with speed bonus (erken bitirene daha çok)
        const xpWithBonus = calculateSpeedBonus(timeElapsed, currentQuestion.xp_value);
        setTotalXP(prev => prev + xpWithBonus);
        setAnsweredCorrectly(prev => new Set(prev).add(currentQuestion.id));
        setStopwatchActive(false); // Stop stopwatch on correct answer
      }
    } else {
      // CHALLENGE MODE: End quiz immediately on first wrong answer
      if (challengeMode) {
        setStopwatchActive(false);
        const timeSeconds = Math.floor((Date.now() - startTime) / 1000);
        // End quiz with current correct count (total = correct count in challenge mode)
        onComplete(correctCount, correctCount, totalXP, timeSeconds);
        return;
      }

      // NORMAL MODE: Track mistakes for weak topic detection
      const newMistakes = new Map(questionMistakes);
      const currentMistakeCount = (newMistakes.get(currentQuestion.id) || 0) + 1;
      newMistakes.set(currentQuestion.id, currentMistakeCount);
      setQuestionMistakes(newMistakes);

      // If 2 mistakes in this quiz, mark as weak topic
      if (currentMistakeCount >= 2 && !weakTopicAdded) {
        try {
          addWeakTopic.mutate({
            unitId,
            unitName,
            subjectId,
            subjectName
          });
          setWeakTopicAdded(true);
          setShowWeakTopicDialog(true);
          toast.warning('Bu konu zayıf konulara eklendi');
        } catch (error) {
          console.error('Failed to add weak topic:', error);
        }
      }
    }
    // Don't modify queue here - wait until Continue is clicked
  };

  const handleContinue = () => {
    // Use the saved result from handleCheck, not derived isCorrect
    const wasCorrect = lastAnswerWasCorrect;

    setShowResult(false);
    setSelectedAnswer(null);
    setLastAnswerWasCorrect(false);
    setDisplayedQuestion(null);
    setTimeElapsed(0); // Reset kronometre
    setStopwatchActive(true); // Restart kronometre

    if (wasCorrect) {
      // Remove correctly answered question from queue
      setQuestionQueue(prev => {
        const newQueue = [...prev];
        newQueue.splice(currentIndex, 1);
        return newQueue;
      });

      // Check if quiz is complete (all unique questions answered)
      if (answeredCorrectly.size === questions.length || questionQueue.length === 1) {
        // Calculate time taken if in challenge mode
        const timeSeconds = challengeMode ? Math.floor((Date.now() - startTime) / 1000) : undefined;
        onComplete(correctCount, questions.length, totalXP, timeSeconds);
        return;
      }

      // Stay at same index (next question slides in) or go to 0 if at end
      if (currentIndex >= questionQueue.length - 1) {
        setCurrentIndex(0);
      }
    } else {
      // Wrong answer - move question to end of queue NOW (after showing result)
      setQuestionQueue(prev => {
        const newQueue = [...prev];
        const wrongQuestion = newQueue.splice(currentIndex, 1)[0];
        newQueue.push(wrongQuestion);
        return newQueue;
      });
      
      // Stay at same index since queue shifted, or go to 0 if needed
      if (currentIndex >= questionQueue.length - 1) {
        setCurrentIndex(0);
      }
    }
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border p-4 z-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <Button variant="ghost" size="icon" onClick={onExit}>
              <X className="w-5 h-5" />
            </Button>
            <Progress value={progress} className="flex-1 h-3" />
            {stopwatchActive && !showResult && (
              <Stopwatch
                onTimeChange={(seconds) => setTimeElapsed(seconds)}
                isRunning={stopwatchActive}
                className="hidden md:flex"
              />
            )}
            <div className="flex items-center gap-1 text-destructive">
              <Heart className="w-5 h-5 fill-current" />
              <span className="font-bold text-sm">{currentHearts}</span>
            </div>
          </div>

          {/* Show remaining questions indicator */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{unitName}</span>
            <span>
              {answeredCorrectly.size}/{questions.length} tamamlandı
              {questionQueue.length > questions.length - answeredCorrectly.size && (
                <span className="text-warning ml-2">
                  (+{questionQueue.length - (questions.length - answeredCorrectly.size)} tekrar)
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Question - use displayedQuestion during result phase to show correct question */}
      <div className="max-w-2xl mx-auto p-4 pb-32">
        <div className="mb-8 animate-slide-up" key={(displayedQuestion || currentQuestion).id + currentIndex}>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            <MathText>{(displayedQuestion || currentQuestion).question_text}</MathText>
          </h2>
          
          {/* Question Image (for math/geometry questions) */}
          {(displayedQuestion || currentQuestion as any).image_url && (
            <div className="mt-4 flex justify-center">
              <img 
                src={(displayedQuestion || currentQuestion as any).image_url} 
                alt="Soru görseli"
                className="max-w-full max-h-64 rounded-lg border border-border"
              />
            </div>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3">
          {(displayedQuestion || currentQuestion).options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectAnswer = index === (displayedQuestion || currentQuestion).correct_answer;
            
            let optionClass = "border-2 border-border bg-card hover:border-primary";
            
            if (showResult) {
              if (isCorrectAnswer) {
                optionClass = "border-2 border-success bg-success/10";
              } else if (isSelected && !isCorrectAnswer) {
                optionClass = "border-2 border-destructive bg-destructive/10 animate-shake";
              }
            } else if (isSelected) {
              optionClass = "border-2 border-primary bg-primary/10";
            }

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={showResult}
                className={cn(
                  "w-full p-4 rounded-xl text-left transition-all duration-200 flex items-center gap-3",
                  optionClass
                )}
              >
                <img
                  src={isSelected ? mascotEncouraging : mascotHappy}
                  alt=""
                  className="w-8 h-8 object-contain shrink-0"
                  draggable={false}
                />
                <MathText className="font-medium text-foreground">{option}</MathText>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showResult && (displayedQuestion || currentQuestion).explanation && (
          <div className={cn(
            "mt-6 p-4 rounded-xl animate-slide-up",
            isCorrect ? "bg-success/10 border border-success" : "bg-destructive/10 border border-destructive"
          )}>
            <p className="font-semibold mb-1 text-foreground">
              {isCorrect ? "🎉 Doğru!" : "❌ Yanlış! Bu soru tekrar sorulacak."}
            </p>
            <p className="text-sm text-muted-foreground">{(displayedQuestion || currentQuestion).explanation}</p>
            {isCorrect && !answeredCorrectly.has((displayedQuestion || currentQuestion).id) && (
              <p className="text-sm text-success mt-2 flex items-center gap-1">
                <Zap className="w-4 h-4" /> +{(displayedQuestion || currentQuestion).xp_value} XP
              </p>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          {/* Beyaz Tahta Toggle Butonu */}
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 shrink-0"
            onClick={() => setShowWhiteboard(true)}
            title="Beyaz Tahta"
          >
            <PenLine className="w-6 h-6" />
          </Button>
          <Button
            className="w-full h-14 text-lg font-bold"
            onClick={showResult ? handleContinue : handleCheck}
            disabled={selectedAnswer === null && !showResult}
          >
            {showResult ? (isCorrect ? "Devam Et" : "Anladım, Devam Et") : "Kontrol Et"}
          </Button>
        </div>
      </div>

      {/* Beyaz Tahta (Whiteboard) */}
      <Whiteboard
        isOpen={showWhiteboard}
        onClose={() => setShowWhiteboard(false)}
        questionText={(displayedQuestion || currentQuestion).question_text}
        questionId={(displayedQuestion || currentQuestion).id}
      />

      {/* Weak Topic Dialog */}
      <WeakTopicNotification
        open={showWeakTopicDialog}
        onClose={() => setShowWeakTopicDialog(false)}
        unitName={unitName}
        subjectName={subjectName}
        onGoToLesson={() => {
          setShowWeakTopicDialog(false);
          if (onGoToLesson) {
            onGoToLesson();
          }
        }}
      />
    </div>
  );
}
