import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Crown, Loader2, Lock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Rank {
  id: string;
  name: string;
  icon: string;
  color: string;
  min_xp: number;
  order_index: number;
}

interface RankSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  userXP: number;
  currentRank: string | null;
}

export function RankSelectionDialog({ open, onClose, userXP, currentRank }: RankSelectionDialogProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedRank, setSelectedRank] = useState<string | null>(currentRank);

  // Fetch available ranks
  const { data: allRanks, isLoading } = useQuery({
    queryKey: ['ranks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ranks')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data as Rank[];
    },
    enabled: open,
  });

  // Update rank mutation
  const updateRankMutation = useMutation({
    mutationFn: async (rankName: string | null) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({ selected_rank: rankName })
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      toast.success('Rütbe güncellendi!');
      onClose();
    },
    onError: (error) => {
      console.error('Rank update error:', error);
      toast.error('Rütbe güncellenemedi');
    },
  });

  const handleSaveRank = () => {
    updateRankMutation.mutate(selectedRank);
  };

  const getRankColor = (color: string) => {
    const colors: Record<string, string> = {
      green: 'bg-green-500 border-green-600 text-white',
      blue: 'bg-blue-500 border-blue-600 text-white',
      purple: 'bg-purple-500 border-purple-600 text-white',
      orange: 'bg-orange-500 border-orange-600 text-white',
      red: 'bg-red-500 border-red-600 text-white',
      gold: 'bg-gradient-to-r from-yellow-400 to-yellow-600 border-yellow-600 text-white',
    };
    return colors[color] || 'bg-gray-500 border-gray-600 text-white';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-warning" />
            Rütbeni Seç
          </DialogTitle>
          <DialogDescription>
            Kazandığın XP ile açtığın rütbeleri seçebilirsin. Mevcut XP: <strong>{userXP}</strong>
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-3">
            {/* No Rank Option */}
            <button
              onClick={() => setSelectedRank(null)}
              className={cn(
                "w-full p-4 border-2 rounded-lg transition-all hover:scale-105",
                selectedRank === null
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-2xl">
                    🚫
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Rütbe Yok</p>
                    <p className="text-xs text-muted-foreground">Rütbe gösterme</p>
                  </div>
                </div>
                {selectedRank === null && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </div>
            </button>

            {/* Available Ranks */}
            {allRanks?.map((rank) => {
              const isUnlocked = userXP >= rank.min_xp;
              const isSelected = selectedRank === rank.name;

              return (
                <button
                  key={rank.id}
                  onClick={() => isUnlocked && setSelectedRank(rank.name)}
                  disabled={!isUnlocked}
                  className={cn(
                    "w-full p-4 border-2 rounded-lg transition-all",
                    isSelected && "border-primary bg-primary/10",
                    !isSelected && isUnlocked && "border-border hover:border-primary/50 hover:scale-105",
                    !isUnlocked && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2",
                        isUnlocked ? getRankColor(rank.color) : "bg-secondary border-border"
                      )}>
                        {rank.icon}
                      </div>
                      <div className="text-left">
                        <p className="font-semibold flex items-center gap-2">
                          {rank.name}
                          {!isUnlocked && <Lock className="w-3 h-3" />}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isUnlocked ? `${rank.min_xp} XP` : `${rank.min_xp} XP gerekli`}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            İptal
          </Button>
          <Button
            onClick={handleSaveRank}
            disabled={updateRankMutation.isPending}
            className="flex-1"
          >
            {updateRankMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              'Kaydet'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
