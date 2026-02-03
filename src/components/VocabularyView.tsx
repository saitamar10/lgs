import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, BookOpen, Volume2, Check, X, Gamepad2, Trophy, Info } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Word {
  id: string;
  english: string;
  turkish: string;
  example: string;
  level: 'A1' | 'A2' | 'B1';
  learned: boolean;
}

// A1-A2 Kelime Listesi (100+ kelime)
const INITIAL_WORDS: Word[] = [
  // A1 Level - Temel Kelimeler
  { id: '1', english: 'hello', turkish: 'merhaba', example: 'Hello, how are you?', level: 'A1', learned: false },
  { id: '2', english: 'goodbye', turkish: 'güle güle', example: 'Goodbye, see you later!', level: 'A1', learned: false },
  { id: '3', english: 'please', turkish: 'lütfen', example: 'Please help me.', level: 'A1', learned: false },
  { id: '4', english: 'thank', turkish: 'teşekkür etmek', example: 'Thank you very much!', level: 'A1', learned: false },
  { id: '5', english: 'yes', turkish: 'evet', example: 'Yes, I agree.', level: 'A1', learned: false },
  { id: '6', english: 'no', turkish: 'hayır', example: 'No, I disagree.', level: 'A1', learned: false },
  { id: '7', english: 'water', turkish: 'su', example: 'I drink water every day.', level: 'A1', learned: false },
  { id: '8', english: 'food', turkish: 'yemek', example: 'This food is delicious.', level: 'A1', learned: false },
  { id: '9', english: 'house', turkish: 'ev', example: 'I live in a big house.', level: 'A1', learned: false },
  { id: '10', english: 'family', turkish: 'aile', example: 'My family is very kind.', level: 'A1', learned: false },
  { id: '11', english: 'friend', turkish: 'arkadaş', example: 'She is my best friend.', level: 'A1', learned: false },
  { id: '12', english: 'school', turkish: 'okul', example: 'I go to school every day.', level: 'A1', learned: false },
  { id: '13', english: 'teacher', turkish: 'öğretmen', example: 'My teacher is very patient.', level: 'A1', learned: false },
  { id: '14', english: 'student', turkish: 'öğrenci', example: 'I am a student.', level: 'A1', learned: false },
  { id: '15', english: 'book', turkish: 'kitap', example: 'I read a book every night.', level: 'A1', learned: false },
  { id: '16', english: 'table', turkish: 'masa', example: 'The book is on the table.', level: 'A1', learned: false },
  { id: '17', english: 'chair', turkish: 'sandalye', example: 'Please sit on the chair.', level: 'A1', learned: false },
  { id: '18', english: 'door', turkish: 'kapı', example: 'Close the door, please.', level: 'A1', learned: false },
  { id: '19', english: 'window', turkish: 'pencere', example: 'Open the window.', level: 'A1', learned: false },
  { id: '20', english: 'car', turkish: 'araba', example: 'I have a new car.', level: 'A1', learned: false },
  { id: '21', english: 'phone', turkish: 'telefon', example: 'My phone is ringing.', level: 'A1', learned: false },
  { id: '22', english: 'computer', turkish: 'bilgisayar', example: 'I work on my computer.', level: 'A1', learned: false },
  { id: '23', english: 'time', turkish: 'zaman', example: 'What time is it?', level: 'A1', learned: false },
  { id: '24', english: 'day', turkish: 'gün', example: 'Have a nice day!', level: 'A1', learned: false },
  { id: '25', english: 'night', turkish: 'gece', example: 'Good night!', level: 'A1', learned: false },
  { id: '26', english: 'morning', turkish: 'sabah', example: 'Good morning!', level: 'A1', learned: false },
  { id: '27', english: 'happy', turkish: 'mutlu', example: 'I am very happy today.', level: 'A1', learned: false },
  { id: '28', english: 'sad', turkish: 'üzgün', example: 'She looks sad.', level: 'A1', learned: false },
  { id: '29', english: 'big', turkish: 'büyük', example: 'This is a big house.', level: 'A1', learned: false },
  { id: '30', english: 'small', turkish: 'küçük', example: 'I have a small dog.', level: 'A1', learned: false },

  // A2 Level - Orta Kelimeler
  { id: '31', english: 'beautiful', turkish: 'güzel', example: 'She has a beautiful smile.', level: 'A2', learned: false },
  { id: '32', english: 'important', turkish: 'önemli', example: 'Education is very important.', level: 'A2', learned: false },
  { id: '33', english: 'difficult', turkish: 'zor', example: 'This question is difficult.', level: 'A2', learned: false },
  { id: '34', english: 'easy', turkish: 'kolay', example: 'This test is easy.', level: 'A2', learned: false },
  { id: '35', english: 'knowledge', turkish: 'bilgi', example: 'Knowledge is power.', level: 'A2', learned: false },
  { id: '36', english: 'remember', turkish: 'hatırlamak', example: 'I remember my first day.', level: 'A2', learned: false },
  { id: '37', english: 'forget', turkish: 'unutmak', example: 'Do not forget your homework.', level: 'A2', learned: false },
  { id: '38', english: 'understand', turkish: 'anlamak', example: 'I understand the lesson.', level: 'A2', learned: false },
  { id: '39', english: 'explain', turkish: 'açıklamak', example: 'Can you explain this?', level: 'A2', learned: false },
  { id: '40', english: 'question', turkish: 'soru', example: 'I have a question.', level: 'A2', learned: false },
  { id: '41', english: 'answer', turkish: 'cevap', example: 'The answer is correct.', level: 'A2', learned: false },
  { id: '42', english: 'problem', turkish: 'problem', example: 'We have a problem.', level: 'A2', learned: false },
  { id: '43', english: 'solution', turkish: 'çözüm', example: 'I found a solution.', level: 'A2', learned: false },
  { id: '44', english: 'healthy', turkish: 'sağlıklı', example: 'Eating fruit is healthy.', level: 'A2', learned: false },
  { id: '45', english: 'exercise', turkish: 'egzersiz', example: 'I exercise every morning.', level: 'A2', learned: false },
  { id: '46', english: 'weather', turkish: 'hava durumu', example: 'The weather is nice today.', level: 'A2', learned: false },
  { id: '47', english: 'travel', turkish: 'seyahat etmek', example: 'I love to travel.', level: 'A2', learned: false },
  { id: '48', english: 'country', turkish: 'ülke', example: 'Turkey is a beautiful country.', level: 'A2', learned: false },
  { id: '49', english: 'city', turkish: 'şehir', example: 'Istanbul is a big city.', level: 'A2', learned: false },
  { id: '50', english: 'money', turkish: 'para', example: 'I need some money.', level: 'A2', learned: false },
  { id: '51', english: 'buy', turkish: 'satın almak', example: 'I want to buy a book.', level: 'A2', learned: false },
  { id: '52', english: 'sell', turkish: 'satmak', example: 'They sell fresh fruit.', level: 'A2', learned: false },
  { id: '53', english: 'shop', turkish: 'dükkan', example: 'The shop is closed.', level: 'A2', learned: false },
  { id: '54', english: 'market', turkish: 'pazar', example: 'I go to the market.', level: 'A2', learned: false },
  { id: '55', english: 'clothes', turkish: 'elbise', example: 'I bought new clothes.', level: 'A2', learned: false },
  { id: '56', english: 'wear', turkish: 'giymek', example: 'I wear a jacket.', level: 'A2', learned: false },
  { id: '57', english: 'clean', turkish: 'temiz', example: 'The room is clean.', level: 'A2', learned: false },
  { id: '58', english: 'dirty', turkish: 'kirli', example: 'My hands are dirty.', level: 'A2', learned: false },
  { id: '59', english: 'wash', turkish: 'yıkamak', example: 'Wash your hands.', level: 'A2', learned: false },
  { id: '60', english: 'cook', turkish: 'pişirmek', example: 'My mother cooks well.', level: 'A2', learned: false },
];

