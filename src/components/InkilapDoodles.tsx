import { cn } from '@/lib/utils';

interface InkilapDoodleProps {
  unitName: string;
  className?: string;
}

// Ünite adına göre hangi doodle gösterileceğini belirle
function matchUnit(unitName: string): string {
  const lower = unitName.toLowerCase();
  if (lower.includes('kahraman') || lower.includes('doğuyor') || lower.includes('doguyor')) return 'kahraman';
  if (lower.includes('uyanış') || lower.includes('uyanis') || lower.includes('milli uyan')) return 'uyanis';
  if (lower.includes('hazırlık') || lower.includes('hazirlik') || lower.includes('kongre')) return 'hazirlik';
  if (lower.includes('tbmm') || lower.includes('meclis') || lower.includes('açılış') || lower.includes('acilis')) return 'tbmm';
  if (lower.includes('cephe')) return 'cepheler';
  if (lower.includes('mudanya') || lower.includes('lozan')) return 'lozan';
  if (lower.includes('inkılap') || lower.includes('inkilap')) return 'inkilaplar';
  if (lower.includes('atatürkçü') || lower.includes('ataturkcu') || lower.includes('ilke')) return 'ataturkculuk';
  return 'default';
}

// Ortak SVG stili - doodle / el çizimi hissi
const doodleStroke = {
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none',
};

// 1. Bir Kahraman Doğuyor - Kitap + Yıldız + Kalpak
function KahramanDoodle() {
  return (
    <svg viewBox="0 0 280 120" className="w-full max-w-[280px] h-auto">
      {/* Kitap */}
      <path d="M40 90 L40 40 Q40 35 45 35 L90 35 Q95 35 95 40 L95 90" stroke="currentColor" strokeWidth="2.5" {...doodleStroke} />
      <path d="M95 90 L95 40 Q95 35 100 35 L145 35 Q150 35 150 40 L150 90" stroke="currentColor" strokeWidth="2.5" {...doodleStroke} />
      <path d="M40 90 L150 90" stroke="currentColor" strokeWidth="2.5" {...doodleStroke} />
      <line x1="55" y1="50" x2="85" y2="50" stroke="currentColor" strokeWidth="1.5" {...doodleStroke} />
      <line x1="55" y1="60" x2="80" y2="60" stroke="currentColor" strokeWidth="1.5" {...doodleStroke} />
      <line x1="55" y1="70" x2="82" y2="70" stroke="currentColor" strokeWidth="1.5" {...doodleStroke} />
      {/* Kalpak */}
      <path d="M185 65 Q185 40 210 35 Q235 40 235 65" stroke="currentColor" strokeWidth="2.5" {...doodleStroke} />
      <path d="M178 65 L242 65" stroke="currentColor" strokeWidth="2.5" {...doodleStroke} />
      <circle cx="210" cy="52" r="4" fill="currentColor" opacity="0.3" />
      {/* Yıldız */}
      <path d="M210 10 L213 20 L224 20 L215 26 L218 36 L210 30 L202 36 L205 26 L196 20 L207 20 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.2" {...doodleStroke} />
      {/* Süsleme çizgiler */}
      <path d="M160 95 Q170 85 180 95 Q190 105 200 95" stroke="currentColor" strokeWidth="1.5" opacity="0.3" {...doodleStroke} />
    </svg>
  );
}

