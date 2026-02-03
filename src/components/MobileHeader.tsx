import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useProfile } from '@/hooks/useLeaderboard';
import { useUserHearts } from '@/hooks/useUserHearts';
import { useStreak } from '@/hooks/useStreak';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Zap, Flame, Heart, Menu, Coins, Crown, Home, Calendar, Target, User } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Subject } from '@/hooks/useSubjects';
import { Sidebar } from './Sidebar';
import { ShopDialog } from './ShopDialog';
import { StreakDialog } from './StreakDialog';
import { MobileTodaysPlanSheet } from './MobileTodaysPlanSheet';
import { TasksDialog } from './TasksDialog';
import { cn } from '@/lib/utils';

interface MobileHeaderProps {
  subjects: Subject[];
  currentSubject: Subject | null;
  currentView: string;
  onSelectSubject: (subject: Subject) => void;
  onNavigate: (view: 'dashboard' | 'leaderboard' | 'profile' | 'coach' | 'vocabulary' | 'mock-exam' | 'todays-plan') => void;
  onStartUnit?: (unitId: string, unitName: string, subjectId: string) => void;
}

export function MobileHeader({
  subjects,
  currentSubject,
  currentView,
  onSelectSubject,
  onNavigate,
  onStartUnit
}: MobileHeaderProps) {
  const { data: profile } = useProfile();
  const { hearts } = useUserHearts();
  const { currentStreak } = useStreak();
  const { data: subscription } = useSubscription();

  const [showShop, setShowShop] = useState(false);
  const [showStreak, setShowStreak] = useState(false);
  const [showTodaysPlan, setShowTodaysPlan] = useState(false);
  const [showTasks, setShowTasks] = useState(false);

  const isPremium = subscription?.plan_type !== 'free';

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <Sidebar
                subjects={subjects}
                currentSubject={currentSubject}
                currentView={currentView}
                onSelectSubject={onSelectSubject}
                onNavigate={onNavigate}
              />
            </SheetContent>
          </Sheet>

          {/* Stats */}
          <div className="flex items-center gap-3">
            {isPremium && (
              <div className="flex items-center gap-1 bg-warning/20 px-2 py-0.5 rounded-full">
                <Crown className="w-4 h-4 text-warning" />
              </div>
            )}
            <button 
              className="flex items-center gap-1"
              onClick={() => setShowStreak(true)}
            >
              <Flame className={currentStreak > 0 ? "w-5 h-5 text-orange-500" : "w-5 h-5 text-muted-foreground"} />
              <span className="font-bold text-sm">{currentStreak}</span>
            </button>
            <div className="flex items-center gap-1">
              <Zap className="w-5 h-5 text-primary" />
              <span className="font-bold text-sm">{profile?.total_xp || 0}</span>
            </div>
            <button 
              className="flex items-center gap-1"
              onClick={() => setShowShop(true)}
            >
              <Coins className="w-5 h-5 text-warning" />
              <span className="font-bold text-sm">{profile?.coins || 0}</span>
            </button>
            <button 
              className="flex items-center gap-1"
              onClick={() => setShowShop(true)}
            >
              <Heart className="w-5 h-5 text-destructive fill-destructive" />
              <span className="font-bold text-sm">{isPremium ? '∞' : hearts}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border lg:hidden">
        <div className="grid grid-cols-4 h-16">
          {/* Dashboard/Home */}
          <button
            onClick={() => onNavigate('dashboard')}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-colors",
              currentView === 'dashboard'
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Öğren</span>
          </button>

          {/* Today's Plan */}
          <button
            onClick={() => setShowTodaysPlan(true)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-colors",
              showTodaysPlan
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs font-medium">Program</span>
          </button>

          {/* Tasks */}
          <button
            onClick={() => setShowTasks(true)}
            className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Target className="w-5 h-5" />
            <span className="text-xs font-medium">Görevler</span>
          </button>

          {/* Profile */}
          <button
            onClick={() => onNavigate('profile')}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-colors",
              currentView === 'profile'
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <User className="w-5 h-5" />
            <span className="text-xs font-medium">Profil</span>
          </button>
        </div>
      </nav>

      {/* Dialogs */}
      <ShopDialog open={showShop} onClose={() => setShowShop(false)} />
      <StreakDialog open={showStreak} onClose={() => setShowStreak(false)} />
      <TasksDialog open={showTasks} onClose={() => setShowTasks(false)} />
      <MobileTodaysPlanSheet
        open={showTodaysPlan}
        onClose={() => setShowTodaysPlan(false)}
        onStartUnit={(unitId, unitName, subjectId) => {
          if (onStartUnit) {
            onStartUnit(unitId, unitName, subjectId);
          }
          setShowTodaysPlan(false);
        }}
      />
    </>
  );
}
