import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, UserMinus, Search, ArrowLeft, Trophy, Zap, Loader2 } from 'lucide-react';
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

interface FriendsPageProps {
  onBack: () => void;
}

export function FriendsPage({ onBack }: FriendsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Fetch data from Supabase
  const { data: friends = [], isLoading: friendsLoading } = useFriends();
  const { data: pendingRequests = [], isLoading: requestsLoading } = useFriendRequests();
  const { data: searchResults = [], isLoading: searchLoading } = useSearchUsers(searchQuery);

  // Mutations
  const sendFriendRequest = useSendFriendRequest();
  const acceptRequest = useAcceptFriendRequest();
  const rejectRequest = useRejectFriendRequest();
  const removeFriend = useRemoveFriend();

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
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-success" />
              <h1 className="text-2xl font-bold">Arkadaşlar</h1>
            </div>
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
              Kullanıcı adı ile arkadaş ara ve ekle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Kullanıcı adı ara..."
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
        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="friends">
              Arkadaşlarım ({friends.length})
            </TabsTrigger>
            <TabsTrigger value="requests">
              İstekler ({pendingRequests.length})
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
                      <div className="flex items-center gap-4">
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFriend(friend.id)}
                        disabled={removeFriend.isPending}
                      >
                        <UserMinus className="w-4 h-4" />
                      </Button>
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
    </div>
  );
}
