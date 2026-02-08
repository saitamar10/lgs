import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useProfile } from '@/hooks/useLeaderboard';
import { useUserHearts } from '@/hooks/useUserHearts';
import { useStreak } from '@/hooks/useStreak';
import { useSubscription } from '@/hooks/useSubscription';
import { Subject } from '@/hooks/useSubjects';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import {
  Menu,
  BookOpen,
  Trophy,
  Store,
  User,
  Zap,
  Flame,
  Heart,
  Bot,
  BookText,
  Crown,
  Coins,
  FileText,
  Target,
  X,
  Users,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileSidebarProps {
  subjects: Subject[];
  currentSubject: Subject | null;
  currentView: string;
  onSelectSubject: (subject: Subject) => void;
  onNavigate: (view: 'dashboard' | 'leaderboard' | 'profile' | 'coach' | 'vocabulary' | 'mock-exam' | 'friends' | 'subscription') => void;
}

const colorMap: Record<string, string> = {
  primary: 'bg-primary text-primary-foreground',
  accent: 'bg-accent text-accent-foreground',
  warning: 'bg-warning text-warning-foreground',
  info: 'bg-info text-info-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
  secondary: 'bg-secondary text-secondary-foreground'
};

export function MobileSidebar({
  subjects,
  currentSubject,
  currentView,
  onSelectSubject,
  onNavigate
}: MobileSidebarProps) {
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const { hearts, maxHearts } = useUserHearts();
  const { currentStreak } = useStreak();
  const { data: subscription } = useSubscription();
  const [open, setOpen] = useState(false);

  const isPremium = subscription?.plan_type !== 'free';

  const handleNavigate = (view: any) => {
    onNavigate(view);
    setOpen(false);
  };

  const handleSelectSubject = (subject: Subject) => {
    onSelectSubject(subject);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-3xl">🎓</span>
                <SheetTitle className="text-xl font-bold text-primary">LGSÇalış</SheetTitle>
                {isPremium && (
                  <Badge variant="secondary" className="text-xs bg-warning/20 text-warning">
                    <Crown className="w-3 h-3 mr-0.5" />
                    Plus
                  </Badge>
                )}
              </div>
            </div>
          </SheetHeader>

          {/* Stats Bar */}
          <div className="p-3 border-b border-border">
            <div className="flex items-center justify-between">
              {/* Hearts */}
              <div className="flex items-center gap-1">
                <Heart className="w-5 h-5 text-destructive fill-destructive" />
                <span className="font-bold text-sm">{isPremium ? '∞' : hearts}</span>
              </div>

              {/* Streak */}
              <div className="flex items-center gap-1">
                <Flame className={cn(
                  "w-5 h-5",
                  currentStreak > 0 ? "text-orange-500" : "text-muted-foreground"
                )} />
                <span className="font-bold text-sm">{currentStreak}</span>
              </div>

              {/* Coins */}
              <div className="flex items-center gap-1">
                <Coins className="w-5 h-5 text-warning" />
                <span className="font-bold text-sm">{profile?.coins ?? 0}</span>
              </div>

              {/* XP */}
              <div className="flex items-center gap-1">
                <Zap className="w-5 h-5 text-primary" />
                <span className="font-bold text-sm">{profile?.total_xp ?? 0}</span>
              </div>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {/* Learn Section */}
            <Button
              variant={currentView === 'dashboard' ? 'default' : 'ghost'}
              className="w-full justify-start gap-3 h-12"
              onClick={() => handleNavigate('dashboard')}
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">ÖĞREN</span>
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
                onClick={() => handleSelectSubject(subject)}
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
              onClick={() => handleNavigate('coach')}
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
              onClick={() => handleNavigate('vocabulary')}
            >
              <BookText className="w-5 h-5 text-accent" />
              <span className="font-medium">Kelime Ezber</span>
            </Button>

            {/* Mock Exam */}
            <Button
              variant={currentView === 'mock-exam' ? 'default' : 'ghost'}
              className="w-full justify-start gap-3 h-11"
              onClick={() => handleNavigate('mock-exam')}
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
              onClick={() => handleNavigate('friends')}
            >
              <Users className="w-5 h-5 text-success" />
              <span className="font-medium">Arkadaşlar</span>
            </Button>

            {/* Subscription */}
            <Button
              variant={currentView === 'subscription' ? 'default' : 'ghost'}
              className="w-full justify-start gap-3 h-11"
              onClick={() => handleNavigate('subscription')}
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
              onClick={() => handleNavigate('leaderboard')}
            >
              <Trophy className="w-5 h-5 text-warning" />
              <span className="font-medium">Puan Tabloları</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-11"
            >
              <Target className="w-5 h-5 text-accent" />
              <span className="font-medium">Görevler</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-11"
            >
              <Store className="w-5 h-5 text-destructive" />
              <span className="font-medium">Mağaza</span>
            </Button>

            <Button
              variant={currentView === 'profile' ? 'default' : 'ghost'}
              className="w-full justify-start gap-3 h-11"
              onClick={() => handleNavigate('profile')}
            >
              <User className="w-5 h-5 text-info" />
              <span className="font-medium">Profil</span>
            </Button>
          </nav>

          {/* Sign Out */}
          <div className="p-3 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground"
              onClick={signOut}
            >
              Çıkış Yap
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
