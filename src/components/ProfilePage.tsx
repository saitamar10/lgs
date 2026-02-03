import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useProfile } from '@/hooks/useLeaderboard';
import { useWeakTopics, WeakTopic } from '@/hooks/useWeakTopics';
import { useStudyPlan, calculateDaysRemaining } from '@/hooks/useStudyPlan';
import { useSubscription } from '@/hooks/useSubscription';
import { useStreak } from '@/hooks/useStreak';
import { useUserHearts } from '@/hooks/useUserHearts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { WeakTopicTestDialog } from './WeakTopicTestDialog';
import { PaywallDialog } from './PaywallDialog';
import { 
  ArrowLeft, 
  User, 
  Zap, 
  Flame, 
  Heart,
  Crown,
  AlertTriangle,
  Settings,
  Bell,
  Lock,
  LogOut,
  Target,
  Trophy,
  Calendar,
  TrendingUp
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ProfilePageProps {
  onBack: () => void;
  onNavigateToUnit: (unitId: string, unitName: string, subjectId: string) => void;
}

// Calculate level from XP
function calculateLevel(xp: number): { level: number; progress: number; xpToNext: number } {
  const baseXP = 100;
  const multiplier = 1.5;
  
  let level = 1;
  let totalXPForLevel = 0;
  let xpForCurrentLevel = baseXP;
  
  while (totalXPForLevel + xpForCurrentLevel <= xp) {
    totalXPForLevel += xpForCurrentLevel;
    level++;
    xpForCurrentLevel = Math.floor(baseXP * Math.pow(multiplier, level - 1));
  }
  
  const xpIntoCurrentLevel = xp - totalXPForLevel;
  const progress = (xpIntoCurrentLevel / xpForCurrentLevel) * 100;
  
  return { 
    level, 
    progress, 
    xpToNext: xpForCurrentLevel - xpIntoCurrentLevel 
  };
}

// Mock weekly XP data for chart
const generateWeeklyData = (totalXP: number) => {
  const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  const today = new Date().getDay();
  // Convert Sunday (0) to 6, and shift Monday (1) to 0, Tuesday (2) to 1, etc.
  const todayIndex = today === 0 ? 6 : today - 1;

  return days.map((day, i) => ({
    day,
    xp: i <= todayIndex ? Math.floor(Math.random() * 80) + 20 : 0
  }));
};

export function ProfilePage({ onBack, onNavigateToUnit }: ProfilePageProps) {
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const { data: weakTopics } = useWeakTopics();
  const { data: studyPlan } = useStudyPlan();
  const { data: subscription } = useSubscription();
  const { currentStreak, longestStreak } = useStreak();
  const { hearts, maxHearts } = useUserHearts();

  const [showPaywall, setShowPaywall] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedWeakTopic, setSelectedWeakTopic] = useState<WeakTopic | null>(null);
  const [showWeakTopicTest, setShowWeakTopicTest] = useState(false);

  const isPremium = subscription?.plan_type !== 'free';
  const levelInfo = calculateLevel(profile?.total_xp || 0);
  const daysRemaining = studyPlan ? calculateDaysRemaining(studyPlan.exam_date) : 0;
  const weeklyData = generateWeeklyData(profile?.total_xp || 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border p-4 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Profil</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* User Info Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {profile?.display_name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold">{profile?.display_name || 'Kullanıcı'}</h2>
                  {isPremium && (
                    <Badge variant="secondary" className="bg-warning/20 text-warning">
                      <Crown className="w-3 h-3 mr-0.5" />
                      Plus
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-sm font-medium">Seviye {levelInfo.level}</span>
                </div>
              </div>
            </div>

            {/* Level Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Seviye {levelInfo.level}</span>
                <span>{levelInfo.xpToNext} XP kaldı</span>
              </div>
              <Progress value={levelInfo.progress} className="h-2" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center p-2 bg-secondary/50 rounded-lg">
                <Zap className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold">{profile?.total_xp || 0}</p>
                <p className="text-xs text-muted-foreground">XP</p>
              </div>
              <div className="text-center p-2 bg-secondary/50 rounded-lg">
                <Flame className="w-5 h-5 text-warning mx-auto mb-1" />
                <p className="text-lg font-bold">{currentStreak || 0}</p>
                <p className="text-xs text-muted-foreground">Seri</p>
              </div>
              <div className="text-center p-2 bg-secondary/50 rounded-lg">
                <Heart className="w-5 h-5 text-destructive mx-auto mb-1" />
                <p className="text-lg font-bold">{isPremium ? '∞' : hearts}</p>
                <p className="text-xs text-muted-foreground">Kalp</p>
              </div>
              <div className="text-center p-2 bg-secondary/50 rounded-lg">
                <Trophy className="w-5 h-5 text-warning mx-auto mb-1" />
                <p className="text-lg font-bold">{longestStreak || 0}</p>
                <p className="text-xs text-muted-foreground">En Uzun</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Progress Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Haftalık İlerleme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`${value} XP`, 'Kazanılan']}
                  />
                  <Bar 
                    dataKey="xp" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* LGS Countdown */}
        {studyPlan && (
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
            <CardContent className="p-4 flex items-center gap-4">
              <Calendar className="w-10 h-10 text-primary" />
              <div>
                <p className="text-2xl font-bold text-primary">{daysRemaining} gün</p>
                <p className="text-sm text-muted-foreground">LGS'ye kaldı</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Weak Topics */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Zayıf Konular
              {weakTopics && weakTopics.length > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {weakTopics.length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!weakTopics || weakTopics.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                🎉 Harika! Zayıf konun yok.
              </p>
            ) : (
              <div className="space-y-2">
                {weakTopics.slice(0, 5).map((topic) => (
                  <div
                    key={topic.id}
                    className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{topic.unit_name}</p>
                      <p className="text-xs text-muted-foreground">{topic.subject_name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <AlertTriangle className="w-3 h-3 text-warning" />
                        <span className="text-xs text-warning">
                          {topic.mistake_count} hata
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedWeakTopic(topic);
                          setShowWeakTopicTest(true);
                        }}
                        className="bg-warning/10 hover:bg-warning/20 border-warning/30"
                      >
                        Özel Test
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onNavigateToUnit(topic.unit_id, topic.unit_name, topic.subject_id)}
                      >
                        Çalış
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Plus Upgrade (for free users) */}
        {!isPremium && (
          <Card className="border-warning/50 bg-gradient-to-r from-warning/5 to-warning/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Crown className="w-10 h-10 text-warning" />
                <div className="flex-1">
                  <p className="font-bold">Plus Üyeliğe Geç</p>
                  <p className="text-sm text-muted-foreground">
                    Sınırsız kalp, AI Koç ve daha fazlası
                  </p>
                </div>
                <Button onClick={() => setShowPaywall(true)}>
                  Katıl
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Settings */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Ayarlar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <Label htmlFor="notifications">Bildirimler</Label>
              </div>
              <Switch 
                id="notifications" 
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>

            {/* Change Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-muted-foreground" />
                <span>Şifre Değiştir</span>
              </div>
              <Button variant="outline" size="sm">
                Değiştir
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Button 
          variant="outline" 
          className="w-full text-destructive hover:text-destructive"
          onClick={signOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Çıkış Yap
        </Button>
      </div>

      <PaywallDialog open={showPaywall} onClose={() => setShowPaywall(false)} />

      <WeakTopicTestDialog
        open={showWeakTopicTest}
        onClose={() => {
          setShowWeakTopicTest(false);
          setSelectedWeakTopic(null);
        }}
        weakTopic={selectedWeakTopic}
        onStartTest={(unitId, unitName) => {
          // Navigate to the unit for special weak topic test
          const topic = selectedWeakTopic;
          if (topic) {
            onNavigateToUnit(unitId, unitName, topic.subject_id);
          }
        }}
      />
    </div>
  );
}
