# LGS Çalışma Platformu - Vercel Deployment Rehberi

## 🚀 Hızlı Deployment

### 1. Vercel Hesabı Oluştur
1. [vercel.com](https://vercel.com) adresine git
2. GitHub hesabınla giriş yap
3. "Add New Project" butonuna tıkla

### 2. GitHub Repository'yi Bağla
1. Bu projeyi GitHub'a push et:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - LGS Platform"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/lgscalis.git
   git push -u origin main
   ```

2. Vercel'de repository'yi seç
3. Import butonuna tıkla

### 3. Environment Variables Ekle

Vercel Dashboard'da "Settings" → "Environment Variables" bölümünden ekle:

**Zorunlu:**
```
VITE_SUPABASE_URL = your_supabase_project_url
VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
```

**Opsiyonel (Ödeme için):**
```
VITE_STRIPE_PUBLISHABLE_KEY = pk_live_your_key
VITE_REVENUECAT_API_KEY = test_COfzeyxLiqKRWhrXUZepVQrrPyT
```

### 4. Build Ayarları

Vercel otomatik algılayacak, ama manuel ayarlamak isterseniz:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 5. Deploy!

"Deploy" butonuna tıkla. İlk deployment 2-3 dakika sürer.

## 📦 Supabase Ayarları

Deployment'tan sonra Supabase'de URL'yi whitelist'e ekle:

1. Supabase Dashboard → Settings → API
2. "Site URL" kısmına Vercel URL'ini ekle: `https://your-project.vercel.app`
3. "Redirect URLs" kısmına ekle:
   ```
   https://your-project.vercel.app
   https://your-project.vercel.app/auth/callback
   ```

## 🔄 Otomatik Deployment

Her GitHub push'unda Vercel otomatik deploy edecek:
- `main` branch → Production
- Diğer branch'ler → Preview deployments

## 🧪 Preview Deployments

Her PR için otomatik preview URL oluşur:
```
https://lgscalis-git-feature-branch-youruser.vercel.app
```

## 🌐 Custom Domain (Opsiyonel)

1. Vercel Dashboard → Settings → Domains
2. Domain adını ekle (örn: lgscalis.com)
3. DNS ayarlarını Vercel'in verdiği gibi yapılandır

## 📊 Analytics ve Monitoring

Vercel otomatik sağlar:
- **Analytics:** Ziyaretçi istatistikleri
- **Speed Insights:** Performance metrikleri
- **Real-time Logs:** Hata ve log takibi

## 🐛 Sorun Giderme

### Build Hatası Alırsanız:
```bash
# Local'de build test edin
npm run build

# Hata varsa düzeltin ve tekrar push edin
git add .
git commit -m "Fix build errors"
git push
```

### Environment Variables Eksikse:
- Vercel Dashboard → Settings → Environment Variables
- Eksik değişkenleri ekle
- "Redeploy" butonuna tıkla

## 🎉 Deployment Sonrası

Site yayında! URL'niz:
```
https://your-project.vercel.app
```

Her push otomatik deploy edilecek. 🚀
