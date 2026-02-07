# 🎓 LGS Hazırlık Platformu - Sponsor Sunumu

**Proje Adı:** LGS Scalis
**Hedef Kitle:** 8. Sınıf Öğrencileri (LGS'ye Hazırlananlar)
**Teknoloji:** React + TypeScript + Supabase + AI (Claude 3.5 Sonnet)
**Durum:** Aktif Geliştirme, Canlı Platformda

---

## 📊 Proje Özeti

Modern gamification ve yapay zeka teknolojilerini kullanarak LGS'ye hazırlanan öğrencilere:
- 🤖 **AI destekli soru çözme ve açıklama**
- 🎮 **Oyunlaştırılmış öğrenme deneyimi**
- 👥 **Sosyal öğrenme ortamı**
- 📈 **Kişiselleştirilmiş çalışma planı**

sunan kapsamlı bir eğitim platformu.

---

## 🎯 Ana Özellikler

### 1. 🤖 AI Soru Çözme Asistanı (AI Coach)

**Ne İşe Yarar:**
- Öğrenciler matematik, fen, Türkçe, İngilizce vb. sorularını yazarak veya fotoğrafını çekerek AI'ya sorabilir
- AI, soruyu adım adım çözer ve temel seviyeden başlayarak açıklar
- Görsel tanıma (Vision API) ile soru fotoğraflarını okur

**Nasıl Çalışır:**
- Claude 3.5 Sonnet AI modeli kullanır (Türkçe dilinde en iyi performans)
- Öğrenci metin yazabilir VEYA soru fotoğrafı yükleyebilir
- AI, görseldeki soruyu okur, hangi ders olduğunu belirler ve detaylı açıklama yapar
- Markdown formatında formüllü, adım adım çözüm sunar

**Kullanıcı Değeri:**
- ✅ 7/24 özel öğretmen gibi
- ✅ Her soruyu adım adım açıklama
- ✅ Temel kavramları hatırlatma
- ✅ Sınırsız soru sorma (Premium)

**Teknik Detaylar:**
- **Model:** Claude 3.5 Sonnet (anthropic/claude-3-5-sonnet-20241022)
- **Vision API:** Görsel okuma desteği
- **Edge Function:** Supabase edge function üzerinden
- **Rate Limiting:** Free kullanıcılar günde 5 soru, Premium sınırsız
- **Max Tokens:** 2048 (detaylı açıklamalar için)

**Sponsor Fırsatı:**
- 💰 "AI Coach Powered by [Sponsor]" branding
- 📊 Günlük 100+ AI soru çözme kullanımı (tahmin)

---

### 2. 🎮 Arkadaşlarla Meydan Okuma Sistemi (Friend Challenges)

**Ne İşe Yarar:**
- Öğrenciler arkadaşlarına belirli bir konuda meydan okur
- Her iki taraf da aynı soruları çözer (farklı zamanlarda)
- İlk yanlış yapan kaybeder sistemi
- Kazanan/kaybeden belirlenir ve confetti animasyonu gösterilir

**Nasıl Çalışır:**
1. **Meydan Okuma Gönder:** Arkadaş seç → Ders/Konu seç → Zorluk seç → Quiz'i tamamla
2. **Meydan Okuma Kabul Et:** Bildirim gelir → Kabul et → Aynı soruları çöz
3. **İlk Hata Bitir:** Challenge mode'da ilk yanlış cevap quiz'i sonlandırır
4. **Sonuç Ekranı:** Kim kazandı gösterilir, confetti animasyonu
5. **Rövanş/Tekrar Oyna:** Sonuç ekranından yeni challenge başlat

**Kullanıcı Değeri:**
- ✅ Rekabetçi öğrenme motivasyonu
- ✅ Arkadaşlarla yarışarak eğlenceli öğrenme
- ✅ Güçlü/zayıf konuları keşfetme
- ✅ Sosyal bağlantı ve etkileşim

**Teknik Detaylar:**
- **Database:** PostgreSQL (Supabase) - `friend_challenges` tablosu
- **Real-time Notifications:** Supabase Realtime channels
- **Browser Notifications:** Web Push API
- **AI Question Generation:** Her challenge için 5 yeni soru üretir
- **Score Tracking:** Doğru sayısı + süre takibi
- **Challenge States:** pending → accepted → completed

**Sponsor Fırsatı:**
- 💰 "Challenge Arena Sponsored by [Sponsor]" branding
- 🏆 "Daily Challenge Champion powered by [Sponsor]"
- 📊 Günlük 50+ challenge kullanımı (tahmin)

---

### 3. 💬 Anlık Mesajlaşma Sistemi (1-1 Chat)

**Ne İşe Yarar:**
- Arkadaşlarla birebir mesajlaşma
- Soru paylaşımı, ders çalışma koordinasyonu
- Real-time mesaj bildirimleri

**Nasıl Çalışır:**
- Her arkadaş çifti için unique conversation oluşturulur
- Mesajlar Supabase'de saklanır
- Real-time message delivery (Supabase Realtime)
- Desktop'ta Facebook-style chat widget, mobilde full-page chat

**Kullanıcı Değeri:**
- ✅ Ders arkadaşlarıyla koordinasyon
- ✅ Soru paylaşımı ve tartışma
- ✅ Sosyal öğrenme ortamı

**Teknik Detaylar:**
- **Database:** `conversations`, `messages` tabloları
- **Real-time:** Supabase Realtime subscriptions
- **Notifications:** Browser push + in-app toast
- **UI:** Desktop chat widget (Facebook-style), Mobile full-page

**Sponsor Fırsatı:**
- 💰 Chat area'da sponsored messages
- 📊 Günlük 200+ mesaj trafiği (tahmin)

---

### 4. 🏆 Liderlik Tablosu (Leaderboard)

**Ne İşe Yarar:**
- Öğrenciler XP kazanarak sıralamada yükselir
- Lig sistemi: Bronz, Gümüş, Altın, Platin, Elmas
- Haftalık, aylık ve tüm zamanlar sıralaması

**Nasıl Çalışır:**
- Her quiz/challenge/görev tamamlandığında XP kazanılır
- XP'ye göre otomatik lig ataması
- Leaderboard lig bazlı filtrelenebilir ([Tümü] / [Ligim])
- Real-time güncellemeler

**Kullanıcı Değeri:**
- ✅ Rekabetçi motivasyon
- ✅ İlerleme takibi
- ✅ Başarı hissi
- ✅ Sosyal karşılaştırma

**Teknik Detaylar:**
- **Lig Sistemi:** Bronz (0-999 XP), Gümüş (1000-2499), Altın (2500-4999), vb.
- **Ranking Algorithm:** Total XP bazlı sıralama
- **Caching:** React Query ile optimize edilmiş data fetching

**Sponsor Fırsatı:**
- 💰 "Leaderboard Presented by [Sponsor]" branding
- 🎁 Haftalık/Aylık ödüller sponsor tarafından
- 📊 Her kullanıcı günde ortalama 3-5 kez kontrol eder

---

### 5. ⚡ Gamification Sistemi

**5.1. XP (Experience Points)**
- Quiz tamamla → XP kazan
- Zorluğa göre değişken XP (Kolay: 10, Orta: 20, Zor: 30, Deneme: 50)
- Günlük görevler tamamla → Bonus XP
- Level sistemi (XP/100 = Level)

**5.2. ❤️ Kalpler (Lives System)**
- Her quiz için 1 kalp harcanır
- 5 kalp maksimum (Free kullanıcılar)
- 30 dakikada 1 kalp otomatik yenilenir
- Reklam izleyerek kalp kazanma
- Premium kullanıcılar sınırsız kalp

**5.3. 🔥 Streak (Gün Sayacı)**
- Her gün giriş yap → Streak artar
- 7 gün streak → Bonus XP ve kalp
- 30 gün streak → Özel rozet
- Streak Freeze özelliği (1 gün boşsa streak kırılmaz)

**5.4. 🏅 Rozetler (Badges)**
- İlk Quiz → "Başlangıç" rozeti
- 10 Quiz → "Çalışkan" rozeti
- 50 Quiz → "Uzman" rozeti
- 7 gün streak → "Kararlı" rozeti
- 100% doğru quiz → "Mükemmel" rozeti

**5.5. 🎯 Günlük Görevler (Daily Tasks)**
- 3 quiz tamamla → 50 XP
- 5 doğru cevap ver → 30 XP
- AI Coach'a 1 soru sor → 20 XP
- 1 arkadaşla chat yap → 10 XP

**Sponsor Fırsatı:**
- 💰 "Daily Tasks Powered by [Sponsor]"
- 🎁 Özel rozetler sponsor markası ile
- 📊 Günlük 80%+ kullanıcı engagement

---

### 6. 📚 Stage-Based Learning Path (Aşamalı Öğrenme)

**Ne İşe Yarar:**
- Her konu 4 aşamada öğrenilir: Öğren → Kolay → Orta → Zor → Deneme
- Adım adım ilerleme sistemi
- Her aşama tamamlanınca bir sonraki açılır

**Nasıl Çalışır:**
1. **Öğren:** AI generated ders anlatımı (TopicLesson)
2. **Kolay:** Temel seviye sorular
3. **Orta:** Orta seviye sorular
4. **Zor:** Zor sorular
5. **Deneme:** Mix sorular (gerçek sınav simülasyonu)

**Kullanıcı Değeri:**
- ✅ Kademeli zorluk artışı
- ✅ Sağlam temel oluşturma
- ✅ Başarı hissi (her aşamada)
- ✅ Yapılandırılmış öğrenme

**Teknik Detaylar:**
- **Progress Tracking:** `stage_progress` tablosu
- **Unlocking Logic:** Her aşama %70+ doğrulukla tamamlanmalı
- **AI Content Generation:** Her konu için otomatik ders oluşturur

---

### 7. 📖 Kelime Ezber (Vocabulary)

**Ne İşe Yarar:**
- İngilizce kelime öğrenme ve tekrar sistemi
- Spaced repetition algoritması
- Kelime kartları (flashcards)

**Nasıl Çalışır:**
- Kelime setleri (LGS müfredatına uygun)
- Öğren → Tekrar et → Test et döngüsü
- Öğrenilen kelimeleri takip eder

**Kullanıcı Değeri:**
- ✅ İngilizce kelime dağarcığı geliştirme
- ✅ Bilimsel öğrenme metodu (spaced repetition)
- ✅ İlerleme takibi

---

### 8. 📝 Deneme Sınavları (Mock Exam)

**Ne İşe Yarar:**
- Gerçek LGS formatında deneme sınavları
- Süre sınırlı (120 dakika)
- Tüm derslerden sorular

**Nasıl Çalışır:**
- Türkçe: 40 soru
- Matematik: 20 soru
- Fen Bilimleri: 20 soru
- İnkılap Tarihi: 10 soru
- Din Kültürü: 10 soru
- İngilizce: 10 soru
- TOPLAM: 110 soru, 120 dakika

**Kullanıcı Değeri:**
- ✅ Gerçek sınav deneyimi
- ✅ Zaman yönetimi pratiği
- ✅ Eksik konuları belirleme
- ✅ Sınav stresi azaltma

---

### 9. 👥 Arkadaş Sistemi (Friends)

**Ne İşe Yarar:**
- Arkadaş ekleme (kullanıcı adı veya arkadaşlık kodu ile)
- Arkadaş listesi görüntüleme
- Arkadaş istatistikleri (level, XP, rozetler)

**Nasıl Çalışır:**
- Her kullanıcı unique arkadaşlık kodu alır
- Arkadaş isteği gönder/kabul et/reddet
- Arkadaşlarla challenge, chat, leaderboard karşılaştırması

**Kullanıcı Değeri:**
- ✅ Sosyal öğrenme ortamı
- ✅ Motivasyon artırıcı
- ✅ Birlikte ilerleme

**Teknik Detaylar:**
- **Database:** `friendships` tablosu
- **States:** pending → accepted
- **Search:** Username veya 8 haneli kod ile arama
- **RPC Functions:** UUID casting için custom database fonksiyonları

---

### 10. 🔔 Bildirim Sistemi (Notifications)

**Ne İşe Yarar:**
- Challenge bildirimleri
- Chat mesaj bildirimleri
- Başarı bildirimleri (rozet kazanma vb.)
- Günlük görev hatırlatmaları

**Nasıl Çalışır:**
- **Browser Push:** Web Push API ile tarayıcı bildirimleri
- **In-App Toast:** Sonner library ile uygulama içi bildirimler
- **Real-time:** Supabase Realtime channels ile anında bildirim

**Kullanıcı Değeri:**
- ✅ Anında haberdar olma
- ✅ Engagement artırıcı
- ✅ FOMO (Fear of Missing Out) etkisi

**Teknik Detaylar:**
- **Web Push API:** Browser native notifications
- **Supabase Realtime:** WebSocket bazlı real-time updates
- **Custom Events:** Window events ile component iletişimi

---

### 11. 💎 Premium/Plus Sistemi

**Free Plan:**
- ❤️ 5 kalp (30 dk regeneration)
- 🤖 Günde 5 AI Coach sorusu
- 🎮 Sınırlı challenge (günde 3)
- 📊 Temel istatistikler

**Plus Plan:**
- ✅ Sınırsız kalp
- ✅ Sınırsız AI Coach
- ✅ Sınırsız challenge
- ✅ Gelişmiş istatistikler
- ✅ Özel rozetler
- ✅ Reklamsız deneyim
- ✅ Öncelikli destek

**Kullanıcı Değeri:**
- ✅ Kesintisiz öğrenme
- ✅ Premium özelliklere erişim
- ✅ Hızlı ilerleme

**Teknik Detaylar:**
- **Subscription Table:** `subscriptions` tablosu
- **Plan Types:** free, plus, premium
- **Feature Gating:** Component seviyesinde premium kontrolleri

**Sponsor Fırsatı:**
- 💰 "Plus Plan Sponsored by [Sponsor]" - İlk ay ücretsiz
- 📊 %10-15 conversion rate hedefi

---

### 12. 📅 Çalışma Planı (Study Plan)

**Ne İşe Yarar:**
- LGS sınav tarihine göre otomatik plan oluşturur
- Günlük hedef XP belirler
- Günlük/Haftalık tamamlanması gereken konu sayısı

**Nasıl Çalışır:**
- Sınav tarihi gir (örn: 7 Haziran 2026)
- Toplam konu sayısı: 63 ünite
- Kalan gün hesapla
- Günlük tamamlanması gereken konu = 63 / kalan_gün

**Kullanıcı Değeri:**
- ✅ Yapılandırılmış çalışma
- ✅ Zamanında bitirme garantisi
- ✅ Stres azaltma

---

### 13. 🎲 Günlük Öneri (Today's Plan)

**Ne İşe Yarar:**
- AI bazlı kişiselleştirilmiş konu önerisi
- Zayıf konuları önceliklendirir
- Günlük çeşitlilik sağlar

**Nasıl Çalışır:**
- Kullanıcı performansını analiz eder
- En az doğru yapılan konuları belirler
- Günlük 3-5 konu önerir

**Kullanıcı Değeri:**
- ✅ Kişiselleştirilmiş öğrenme
- ✅ Zayıf konuları güçlendirme
- ✅ Karar verme yükünü azaltma

---

### 14. 🔬 Deney Simülasyonları (Experiments)

**Ne İşe Yarar:**
- Fen Bilimleri deneyleri sanal ortamda yapma
- İnteraktif deney adımları
- Sonuç gözlemleme ve öğrenme

**Nasıl Çalışır:**
- Her fen konusu için ilgili deney
- Adım adım deney yapma
- Sonuçları gözlemleme
- Quiz ile pekiştirme

**Kullanıcı Değeri:**
- ✅ Görsel öğrenme
- ✅ Pratik deneyim
- ✅ Laboratuvar eksiğini giderme

---

### 15. 👤 Profil ve İstatistikler

**Profil Özellikleri:**
- Avatar ve kullanıcı adı
- Level ve XP gösterimi
- Rozet koleksiyonu
- Streak bilgisi
- Toplam çözülen soru sayısı
- En iyi performans konuları
- Zayıf konular listesi

**İstatistikler:**
- Günlük/Haftalık/Aylık XP grafiği
- Konu bazlı başarı oranları
- Challenge kazanma oranı
- Toplam çalışma süresi
- Süreklilik grafiği (streak chart)

**Kullanıcı Değeri:**
- ✅ İlerleme görselleştirme
- ✅ Motivasyon artırıcı
- ✅ Güçlü/zayıf analizi

---

## 🛠️ Teknik Altyapı

### Frontend
- **Framework:** React 18 + TypeScript
- **Styling:** TailwindCSS + shadcn/ui
- **State Management:** React Query (TanStack Query)
- **Routing:** React Router v6
- **Forms:** React Hook Form
- **Animations:** Framer Motion, Canvas Confetti

### Backend
- **Database:** PostgreSQL (Supabase)
- **Authentication:** Supabase Auth
- **Real-time:** Supabase Realtime (WebSocket)
- **Edge Functions:** Deno (Supabase Edge Runtime)
- **AI Integration:** Claude 3.5 Sonnet via Lovable AI Gateway

### AI & ML
- **Model:** Claude 3.5 Sonnet (anthropic/claude-3-5-sonnet-20241022)
- **Vision API:** Image-to-text OCR
- **Question Generation:** AI-powered dynamic quiz generation
- **Lesson Generation:** Auto-generated topic explanations

### Infrastructure
- **Hosting:** Vercel (Frontend)
- **Database:** Supabase Cloud
- **CDN:** Vercel Edge Network
- **Analytics:** (Potansiyel: Google Analytics, Mixpanel)

### Security
- **Authentication:** JWT tokens
- **Row Level Security (RLS):** Database seviyesinde veri güvenliği
- **API Rate Limiting:** Edge function seviyesinde
- **CORS:** Controlled cross-origin requests

---

## 📊 Kullanıcı Metrikleri (Potansiyel)

### Engagement Metrikleri
- **Daily Active Users (DAU):** Hedef 500+ (6 ay içinde)
- **Retention Rate:** %60+ (7 günlük)
- **Session Duration:** Ortalama 25-30 dakika
- **Daily Sessions per User:** 2-3 oturum

### Content Metrikleri
- **Quizzes Completed:** 100+ günlük (başlangıç)
- **AI Questions Asked:** 50+ günlük
- **Challenges Created:** 30+ günlük
- **Messages Sent:** 200+ günlük

### Conversion Metrikleri
- **Free to Plus Conversion:** %10-15 hedef
- **Plus ARPU:** ₺50-100/ay (tahmin)

---

## 💰 Sponsor Fırsatları

### 1. Ana Sponsor (₺10,000+/ay)
- ✅ Platform logosu ve ismi tüm sayfalarda
- ✅ "Powered by [Sponsor]" branding
- ✅ Özel rozet ve başarılar sponsor markası ile
- ✅ Plus plan ilk ay ücretsiz (sponsor funded)
- ✅ Aylık detaylı kullanıcı raporu

### 2. Feature Sponsor (₺5,000+/ay)
- ✅ "AI Coach Presented by [Sponsor]"
- ✅ "Challenge Arena Sponsored by [Sponsor]"
- ✅ Özel landing page sponsor için
- ✅ Haftalık kullanıcı metrikleri

### 3. Challenge Sponsor (₺3,000+/ay)
- ✅ Haftalık/Aylık challenge turnuvaları
- ✅ Kazananlara sponsor ürün/hizmet ödülleri
- ✅ Turnuva sayfasında branding

### 4. Content Sponsor (₺2,000+/ay)
- ✅ Deneme sınavları sponsor markası ile
- ✅ "Mock Exam by [Sponsor]"
- ✅ Sınav sonuç sayfasında banner

### 5. Community Sponsor (₺1,000+/ay)
- ✅ Chat area'da sponsored messages
- ✅ Arkadaşlık sistemi branding
- ✅ Community etkinlikleri

---

## 🎯 Hedef Kitle Profili

### Demografik
- **Yaş:** 13-14 yaş (8. sınıf)
- **Coğrafya:** Türkiye
- **Eğitim:** İlköğretim son sınıf
- **Ekonomik Durum:** Orta-üst gelir aileler (Premium potansiyeli)

### Davranışsal
- **Teknoloji Kullanımı:** Yüksek (dijital yerliler)
- **Mobil Kullanım:** %80+ mobil, %20 desktop
- **Günlük Aktif Süre:** 30-60 dakika (tahmin)
- **Sosyal Özellik İlgisi:** Yüksek (arkadaşlarla yarışma)

### Motivasyonlar
- 🎯 LGS'de yüksek puan alma
- 🏆 Arkadaşlarıyla yarışma
- 🎮 Oyunlaştırılmış öğrenme
- 📱 Mobil erişim kolaylığı

---

## 📈 Büyüme Stratejisi

### Kısa Vade (0-3 Ay)
1. ✅ Beta kullanıcıları ile test
2. ✅ Temel özellikleri stablize etme
3. ✅ SEO optimizasyonu
4. ✅ Sosyal medya kampanyaları
5. ✅ İlk 500 kullanıcı hedefi

### Orta Vade (3-6 Ay)
1. ✅ Okul ortaklıkları
2. ✅ Influencer işbirlikleri (eğitim YouTuber'ları)
3. ✅ Google/Facebook Ads
4. ✅ 5,000 kullanıcı hedefi
5. ✅ Premium plan lansmanı

### Uzun Vade (6-12 Ay)
1. ✅ 50,000+ kullanıcı hedefi
2. ✅ Franchise model (diğer sınavlar: YKS, KPSS)
3. ✅ B2B satış (okullar, dershaneler)
4. ✅ Uluslararası pazar (Azerbaycan, KKTC vb.)

---

## 🤝 İşbirliği Modelleri

### Model 1: Doğrudan Sponsorluk
- Aylık sabit ödeme
- Platform genelinde görünürlük
- Kullanıcı metriklerine erişim

### Model 2: Revenue Share
- Toplam gelirin %X'i sponsor payı
- Uzun vadeli ortaklık
- Büyüme ile birlikte artan getiri

### Model 3: Ürün/Hizmet Entegrasyonu
- Sponsor'un eğitim ürünleri platformda
- Çapraz promosyon
- Win-win işbirliği

### Model 4: Etkinlik Sponsorluğu
- Aylık challenge turnuvaları
- Kazananlara sponsor ürünleri
- Kampanya bazlı işbirliği

---

## 📞 İletişim

**Proje Sahibi:** İsmet Muhammet Ceber
**E-posta:** ismetceberr@gmail.com
**Website:** https://lgscalis.com.tr
**Demo:** https://lgscalis.com.tr
**Telefon:** [Telefon numaranızı ekleyebilirsiniz]

---

## 📎 Ekler

### Ekler Listesi (Hazırlanabilir)
1. Kullanıcı Akış Diyagramları
2. Ekran Görüntüleri (Screenshots)
3. Video Demo
4. Teknik Mimari Dökümanı
5. Finansal Projeksiyonlar
6. Kullanıcı Testimonials (Beta kullanıcılardan)

---

**Son Güncelleme:** 7 Şubat 2026
**Versiyon:** 1.0
**Durum:** Aktif Geliştirme, Sponsor Arayışında

---

## 🌟 Neden Bu Platforma Sponsor Olmalı?

1. **📈 Büyüyen Pazar:** Türkiye'de yılda ~1 milyon öğrenci LGS'ye giriyor
2. **🎯 Hedefli Kitle:** Tam olarak eğitim odaklı, aktif öğrenciler
3. **💡 İnovatif Yaklaşım:** AI + Gamification + Sosyal öğrenme
4. **📱 Modern Platform:** Mobil-first, kullanıcı dostu arayüz
5. **🚀 Hızlı Büyüme Potansiyeli:** Viral özellikler (arkadaş sistemi, challenges)
6. **💰 Monetizasyon Potansiyeli:** Premium plan + reklam geliri
7. **🤝 Uzun Vadeli Ortaklık:** Sadece sponsorluk değil, büyüme ortağı
8. **📊 Ölçülebilir ROI:** Detaylı analytics ve raporlama

---

**Sponsorluk görüşmesi için lütfen iletişime geçin!** 🎓
