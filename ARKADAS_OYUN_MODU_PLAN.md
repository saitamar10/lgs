# Arkadaşlarla Oyna Modu - Geliştirme Planı

## ✅ TAMAMLANAN İŞLER

### 1. Basit "Oyna" Butonu
- **Dosya**: `src/pages/FriendsPage.tsx`
- Her arkadaşın yanına 🎮 Gamepad2 ikonu ile "Oyna" butonu eklendi
- Buton sıralaması: **Oyna → Mesaj → Sil**
- **Dosya**: `src/pages/Dashboard.tsx`
- `onPlayWithFriend` prop'u ile basit oyun modu entegre edildi
- Şu an: Rastgele ünite seçiliyor, orta seviye quiz başlatılıyor

### 2. Database Migration Hazır
- **Dosya**: `supabase/migrations/20260207_friend_challenges.sql`
- `friend_challenges` tablosu oluşturuldu
- Özellikler:
  - Challenger ve challenged skorları ayrı ayrı
  - Süre karşılaştırması (time_seconds)
  - Status: pending/accepted/completed/declined
  - RLS policies eklendi

### 3. Challenge Hooks Hazır
- **Dosya**: `src/hooks/useFriendChallenges.ts`
- Hazır fonksiyonlar:
  - `useFriendChallenges()` - Tüm meydan okumaları getir
  - `usePendingChallenges()` - Bekleyen meydan okumaları getir
  - `useCreateChallenge()` - Yeni meydan okuma oluştur
  - `useCompleteChallenge()` - Meydan okumayı tamamla
  - `useAcceptChallenge()` - Meydan okumayı kabul et
  - `useDeclineChallenge()` - Meydan okumayı reddet
  - `getChallengeWinner()` - Kazananı belirle (skor + süre)
  - `formatChallengeTime()` - Süreyi formatla

---

## 🚧 YAPILACAK İŞLER

### ADIM 1: Database Migration Uygula
```bash
# Docker Desktop'ı başlat
# Terminal'de çalıştır:
cd C:\Users\lenovo\Desktop\lgscalis
npx supabase db reset
```

### ADIM 2: Challenge Dialog Bileşeni Oluştur
**Dosya**: `src/components/ChallengeDialog.tsx` (YENİ DOSYA)

**Özellikler:**
- Konu/ünite seçimi
- Zorluk seviyesi seçimi (Kolay/Orta/Zor)
- "Meydan Oku" butonu
- Arkadaş bilgisi gösterimi

**Props:**
```typescript
interface ChallengeDialogProps {
  open: boolean;
  onClose: () => void;
  friendId: string;
  friendName: string;
  onStartChallenge: (unitId: string, unitName: string, subjectName: string, difficulty: ChallengeDifficulty) => void;
}
```

### ADIM 3: Challenge Notification Badge
**Dosya**: `src/pages/FriendsPage.tsx` (GÜNCELLE)

**Eklenecekler:**
- Header'da bildirim badge'i (kaç meydan okuma bekliyorsa)
- `usePendingChallenges()` hook'u kullan
- Badge tıklandığında "Bekleyen Mücadeleler" sekmesi açılsın

### ADIM 4: Challenge Results Dialog
**Dosya**: `src/components/ChallengeResultsDialog.tsx` (YENİ DOSYA)

**Gösterilecekler:**
- İki oyuncunun skorları yan yana
- Süre karşılaştırması
- Kazanan/kaybeden/beraberlik durumu
- Konfeti animasyonu (kazanırsa)
- "Rövanş İste" butonu
- "Tekrar Oyna" butonu

**Props:**
```typescript
interface ChallengeResultsDialogProps {
  open: boolean;
  onClose: () => void;
  challenge: FriendChallenge;
  currentUserId: string;
}
```

### ADIM 5: FriendsPage'e Challenges Tab Ekle
**Dosya**: `src/pages/FriendsPage.tsx` (GÜNCELLE)

**Yeni tab yapısı:**
```
[Arkadaşlarım] [İstekler] [Mücadeleler] <-- YENİ
```

**Mücadeleler sekmesinde:**
- **Bekleyen Mücadeleler** (Bana gönderilmiş, henüz oynamadım)
  - "Oyna" butonu
  - "Reddet" butonu
- **Devam Eden** (Ben gönderdim, karşı taraf henüz oynamadı)
  - "Bekliyor..." durumu
- **Tamamlanan** (Son 10 mücadele)
  - Kazanan/kaybeden göstergesi
  - Skor bilgisi
  - "Sonuçları Gör" butonu

### ADIM 6: Dashboard Challenge Entegrasyonu
**Dosya**: `src/pages/Dashboard.tsx` (GÜNCELLE)

**Quiz tamamlandığında:**
1. Quiz sonucu alındığında challenge mi kontrol et
2. Eğer challenge ise → `useCompleteChallenge()` ile kaydet
3. Challenge results dialog'unu göster

