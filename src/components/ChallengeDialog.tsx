import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSubjects, useUnits } from '@/hooks/useSubjects';
import { ChallengeDifficulty } from '@/hooks/useFriendChallenges';
import { Gamepad2, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChallengeDialogProps {
  open: boolean;
  onClose: () => void;
  friendId: string;
  friendName: string;
  onStartChallenge: (unitId: string, unitName: string, subjectName: string, difficulty: ChallengeDifficulty) => void;
}

const difficultyLabels: Record<ChallengeDifficulty, string> = {
  easy: 'Kolay',
  medium: 'Orta',
  hard: 'Zor',
  exam: 'Sınav'
};

const difficultyColors: Record<ChallengeDifficulty, string> = {
  easy: 'bg-green-500/20 text-green-700 dark:text-green-400',
  medium: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  hard: 'bg-red-500/20 text-red-700 dark:text-red-400',
  exam: 'bg-purple-500/20 text-purple-700 dark:text-purple-400'
};

export function ChallengeDialog({
  open,
  onClose,
  friendId,
  friendName,
  onStartChallenge
}: ChallengeDialogProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<ChallengeDifficulty>('medium');

  const { data: subjects, isLoading: subjectsLoading } = useSubjects();
  const { data: units, isLoading: unitsLoading } = useUnits(selectedSubjectId);

  const selectedSubject = subjects?.find(s => s.id === selectedSubjectId);
  const selectedUnit = units?.find(u => u.id === selectedUnitId);

  const handleStartChallenge = () => {
    if (!selectedUnitId || !selectedUnit || !selectedSubject) {
      return;
    }

    onStartChallenge(
      selectedUnitId,
      selectedUnit.name,
      selectedSubject.name,
      selectedDifficulty
    );

    // Reset selections
    setSelectedSubjectId('');
    setSelectedUnitId('');
    setSelectedDifficulty('medium');
  };

  const handleSubjectChange = (value: string) => {
    setSelectedSubjectId(value);
    setSelectedUnitId(''); // Reset unit selection when subject changes
  };

  const canStartChallenge = selectedSubjectId && selectedUnitId && selectedDifficulty;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-primary" />
            {friendName} ile Meydan Okuma
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Friend Info */}
          <div className="bg-primary/10 rounded-lg p-4 flex items-center gap-3">
            <Target className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Rakip</p>
              <p className="font-semibold">{friendName}</p>
            </div>
          </div>

          {/* Subject Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Ders Seç</label>
            <Select value={selectedSubjectId} onValueChange={handleSubjectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Bir ders seçin..." />
              </SelectTrigger>
              <SelectContent>
                {subjectsLoading ? (
                  <SelectItem value="loading" disabled>Yükleniyor...</SelectItem>
                ) : (
                  subjects?.map(subject => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.icon} {subject.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Unit Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Konu/Ünite Seç</label>
            <Select
              value={selectedUnitId}
              onValueChange={setSelectedUnitId}
              disabled={!selectedSubjectId}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  !selectedSubjectId
                    ? "Önce ders seçin..."
                    : "Bir konu seçin..."
                } />
              </SelectTrigger>
              <SelectContent>
                {unitsLoading ? (
                  <SelectItem value="loading" disabled>Yükleniyor...</SelectItem>
                ) : units && units.length > 0 ? (
                  units.map(unit => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name}
                    </SelectItem>
                  ))
                ) : selectedSubjectId ? (
                  <SelectItem value="empty" disabled>Konu bulunamadı</SelectItem>
                ) : null}
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Zorluk Seviyesi</label>
            <div className="grid grid-cols-2 gap-2">
              {(['easy', 'medium', 'hard', 'exam'] as ChallengeDifficulty[]).map(difficulty => (
                <button
                  key={difficulty}
                  type="button"
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-all",
                    "border-2",
                    selectedDifficulty === difficulty
                      ? cn("border-primary", difficultyColors[difficulty])
                      : "border-transparent bg-secondary hover:bg-secondary/80"
                  )}
                >
                  {difficultyLabels[difficulty]}
                </button>
              ))}
            </div>
          </div>

          {/* Info Box */}
          {selectedUnit && (
            <div className="bg-info/10 border border-info/20 rounded-lg p-3 flex items-start gap-2 text-sm">
              <Zap className="w-4 h-4 text-info mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-info">
                  {selectedSubject?.name} - {selectedUnit.name}
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  5 soruluk bir quiz oynayacaksınız. Skorun ve hızın karşılaştırılacak!
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              İptal
            </Button>
            <Button
              onClick={handleStartChallenge}
              disabled={!canStartChallenge}
              className="flex-1"
            >
              <Gamepad2 className="w-4 h-4 mr-2" />
              Meydan Oku
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