// 2. Milli Uyanış - Harita + Bayrak
function UyanisDoodle() {
  return (
    <svg viewBox="0 0 280 120" className="w-full max-w-[280px] h-auto">
      {/* Anadolu haritası basitleştirilmiş */}
      <path d="M30 70 Q50 50 80 55 Q110 45 140 50 Q170 40 200 50 Q220 45 240 55 Q250 65 240 75 Q220 85 200 80 Q170 90 140 85 Q110 90 80 80 Q50 85 30 70 Z" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.08" {...doodleStroke} />
      {/* İşgal çizgileri */}
      <line x1="50" y1="60" x2="70" y2="75" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" {...doodleStroke} />
      <line x1="220" y1="55" x2="235" y2="70" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" {...doodleStroke} />
      <line x1="120" y1="50" x2="130" y2="65" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" {...doodleStroke} />
      {/* Bayrak */}
      <line x1="140" y1="25" x2="140" y2="48" stroke="currentColor" strokeWidth="2" {...doodleStroke} />
      <path d="M140 25 L165 30 L140 36" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.15" {...doodleStroke} />
      {/* Ay yıldız (küçük) */}
      <circle cx="150" cy="30" r="2.5" stroke="currentColor" strokeWidth="1" fill="none" />
      {/* X işaretleri - direnç */}
      <path d="M60 62 L66 68 M66 62 L60 68" stroke="currentColor" strokeWidth="2" opacity="0.6" {...doodleStroke} />
      <path d="M225 58 L231 64 M231 58 L225 64" stroke="currentColor" strokeWidth="2" opacity="0.6" {...doodleStroke} />
      {/* Ünlem */}
      <text x="100" y="42" fontSize="14" fill="currentColor" opacity="0.4" fontWeight="bold">!</text>
    </svg>
  );
}

// 3. Kurtuluş Savaşı Hazırlık - Kongre binası + Kürsü
function HazirlikDoodle() {
  return (
    <svg viewBox="0 0 280 120" className="w-full max-w-[280px] h-auto">
      {/* Bina */}
      <rect x="60" y="40" width="100" height="60" rx="3" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.05" {...doodleStroke} />
      {/* Çatı üçgen */}
      <path d="M55 40 L110 15 L165 40" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.05" {...doodleStroke} />
      {/* Kapı */}
      <rect x="95" y="70" width="30" height="30" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.08" {...doodleStroke} />
      {/* Pencereler */}
      <rect x="70" y="50" width="15" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" {...doodleStroke} />
      <rect x="135" y="50" width="15" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" {...doodleStroke} />
      {/* Kürsü */}
      <path d="M195 60 L195 100 M185 60 L205 60 M182 100 L208 100" stroke="currentColor" strokeWidth="2.5" {...doodleStroke} />
      <rect x="183" y="50" width="24" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.08" {...doodleStroke} />
      {/* İnsanlar (basit) */}
      <circle cx="225" cy="80" r="5" stroke="currentColor" strokeWidth="1.5" {...doodleStroke} />
      <line x1="225" y1="85" x2="225" y2="100" stroke="currentColor" strokeWidth="1.5" {...doodleStroke} />
      <circle cx="245" cy="82" r="5" stroke="currentColor" strokeWidth="1.5" {...doodleStroke} />
      <line x1="245" y1="87" x2="245" y2="100" stroke="currentColor" strokeWidth="1.5" {...doodleStroke} />
      <circle cx="260" cy="80" r="5" stroke="currentColor" strokeWidth="1.5" {...doodleStroke} />
      <line x1="260" y1="85" x2="260" y2="100" stroke="currentColor" strokeWidth="1.5" {...doodleStroke} />
    </svg>
  );
}

// 4. TBMM'nin Açılışı - Meclis binası + Bayrak
function TBMMDoodle() {
  return (
    <svg viewBox="0 0 280 120" className="w-full max-w-[280px] h-auto">
      {/* Meclis binası */}
      <rect x="50" y="45" width="130" height="55" rx="3" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.05" {...doodleStroke} />
      {/* Sütunlar */}
      <line x1="75" y1="45" x2="75" y2="100" stroke="currentColor" strokeWidth="2.5" {...doodleStroke} />
      <line x1="100" y1="45" x2="100" y2="100" stroke="currentColor" strokeWidth="2.5" {...doodleStroke} />
      <line x1="130" y1="45" x2="130" y2="100" stroke="currentColor" strokeWidth="2.5" {...doodleStroke} />
      <line x1="155" y1="45" x2="155" y2="100" stroke="currentColor" strokeWidth="2.5" {...doodleStroke} />
      {/* Üst kısım */}
      <path d="M45 45 L115 20 L185 45" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.05" {...doodleStroke} />
      {/* Bayrak */}
      <line x1="115" y1="5" x2="115" y2="20" stroke="currentColor" strokeWidth="2" {...doodleStroke} />
      <path d="M115 5 L138 9 L115 14" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.15" {...doodleStroke} />
      {/* 23 Nisan yazısı */}
      <text x="200" y="55" fontSize="11" fill="currentColor" opacity="0.5" fontWeight="bold" fontFamily="serif">23</text>
      <text x="196" y="70" fontSize="9" fill="currentColor" opacity="0.4" fontFamily="serif">Nisan</text>
      <text x="196" y="83" fontSize="9" fill="currentColor" opacity="0.4" fontFamily="serif">1920</text>
      {/* Yıldız */}
      <path d="M230 40 L233 48 L242 48 L235 53 L237 61 L230 56 L223 61 L225 53 L218 48 L227 48 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.15" {...doodleStroke} />
    </svg>
  );
}

