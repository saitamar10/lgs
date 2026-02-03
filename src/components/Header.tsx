import { useAuth } from '@/lib/auth';
import { useProfile } from '@/hooks/useLeaderboard';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Zap, Flame, LogOut, Trophy, User } from 'lucide-react';

interface HeaderProps {
  onNavigate?: (page: 'dashboard' | 'leaderboard') => void;
  currentPage?: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate?.('dashboard')}
          >
            <span className="text-2xl">🎓</span>
            <h1 className="text-xl font-bold text-foreground hidden sm:block">LGS Hazırlık</h1>
          </div>

          {user && profile && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 bg-warning/10 text-warning px-3 py-1.5 rounded-full">
                  <Zap className="w-4 h-4" />
                  <span className="font-bold">{profile.total_xp || 0}</span>
                </div>
                {profile.streak_days > 0 && (
                  <div className="flex items-center gap-1 bg-destructive/10 text-destructive px-3 py-1.5 rounded-full">
                    <Flame className="w-4 h-4" />
                    <span className="font-bold">{profile.streak_days}</span>
                  </div>
                )}
              </div>

              <Button
                variant={currentPage === 'leaderboard' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onNavigate?.('leaderboard')}
                className="hidden sm:flex"
              >
                <Trophy className="w-4 h-4 mr-1" />
                Sıralama
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                        {profile.display_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{profile.display_name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onNavigate?.('leaderboard')} className="sm:hidden">
                    <Trophy className="w-4 h-4 mr-2" />
                    Sıralama
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Çıkış Yap
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
