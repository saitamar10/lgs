import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useProfile } from '@/hooks/useLeaderboard';
import { useStudyPlan, calculateDaysRemaining } from '@/hooks/useStudyPlan';
import { useUserHearts } from '@/hooks/useUserHearts';
import { useStreak } from '@/hooks/useStreak';
import { useSubscription } from '@/hooks/useSubscription';
import { Subject } from '@/hooks/useSubjects';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ShopDialog } from '@/components/ShopDialog';
import { TasksDialog } from '@/components/TasksDialog';
import { StreakDialog } from '@/components/StreakDialog';
import {
  BookOpen,
  Trophy,
  Target,
  Store,
  User,
  Zap,
  Flame,
  Calendar,
  Heart,
  Bot,
  BookText,
  Crown,
  Coins,
  FileText,
  Users,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  subjects: Subject[];
  currentSubject: Subject | null;
  currentView: string;
  onSelectSubject: (subject: Subject) => void;
  onNavigate: (view: 'dashboard' | 'leaderboard' | 'profile' | 'coach' | 'vocabulary' | 'mock-exam' | 'todays-plan' | 'friends' | 'subscription') => void;
}

const colorMap: Record<string, string> = {
  primary: 'bg-primary text-primary-foreground',
  accent: 'bg-accent text-accent-foreground',
  warning: 'bg-warning text-warning-foreground',
  info: 'bg-info text-info-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
  secondary: 'bg-secondary text-secondary-foreground'
};

