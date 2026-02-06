import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, X, Minus, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useConversations, useMessages, useSendMessage, useMarkAsRead, useGetOrCreateConversation, Conversation } from '@/hooks/useChat';
import { useFriends, getDisplayName } from '@/hooks/useFriends';
import { useAuth } from '@/lib/auth';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { toast } from 'sonner';

interface ChatWindowProps {
  conversation: Conversation;
  onClose: () => void;
  onMinimize: () => void;
  isMinimized: boolean;
}

export function ChatWindow({ conversation, onClose, onMinimize, isMinimized }: ChatWindowProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading } = useMessages(conversation.id);
  const sendMessage = useSendMessage();
  const markAsRead = useMarkAsRead();

  // Mark as read when opening
  useEffect(() => {
    if (!isMinimized && conversation.id) {
      markAsRead.mutate(conversation.id);
    }
  }, [isMinimized, conversation.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    await sendMessage.mutateAsync({
      conversationId: conversation.id,
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

  return (
    <Card className={cn(
      "fixed bottom-0 right-4 w-80 shadow-2xl transition-all duration-300 z-50",
      isMinimized ? "h-14" : "h-96"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primary-foreground text-primary text-xs">
              {conversation.other_user?.display_name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">
              {conversation.other_user?.display_name || 'Kullanıcı'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={onMinimize}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 h-72 bg-muted/20">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
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
                          "max-w-[75%] rounded-2xl px-3 py-2 text-sm",
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
          <div className="p-3 border-t bg-background">
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
              >
                {sendMessage.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}

interface DesktopChatWidgetProps {
  onOpenMobileChat?: () => void;
}

export function DesktopChatWidget({ onOpenMobileChat }: DesktopChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openChats, setOpenChats] = useState<Conversation[]>([]);
  const [minimizedChats, setMinimizedChats] = useState<Set<string>>(new Set());

  const { data: conversations } = useConversations();
  const { data: friends = [] } = useFriends();
  const getOrCreateConversation = useGetOrCreateConversation();

  const totalUnread = conversations?.reduce((sum, conv) => sum + (conv.unread_count || 0), 0) || 0;

  // Filter friends (exclude those with existing conversations)
  const conversationUserIds = new Set(conversations?.map(c => c.other_user?.user_id) || []);

  // Start chat with friend
  const handleStartChatWithFriend = async (friendId: string) => {
    try {
      const conversationId = await getOrCreateConversation.mutateAsync(friendId);
      // Find or create conversation object
      const existingConv = conversations?.find(c => c.id === conversationId);
      if (existingConv) {
        handleOpenChat(existingConv);
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
        handleOpenChat(tempConv);
      }
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to start chat:', error);
      toast.error('Sohbet başlatılamadı');
    }
  };

  const handleOpenChat = (conversation: Conversation) => {
    if (!openChats.find(c => c.id === conversation.id)) {
      setOpenChats([...openChats, conversation]);
    }
    minimizedChats.delete(conversation.id);
    setMinimizedChats(new Set(minimizedChats));
  };

  const handleCloseChat = (conversationId: string) => {
    setOpenChats(openChats.filter(c => c.id !== conversationId));
    minimizedChats.delete(conversationId);
    setMinimizedChats(new Set(minimizedChats));
  };

  const handleMinimizeChat = (conversationId: string) => {
    const newMinimized = new Set(minimizedChats);
    if (newMinimized.has(conversationId)) {
      newMinimized.delete(conversationId);
    } else {
      newMinimized.add(conversationId);
    }
    setMinimizedChats(newMinimized);
  };

  return (
    <>
      {/* Desktop Only - Chat List Button */}
      <div className="hidden md:block fixed bottom-4 right-4 z-40">
        <Button
          size="lg"
          className="rounded-full shadow-2xl h-14 px-6"
          onClick={() => setIsOpen(!isOpen)}
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Sohbet
          {totalUnread > 0 && (
            <Badge className="ml-2 bg-destructive text-destructive-foreground">
              {totalUnread}
            </Badge>
          )}
        </Button>

        {/* Chat List Popup */}
        {isOpen && (
          <Card className="absolute bottom-16 right-0 w-80 shadow-2xl flex flex-col" style={{ maxHeight: '500px' }}>
            <div className="p-3 border-b bg-primary text-primary-foreground flex items-center justify-between">
              <h3 className="font-bold">Mesajlar</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <Tabs defaultValue="conversations" className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="grid w-full grid-cols-2 rounded-none">
                <TabsTrigger value="conversations">
                  Sohbetler ({conversations?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="friends">
                  Arkadaşlar ({friends.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="conversations" className="flex-1 overflow-y-auto mt-0">
                {conversations?.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    Henüz sohbet yok. Arkadaşlar sekmesinden sohbet başlat! 💬
                  </div>
                ) : (
                  conversations?.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => {
                        handleOpenChat(conv);
                        setIsOpen(false);
                      }}
                      className="w-full p-3 hover:bg-accent transition-colors text-left border-b"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {conv.other_user?.display_name?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-sm truncate">
                              {conv.other_user?.display_name || 'Kullanıcı'}
                            </p>
                            {(conv.unread_count || 0) > 0 && (
                              <Badge variant="destructive" className="ml-2">
                                {conv.unread_count}
                              </Badge>
                            )}
                          </div>
                          {conv.last_message && (
                            <p className="text-xs text-muted-foreground truncate">
                              {conv.last_message.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </TabsContent>

              <TabsContent value="friends" className="flex-1 overflow-y-auto mt-0">
                {friends.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    Henüz arkadaşın yok. Arkadaş ekle ve sohbet et! 👥
                  </div>
                ) : (
                  friends.map((friend) => (
                    <button
                      key={friend.id}
                      onClick={() => handleStartChatWithFriend(friend.id)}
                      disabled={getOrCreateConversation.isPending}
                      className="w-full p-3 hover:bg-accent transition-colors text-left border-b"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getDisplayName(friend).charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">
                            {getDisplayName(friend)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Sohbet başlat
                          </p>
                        </div>
                        {conversationUserIds.has(friend.id) && (
                          <Badge variant="secondary" className="text-xs">
                            Aktif
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </Card>
        )}
      </div>

      {/* Open Chat Windows */}
      <div className="hidden md:flex fixed bottom-0 right-4 gap-2 z-50" style={{ right: '100px' }}>
        {openChats.map((conv, index) => (
          <div key={conv.id} style={{ marginRight: `${index * 330}px` }}>
            <ChatWindow
              conversation={conv}
              onClose={() => handleCloseChat(conv.id)}
              onMinimize={() => handleMinimizeChat(conv.id)}
              isMinimized={minimizedChats.has(conv.id)}
            />
          </div>
        ))}
      </div>

      {/* Mobile Only - Show Mobile Chat Button */}
      <div className="md:hidden fixed bottom-20 right-4 z-40">
        <Button
          size="lg"
          className="rounded-full shadow-2xl h-14 w-14"
          onClick={onOpenMobileChat}
        >
          <MessageCircle className="w-6 h-6" />
          {totalUnread > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground h-5 w-5 flex items-center justify-center p-0 text-xs">
              {totalUnread > 9 ? '9+' : totalUnread}
            </Badge>
          )}
        </Button>
      </div>
    </>
  );
}