// 5. Kurtuluş Savaşı Cepheleri - Kılıçlar + Kalkan + Ok
function CephelerDoodle() {
  return (
    <svg viewBox="0 0 280 120" className="w-full max-w-[280px] h-auto">
      {/* Kalkan */}
      <path d="M100 25 Q100 15 120 10 Q140 15 140 25 L140 65 Q120 80 100 65 Z" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.08" {...doodleStroke} />
      <path d="M120 20 L120 60" stroke="currentColor" strokeWidth="1.5" opacity="0.3" {...doodleStroke} />
      <path d="M106 40 L134 40" stroke="currentColor" strokeWidth="1.5" opacity="0.3" {...doodleStroke} />
      {/* Sol kılıç */}
      <path d="M65 85 L105 25" stroke="currentColor" strokeWidth="2.5" {...doodleStroke} />
      <path d="M100 30 L110 20" stroke="currentColor" strokeWidth="3" {...doodleStroke} />
      <path d="M60 88 L70 82" stroke="currentColor" strokeWidth="4" {...doodleStroke} />
      {/* Sağ kılıç */}
      <path d="M175 85 L135 25" stroke="currentColor" strokeWidth="2.5" {...doodleStroke} />
      <path d="M140 30 L130 20" stroke="currentColor" strokeWidth="3" {...doodleStroke} />
      <path d="M180 88 L170 82" stroke="currentColor" strokeWidth="4" {...doodleStroke} />
      {/* Cephe okları */}
      <path d="M200 30 L230 50" stroke="currentColor" strokeWidth="2" strokeDasharray="5 3" {...doodleStroke} />
      <path d="M226 44 L232 50 L224 52" stroke="currentColor" strokeWidth="2" fill="none" {...doodleStroke} />
      <path d="M200 55 L230 75" stroke="currentColor" strokeWidth="2" strokeDasharray="5 3" {...doodleStroke} />
      <path d="M226 69 L232 75 L224 77" stroke="currentColor" strokeWidth="2" fill="none" {...doodleStroke} />
      <path d="M200 80 L230 100" stroke="currentColor" strokeWidth="2" strokeDasharray="5 3" {...doodleStroke} />
      <path d="M226 94 L232 100 L224 102" stroke="currentColor" strokeWidth="2" fill="none" {...doodleStroke} />
      {/* Cephe isimleri */}
      <text x="236" y="52" fontSize="8" fill="currentColor" opacity="0.5">Doğu</text>
      <text x="236" y="78" fontSize="8" fill="currentColor" opacity="0.5">Güney</text>
      <text x="236" y="103" fontSize="8" fill="currentColor" opacity="0.5">Batı</text>
    </svg>
  );
}