interface VocabularyViewProps {
  onBack: () => void;
}

// Hangman figure component
const HangmanFigure = ({ wrongGuesses }: { wrongGuesses: number }) => {
  return (
    <div className="flex justify-center items-end h-64 mb-4">
      <svg width="200" height="250" className="stroke-current text-foreground">
        {/* Gallows */}
        <line x1="10" y1="230" x2="150" y2="230" strokeWidth="4" />
        <line x1="50" y1="230" x2="50" y2="20" strokeWidth="4" />
        <line x1="50" y1="20" x2="130" y2="20" strokeWidth="4" />
        <line x1="130" y1="20" x2="130" y2="50" strokeWidth="4" />

        {/* Head */}
        {wrongGuesses >= 1 && (
          <circle cx="130" cy="70" r="20" strokeWidth="4" fill="none" className="stroke-destructive animate-scale-in" />
        )}

        {/* Body */}
        {wrongGuesses >= 2 && (
          <line x1="130" y1="90" x2="130" y2="150" strokeWidth="4" className="stroke-destructive animate-scale-in" />
        )}

        {/* Left Arm */}
        {wrongGuesses >= 3 && (
          <line x1="130" y1="110" x2="100" y2="130" strokeWidth="4" className="stroke-destructive animate-scale-in" />
        )}

        {/* Right Arm */}
        {wrongGuesses >= 4 && (
          <line x1="130" y1="110" x2="160" y2="130" strokeWidth="4" className="stroke-destructive animate-scale-in" />
        )}

        {/* Left Leg */}
        {wrongGuesses >= 5 && (
          <line x1="130" y1="150" x2="110" y2="190" strokeWidth="4" className="stroke-destructive animate-scale-in" />
        )}

        {/* Right Leg */}
        {wrongGuesses >= 6 && (
          <line x1="130" y1="150" x2="150" y2="190" strokeWidth="4" className="stroke-destructive animate-scale-in" />
        )}
      </svg>
    </div>
  );
};

