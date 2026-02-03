-- Clear existing data and add full curriculum
DELETE FROM public.questions;
DELETE FROM public.units;
DELETE FROM public.subjects;

-- Insert all subjects
INSERT INTO public.subjects (name, slug, description, icon, color, order_index) VALUES
('Matematik', 'matematik', 'Sayılar, cebir, geometri ve olasılık', '🔢', 'primary', 1),
('Türkçe', 'turkce', 'Dil bilgisi, anlam ve yazım kuralları', '📚', 'accent', 2),
('Fen Bilimleri', 'fen-bilimleri', 'Fizik, kimya ve biyoloji konuları', '🔬', 'warning', 3),
('T.C. İnkılap Tarihi', 'inkilap-tarihi', 'Atatürk dönemi ve Türkiye Cumhuriyeti', '🏛️', 'info', 4),
('İngilizce', 'ingilizce', 'Gramer, kelime ve okuma anlama', '🌐', 'destructive', 5),
('Din Kültürü', 'din-kulturu', 'İnanç, ibadet ve ahlak', '☪️', 'secondary', 6);

-- MATEMATIK ÜNİTELERİ
INSERT INTO public.units (subject_id, name, slug, description, order_index)
SELECT s.id, u.name, u.slug, u.description, u.order_index
FROM public.subjects s
CROSS JOIN (VALUES
  ('Çarpanlar ve Katlar', 'carpanlar-katlar', 'EBOB, EKOK ve bölünebilme kuralları', 1),
  ('Üslü İfadeler', 'uslu-ifadeler', 'Üslü sayılarla işlemler', 2),
  ('Kareköklü İfadeler', 'karekoklu-ifadeler', 'Kareköklü sayılar ve işlemler', 3),
  ('Veri Analizi', 'veri-analizi', 'İstatistik ve veri yorumlama', 4),
  ('Olasılık', 'olasilik', 'Basit olayların olma olasılığı', 5),
  ('Cebirsel İfadeler ve Özdeşlikler', 'cebirsel-ifadeler', 'Özdeşlikler ve çarpanlara ayırma', 6),
  ('Doğrusal Denklemler', 'dogrusal-denklemler', 'Birinci dereceden denklemler', 7),
  ('Eşitsizlikler', 'esitsizlikler', 'Birinci dereceden eşitsizlikler', 8),
  ('Üçgenler', 'ucgenler', 'Üçgen özellikleri ve alan hesabı', 9),
  ('Eşlik ve Benzerlik', 'eslik-benzerlik', 'Geometrik şekillerde eşlik ve benzerlik', 10),
  ('Dönüşüm Geometrisi', 'donusum-geometrisi', 'Yansıma, öteleme ve dönme', 11),
  ('Geometrik Cisimler', 'geometrik-cisimler', 'Prizmalar, piramitler ve hacim', 12)
) AS u(name, slug, description, order_index)
WHERE s.slug = 'matematik';

-- TÜRKÇE ÜNİTELERİ
INSERT INTO public.units (subject_id, name, slug, description, order_index)
SELECT s.id, u.name, u.slug, u.description, u.order_index
FROM public.subjects s
CROSS JOIN (VALUES
  ('Fiilimsiler', 'fiilimsiler', 'İsim-fiil, sıfat-fiil, zarf-fiil', 1),
  ('Sözcükte Anlam', 'sozcukte-anlam', 'Gerçek, mecaz, yan anlam', 2),
  ('Söz Gruplarında Anlam', 'soz-gruplarinda-anlam', 'Deyim, atasözü, ikileme', 3),
  ('Cümlenin Öğeleri', 'cumlenin-ogeleri', 'Özne, yüklem, nesne, tümleçler', 4),
  ('Söz Sanatları', 'soz-sanatlari', 'Benzetme, kişileştirme, abartma', 5),
  ('Yazım Kuralları', 'yazim-kurallari', 'Büyük harf, bitişik/ayrı yazım', 6),
  ('Noktalama İşaretleri', 'noktalama-isaretleri', 'Virgül, nokta, tırnak işaretleri', 7),
  ('Cümlede Anlam', 'cumlede-anlam', 'Öznel/nesnel, neden-sonuç', 8),
  ('Metin Türleri', 'metin-turleri', 'Hikaye, deneme, makale', 9),
  ('Cümle Türleri', 'cumle-turleri', 'Olumlu/olumsuz, basit/bileşik', 10),
  ('Parçada Anlam', 'parcada-anlam', 'Ana fikir, yardımcı fikir', 11),
  ('Fiilde Çatı', 'fiilde-cati', 'Etken, edilgen, dönüşlü', 12),
  ('Anlatım Bozuklukları', 'anlatim-bozukluklari', 'Yapı ve anlam bozuklukları', 13)
) AS u(name, slug, description, order_index)
WHERE s.slug = 'turkce';