// 6. Mudanya ve Lozan - Masa + Belge + Kalem
function LozanDoodle() {
  return (
    <svg viewBox="0 0 280 120" className="w-full max-w-[280px] h-auto">
      {/* Masa */}
      <rect x="40" y="55" width="150" height="8" rx="2" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.1" {...doodleStroke} />
      <line x1="55" y1="63" x2="55" y2="100" stroke="currentColor" strokeWidth="2.5" {...doodleStroke} />
      <line x1="175" y1="63" x2="175" y2="100" stroke="currentColor" strokeWidth="2.5" {...doodleStroke} />
      {/* Belge */}
      <rect x="80" y="25" width="45" height="30" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.05" {...doodleStroke} />
      <line x1="86" y1="33" x2="118" y2="33" stroke="currentColor" strokeWidth="1" opacity="0.4" {...doodleStroke} />
      <line x1="86" y1="38" x2="115" y2="38" stroke="currentColor" strokeWidth="1" opacity="0.4" {...doodleStroke} />
      <line x1="86" y1="43" x2="112" y2="43" stroke="currentColor" strokeWidth="1" opacity="0.4" {...doodleStroke} />
      <line x1="86" y1="48" x2="105" y2="48" stroke="currentColor" strokeWidth="1" opacity="0.4" {...doodleStroke} />
      {/* Kalem */}
      <path d="M140 50 L155 20 L158 22 L143 52 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.15" {...doodleStroke} />
      <path d="M140 50 L138 55 L143 52" fill="currentColor" opacity="0.3" />
      {/* El sıkışma */}
      <path d="M210 50 Q215 40 225 45 L240 50 Q245 55 240 60 L225 58 Q215 62 210 55 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.08" {...doodleStroke} />
      {/* Barış sembolü - zeytin dalı */}
      <path d="M220 70 Q225 65 230 70 Q235 65 240 70" stroke="currentColor" strokeWidth="1.5" opacity="0.4" {...doodleStroke} />
      <path d="M222 73 Q227 68 232 73" stroke="currentColor" strokeWidth="1.5" opacity="0.3" {...doodleStroke} />
    </svg>
  );
}

// 7. Atatürk İnkılapları - ABC + Şapka + Fabrika
function InkilaplarDoodle() {
  return (
    <svg viewBox="0 0 280 120" className="w-full max-w-[280px] h-auto">
      {/* ABC Harfleri - Harf Devrimi */}
      <text x="20" y="50" fontSize="28" fill="currentColor" opacity="0.25" fontWeight="bold" fontFamily="serif">A</text>
      <text x="48" y="50" fontSize="28" fill="currentColor" opacity="0.2" fontWeight="bold" fontFamily="serif">B</text>
      <text x="76" y="50" fontSize="28" fill="currentColor" opacity="0.15" fontWeight="bold" fontFamily="serif">C</text>
      {/* Şapka */}
      <ellipse cx="155" cy="55" rx="25" ry="8" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.08" {...doodleStroke} />
      <path d="M138 55 Q138 35 155 30 Q172 35 172 55" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.05" {...doodleStroke} />
      {/* Fabrika */}
      <rect x="210" y="50" width="50" height="50" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.05" {...doodleStroke} />
      <rect x="220" y="30" width="10" height="25" rx="1" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.08" {...doodleStroke} />
      <rect x="240" y="35" width="10" height="20" rx="1" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.08" {...doodleStroke} />
      {/* Baca dumanı */}
      <path d="M225 30 Q222 22 228 18 Q224 12 230 8" stroke="currentColor" strokeWidth="1.5" opacity="0.3" {...doodleStroke} />
      <path d="M245 35 Q242 28 248 24" stroke="currentColor" strokeWidth="1.5" opacity="0.25" {...doodleStroke} />
      {/* Pencereler */}
      <rect x="218" y="60" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1" opacity="0.3" {...doodleStroke} />
      <rect x="242" y="60" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1" opacity="0.3" {...doodleStroke} />
      {/* Ok - değişim */}
      <path d="M105 45 L125 45" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" {...doodleStroke} />
      <path d="M121 40 L127 45 L121 50" stroke="currentColor" strokeWidth="2" {...doodleStroke} />
    </svg>
  );
}

