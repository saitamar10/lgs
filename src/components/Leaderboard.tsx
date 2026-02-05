import { useState } from 'react';
import { useLeaderboard, LeaderboardEntry } from '@/hooks/useLeaderboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, Award, Zap, Flame } from 'lucide-react';
import { UserProfileDialog } from '@/components/UserProfileDialog';
import { cn } from '@/lib/utils';

interface LeaderboardProps {
  currentUserId?: string;
}

export function Leaderboard({ currentUserId }: LeaderboardProps) {
  const { data: leaderboard, isLoading } = useLeaderboard();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showUserProfile, setShowUserProfile] = useState(false);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-warning" />
            Liderlik Tablosu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-secondary rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-warning" />;
      case 2:
        return <Medal className="w-5 h-5 text-muted-foreground" />;
      case 3:
        return <Award className="w-5 h-5 text-warning/70" />;
      default:
        return <span className="text-sm font-bold text-muted-foreground">{rank}</span>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-warning" />
          Liderlik Tablosu
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {leaderboard?.map((entry) => (
            <div
              key={entry.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-colors cursor-pointer",
                entry.user_id === currentUserId
                  ? "bg-primary/10 border border-primary hover:bg-primary/20"
                  : "bg-secondary hover:bg-secondary/80",
                entry.rank === 1 && "bg-warning/10 border border-warning hover:bg-warning/20"
              )}
              onClick={() => {
                if (entry.user_id !== currentUserId) {
                  setSelectedUserId(entry.user_id);
                  setShowUserProfile(true);
                }
              }}
            >
              <div className="w-8 flex justify-center">
                {getRankIcon(entry.rank || 0)}
              </div>
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                  {entry.display_name?.charAt(0).toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">
                  {entry.display_name || 'Anonim'}
                  {entry.user_id === currentUserId && ' (Sen)'}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-warning" />
                    {entry.total_xp} XP
                  </span>
                  {entry.streak_days > 0 && (
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-destructive" />
                      {entry.streak_days} gün
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {(!leaderboard || leaderboard.length === 0) && (
            <p className="text-center text-muted-foreground py-8">
              Henüz lider yok. İlk sen ol! 🚀
            </p>
          )}
        </div>

        {/* User Profile Dialog */}
        {selectedUserId && (
          <UserProfileDialog
            open={showUserProfile}
            onClose={() => {
              setShowUserProfile(false);
              setSelectedUserId(null);
            }}
            userId={selectedUserId}
          />
        )}
      </CardContent>
    </Card>
  );
}