-- FEN BİLİMLERİ ÜNİTELERİ
INSERT INTO public.units (subject_id, name, slug, description, order_index)
SELECT s.id, u.name, u.slug, u.description, u.order_index
FROM public.subjects s
CROSS JOIN (VALUES
  ('Mevsimler ve İklim', 'mevsimler-iklim', 'Dünya''nın hareketleri ve mevsimler', 1),
  ('DNA ve Genetik Kod', 'dna-genetik', 'DNA yapısı ve kalıtım', 2),
  ('Kalıtım', 'kalitim', 'Mendel yasaları ve çaprazlama', 3),
  ('Mutasyon ve Modifikasyon', 'mutasyon-modifikasyon', 'Genetik değişimler', 4),
  ('Biyoteknoloji', 'biyoteknoloji', 'Gen mühendisliği ve uygulamalar', 5),
  ('Basınç', 'basinc', 'Katı, sıvı ve gaz basıncı', 6),
  ('Periyodik Sistem', 'periyodik-sistem', 'Elementler ve özellikleri', 7),
  ('Fiziksel ve Kimyasal Değişimler', 'fiziksel-kimyasal', 'Madde değişimleri', 8),
  ('Kimyasal Tepkimeler', 'kimyasal-tepkimeler', 'Tepkime denklemleri', 9),
  ('Asitler ve Bazlar', 'asitler-bazlar', 'pH ve nötrleşme', 10),
  ('Basit Makineler', 'basit-makineler', 'Kaldıraç, makara, eğik düzlem', 11),
  ('Enerji Dönüşümleri', 'enerji-donusumleri', 'Enerji türleri ve dönüşümler', 12),
  ('Elektrik Yükleri', 'elektrik-yukleri', 'Elektriklenme ve yükler', 13),
  ('Elektrik Enerjisi', 'elektrik-enerjisi', 'Elektrik devreleri ve enerji', 14)
) AS u(name, slug, description, order_index)
WHERE s.slug = 'fen-bilimleri';

-- T.C. İNKILAP TARİHİ ÜNİTELERİ
INSERT INTO public.units (subject_id, name, slug, description, order_index)
SELECT s.id, u.name, u.slug, u.description, u.order_index
FROM public.subjects s
CROSS JOIN (VALUES
  ('Bir Kahraman Doğuyor', 'kahraman-doguyor', 'Mustafa Kemal''in hayatı ve fikir dünyası', 1),
  ('Milli Uyanış', 'milli-uyanis', 'I. Dünya Savaşı ve işgaller', 2),
  ('Kurtuluş Savaşı Hazırlık', 'kurtulus-hazirlik', 'Kongreler ve örgütlenme', 3),
  ('TBMM''nin Açılışı', 'tbmm-acilis', 'Meclis''in kurulması ve ilk faaliyetler', 4),
  ('Kurtuluş Savaşı Cepheleri', 'kurtulus-cepheleri', 'Doğu, Güney ve Batı cepheleri', 5),
  ('Mudanya ve Lozan', 'mudanya-lozan', 'Barış antlaşmaları', 6),
  ('Atatürk İnkılapları', 'ataturk-inkilaplari', 'Siyasi, sosyal, ekonomik inkılaplar', 7),
  ('Atatürkçülük', 'ataturkculuk', 'Atatürk ilkeleri', 8)
) AS u(name, slug, description, order_index)
WHERE s.slug = 'inkilap-tarihi';

-- İNGİLİZCE ÜNİTELERİ
INSERT INTO public.units (subject_id, name, slug, description, order_index)
SELECT s.id, u.name, u.slug, u.description, u.order_index
FROM public.subjects s
CROSS JOIN (VALUES
  ('Friendship', 'friendship', 'Describing personality and friendships', 1),
  ('Teen Life', 'teen-life', 'Daily routines and activities', 2),
  ('Cooking', 'cooking', 'Food, recipes and instructions', 3),
  ('Communication', 'communication', 'Technology and social media', 4),
  ('The Internet', 'the-internet', 'Online safety and digital world', 5),
  ('Adventures', 'adventures', 'Travel and experiences', 6),
  ('Tourism', 'tourism', 'Holidays and places to visit', 7),
  ('Chores', 'chores', 'Housework and responsibilities', 8),
  ('Science', 'science', 'Inventions and discoveries', 9),
  ('Natural Forces', 'natural-forces', 'Weather and natural disasters', 10)
) AS u(name, slug, description, order_index)
WHERE s.slug = 'ingilizce';

-- DİN KÜLTÜRÜ ÜNİTELERİ
INSERT INTO public.units (subject_id, name, slug, description, order_index)
SELECT s.id, u.name, u.slug, u.description, u.order_index
FROM public.subjects s
CROSS JOIN (VALUES
  ('Kader İnancı', 'kader-inanci', 'Kader ve kaza kavramları', 1),
  ('Zekat ve Sadaka', 'zekat-sadaka', 'Yardımlaşma ve sosyal dayanışma', 2),
  ('Din ve Hayat', 'din-hayat', 'Günlük yaşamda dini değerler', 3),
  ('Hz. Muhammed''in Hayatı', 'hz-muhammed', 'Peygamberimizin örnekliği', 4),
  ('Kur''an-ı Kerim', 'kuran-kerim', 'Ana konular ve temel kavramlar', 5),
  ('Ahlaki Değerler', 'ahlaki-degerler', 'İslam ahlakı ve erdemler', 6)
) AS u(name, slug, description, order_index)
WHERE s.slug = 'din-kulturu';

-- Add study_plans table for exam date tracking
CREATE TABLE IF NOT EXISTS public.study_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  exam_date DATE NOT NULL,
  daily_goal_xp INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own study plan"
ON public.study_plans FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own study plan"
ON public.study_plans FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study plan"
ON public.study_plans FOR UPDATE
USING (auth.uid() = user_id);

CREATE TRIGGER update_study_plans_updated_at
BEFORE UPDATE ON public.study_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();