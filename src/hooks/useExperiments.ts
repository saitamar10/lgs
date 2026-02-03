import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ExperimentStep {
  id: number;
  type: 'intro' | 'materials' | 'procedure' | 'observation' | 'conclusion';
  title: string;
  content: string;
  image?: string;
  safety?: string;
}

export interface Experiment {
  id: string;
  unit_id: string;
  title: string;
  description: string;
  steps: ExperimentStep[];
  materials: string[];
  safety_notes?: string;
  created_at: string;
}

// Get experiment by unit_id
export function useExperiment(unitId: string | undefined) {
  return useQuery({
    queryKey: ['experiment', unitId],
    queryFn: async () => {
      if (!unitId) return null;

      const { data, error } = await supabase
        .from('experiments')
        .select('*')
        .eq('unit_id', unitId)
        .single();

      if (error) {
        // If no experiment found, return placeholder
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return data as Experiment;
    },
    enabled: !!unitId,
  });
}

// Get all experiments for a subject
export function useExperimentsBySubject(subjectId: string | undefined) {
  return useQuery({
    queryKey: ['experiments', 'subject', subjectId],
    queryFn: async () => {
      if (!subjectId) return [];

      const { data, error } = await supabase
        .from('experiments')
        .select(`
          *,
          units!inner(subject_id)
        `)
        .eq('units.subject_id', subjectId);

      if (error) throw error;

      return data as Experiment[];
    },
    enabled: !!subjectId,
  });
}

// Detailed experiment generator based on subject and unit
export function generatePlaceholderExperiment(unitName: string, subjectName: string): ExperimentStep[] {
  const unitLower = unitName.toLowerCase();
  const subjectLower = subjectName.toLowerCase();

  // FEN BİLİMLERİ DENEYLERİ
  if (subjectLower.includes('fen')) {
    // Fotosentez
    if (unitLower.includes('fotosentez') || unitLower.includes('bitki')) {
      return [
        {
          id: 0,
          type: 'intro',
          title: 'Fotosentez Deneyi',
          content: `Bitkilerin nasıl besin ürettiğini gözlemleyeceğiz! Bu deneyde, bitkilerin ışık kullanarak karbondioksit ve suyu glikoza dönüştürdüğünü göreceğiz.`,
        },
        {
          id: 1,
          type: 'materials',
          title: 'Gerekli Malzemeler',
          content: `• Saksı bitkisi (1 adet)
• Alüminyum folyo
• Makas
• Su
• Güneşli bir pencere
• 3-4 gün süre`,
          safety: 'Makası kullanırken dikkatli ol. Bitkilere zarar vermemeye özen göster.',
        },
        {
          id: 2,
          type: 'procedure',
          title: 'Deney Adımları',
          content: `1. Saksı bitkisinin yapraklarından birini seç (yeşil, sağlıklı bir yaprak)

2. Yaprağın yarısını alüminyum folyoyla kapat (ışık almasını engellemek için)

3. Bitkiyi güneşli bir pencereye koy

4. 3-4 gün boyunca bitkiye düzenli su ver

5. 4. günün sonunda alüminyum folyoyu aç

6. Kapalı kalan kısım ile açıkta kalan kısmı karşılaştır`,
        },
        {
          id: 3,
          type: 'observation',
          title: 'Ne Gözlemliyorsun?',
          content: `📝 Gözlemler:

• Işık alan kısım: Yaprak yeşil rengini korudu, canlı görünüyor

• Karanlıkta kalan kısım: Yaprak sararıyor veya soluk renkte

• Neden? Işık olmadan fotosentez gerçekleşemez, dolayısıyla klorofil üretilmez

💡 Önemli Not:
Bitkilerin ışığa ihtiyacı var çünkü fotosentez için ışık enerjisi şart! Işık olmadan bitki besin üretemez.`,
        },
        {
          id: 4,
          type: 'conclusion',
          title: 'Sonuç ve Öğrendiklerimiz',
          content: `🎯 Bu Deneyde Öğrendiklerimiz:

✅ Bitkiler fotosentez için ışığa ihtiyaç duyar
✅ Işık olmadan klorofil üretimi durur
✅ Fotosentez denklemi: Işık + CO₂ + H₂O → Glikoz + O₂
✅ Yeşil yapraklardaki klorofil, ışık enerjisini yakalar

🌱 Gerçek Hayatta:
Evdeki bitkilerin pencere kenarında durmasının sebebi budur! Işık olmadan bitkiler besin üretemez ve ölür.`,
        },
      ];
    }

    // Elektrik Devreleri
    if (unitLower.includes('elektrik') || unitLower.includes('devre') || unitLower.includes('ampul')) {
      return [
        {
          id: 0,
          type: 'intro',
          title: 'Basit Elektrik Devresi',
          content: `Elektrik nasıl çalışır? Kendi elektrik devreni yaparak ampulü yakmayı öğreneceksin!`,
        },
        {
          id: 1,
          type: 'materials',
          title: 'Gerekli Malzemeler',
          content: `• 1.5V AA pil (2 adet)
• Küçük ampul (1.5-3V)
• İzole edilmiş bakır tel (50 cm)
• Makas
• Bant`,
          safety: '⚠️ Sadece 1.5V pil kullan! Daha yüksek voltaj tehlikeli olabilir. Tellerin ucunu kesmeden önce pilin bağlı olmadığından emin ol.',
        },
        {
          id: 2,
          type: 'procedure',
          title: 'Deney Adımları',
          content: `1. Bakır teli 3 parçaya böl (her biri 15-20 cm)

2. Tellerin uçlarındaki izoleleri soy (1-2 cm)

3. İlk telin bir ucunu pilin (+) kutbuna bağla

4. Aynı telin diğer ucunu ampulün metal kısmına dokun

5. İkinci teli pilin (-) kutbuna bağla

6. İkinci telin diğer ucunu ampulün alt kısmına dokun

7. Ampul yanıyor mu? Gözlemle!

8. BONUS: İkinci pili ekleyerek devreyi güçlendir`,
        },
        {
          id: 3,
          type: 'observation',
          title: 'Gözlemler',
          content: `💡 Ne Oldu?

Devre tamamlandığında:
• Ampul yandı ✅
• Işık verdi
• Teller hafif ısındı

Devre kesildiğinde:
• Ampul söndü
• Işık kayboldu

🔬 Bilimsel Açıklama:
Elektrik akımı, (+) kutuptan (-) kutuba doğru akar. Devre kapalı olduğunda (tüm bağlantılar yapıldığında) elektronlar hareket eder ve ampul yanar.

Devre açıksa → Akım yok → Ampul yanmaz`,
        },
        {
          id: 4,
          type: 'conclusion',
          title: 'Sonuç',
          content: `🎯 Öğrendiklerimiz:

✅ Elektrik devresi: Enerji kaynağı + iletken + tüketici
✅ Kapalı devre: Akım akar, ampul yanar
✅ Açık devre: Akım akmaz, ampul yanmaz
✅ İletkenler: Metallerin elektriği ilettiği

💡 Gerçek Hayatta:
Evdeki her anahtar, devreyi açıp kapatır! Işık düğmesine bastığında devre kapanır ve ampul yanar. Kapatınca devre açılır.`,
        },
      ];
    }

    // Maddenin Halleri
    if (unitLower.includes('madde') || unitLower.includes('hal') || unitLower.includes('katı')) {
      return [
        {
          id: 0,
          type: 'intro',
          title: 'Maddenin Halleri Deneyi',
          content: `Maddenin katı, sıvı ve gaz hallerini gözlemleyeceğiz! Su kullanarak maddenin 3 halini de göreceğiz.`,
        },
        {
          id: 1,
          type: 'materials',
          title: 'Gerekli Malzemeler',
          content: `• Plastik kap (2 adet)
• Su
• Buzdolabı (dondurucu)
• Tencere
• Ocak (yetişkin gözetiminde!)
• Termometre (varsa)`,
          safety: '⚠️ ÇOK ÖNEMLİ: Ocağı mutlaka bir yetişkinle kullan! Kaynar su çok tehlikelidir.',
        },
        {
          id: 2,
          type: 'procedure',
          title: 'Deney Adımları',
          content: `ADIM 1 - SIVI HAL:
1. Bir kaba normal musluk suyu koy
2. Kabın şeklini değiştir → Su kabın şeklini alır

ADIM 2 - KATI HAL:
3. Suyu buzdolabının donducuruna koy
4. 4-5 saat bekle
5. Çıkar → Buz (katı halde) oluştu!
6. Buzun şeklini değiştirmeye çalış → Değişmez!

ADIM 3 - GAZ HAL:
7. Yetişkinle birlikte suyu tencerede kaynat
8. Tencerenin üstünden çıkan buharı gözlemle
9. Buhar havaya karışıyor → Gaz hali!`,
        },
        {
          id: 3,
          type: 'observation',
          title: 'Gözlemler',
          content: `📊 Maddenin 3 Hali:

KATI HAL (BUZ):
• Şekli sabit
• Hacmi sabit
• Moleküller çok yakın, hareket etmez

SIVI HAL (SU):
• Şekli değişken (kabın şeklini alır)
• Hacmi sabit
• Moleküller az hareketli

GAZ HAL (BUHAR):
• Şekli değişken
• Hacmi değişken (her yere yayılır)
• Moleküller çok hareketli

🌡️ Sıcaklık Etkisi:
Sıcaklık arttıkça moleküller hızlanır ve madde hal değiştirir!`,
        },
        {
          id: 4,
          type: 'conclusion',
          title: 'Sonuç',
          content: `🎯 Öğrendiklerimiz:

✅ Maddenin 3 hali vardır: Katı, Sıvı, Gaz
✅ Isı alınca: Katı → Sıvı → Gaz (erime, buharlaşma)
✅ Isı verinçe: Gaz → Sıvı → Katı (yoğunlaşma, donma)
✅ Aynı madde farklı hallerde olabilir (H₂O: buz, su, buhar)

🌍 Doğada:
• Kar yağışı: Bulutlardaki su buharı donarak kar oluşur
• Yağmur: Buhar yoğunlaşarak sıvı hale geçer
• Deniz buharlaşması: Güneşin ısısıyla su buhar olur`,
        },
      ];
    }
  }

  // MATEMATİK AKTİVİTELERİ
  if (subjectLower.includes('matematik')) {
    if (unitLower.includes('kesir') || unitLower.includes('bölme')) {
      return [
        {
          id: 0,
          type: 'intro',
          title: 'Kesirlerle Tanışalım',
          content: `Kesirleri pizza ile öğreneceğiz! Gerçek hayatta kesirlerin nasıl kullanıldığını göreceğiz.`,
        },
        {
          id: 1,
          type: 'materials',
          title: 'Gerekli Malzemeler',
          content: `• Kağıt (3-4 yaprak)
• Makas
• Renkli kalemler
• Cetvel`,
          safety: 'Makası dikkatli kullan. Parmaklarını kesmemeye özen göster.',
        },
        {
          id: 2,
          type: 'procedure',
          title: 'Aktivite Adımları',
          content: `PIZZA MODELİ:

1. Kağıda büyük bir daire çiz (pizza)

2. Pizzayı 4 eşit parçaya böl (kesme hatları çiz)

3. Parçaları renklendir:
   - 1 parça: Kırmızı
   - 2 parça: Mavi
   - 1 parça: Yeşil

4. Sorular:
   • Kırmızı parça pizzanın kaçta kaçı? (1/4)
   • Mavi parçalar toplam kaçta kaç? (2/4 = 1/2)
   • Yeşil parça kaçta kaç? (1/4)

5. İkinci pizza çiz ve 8 parçaya böl

6. Karşılaştır: 1/4 ve 2/8 eşit mi?`,
        },
        {
          id: 3,
          type: 'observation',
          title: 'Gözlemler',
          content: `🍕 Kesir Nedir?

Kesir = Parça / Bütün

Örnekler:
• 1/4 = 1 parça / 4 eşit parça
• 2/4 = 2 parça / 4 eşit parça
• 3/4 = 3 parça / 4 eşit parça

📊 Eşdeğer Kesirler:
1/2 = 2/4 = 4/8
(Aynı büyüklük, farklı gösterim)

💡 Gerçek Hayat:
• Pizza dilimi: 1 dilim / 8 dilim = 1/8
• Sınıf: 15 kız / 30 öğrenci = 15/30 = 1/2
• Zaman: 30 dakika / 60 dakika = 1/2 saat`,
        },
        {
          id: 4,
          type: 'conclusion',
          title: 'Sonuç',
          content: `🎯 Öğrendiklerimiz:

✅ Kesir: Bütünün eşit parçalarından birini gösterir
✅ Pay: Üstteki sayı (kaç parça aldık)
✅ Payda: Alttaki sayı (kaç parçaya böldük)
✅ Eşdeğer kesirler: Aynı miktarı farklı şekilde yazmak

🎓 LGS'de Kesirler:
Kesirler LGS matematikte çok önemli! Toplama, çıkarma, çarpma ve karşılaştırma sorularında kullanılır.`,
        },
      ];
    }

    if (unitLower.includes('alan') || unitLower.includes('çevre') || unitLower.includes('geometri')) {
      return [
        {
          id: 0,
          type: 'intro',
          title: 'Alan ve Çevre Keşfi',
          content: `Odandaki eşyaları ölçerek alan ve çevre kavramlarını öğreneceksin!`,
        },
        {
          id: 1,
          type: 'materials',
          title: 'Gerekli Malzemeler',
          content: `• Mezura veya cetvel
• Kağıt ve kalem
• Dikdörtgen bir masa
• Kare şeklinde bir nesne (kitap, kutu vb.)`,
        },
        {
          id: 2,
          type: 'procedure',
          title: 'Aktivite Adımları',
          content: `1. MASANIN ÇEVRESİNİ ÖLÇ:
   - Uzun kenar: ... cm
   - Kısa kenar: ... cm
   - Çevre = (Uzun + Kısa) × 2

2. MASANIN ALANINI HESAPLA:
   - Alan = Uzun kenar × Kısa kenar

3. KİTABIN ÖLÇÜLERİNİ AL:
   - Bir kenar: ... cm
   - Çevre = 4 × kenar
   - Alan = kenar × kenar

4. KARŞILAŞTIR:
   Hangi nesnenin alanı daha büyük?`,
        },
        {
          id: 3,
          type: 'observation',
          title: 'Gözlemler',
          content: `📐 Alan vs Çevre:

ÇEVRE:
• Şeklin dış çizgisinin uzunluğu
• Birim: cm, m, km
• Dikdörtgen: 2(a+b)
• Kare: 4a

ALAN:
• Şeklin kapladığı yüzey
• Birim: cm², m², km²
• Dikdörtgen: a × b
• Kare: a × a

💡 Fark:
• Çevre: Etrafını çevirsen ne kadar yol?
• Alan: İçini boyasan kaç kağıt?`,
        },
        {
          id: 4,
          type: 'conclusion',
          title: 'Sonuç',
          content: `🎯 Öğrendiklerimiz:

✅ Çevre: Kenarların toplamı
✅ Alan: İç kısmın büyüklüğü
✅ Farklı şekiller, farklı formüller
✅ Birimler çok önemli! (cm, cm²)

🏡 Gerçek Hayatta:
• Bahçeye çit çekmek: Çevre hesabı
• Odaya halı almak: Alan hesabı
• Duvar boyamak: Alan hesabı
• Çerçeve almak: Çevre hesabı`,
        },
      ];
    }
  }

  // TÜRKÇE AKTİVİTELERİ
  if (subjectLower.includes('türkçe') || subjectLower.includes('dil')) {
    return [
      {
        id: 0,
        type: 'intro',
        title: 'Kelime Hazineni Genişlet',
        content: `Eş anlamlı, zıt anlamlı kelimeler ve deyimlerle Türkçe becerini geliştireceksin!`,
      },
      {
        id: 1,
        type: 'materials',
        title: 'Gerekli Malzemeler',
        content: `• Kağıt ve kalem
• Renkli kalemler
• Gazete veya dergi (isteğe bağlı)
• Sözlük (varsa)`,
      },
      {
        id: 2,
        type: 'procedure',
        title: 'Aktivite Adımları',
        content: `1. KELİME AVLAMA:
   Bir hikaye metni seç, içinden 10 kelime bul

2. EŞ ANLAMLI KELİMELER:
   Her kelime için en az 1 eş anlamlı yaz
   Örnek: Mutlu → Sevinçli, neşeli

3. ZIT ANLAMLI KELİMELER:
   Her kelime için zıt anlamlısını bul
   Örnek: Mutlu ↔ Üzgün

4. CÜMLE KURMA:
   Her kelimeyle bir cümle kur

5. DEYİM ÖĞREN:
   3 yeni deyim öğren ve cümlelerde kullan`,
      },
      {
        id: 3,
        type: 'observation',
        title: 'Gözlemler',
        content: `📚 Kelime Çeşitleri:

EŞ ANLAMLI:
• Güzel = Hoş, zarif, sevimli
• Hızlı = Çabuk, seri
• Bakmak = Gözetmek, seyretmek

ZIT ANLAMLI:
• Güzel ↔ Çirkin
• Hızlı ↔ Yavaş
• Aydınlık ↔ Karanlık

DEYİMLER:
• Burnundan kıl aldırmamak = Kibirli olmak
• Dört gözle beklemek = Sabırsızlıkla beklemek
• Taş çatlasa = En fazla

💡 İpucu: Her gün 5 yeni kelime öğren!`,
      },
      {
        id: 4,
        type: 'conclusion',
        title: 'Sonuç',
        content: `🎯 Öğrendiklerimiz:

✅ Zengin kelime hazinesi = Güçlü Türkçe
✅ Eş anlamlı kelimeler metni zenginleştirir
✅ Zıt anlamlı kelimeler karşıtlık bildirir
✅ Deyimler anlatımı güzelleştirir

📖 LGS Türkçe İçin:
• Paragraf sorularında kelime bilgisi şart
• Anlam ilişkileri sıkça soruluyor
• Deyimler ve atasözleri önemli`,
      },
    ];
  }

  // SOSYAL BİLGİLER AKTİVİTESİ
  if (subjectLower.includes('sosyal')) {
    return [
      {
        id: 0,
        type: 'intro',
        title: 'Türkiye Haritası Keşfi',
        content: `Türkiye'nin coğrafi bölgelerini ve il haritasını öğreneceğiz!`,
      },
      {
        id: 1,
        type: 'materials',
        title: 'Gerekli Malzemeler',
        content: `• Türkiye haritası (çıktı veya internet)
• Renkli kalemler
• Kağıt
• İnternet bağlantısı (araştırma için)`,
      },
      {
        id: 2,
        type: 'procedure',
        title: 'Aktivite Adımları',
        content: `1. 7 BÖLGEYİ RENKLE:
   Her coğrafi bölgeyi farklı renkle boya

2. İLLERİ YAZ:
   Her bölgede hangi iller var? Yaz

3. ARAŞTIR:
   Her bölgenin:
   • İklimi
   • Önemli şehirleri
   • Tarım ürünleri
   • Turistik yerleri

4. KENDİ BÖLGENİ TANI:
   Yaşadığın bölge hakkında daha detaylı bilgi topla`,
      },
      {
        id: 3,
        type: 'observation',
        title: 'Gözlemler',
        content: `🗺️ Türkiye'nin 7 Bölgesi:

1. Marmara Bölgesi
   İller: İstanbul, Bursa, Kocaeli...
   İklim: Ilıman

2. Ege Bölgesi
   İller: İzmir, Manisa, Aydın...
   Ürünler: Zeytin, üzüm

3. Akdeniz Bölgesi
   İller: Antalya, Mersin, Adana...
   İklim: Akdeniz iklimi

4. İç Anadolu
   İller: Ankara, Konya, Kayseri...
   Ürünler: Buğday

5. Karadeniz
   İller: Trabzon, Samsun, Ordu...
   Ürünler: Fındık, çay

6. Doğu Anadolu
   İller: Erzurum, Van...
   Yüksek dağlar

7. Güneydoğu Anadolu
   İller: Gaziantep, Şanlıurfa...
   Sıcak iklim`,
      },
      {
        id: 4,
        type: 'conclusion',
        title: 'Sonuç',
        content: `🎯 Öğrendiklerimiz:

✅ Türkiye 7 coğrafi bölgeye ayrılır
✅ Her bölgenin kendine özgü iklimi var
✅ Tarım ürünleri iklime göre değişir
✅ 81 ilimiz var

🌍 Neden Önemli?
Coğrafya LGS'de hem Sosyal hem de Fen sorularında kullanılıyor! İklim, bölgeler ve ekonomik faaliyetler önemli konular.`,
      },
    ];
  }

  // GENEL DENEY (Hiçbir kategoriye uymuyorsa)
  return [
    {
      id: 0,
      type: 'intro',
      title: `${unitName} - Keşfet ve Öğren`,
      content: `${unitName} konusunda pratik yaparak öğrenmeye hazır mısın? Bu aktivitede konuyu pekiştireceksin!`,
    },
    {
      id: 1,
      type: 'materials',
      title: 'Hazırlık',
      content: `Bu aktivite için:

• Kağıt ve kalem
• Not defteri
• Konsantrasyon
• Merak

hazır ol!`,
    },
    {
      id: 2,
      type: 'procedure',
      title: 'Öğrenme Adımları',
      content: `1. Konu özeti çıkar:
   ${unitName} konusunun ana başlıklarını not al

2. Örnekler oluştur:
   Konuyla ilgili 5 örnek bul veya yaz

3. Sorular çöz:
   Konuyla ilgili quiz'e geç ve pratik yap

4. Anlamadığın yerleri işaretle:
   Eksik olduğun noktaları belirle

5. Tekrar et:
   Zor gelen kısımları bir daha çalış`,
    },
    {
      id: 3,
      type: 'observation',
      title: 'Değerlendirme',
      content: `✏️ Kendini Test Et:

• Konuyu kendi cümlelerinle anlatabilir misin?
• Örnekler verebiliyor musun?
• Sorulara doğru cevap verebildin mi?

Eğer hepsine "Evet" diyorsan, konuyu öğrenmişsin demektir! 🎉

Hayır varsa, tekrar çalışman gereken yerler var. O kısımları işaretle ve yeniden gözden geçir.`,
    },
    {
      id: 4,
      type: 'conclusion',
      title: 'Tamamla',
      content: `🎯 ${unitName} Konusu Tamamlandı!

Artık bu konuda:
✅ Temel kavramları biliyorsun
✅ Örnekler verebiliyorsun
✅ Sorulara cevap verebiliyorsun

💪 Sonraki Adım:
Quiz'e geç ve bilgini test et! Yüksek puan alırsan bir sonraki zorluk seviyesine geçebilirsin.

Başarılar! 🚀`,
    },
  ];
}
