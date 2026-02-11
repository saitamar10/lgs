import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, UserMinus, Search, ArrowLeft, Trophy, Zap, Loader2, Gamepad2, Swords, Target, Timer } from 'lucide-react';
import { UserProfileDialog } from '@/components/UserProfileDialog';
import { useAuth } from '@/lib/auth';
import {
  useFriends,
  useFriendRequests,
  useSearchUsers,
  useSendFriendRequest,
  useAcceptFriendRequest,
  useRejectFriendRequest,
  useRemoveFriend,
  getDisplayName
} from '@/hooks/useFriends';
import { usePendingChallenges, useFriendChallenges, useAcceptChallenge, useDeclineChallenge, getChallengeWinner, formatChallengeTime } from '@/hooks/useFriendChallenges';
import { ChallengeResultsDialog } from '@/components/ChallengeResultsDialog';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface FriendsPageProps {
  onBack: () => void;
  onPlayWithFriend?: (friendId: string, friendName: string) => void;
  onAcceptChallenge?: (challengeId: string, unitId: string, unitName: string, subjectName: string, difficulty: string) => void;
}

export function FriendsPage({ onBack, onPlayWithFriend, onAcceptChallenge }: FriendsPageProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  const [showChallengeResults, setShowChallengeResults] = useState(false);
  const [activeTab, setActiveTab] = useState('friends');

  // Listen for challenge notification clicks to switch to challenges tab
  useEffect(() => {
    const handleSwitchToChallengesTab = () => {
      setActiveTab('challenges');
    };

    window.addEventListener('switch-to-challenges-tab', handleSwitchToChallengesTab);

    return () => {
      window.removeEventListener('switch-to-challenges-tab', handleSwitchToChallengesTab);
    };
  }, []);

  // Fetch data from Supabase
  const { data: friends = [], isLoading: friendsLoading } = useFriends();
  const { data: pendingRequests = [], isLoading: requestsLoading } = useFriendRequests();
  const { data: searchResults = [], isLoading: searchLoading } = useSearchUsers(searchQuery);
  const { data: pendingChallenges = [] } = usePendingChallenges();
  const { data: allChallenges = [] } = useFriendChallenges();

  // Mutations
  const sendFriendRequest = useSendFriendRequest();
  const acceptRequest = useAcceptFriendRequest();
  const rejectRequest = useRejectFriendRequest();
  const removeFriend = useRemoveFriend();
  const acceptChallenge = useAcceptChallenge();
  const declineChallenge = useDeclineChallenge();

  const handleAddFriend = (userId: string) => {
    sendFriendRequest.mutate(userId);
    setSearchQuery('');
  };

  const handleRemoveFriend = (friendId: string) => {
    removeFriend.mutate(friendId);
  };

  const handleAcceptRequest = (requesterId: string) => {
    acceptRequest.mutate(requesterId);
  };

  const handleRejectRequest = (requesterId: string) => {
    rejectRequest.mutate(requesterId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-success" />
                <h1 className="text-2xl font-bold">Arkadaşlar</h1>
              </div>
            </div>
            {pendingChallenges.length > 0 && (
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setActiveTab('challenges')}
                >
                  <Swords className="w-4 h-4" />
                  <span className="hidden sm:inline">Mücadeleler</span>
                  <Badge variant="destructive" className="ml-1 px-1.5 py-0 text-xs animate-pulse">
                    {pendingChallenges.length}
                  </Badge>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Arkadaş Ara
            </CardTitle>
            <CardDescription>
              Kullanıcı adı veya arkadaşlık kodu ile arkadaş ara ve ekle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Kullanıcı adı veya arkadaşlık kodu (8 karakter)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Search Results */}
            {searchQuery.length >= 2 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {searchLoading ? (
                  <div className="text-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>{getDisplayName(user).charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{getDisplayName(user)}</div>
                          <div className="text-sm text-muted-foreground">Seviye {user.level}</div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddFriend(user.id)}
                        disabled={sendFriendRequest.isPending}
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Ekle
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-muted-foreground py-4">
                    Kullanıcı bulunamadı
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Friends Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="friends">
              Arkadaşlarım ({friends.length})
            </TabsTrigger>
            <TabsTrigger value="requests">
              İstekler ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="challenges" className="relative">
              Mücadeleler
              {pendingChallenges.length > 0 && (
                <Badge variant="destructive" className="ml-1 px-1 py-0 text-xs h-4 min-w-4">
                  {pendingChallenges.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="space-y-4 mt-4">
            {friendsLoading ? (
              <Card>
                <CardContent className="py-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                </CardContent>
              </Card>
            ) : friends.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Henüz arkadaşın yok</p>
                    <p className="text-sm mt-2">Arkadaş ara ve birlikte öğrenmeye başla!</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              friends.map((friend) => (
                <Card key={friend.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div
                        className="flex items-center gap-4 flex-1 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => {
                          setSelectedUserId(friend.id);
                          setShowUserProfile(true);
                        }}
                      >
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getDisplayName(friend).charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{getDisplayName(friend)}</div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Badge variant="outline" className="text-xs">
                                Seviye {friend.level}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <Zap className="w-3 h-3 text-primary" />
                              {friend.total_xp} XP
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onPlayWithFriend) {
                              onPlayWithFriend(friend.id, getDisplayName(friend));
                            } else {
                              toast.info('Oyun modu yakında aktif olacak!');
                            }
                          }}
                          className="bg-primary hover:bg-primary/90"
                        >
                          <Gamepad2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFriend(friend.id)}
                          disabled={removeFriend.isPending}
                        >
                          <UserMinus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="requests" className="space-y-4 mt-4">
            {requestsLoading ? (
              <Card>
                <CardContent className="py-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                </CardContent>
              </Card>
            ) : pendingRequests.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <UserPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Bekleyen istek yok</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              pendingRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-accent text-accent-foreground">
                            {getDisplayName(request).charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{getDisplayName(request)}</div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              Seviye {request.level}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Zap className="w-3 h-3 text-primary" />
                              {request.total_xp} XP
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAcceptRequest(request.id)}
                          disabled={acceptRequest.isPending}
                        >
                          Kabul Et
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectRequest(request.id)}
                          disabled={rejectRequest.isPending}
                        >
                          Reddet
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="challenges" className="space-y-4 mt-4">
            {/* Pending Challenges (Received) */}
            {pendingChallenges.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground px-1">Bekleyen Mücadeleler</h3>
                {pendingChallenges.map((challenge) => (
                  <Card key={challenge.id} className="border-yellow-500/50 bg-yellow-500/5">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                              <Swords className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold">{challenge.challenger_name}</p>
                              <p className="text-sm text-muted-foreground">sana meydan okudu!</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="capitalize">{challenge.difficulty}</Badge>
                        </div>

                        <div className="bg-secondary/50 rounded-lg p-3 text-sm">
                          <p className="font-medium">{challenge.subject_name} - {challenge.unit_name}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              <span>{challenge.challenger_score}/{challenge.challenger_total}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Timer className="w-3 h-3" />
                              <span>{formatChallengeTime(challenge.challenger_time_seconds)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              if (onAcceptChallenge) {
                                onAcceptChallenge(
                                  challenge.id,
                                  challenge.unit_id,
                                  challenge.unit_name,
                                  challenge.subject_name,
                                  challenge.difficulty
                                );
                              } else {
                                toast.error('Challenge sistemi yüklenemedi');
                              }
                            }}
                          >
                            <Gamepad2 className="w-4 h-4 mr-1" />
                            Oyna
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => declineChallenge.mutate(challenge.id)}
                            disabled={declineChallenge.isPending}
                          >
                            Reddet
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Ongoing Challenges (Sent, waiting for opponent) */}
            {allChallenges.filter(c => c.status === 'pending' && c.challenger_id === c.id).length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground px-1">Devam Eden</h3>
                {allChallenges
                  .filter(c => c.status === 'pending')
                  .map((challenge) => (
                    <Card key={challenge.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-semibold">{challenge.challenged_name}</p>
                              <p className="text-sm text-muted-foreground">{challenge.subject_name} - {challenge.unit_name}</p>
                            </div>
                          </div>
                          <Badge variant="secondary">Bekliyor...</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}

            {/* Completed Challenges */}
            {allChallenges.filter(c => c.status === 'completed').slice(0, 10).length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground px-1">Tamamlanan (Son 10)</h3>
                {allChallenges
                  .filter(c => c.status === 'completed')
                  .slice(0, 10)
                  .map((challenge) => {
                    const winner = getChallengeWinner(challenge);

                    // Determine if current user is challenger or challenged
                    const isChallenger = user?.id === challenge.challenger_id;

                    // Get opponent info and scores based on user's role
                    const opponentName = isChallenger ? challenge.challenged_name : challenge.challenger_name;
                    const myScore = isChallenger ? challenge.challenger_score : challenge.challenged_score;
                    const myTotal = isChallenger ? challenge.challenger_total : challenge.challenged_total;
                    const opponentScore = isChallenger ? challenge.challenged_score : challenge.challenger_score;
                    const opponentTotal = isChallenger ? challenge.challenged_total : challenge.challenger_total;

                    // Determine if I won
                    const didIWin = (isChallenger && winner === 'challenger') || (!isChallenger && winner === 'challenged');
                    const isTie = winner === 'tie';

                    return (
                      <Card key={challenge.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isTie ? 'bg-blue-500/20' :
                                didIWin ? 'bg-green-500/20' :
                                'bg-red-500/20'
                              }`}>
                                {isTie ? (
                                  <Target className="w-5 h-5 text-blue-500" />
                                ) : didIWin ? (
                                  <Trophy className="w-5 h-5 text-green-500" />
                                ) : (
                                  <Trophy className="w-5 h-5 text-red-500" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold">{opponentName}</p>
                                <p className="text-sm text-muted-foreground">{challenge.subject_name} - {challenge.unit_name}</p>
                                <div className="mt-1 text-sm">
                                  <span className="font-medium">{opponentScore || 0} - {myScore || 0}</span>
                                  <span className={`ml-2 ${
                                    isTie ? 'text-blue-600' :
                                    didIWin ? 'text-green-600' :
                                    'text-red-600'
                                  }`}>
                                    {isTie ? 'Berabere' : didIWin ? 'Yendin!' : 'Seni Yendi'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedChallengeId(challenge.id);
                                setShowChallengeResults(true);
                              }}
                            >
                              Sonuçlar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            )}

            {/* Empty State */}
            {pendingChallenges.length === 0 && allChallenges.filter(c => c.status === 'completed').length === 0 && (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <Swords className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Henüz meydan okuman yok</p>
                    <p className="text-sm mt-2">Arkadaşlarına meydan oku ve yarışmaya başla!</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Info Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Trophy className="w-5 h-5 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold mb-1">Arkadaşlarınla Yarış!</p>
                <p className="text-muted-foreground">
                  Arkadaşlarını ekle, liderlik tablosunda yarış ve birlikte daha eğlenceli öğren!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
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

      {/* Challenge Results Dialog */}
      {selectedChallengeId && (
        <ChallengeResultsDialog
          open={showChallengeResults}
          onClose={() => {
            setShowChallengeResults(false);
            setSelectedChallengeId(null);
          }}
          challenge={allChallenges.find(c => c.id === selectedChallengeId)!}
          currentUserId={allChallenges.find(c => c.id === selectedChallengeId)?.challenged_id || ''}
          onRematch={() => {
            // Will be implemented in ADIM 6
            toast.info('Rövanş özelliği yakında eklenecek!');
          }}
          onPlayAgain={() => {
            // Will be implemented in ADIM 6
            toast.info('Tekrar oyna özelliği yakında eklenecek!');
          }}
        />
      )}
    </div>
  );
}
