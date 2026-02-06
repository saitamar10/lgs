import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Send, Loader2, Search, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useConversations, useMessages, useSendMessage, useMarkAsRead, useGetOrCreateConversation, Conversation } from '@/hooks/useChat';
import { useFriends, getDisplayName } from '@/hooks/useFriends';
import { useAuth } from '@/lib/auth';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { toast } from 'sonner';

interface MobileChatPageProps {
  onBack: () => void;
}

export function MobileChatPage({ onBack }: MobileChatPageProps) {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversations, isLoading: conversationsLoading } = useConversations();
  const { data: friends = [], isLoading: friendsLoading } = useFriends();
  const { data: messages, isLoading: messagesLoading } = useMessages(selectedConversation?.id || null);
  const sendMessage = useSendMessage();
  const markAsRead = useMarkAsRead();
  const getOrCreateConversation = useGetOrCreateConversation();

  // Filter conversations by search
  const filteredConversations = conversations?.filter(conv =>
    conv.other_user?.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter friends by search (exclude friends who already have conversations)
  const conversationUserIds = new Set(conversations?.map(c => c.other_user?.user_id) || []);
  const filteredFriends = friends.filter(friend =>
    friend.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Start chat with friend
  const handleStartChatWithFriend = async (friendId: string) => {
    try {
      const conversationId = await getOrCreateConversation.mutateAsync(friendId);
      // Find or create conversation object
      const existingConv = conversations?.find(c => c.id === conversationId);
      if (existingConv) {
        setSelectedConversation(existingConv);
      } else {
        // Create temporary conversation object
        const friend = friends.find(f => f.id === friendId);
        const tempConv: Conversation = {
          id: conversationId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          other_user: {
            user_id: friendId,
            display_name: friend?.display_name || 'Kullanıcı'
          }
        };
        setSelectedConversation(tempConv);
      }
    } catch (error) {
      console.error('Failed to start chat:', error);
      toast.error('Sohbet başlatılamadı');
    }
  };

  // Mark as read when selecting conversation
  useEffect(() => {
    if (selectedConversation?.id) {
      markAsRead.mutate(selectedConversation.id);
    }
  }, [selectedConversation?.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || !selectedConversation) return;

    await sendMessage.mutateAsync({
      conversationId: selectedConversation.id,
      content: message
    });

    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Conversation List View
  if (!selectedConversation) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b p-4 z-10">
          <div className="flex items-center gap-3 mb-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Mesajlar</h1>
          </div>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Sohbet ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs: Sohbetler & Arkadaşlar */}
        <Tabs defaultValue="conversations" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mx-4">
            <TabsTrigger value="conversations">
              Sohbetler ({filteredConversations?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="friends">
              Arkadaşlar ({friends.length})
            </TabsTrigger>
          </TabsList>

          {/* Conversations Tab */}
          <TabsContent value="conversations" className="flex-1 overflow-y-auto mt-0">
            {conversationsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredConversations?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                  💬
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  {searchQuery ? 'Sohbet bulunamadı' : 'Henüz mesaj yok'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? 'Farklı bir arama deneyin' : 'Arkadaşlar sekmesinden sohbet başlat!'}
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredConversations?.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className="w-full p-4 hover:bg-accent transition-colors text-left flex items-center gap-3"
                  >
                    <div className="relative">
                      <Avatar className="w-14 h-14">
                        <AvatarFallback className="text-lg">
                          {conv.other_user?.display_name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      {(conv.unread_count || 0) > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-xs text-primary-foreground font-bold">
                            {conv.unread_count! > 9 ? '9+' : conv.unread_count}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold truncate">
                          {conv.other_user?.display_name || 'Kullanıcı'}
                        </p>
                        {conv.last_message && (
                          <span className="text-xs text-muted-foreground ml-2">
                            {formatDistanceToNow(new Date(conv.last_message.created_at), {
                              addSuffix: false,
                              locale: tr
                            })}
                          </span>
                        )}
                      </div>
                      {conv.last_message && (
                        <p className={cn(
                          "text-sm truncate",
                          (conv.unread_count || 0) > 0
                            ? "font-semibold text-foreground"
                            : "text-muted-foreground"
                        )}>
                          {conv.last_message.content}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Friends Tab */}
          <TabsContent value="friends" className="flex-1 overflow-y-auto mt-0">
            {friendsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredFriends.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                  👥
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  {searchQuery ? 'Arkadaş bulunamadı' : 'Henüz arkadaşın yok'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? 'Farklı bir arama deneyin' : 'Arkadaş ekle ve sohbet et!'}
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredFriends.map((friend) => (
                  <button
                    key={friend.id}
                    onClick={() => handleStartChatWithFriend(friend.id)}
                    disabled={getOrCreateConversation.isPending}
                    className="w-full p-4 hover:bg-accent transition-colors text-left flex items-center gap-3"
                  >
                    <Avatar className="w-14 h-14">
                      <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                        {getDisplayName(friend).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">
                        {getDisplayName(friend)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Mesaj göndermek için tıkla
                      </p>
                    </div>
                    {conversationUserIds.has(friend.id) && (
                      <Badge variant="secondary" className="text-xs">
                        Aktif
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Chat View
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b p-4 z-10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedConversation(null)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Avatar className="w-10 h-10">
            <AvatarFallback>
              {selectedConversation.other_user?.display_name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="font-bold">
              {selectedConversation.other_user?.display_name || 'Kullanıcı'}
            </h2>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messagesLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : messages?.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Henüz mesaj yok. İlk mesajı gönder! 👋
          </div>
        ) : (
          <>
            {messages?.map((msg) => {
              const isMe = msg.sender_id === user?.id;
              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    isMe ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-2",
                      isMe
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-card border rounded-bl-sm"
                    )}
                  >
                    <p className="break-words">{msg.content}</p>
                    <p className={cn(
                      "text-xs mt-1",
                      isMe ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>
                      {formatDistanceToNow(new Date(msg.created_at), {
                        addSuffix: true,
                        locale: tr
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-card border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Mesaj yaz..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
            disabled={sendMessage.isPending}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!message.trim() || sendMessage.isPending}
            className="shrink-0"
          >
            {sendMessage.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
