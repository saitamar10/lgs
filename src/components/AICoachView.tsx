import { useState, useRef } from 'react';
import { useSendQuestionOnly, useCoachMessageLimit } from '@/hooks/useCoach';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Bot,
  ArrowLeft,
  Crown,
  Upload,
  X,
  Send,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { Mascot } from '@/components/Mascot';

interface AICoachViewProps {
  onBack: () => void;
}

export function AICoachView({ onBack }: AICoachViewProps) {
  const sendQuestionOnly = useSendQuestionOnly();
  const { data: subscription } = useSubscription();
  const { canSendMessage, remainingMessages, dailyLimit, incrementMessageCount } = useCoachMessageLimit();

  const isPremium = subscription?.plan_type !== 'free';

  const [questionText, setQuestionText] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Handle image selection
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
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleSubmit = async () => {
    if (!questionText.trim() && !selectedImage) {
      toast.error('Lütfen soru yazın veya görsel yükleyin');
      return;
    }

    // Check message limit for free users
    if (!isPremium && !canSendMessage) {
      toast.error(`Günlük soru limitine ulaştınız (${dailyLimit}/${dailyLimit}). Plus'a yükselt!`);
      return;
    }

    setIsSending(true);
    setAiResponse(null);

    try {
      // Create enhanced prompt for question solving
      const userQuestion = questionText.trim() || 'Görseldeki soruyu çöz ve detaylı açıkla';

      const systemPrompt = `Sen bir LGS öğretmenisin. Öğrenciye soruyu adım adım, temel seviyeden başlayarak açıkla.

${imagePreview ? `KRİTİK: GÖRSELDE NE SORULDUĞUNU DİKKATLE OKU!

1. İLK ADIM: Görseldeki metni TAM OLARAK oku
2. İKİNCİ ADIM: Soru türünü belirle (Matematik? Türkçe? İngilizce? Fen? Sosyal?)
3. ÜÇÜNCÜ ADIM: O konuya göre cevap ver

ASLA varsayımda bulunma! Görselde yazanı AYNEN oku ve ona göre cevapla.` : ''}

KURALLARIN:
1. Her adımı numaralandır ve açıkla
2. Temel kavramları hatırlat
3. Formülleri göster
4. Örnek ver
5. Nihai cevabı net ver
6. Öğrenci seviyesinde, basit dil kullan

Öğrenci sorusu: ${userQuestion}`;

      const response = await sendQuestionOnly.mutateAsync({
        content: systemPrompt,
        imageBase64: imagePreview || undefined
      });

      setAiResponse(response);

      // Increment message count for free users
      if (!isPremium) {
        await incrementMessageCount.mutateAsync();
      }

      // Clear form
      setQuestionText('');
      handleRemoveImage();
    } catch (error: any) {
      console.error('Failed to send question:', error);
      toast.error(error.message || 'Soru gönderilemedi. Tekrar deneyin.');
    } finally {
      setIsSending(false);
    }
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
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-bold">AI Soru Çözme Asistanı</h2>
                  <p className="text-xs text-muted-foreground">Adım adım açıklama</p>
                </div>
              </div>
            </div>
            {!isPremium && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">
                  Kalan: <span className="font-bold text-foreground">{remainingMessages}/{dailyLimit}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Welcome Message */}
        {!aiResponse && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Mascot size="lg" mood="happy" />
                <div>
                  <h3 className="font-bold text-lg mb-2">👋 Merhaba! Ben AI Öğretmenim</h3>
                  <p className="text-muted-foreground mb-3">
                    Sorunuzu 2 şekilde sorabilirsiniz:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-primary">1.</span>
                      <span>📝 Aşağıdaki alana sorunuzu yazın</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-primary">2.</span>
                      <span>📸 Soru görselini yükleyin (sürükle-bırak veya tıkla)</span>
                    </div>
                  </div>
                  <p className="text-sm text-primary font-medium mt-3">
                    Temel kavramlardan başlayarak adım adım açıklayacağım! 🎓
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Question Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sorunuzu Yazın</CardTitle>
            <CardDescription>
              Sorunuzu detaylı yazın veya aşağıya soru görselini yükleyin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Text Input */}
            <Textarea
              placeholder="Örnek: x² + 5x + 6 = 0 denklemini çöz&#10;&#10;veya&#10;&#10;Görseldeki soruyu çöz"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              rows={6}
              className="text-base resize-none"
              disabled={isSending}
            />

            {/* Image Upload Area */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Soru Görseli (Opsiyonel)
              </label>

              {!imagePreview ? (
                <div
                  ref={dropZoneRef}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
                >
                  <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">
                    Soru görselini buraya sürükleyin veya tıklayın
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, JPEG (Max 5MB)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative border-2 border-border rounded-lg p-4">
                  <img
                    src={imagePreview}
                    alt="Soru görseli"
                    className="max-h-96 mx-auto rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                    disabled={isSending}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={(!questionText.trim() && !selectedImage) || isSending || (!isPremium && !canSendMessage)}
              className="w-full h-12 text-lg"
              size="lg"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Çözülüyor...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Soruyu Gönder ve Çöz
                </>
              )}
            </Button>

            {!isPremium && !canSendMessage && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-center">
                <p className="text-sm text-destructive font-medium">
                  Günlük soru limitine ulaştınız ({dailyLimit}/{dailyLimit})
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  <Crown className="w-3 h-3 mr-1" />
                  Plus'a Yükselt - Sınırsız Soru
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Response */}
        {aiResponse && (
          <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <CardTitle>Çözüm</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{aiResponse}</ReactMarkdown>
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <Button
                  onClick={() => {
                    setAiResponse(null);
                    setQuestionText('');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Yeni Soru Sor
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