export function Sidebar({ 
  subjects, 
  currentSubject, 
  currentView,
  onSelectSubject, 
  onNavigate 
}: SidebarProps) {
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const { data: studyPlan } = useStudyPlan();
  const { hearts, maxHearts, formattedTimeUntilNextHeart, isRegenerating } = useUserHearts();
  const { currentStreak } = useStreak();
  const { data: subscription } = useSubscription();

  const [showShop, setShowShop] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [showStreak, setShowStreak] = useState(false);

  const daysRemaining = studyPlan ? calculateDaysRemaining(studyPlan.exam_date) : 0;
  const dailyProgress = profile ? Math.min(100, (profile.total_xp % (studyPlan?.daily_goal_xp || 50)) / (studyPlan?.daily_goal_xp || 50) * 100) : 0;

  const isPremium = subscription?.plan_type !== 'free';

  return (
    <>
      <aside className="w-64 bg-card border-r border-border h-screen sticky top-0 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <span className="text-3xl">🎓</span>
            <span className="text-xl font-bold text-primary">LGSÇalış</span>
            {isPremium && (
              <Badge variant="secondary" className="ml-auto text-xs bg-warning/20 text-warning">
                <Crown className="w-3 h-3 mr-0.5" />
                Plus
              </Badge>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="p-3 border-b border-border">
          <div className="flex items-center justify-between">
            {/* Hearts */}
            <button 
              className="flex items-center gap-1 hover:opacity-80 transition-opacity"
              onClick={() => setShowShop(true)}
            >
              <Heart className="w-5 h-5 text-destructive fill-destructive" />
              <span className="font-bold text-sm">{isPremium ? '∞' : hearts}</span>
              {isRegenerating && !isPremium && (
                <span className="text-xs text-muted-foreground">{formattedTimeUntilNextHeart}</span>
              )}
            </button>

            {/* Streak */}
            <button 
              className="flex items-center gap-1 hover:opacity-80 transition-opacity"
              onClick={() => setShowStreak(true)}
            >
              <Flame className={cn(
                "w-5 h-5",
                currentStreak > 0 ? "text-orange-500" : "text-muted-foreground"
              )} />
              <span className="font-bold text-sm">{currentStreak}</span>
            </button>

            {/* Coins */}
            <button 
              className="flex items-center gap-1 hover:opacity-80 transition-opacity"
              onClick={() => setShowShop(true)}
            >
              <Coins className="w-5 h-5 text-warning" />
              <span className="font-bold text-sm">{profile?.coins ?? 0}</span>
            </button>

            {/* XP */}
            <div className="flex items-center gap-1">
              <Zap className="w-5 h-5 text-primary" />
              <span className="font-bold text-sm">{profile?.total_xp ?? 0}</span>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {/* Today's Plan Section */}
          <Button
            variant={currentView === 'todays-plan' ? 'default' : 'ghost'}
            className="w-full justify-start gap-3 h-12"
            onClick={() => onNavigate('todays-plan')}
          >
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Bugünkü Programım</span>
          </Button>

          {/* Subjects */}
          <div className="pt-2 pb-1 px-3">
            <span className="text-xs font-semibold text-muted-foreground">DERSLER</span>
          </div>
          {subjects.map((subject) => (
            <Button
              key={subject.id}
              variant={currentSubject?.id === subject.id ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-3 h-11"
              onClick={() => onSelectSubject(subject)}
            >
              <span className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center text-sm",
                colorMap[subject.color || 'primary']
              )}>
                {subject.icon}
              </span>
              <span className="font-medium truncate">{subject.name}</span>
            </Button>
          ))}

          {/* Divider */}
          <div className="my-3 border-t border-border" />

          {/* Features */}
          <div className="pb-1 px-3">
            <span className="text-xs font-semibold text-muted-foreground">ÖZELLİKLER</span>
          </div>

          {/* AI Coach */}
          <Button
            variant={currentView === 'coach' ? 'default' : 'ghost'}
            className="w-full justify-start gap-3 h-11"
            onClick={() => onNavigate('coach')}
          >
            <Bot className="w-5 h-5 text-primary" />
            <span className="font-medium">AI Koç</span>
            {!isPremium && (
              <Badge variant="outline" className="ml-auto text-xs">
                Plus
              </Badge>
            )}
          </Button>

          {/* Vocabulary */}
          <Button
            variant={currentView === 'vocabulary' ? 'default' : 'ghost'}
            className="w-full justify-start gap-3 h-11"
            onClick={() => onNavigate('vocabulary')}
          >
            <BookText className="w-5 h-5 text-accent" />
            <span className="font-medium">Kelime Ezber</span>
          </Button>

          {/* Mock Exam */}
          <Button
            variant={currentView === 'mock-exam' ? 'default' : 'ghost'}
            className="w-full justify-start gap-3 h-11"
            onClick={() => onNavigate('mock-exam')}
          >
            <FileText className="w-5 h-5 text-info" />
            <span className="font-medium">Deneme Sınavı</span>
          </Button>

          {/* Divider */}
          <div className="my-3 border-t border-border" />

          {/* Social Section */}
          <div className="pb-1 px-3">
            <span className="text-xs font-semibold text-muted-foreground">SOSYAL</span>
          </div>

          {/* Friends */}
          <Button
            variant={currentView === 'friends' ? 'default' : 'ghost'}
            className="w-full justify-start gap-3 h-11"
            onClick={() => onNavigate('friends')}
          >
            <Users className="w-5 h-5 text-success" />
            <span className="font-medium">Arkadaşlar</span>
          </Button>

          {/* Subscription */}
          <Button
            variant={currentView === 'subscription' ? 'default' : 'ghost'}
            className="w-full justify-start gap-3 h-11"
            onClick={() => onNavigate('subscription')}
          >
            <CreditCard className="w-5 h-5 text-warning" />
            <span className="font-medium">Abonelik & Ödeme</span>
            {!isPremium && (
              <Badge variant="outline" className="ml-auto text-xs">
                Plus
              </Badge>
            )}
          </Button>

          {/* Divider */}
          <div className="my-3 border-t border-border" />

          {/* Other Navigation */}
          <Button
            variant={currentView === 'leaderboard' ? 'default' : 'ghost'}
            className="w-full justify-start gap-3 h-11"
            onClick={() => onNavigate('leaderboard')}
          >
            <Trophy className="w-5 h-5 text-warning" />
            <span className="font-medium">Puan Tabloları</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-11"
            onClick={() => setShowTasks(true)}
          >
            <Target className="w-5 h-5 text-accent" />
            <span className="font-medium">Görevler</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-11"
            onClick={() => setShowShop(true)}
          >
            <Store className="w-5 h-5 text-destructive" />
            <span className="font-medium">Mağaza</span>
          </Button>

          <Button
            variant={currentView === 'profile' ? 'default' : 'ghost'}
            className="w-full justify-start gap-3 h-11"
            onClick={() => onNavigate('profile')}
          >
            <User className="w-5 h-5 text-info" />
            <span className="font-medium">Profil</span>
          </Button>
        </nav>

        {/* Stats Footer */}
        {profile && (
          <div className="p-3 border-t border-border space-y-3">
            {/* Days Remaining */}
            {studyPlan && (
              <div className="bg-secondary rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">LGS'ye {daysRemaining} gün</span>
                </div>
                <Progress value={dailyProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Günlük hedef: {studyPlan.daily_goal_xp} XP
                </p>
              </div>
            )}

            {/* Sign Out */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground"
              onClick={signOut}
            >
              Çıkış Yap
            </Button>
          </div>
        )}
      </aside>

      {/* Dialogs */}
      <ShopDialog open={showShop} onClose={() => setShowShop(false)} />
      <TasksDialog open={showTasks} onClose={() => setShowTasks(false)} />
      <StreakDialog open={showStreak} onClose={() => setShowStreak(false)} />
    </>
  );
}
