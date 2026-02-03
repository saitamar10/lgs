import { useState, useRef, useEffect } from 'react';
import { 
  useCoachConversations, 
  useCoachMessages, 
  useCreateConversation, 
  useSendMessage,
  useDeleteConversation,
  useCoachMessageLimit
} from '@/hooks/useCoach';
import { useSubscription } from '@/hooks/useSubscription';
import { useProfile } from '@/hooks/useLeaderboard';
import { useAllStageProgress } from '@/hooks/useStageProgress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, 
  Send, 
  Plus, 
  Trash2, 
  Loader2, 
  ArrowLeft,
  Sparkles,
  BookOpen,
  Target,
  TrendingUp,
  Crown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { Mascot } from '@/components/Mascot';

interface AICoachViewProps {
  onBack: () => void;
}

const quickPrompts = [
  { icon: <Target className="w-4 h-4" />, text: "Zayıf konularımı analiz et" },
  { icon: <BookOpen className="w-4 h-4" />, text: "Bugün ne çalışmalıyım?" },
  { icon: <TrendingUp className="w-4 h-4" />, text: "LGS için strateji öner" },
];

export function AICoachView({ onBack }: AICoachViewProps) {
  const { data: conversations, isLoading: convsLoading } = useCoachConversations();
  const createConversation = useCreateConversation();
  const deleteConversation = useDeleteConversation();
  const sendMessage = useSendMessage();
  const { data: profile } = useProfile();
  const { data: allProgress } = useAllStageProgress();
  const { data: subscription } = useSubscription();
  const { canSendMessage, remainingMessages, dailyLimit, incrementMessageCount } = useCoachMessageLimit();

  const isPremium = subscription?.plan_type !== 'free';

  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading: msgsLoading } = useCoachMessages(selectedConvId);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNewConversation = async () => {
    try {
      const conv = await createConversation.mutateAsync('Yeni Sohbet');
      setSelectedConvId(conv.id);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const handleSendMessage = async (text?: string) => {
    const messageToSend = text || message;
    if (!messageToSend.trim() || !selectedConvId) return;

    // Check message limit for free users
    if (!isPremium && !canSendMessage) {
      toast.error(`Günlük mesaj limitine ulaştınız (${dailyLimit}/${dailyLimit}). Plus'a yükselt!`);
      return;
    }

    setMessage('');
    setIsSending(true);

    try {
      // Add context about user's progress
      let contextMessage = messageToSend;
      if (messageToSend.includes('zayıf') || messageToSend.includes('analiz')) {
        const progressSummary = allProgress?.slice(0, 5).map(p => 
          `Ünite: ${p.unit_id}, Kolay: ${p.easy_completions}/3, Orta: ${p.medium_completions}/3`
        ).join('\n');
        contextMessage = `${messageToSend}\n\nKullanıcı istatistikleri:\n- Toplam XP: ${profile?.total_xp || 0}\n- Seri: ${profile?.streak_days || 0} gün\n\nİlerleme:\n${progressSummary || 'Henüz ilerleme yok'}`;
      }

      await sendMessage.mutateAsync({ 
        conversationId: selectedConvId, 
        content: contextMessage 
      });

      // Increment message count for free users
      if (!isPremium) {
        await incrementMessageCount.mutateAsync();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Mesaj gönderilemedi. Tekrar deneyin.');
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteConversation = async (convId: string) => {
    try {
      await deleteConversation.mutateAsync(convId);
      if (selectedConvId === convId) {
        setSelectedConvId(null);
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold">LGS Koç</h2>
            <p className="text-xs text-muted-foreground">AI destekli özel ders</p>
          </div>
        </div>
        <div className="ml-auto">
          <Button variant="outline" size="sm" onClick={handleNewConversation}>
            <Plus className="w-4 h-4 mr-1" />
            Yeni Sohbet
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area - No sidebar */}
        <div className="flex-1 flex flex-col">
          {!selectedConvId ? (
            // Welcome Screen
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <Mascot 
                size="xl" 
                mood="happy" 
                message="Merhaba! LGS yolculuğunda sana yardımcı olmak için buradayım! 🎓"
                animate
              />
              <h3 className="text-2xl font-bold mb-2 mt-6">LGS Koçunuz</h3>
              <p className="text-muted-foreground text-center mb-8 max-w-md">
                Zayıf konularını analiz eder, günlük çalışma planı oluşturur ve 
                soruları detaylı açıklar.
              </p>
              <Button onClick={handleNewConversation} size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Sohbete Başla
              </Button>
            </div>
          ) : (
            <>
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                {msgsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : messages?.length === 0 ? (
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div className="bg-muted rounded-lg p-4 max-w-[80%]">
                        <p>Merhaba! Ben senin LGS koçunum. 🎓</p>
                        <p className="mt-2">Sana nasıl yardımcı olabilirim?</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 ml-11">
                      {quickPrompts.map((prompt, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendMessage(prompt.text)}
                          className="text-xs"
                        >
                          {prompt.icon}
                          <span className="ml-1">{prompt.text}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex gap-3",
                          msg.role === 'user' && "flex-row-reverse"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                          msg.role === 'assistant' 
                            ? "bg-gradient-to-br from-primary to-accent" 
                            : "bg-secondary"
                        )}>
                          {msg.role === 'assistant' ? (
                            <Bot className="w-5 h-5 text-primary-foreground" />
                          ) : (
                            <span className="text-sm">👤</span>
                          )}
                        </div>
                        <div className={cn(
                          "rounded-lg p-4 max-w-[80%]",
                          msg.role === 'assistant' ? "bg-muted" : "bg-primary text-primary-foreground"
                        )}>
                          {msg.role === 'assistant' ? (
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                          ) : (
                            <p>{msg.content}</p>
                          )}
                        </div>
                      </div>
                    ))}
                    {isSending && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                          <Bot className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div className="bg-muted rounded-lg p-4">
                          <Loader2 className="w-5 h-5 animate-spin" />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-border">
                {/* Message Limit Banner for Free Users */}
                {!isPremium && (
                  <div className="mb-3 flex items-center justify-between bg-muted/50 rounded-lg p-2 text-sm">
                    <span className="text-muted-foreground">
                      Günlük mesaj: <span className="font-bold text-foreground">{remainingMessages}/{dailyLimit}</span>
                    </span>
                    <Button variant="ghost" size="sm" className="text-warning h-7">
                      <Crown className="w-3 h-3 mr-1" />
                      Sınırsız için Plus
                    </Button>
                  </div>
                )}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={!isPremium && !canSendMessage ? "Günlük limit doldu" : "Mesaj yaz..."}
                    disabled={isSending || (!isPremium && !canSendMessage)}
                    className="flex-1"
                  />
                  <Button 
                    type="submit" 
                    disabled={!message.trim() || isSending || (!isPremium && !canSendMessage)}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
