import { useState, useRef, useEffect } from 'react';
import {
  useCoachConversations,
  useCoachMessages,
  useCreateConversation,
  useSendMessage,
  useDeleteConversation,
  useCoachMessageLimit,
  CoachConversation,
  CoachMessage
} from '@/hooks/useCoach';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import {
  Bot,
  ArrowLeft,
  Crown,
  Upload,
  X,
  Send,
  Loader2,
  Plus,
  Trash2,
  MessageSquare,
  Image as ImageIcon,
  ChevronLeft
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

interface AICoachViewProps {
  onBack: () => void;
}

export function AICoachView({ onBack }: AICoachViewProps) {
  const { data: conversations = [], isLoading: conversationsLoading } = useCoachConversations();
  const createConversation = useCreateConversation();
  const sendMessage = useSendMessage();
  const deleteConversation = useDeleteConversation();
  const { data: subscription } = useSubscription();
  const { canSendMessage, remainingMessages, dailyLimit, incrementMessageCount } = useCoachMessageLimit();

  const isPremium = subscription?.plan_type !== 'free';

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const { data: messages = [], isLoading: messagesLoading } = useCoachMessages(activeConversationId);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [messageText]);

  const handleNewConversation = async () => {
    try {
      const conversation = await createConversation.mutateAsync('Yeni Sohbet');
      setActiveConversationId(conversation.id);
      setShowSidebar(false);
    } catch (error) {
      toast.error('Yeni sohbet oluşturulamadı');
    }
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setShowSidebar(false);
  };

  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteConversation.mutateAsync(id);
      if (activeConversationId === id) {
        setActiveConversationId(null);
      }
    } catch (error) {
      toast.error('Sohbet silinemedi');
    }
  };

  const handleImageSelect = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Görsel 5MB\'dan küçük olmalı');
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Lütfen sadece görsel dosyası yükleyin');
      return;
    }
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageSelect(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() && !selectedImage) return;

    if (!isPremium && !canSendMessage) {
      toast.error(`Günlük mesaj limitine ulaştınız (${dailyLimit}/${dailyLimit})`);
      return;
    }

    let conversationId = activeConversationId;

    // Create new conversation if none active
    if (!conversationId) {
      try {
        const title = messageText.trim().slice(0, 50) || 'Görsel Soru';
        const conversation = await createConversation.mutateAsync(title);
        conversationId = conversation.id;
        setActiveConversationId(conversation.id);
      } catch (error) {
        toast.error('Sohbet oluşturulamadı');
        return;
      }
    }

    const content = messageText.trim() || 'Görseldeki soruyu çöz ve açıkla';
    setIsSending(true);
    setMessageText('');
    const currentImagePreview = imagePreview;
    handleRemoveImage();

    try {
      await sendMessage.mutateAsync({
        conversationId,
        content,
        imageBase64: currentImagePreview || undefined
      });

      if (!isPremium) {
        await incrementMessageCount.mutateAsync();
      }
    } catch (error: any) {
      toast.error(error.message || 'Mesaj gönderilemedi');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Bugün';
    if (diffDays === 1) return 'Dün';
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border shrink-0">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Back / Sidebar toggle */}
              {!showSidebar && activeConversationId ? (
                <Button variant="ghost" size="icon" onClick={() => setShowSidebar(true)} className="md:hidden">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              ) : null}
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-bold text-sm">AI Koç</h2>
                  <p className="text-xs text-muted-foreground">LGS Soru Asistanı</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isPremium && (
                <span className="text-xs text-muted-foreground">
                  <span className="font-bold text-foreground">{remainingMessages}</span>/{dailyLimit}
                </span>
              )}
              <Button variant="outline" size="sm" onClick={handleNewConversation} className="h-8">
                <Plus className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Yeni</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - conversation list */}
        <div className={`${showSidebar ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-72 border-r border-border bg-card shrink-0`}>
          <div className="p-3 border-b border-border">
            <Button onClick={handleNewConversation} className="w-full h-9 text-sm" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Sohbet
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversationsLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center">
                <MessageSquare className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Henüz sohbet yok</p>
                <p className="text-xs text-muted-foreground mt-1">Yeni bir sohbet başlatın</p>
              </div>
            ) : (
              <div className="py-1">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`group flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${
                      activeConversationId === conv.id
                        ? 'bg-primary/10 border-r-2 border-primary'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{conv.title}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(conv.updated_at)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 shrink-0"
                      onClick={(e) => handleDeleteConversation(conv.id, e)}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className={`${!showSidebar || !activeConversationId ? 'flex' : 'hidden'} md:flex flex-col flex-1 min-w-0`}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {!activeConversationId && messages.length === 0 ? (
              /* Welcome screen */
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-4">
                  <Bot className="w-9 h-9 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-lg mb-2">AI Koç'a Hoş Geldin!</h3>
                <p className="text-muted-foreground text-sm max-w-md mb-6">
                  LGS sorularını sor, görsel yükle veya herhangi bir konuda yardım iste. Sohbet geçmişin kaydedilir.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md w-full">
                  {[
                    '📐 Matematik sorusu çöz',
                    '📝 Türkçe paragraf analizi',
                    '🔬 Fen deneyi açıkla',
                    '📸 Görsel soru yükle'
                  ].map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setMessageText(suggestion.replace(/^[^\s]+ /, ''));
                      }}
                      className="text-left text-sm px-4 py-3 rounded-xl border border-border hover:bg-muted/50 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : messagesLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-md'
                          : 'bg-muted rounded-bl-md'
                      }`}
                    >
                      {msg.role === 'assistant' ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      )}
                      <p className={`text-[10px] mt-1.5 ${
                        msg.role === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'
                      }`}>
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isSending && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-7 h-7 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Image preview */}
          {imagePreview && (
            <div className="px-4 pb-2">
              <div className="relative inline-block">
                <img src={imagePreview} alt="Yüklenen görsel" className="h-20 rounded-lg border border-border" />
                <button
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Message limit warning */}
          {!isPremium && !canSendMessage && (
            <div className="px-4 pb-2">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-2.5 text-center">
                <p className="text-xs text-destructive font-medium">
                  Günlük mesaj limitine ulaştınız ({dailyLimit}/{dailyLimit})
                </p>
                <Button variant="outline" size="sm" className="mt-1.5 h-7 text-xs">
                  <Crown className="w-3 h-3 mr-1" />
                  Plus'a Yükselt
                </Button>
              </div>
            </div>
          )}

          {/* Input area */}
          <div className="border-t border-border bg-card p-3 shrink-0">
            <div className="flex items-end gap-2 max-w-4xl mx-auto">
              {/* Image upload button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 shrink-0"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSending}
              >
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />

              {/* Text input */}
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Mesajınızı yazın..."
                  rows={1}
                  disabled={isSending || (!isPremium && !canSendMessage)}
                  className="w-full resize-none rounded-xl border border-input bg-background px-4 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 max-h-[120px]"
                />
              </div>

              {/* Send button */}
              <Button
                size="icon"
                className="h-10 w-10 shrink-0 rounded-xl"
                onClick={handleSendMessage}
                disabled={(!messageText.trim() && !selectedImage) || isSending || (!isPremium && !canSendMessage)}
              >
                {isSending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