export function VocabularyView({ onBack }: VocabularyViewProps) {
  const [words, setWords] = useState<Word[]>(INITIAL_WORDS);
  const [view, setView] = useState<'menu' | 'add' | 'study' | 'game' | 'hangman'>('menu');
  const [newWord, setNewWord] = useState({ english: '', turkish: '', example: '', level: 'A1' as 'A1' | 'A2' | 'B1' });
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Study mode states
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);

  // Game mode states
  const [gameScore, setGameScore] = useState(0);
  const [gameWords, setGameWords] = useState<Word[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  // Hangman states
  const [hangmanWord, setHangmanWord] = useState<Word | null>(null);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const maxWrongGuesses = 6;

  const learnedCount = words.filter(w => w.learned).length;
  const progressPercent = (learnedCount / words.length) * 100;

  // Add new word
  const handleAddWord = () => {
    if (!newWord.english || !newWord.turkish) {
      toast.error('İngilizce kelime ve Türkçe anlam zorunlu!');
      return;
    }

    const word: Word = {
      id: Date.now().toString(),
      english: newWord.english.toLowerCase().trim(),
      turkish: newWord.turkish.trim(),
      example: newWord.example.trim(),
      level: newWord.level,
      learned: false
    };

    setWords([...words, word]);
    setNewWord({ english: '', turkish: '', example: '', level: 'A1' });
    setShowAddDialog(false);
    toast.success('Kelime eklendi! 🎉');
  };

  // Study: Mark as learned/unknown
  const handleKnowWord = (know: boolean) => {
    const currentWord = words[currentWordIndex];

    if (know) {
      // Biliyorum - işaretle ve sonraki kelimeye geç
      setWords(words.map(w => w.id === currentWord.id ? { ...w, learned: true } : w));
      toast.success('Harika! ✅');
      nextWord();
    } else {
      // Bilmiyorum - anlamını göster
      setShowMeaning(true);
      toast.info('Anlamını öğren! 📖');
    }
  };

  const handleLearnWord = () => {
    const currentWord = words[currentWordIndex];
    setWords(words.map(w => w.id === currentWord.id ? { ...w, learned: true } : w));
    toast.success('Kelime defterine eklendi! 📝');
    setShowMeaning(false);
    nextWord();
  };

  const nextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setShowMeaning(false);
    } else {
      toast.success('Tüm kelimeleri bitirdin! 🎉');
      setView('menu');
      setCurrentWordIndex(0);
    }
  };

  // Start matching game
  const startMatchingGame = () => {
    const shuffled = [...words].sort(() => Math.random() - 0.5).slice(0, 6);
    setGameWords(shuffled);
    setGameScore(0);
    setSelectedWords([]);
    setMatchedPairs([]);
    setView('game');
  };

  const handleWordClick = (word: string, type: 'english' | 'turkish') => {
    const clickedId = `${type}-${word}`;

    if (matchedPairs.includes(clickedId)) return;
    if (selectedWords.includes(clickedId)) return;

    const newSelected = [...selectedWords, clickedId];
    setSelectedWords(newSelected);

    if (newSelected.length === 2) {
      // Check match
      const [first, second] = newSelected;
      const [firstType, ...firstNameParts] = first.split('-');
      const [secondType, ...secondNameParts] = second.split('-');
      const firstName = firstNameParts.join('-');
      const secondName = secondNameParts.join('-');

      const firstWord = gameWords.find(w =>
        (firstType === 'english' && w.english === firstName) ||
        (firstType === 'turkish' && w.turkish === firstName)
      );
      const secondWord = gameWords.find(w =>
        (secondType === 'english' && w.english === secondName) ||
        (secondType === 'turkish' && w.turkish === secondName)
      );

      if (firstWord?.id === secondWord?.id && firstType !== secondType) {
        // Match!
        setMatchedPairs([...matchedPairs, first, second]);
        setGameScore(gameScore + 10);
        toast.success('Eşleştirme başarılı! +10 puan 🎉');

        if (matchedPairs.length + 2 === gameWords.length * 2) {
          setTimeout(() => {
            toast.success(`Oyunu bitirdin! Toplam: ${gameScore + 10} puan 🏆`);
          }, 500);
        }
      } else {
        // No match
        toast.error('Yanlış eşleştirme!');
      }

      setTimeout(() => setSelectedWords([]), 800);
    }
  };

  // Start hangman
  const startHangman = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setHangmanWord(randomWord);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setView('hangman');
  };

  const guessLetter = (letter: string) => {
    if (guessedLetters.includes(letter)) return;

    const newGuessed = [...guessedLetters, letter];
    setGuessedLetters(newGuessed);

    if (!hangmanWord?.english.includes(letter)) {
      setWrongGuesses(wrongGuesses + 1);

      if (wrongGuesses + 1 >= maxWrongGuesses) {
        toast.error(`Kaybettin! Kelime: ${hangmanWord?.english} (${hangmanWord?.turkish})`);
        setTimeout(() => startHangman(), 2000);
      }
    } else {
      // Check if word is complete
      const allLetters = hangmanWord.english.split('').every(l =>
        newGuessed.includes(l) || l === ' '
      );

      if (allLetters) {
        toast.success(`Kazandın! 🎉 ${hangmanWord.english} = ${hangmanWord.turkish}`);
        setTimeout(() => startHangman(), 2000);
      }
    }
  };

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  if (view === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
        {/* Header */}
        <div className="sticky top-0 bg-card/95 backdrop-blur border-b border-border p-4 z-10">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-bold">İngilizce Kelime Defteri</h2>
                <p className="text-xs text-muted-foreground">{words.length} kelime · A1-A2 seviye</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-4 space-y-4">
          {/* Progress Card */}
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">İlerleme</span>
                <span className="text-sm font-bold text-primary">{learnedCount}/{words.length} kelime</span>
              </div>
              <Progress value={progressPercent} className="h-3" />
            </CardContent>
          </Card>

          {/* Menu Options */}
          <div className="grid gap-3">
            <Card
              className="cursor-pointer hover:border-primary transition-all hover:shadow-lg"
              onClick={() => setShowAddDialog(true)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
                  <Plus className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="font-bold">Kelime Ekle</h3>
                  <p className="text-sm text-muted-foreground">Yeni kelime ekle</p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:border-primary transition-all hover:shadow-lg"
              onClick={() => setView('study')}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">Çalış</h3>
                  <p className="text-sm text-muted-foreground">Kelimeleri öğren ve tekrar et</p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:border-warning transition-all hover:shadow-lg"
              onClick={startMatchingGame}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-warning/20 rounded-xl flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <h3 className="font-bold">Kelime Oyunu</h3>
                  <p className="text-sm text-muted-foreground">İngilizce-Türkçe eşleştir</p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:border-destructive transition-all hover:shadow-lg"
              onClick={startHangman}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-destructive/20 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <h3 className="font-bold">Asmaca Oyunu</h3>
                  <p className="text-sm text-muted-foreground">Harfleri tahmin et</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Word Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Kelime Ekle</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-1 block">İngilizce Kelime *</label>
                <Input
                  placeholder="örn: beautiful"
                  value={newWord.english}
                  onChange={(e) => setNewWord({ ...newWord, english: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Türkçe Anlam *</label>
                <Input
                  placeholder="örn: güzel"
                  value={newWord.turkish}
                  onChange={(e) => setNewWord({ ...newWord, turkish: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Örnek Cümle (İngilizce)</label>
                <Textarea
                  placeholder="örn: She has a beautiful smile."
                  value={newWord.example}
                  onChange={(e) => setNewWord({ ...newWord, example: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Seviye</label>
                <div className="flex gap-2">
                  <Button
                    variant={newWord.level === 'A1' ? 'default' : 'outline'}
                    onClick={() => setNewWord({ ...newWord, level: 'A1' })}
                    className="flex-1"
                  >
                    A1
                  </Button>
                  <Button
                    variant={newWord.level === 'A2' ? 'default' : 'outline'}
                    onClick={() => setNewWord({ ...newWord, level: 'A2' })}
                    className="flex-1"
                  >
                    A2
                  </Button>
                  <Button
                    variant={newWord.level === 'B1' ? 'default' : 'outline'}
                    onClick={() => setNewWord({ ...newWord, level: 'B1' })}
                    className="flex-1"
                  >
                    B1
                  </Button>
                </div>
              </div>
              <Button
                className="w-full"
                onClick={handleAddWord}
                disabled={!newWord.english || !newWord.turkish}
              >
                Kelimeyi Ekle
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (view === 'study') {
    const currentWord = words[currentWordIndex];

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="sticky top-0 bg-card/95 backdrop-blur border-b border-border p-4 z-10">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setView('menu')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h2 className="font-bold">Kelime Çalışması</h2>
              <Progress value={(currentWordIndex / words.length) * 100} className="h-2 mt-1" />
            </div>
            <span className="text-sm font-medium">{currentWordIndex + 1}/{words.length}</span>
          </div>
        </div>

        <div className="max-w-xl mx-auto p-4 flex items-center justify-center min-h-[80vh]">
          <Card className="w-full">
            <CardContent className="p-8 text-center space-y-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => speakWord(currentWord.english)}
                className="absolute top-4 right-4"
              >
                <Volume2 className="w-5 h-5" />
              </Button>

              <Badge variant="outline" className="mb-2">{currentWord.level}</Badge>

              <div className="space-y-4">
                <div>
                  <h1 className="text-4xl font-bold text-primary mb-2">{currentWord.english}</h1>
                  {showMeaning && (
                    <p className="text-2xl font-semibold text-accent animate-slide-up">{currentWord.turkish}</p>
                  )}
                </div>

                {showMeaning ? (
                  <div className="animate-slide-up space-y-4">
                    {currentWord.example && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm italic text-muted-foreground">"{currentWord.example}"</p>
                      </div>
                    )}
                    <Button onClick={handleLearnWord} size="lg" className="w-full">
                      Öğrendim, Defterime Ekle 📝
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-muted-foreground">Bu kelimenin anlamını biliyor musun?</p>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleKnowWord(true)}
                        className="flex-1 bg-success hover:bg-success/90"
                        size="lg"
                      >
                        <Check className="w-5 h-5 mr-2" />
                        Biliyorum
                      </Button>
                      <Button
                        onClick={() => handleKnowWord(false)}
                        variant="outline"
                        className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                        size="lg"
                      >
                        <X className="w-5 h-5 mr-2" />
                        Bilmiyorum
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (view === 'game') {
    const allGameItems = [
      ...gameWords.map(w => ({ id: `english-${w.english}`, text: w.english, type: 'english' as const, level: w.level })),
      ...gameWords.map(w => ({ id: `turkish-${w.turkish}`, text: w.turkish, type: 'turkish' as const, level: w.level }))
    ].sort(() => Math.random() - 0.5);

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-warning/5 to-background">
        <div className="sticky top-0 bg-card/95 backdrop-blur border-b border-border p-4 z-10">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setView('menu')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h2 className="font-bold">Kelime Eşleştirme Oyunu</h2>
              <p className="text-xs text-muted-foreground">İngilizce ve Türkçe kelimeleri eşleştir</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Puan</p>
              <p className="text-2xl font-bold text-warning">{gameScore}</p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-4">
          <div className="grid grid-cols-2 gap-3">
            {allGameItems.map(item => (
              <Card
                key={item.id}
                className={cn(
                  "cursor-pointer transition-all",
                  matchedPairs.includes(item.id) && "opacity-30 cursor-not-allowed bg-success/20 border-success",
                  selectedWords.includes(item.id) && !matchedPairs.includes(item.id) && "border-primary bg-primary/10 scale-95",
                  !matchedPairs.includes(item.id) && !selectedWords.includes(item.id) && "hover:border-warning hover:scale-105"
                )}
                onClick={() => !matchedPairs.includes(item.id) && handleWordClick(item.text, item.type)}
              >
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <p className={cn(
                      "font-bold",
                      item.type === 'english' ? "text-primary" : "text-accent"
                    )}>
                      {item.text}
                    </p>
                    <Badge variant="outline" className="text-xs">{item.level}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {item.type === 'english' ? '🇬🇧 İngilizce' : '🇹🇷 Türkçe'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'hangman' && hangmanWord) {
    const displayWord = hangmanWord.english.split('').map(letter =>
      guessedLetters.includes(letter) || letter === ' ' ? letter : '_'
    ).join(' ');

    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const isGameOver = wrongGuesses >= maxWrongGuesses;
    const isWon = hangmanWord.english.split('').every(l => guessedLetters.includes(l) || l === ' ');

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-destructive/5 to-background">
        <div className="sticky top-0 bg-card/95 backdrop-blur border-b border-border p-4 z-10">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setView('menu')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h2 className="font-bold">Asmaca Oyunu</h2>
              <p className="text-xs text-muted-foreground">Harfleri tahmin et</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Hata</p>
              <p className="text-2xl font-bold text-destructive">{wrongGuesses}/{maxWrongGuesses}</p>
            </div>
          </div>
        </div>

        <div className="max-w-xl mx-auto p-4 space-y-4">
          {/* Hint at top */}
          <Card className="bg-info/5 border-info/30">
            <CardContent className="p-4 flex items-center gap-3">
              <Info className="w-5 h-5 text-info" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">İpucu:</p>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-lg">{hangmanWord.turkish}</p>
                  <Badge variant="outline">{hangmanWord.level}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hangman Visual with Skeleton */}
          <Card>
            <CardContent className="p-8 text-center">
              <HangmanFigure wrongGuesses={wrongGuesses} />

              <div className="text-4xl font-mono font-bold tracking-widest mb-4">
                {displayWord}
              </div>

              {isGameOver && (
                <div className="p-4 bg-destructive/10 rounded-lg animate-slide-up">
                  <p className="font-bold text-destructive mb-1">Kaybettin! 😵</p>
                  <p className="text-2xl font-bold">{hangmanWord.english}</p>
                  <p className="text-lg text-muted-foreground">({hangmanWord.turkish})</p>
                </div>
              )}
              {isWon && (
                <div className="p-4 bg-success/10 rounded-lg animate-slide-up">
                  <p className="text-2xl font-bold text-success">🎉 Tebrikler!</p>
                  <p className="text-lg">{hangmanWord.english} = {hangmanWord.turkish}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alphabet */}
          <div className="grid grid-cols-7 gap-2">
            {alphabet.map(letter => (
              <Button
                key={letter}
                onClick={() => guessLetter(letter)}
                disabled={guessedLetters.includes(letter) || isGameOver || isWon}
                className={cn(
                  "h-12 text-lg font-bold",
                  guessedLetters.includes(letter) && hangmanWord.english.includes(letter) && "bg-success",
                  guessedLetters.includes(letter) && !hangmanWord.english.includes(letter) && "bg-destructive"
                )}
                variant={guessedLetters.includes(letter) ? "default" : "outline"}
              >
                {letter.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