// 8. Atatürkçülük - 6 Ok
function AtaturkculukDoodle() {
  return (
    <svg viewBox="0 0 280 120" className="w-full max-w-[280px] h-auto">
      {/* Merkez daire */}
      <circle cx="140" cy="60" r="35" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.05" {...doodleStroke} />
      <circle cx="140" cy="60" r="20" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.05" {...doodleStroke} />
      {/* 6 Ok */}
      {/* Üst */}
      <line x1="140" y1="40" x2="140" y2="12" stroke="currentColor" strokeWidth="2.5" {...doodleStroke} />
      <path d="M135 18 L140 8 L145 18" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.2" {...doodleStroke} />
      {/* Sağ üst */}
      <line x1="157" y1="47" x2="176" y2="22" stroke="currentColor" strokeWidth="2.5" {...doodleStroke} />
      <path d="M170 28 L179 18 L178 30" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.2" {...doodleStroke} />
      {/* Sağ alt */}
      <line x1="157" y1="73" x2="176" y2="98" stroke="currentColor" strokeWidth="2.5" {...doodleStroke} />
      <path d="M178 90 L179 102 L170 92" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.2" {...doodleStroke} />
      {/* Alt */}
      <line x1="140" y1="80" x2="140" y2="108" stroke="currentColor" strokeWidth="2.5" {...doodleStroke} />
      <path d="M135 102 L140 112 L145 102" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.2" {...doodleStroke} />
      {/* Sol alt */}
      <line x1="123" y1="73" x2="104" y2="98" stroke="currentColor" strokeWidth="2.5" {...doodleStroke} />
      <path d="M102 90 L101 102 L110 92" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.2" {...doodleStroke} />
      {/* Sol üst */}
      <line x1="123" y1="47" x2="104" y2="22" stroke="currentColor" strokeWidth="2.5" {...doodleStroke} />
      <path d="M110 28 L101 18 L102 30" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.2" {...doodleStroke} />
      {/* İlke isimleri */}
      <text x="200" y="25" fontSize="7.5" fill="currentColor" opacity="0.45">Cumhuriyetçilik</text>
      <text x="200" y="45" fontSize="7.5" fill="currentColor" opacity="0.4">Milliyetçilik</text>
      <text x="200" y="65" fontSize="7.5" fill="currentColor" opacity="0.35">Halkçılık</text>
      <text x="200" y="80" fontSize="7.5" fill="currentColor" opacity="0.4">Devletçilik</text>
      <text x="200" y="95" fontSize="7.5" fill="currentColor" opacity="0.35">Laiklik</text>
      <text x="200" y="110" fontSize="7.5" fill="currentColor" opacity="0.4">İnkılapçılık</text>
    </svg>
  );
}

// Varsayılan doodle - genel tarih
function DefaultDoodle() {
  return (
    <svg viewBox="0 0 280 120" className="w-full max-w-[280px] h-auto">
      {/* Bayrak */}
      <line x1="100" y1="15" x2="100" y2="100" stroke="currentColor" strokeWidth="2.5" {...doodleStroke} />
      <path d="M100 15 L160 30 L100 45" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.12" {...doodleStroke} />
      {/* Ay yıldız */}
      <circle cx="125" cy="30" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" {...doodleStroke} />
      <path d="M135 26 L137 30 L141 30 L138 33 L139 37 L135 34 L131 37 L132 33 L129 30 L133 30 Z" stroke="currentColor" strokeWidth="1" fill="currentColor" opacity="0.2" {...doodleStroke} />
      {/* Kitap */}
      <path d="M180 80 L180 50 Q180 46 185 46 L215 46 Q220 46 220 50 L220 80" stroke="currentColor" strokeWidth="2" {...doodleStroke} />
      <line x1="200" y1="46" x2="200" y2="80" stroke="currentColor" strokeWidth="1.5" {...doodleStroke} />
      <line x1="180" y1="80" x2="220" y2="80" stroke="currentColor" strokeWidth="2" {...doodleStroke} />
    </svg>
  );
}

const DOODLE_MAP: Record<string, () => JSX.Element> = {
  kahraman: KahramanDoodle,
  uyanis: UyanisDoodle,
  hazirlik: HazirlikDoodle,
  tbmm: TBMMDoodle,
  cepheler: CephelerDoodle,
  lozan: LozanDoodle,
  inkilaplar: InkilaplarDoodle,
  ataturkculuk: AtaturkculukDoodle,
  default: DefaultDoodle,
};

export function InkilapDoodle({ unitName, className }: InkilapDoodleProps) {
  const key = matchUnit(unitName);
  const DoodleComponent = DOODLE_MAP[key] || DOODLE_MAP.default;

  return (
    <div className={cn(
      "flex justify-center mt-4 text-red-700 dark:text-red-400 opacity-80",
      className
    )}>
      <DoodleComponent />
    </div>
  );
}