**Challenge başlatma:**
1. `onPlayWithFriend` yerine yeni akış:
   - ChallengeDialog aç
   - Kullanıcı konu/zorluk seçsin
   - Quiz'i başlat
   - Quiz bitince skoru kaydet ve `useCreateChallenge()` çalıştır

### ADIM 7: QuizScreen'e Challenge Modu Ekle
**Dosya**: `src/components/QuizScreen.tsx` (GÜNCELLE)

**Eklenecek props:**
```typescript
challengeMode?: boolean;
challengeId?: string; // Eğer kabul edilen bir challenge ise
```

**Quiz tamamlandığında:**
- Normal mod: Normal `onComplete` çalışır
- Challenge oluşturma modu: `onComplete` + challenge oluştur
- Challenge kabul modu: `onComplete` + challenge'ı tamamla

### ADIM 8: Bildirim Sistemi Entegrasyonu
**Dosya**: `src/hooks/useNotifications.ts` (GÜNCELLE)

**Yeni bildirim türü:**
- "friend_challenge" - Arkadaşın sana meydan okudu
- Bildirime tıklayınca FriendsPage > Mücadeleler sekmesi açılsın

---

## 📋 KULLANIM AKIŞI

### Senaryo 1: Ali, Ayşe'ye Meydan Okuyor

1. **Ali:**
   - Arkadaşlar sayfasında Ayşe'nin yanındaki 🎮 butonuna tıklar
   - ChallengeDialog açılır
   - "Matematik > Çarpma İşlemi > Orta" seçer
   - Quiz başlar, 5 soruyu 8/10 puan alarak 45 saniyede bitirir
   - Quiz bitince otomatik olarak challenge oluşturulur
   - "Meydan okuman Ayşe'ye gönderildi!" mesajı

2. **Ayşe:**
   - Giriş yaptığında bildirim gelir: "Ali sana meydan okudu!"
   - Arkadaşlar sayfasında badge görür (1)
   - Mücadeleler sekmesine girer
   - "Ali - Matematik / Çarpma İşlemi (Orta) - Bekliyor..." görür
   - "Oyna" butonuna tıklar
   - Aynı quiz'i oynar (aynı konu/zorluk)
   - 9/10 puan alır, 50 saniyede bitirir
   - Otomatik olarak results dialog açılır
   - **KAZANAN: Ayşe** (9 > 8 skor)
   - "Rövanş İste" veya "Kapat" seçer

3. **Ali:**
   - Ayşe quiz'i tamamladığında bildirim gelir: "Ayşe mücadeleyi tamamladı!"
   - Mücadeleler > Tamamlanan'dan sonucu görür
   - **Kaybetti** (8 < 9)

---

## 🎨 UI/UX ÖNERİLERİ

### Renk Kodları
- **Bekleyen**: Sarı badge (pending)
- **Kazanan**: Yeşil border + 🏆 (win)
- **Kaybeden**: Kırmızı border (lose)
- **Beraberlik**: Mavi border (tie)

### İkonlar
- 🎮 Gamepad2 - Oyna butonu
- ⏱️ Timer - Süre gösterimi
- 🏆 Trophy - Kazanan
- 🔥 Flame - Rövanş
- ⚔️ Swords - Mücadele badge'i

### Animasyonlar
- Konfeti (kazanınca)
- Pulse animasyonu (bekleyen mücadele badge'inde)
- Slide-in (results dialog)

---

## 🐛 DİKKAT EDİLECEKLER

1. **Aynı sorular çıkmasın**: Her challenge için farklı sorular üret
2. **Süre takibi**: QuizScreen'de timer ekle, başlangıç/bitiş zamanı kaydet
3. **Network hatası**: Challenge oluşturma/tamamlama başarısız olursa kullanıcıya hata göster
4. **Arkadaş değilse**: Sadece arkadaşlar meydan okuyabilsin (kontrol et)
5. **Kalp sistemi**: Challenge oynarken de kalp harcansın mı? (Karar ver)

---

## 📝 TALİMATLAR

### Dönünce bana şöyle talimat ver:

**Örnek 1:**
```
"ARKADAS_OYUN_MODU_PLAN.md dosyasını oku ve ADIM 2'yi yap"
```

**Örnek 2:**
```
"Challenge sistemini tamamla, ADIM 2'den başla tüm adımları yap"
```

**Örnek 3:**
```
"Sadece ADIM 5'i yap - FriendsPage'e Mücadeleler sekmesi ekle"
```

---

## 💡 EK FİKİRLER (İSTEĞE BAĞLI)

- [ ] Challenge geçmişi istatistikleri (kaç kazandın/kaybettin)
- [ ] En çok meydan okunan arkadaş
- [ ] Günlük/haftalık challenge limiti
- [ ] Challenge liderlik tablosu
- [ ] Grup challengeları (3-4 kişi)
- [ ] Hızlı meydan okuma (direkt rastgele konu/zorluk)
- [ ] Challenge kupası/rozeti sistemi

---

**Oluşturulma Tarihi**: 2026-02-07
**Durum**: Database + Hooks hazır, UI bekleniyor
**Öncelik**: Orta-Yüksek
