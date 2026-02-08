import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, X, CheckCircle } from 'lucide-react';

interface DoodleScene {
  caption: string;
  date?: string;
  scene: 'kahraman-dogum' | 'kahraman-okul' | 'kahraman-harbiye' | 'kahraman-canakkale' | 'kahraman-lider' |
         'uyanis-mondros' | 'uyanis-isgal' | 'uyanis-cemiyetler' | 'uyanis-samsun' | 'uyanis-direnis' |
         'hazirlik-amasya' | 'hazirlik-erzurum' | 'hazirlik-sivas' | 'hazirlik-misak' | 'hazirlik-sonmeclis' |
         'tbmm-acilis' | 'tbmm-anayasa' | 'tbmm-isyanlar' | 'tbmm-meclis' | 'tbmm-bayrak' |
         'cephe-dogu' | 'cephe-guney' | 'cephe-inonu' | 'cephe-sakarya' | 'cephe-taarruz' |
         'lozan-saltanat' | 'lozan-mudanya' | 'lozan-masa' | 'lozan-baris' | 'lozan-zafer' |
         'inkilap-cumhuriyet' | 'inkilap-harf' | 'inkilap-sapka' | 'inkilap-hukuk' | 'inkilap-toplum' |
         'ataturkculuk-6ok' | 'ataturkculuk-bulusma' | 'ataturkculuk-cummill' | 'ataturkculuk-haldev' | 'ataturkculuk-bayrak' |
         'default';
}

interface InteractiveNarrationViewProps {
  unitName: string;
  subjectName: string;
  onComplete: () => void;
  onExit: () => void;
}

// Ortak doodle stili
const S = {
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none',
};

// ========================
// BÜYÜK ANİMASYONLU SAHNELER
// ========================

function SceneKahramanDogum() {
  return (
    <svg viewBox="0 0 400 350" className="w-full h-full max-w-[400px]">
      <style>{`
        @keyframes twinkle { 0%,100%{opacity:0.2} 50%{opacity:0.8} }
        @keyframes riseUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes drawLine { from{stroke-dashoffset:200} to{stroke-dashoffset:0} }
        .twinkle1{animation:twinkle 2s ease-in-out infinite}
        .twinkle2{animation:twinkle 2.5s ease-in-out infinite 0.5s}
        .twinkle3{animation:twinkle 3s ease-in-out infinite 1s}
        .rise{animation:riseUp 0.8s ease-out both}
      `}</style>
      {/* Gökyüzü arka plan */}
      <rect x="0" y="0" width="400" height="180" fill="currentColor" opacity="0.03" rx="20" />
      {/* Yıldızlar */}
      <circle cx="50" cy="30" r="3" fill="currentColor" className="twinkle1" />
      <circle cx="120" cy="50" r="2" fill="currentColor" className="twinkle2" />
      <circle cx="300" cy="25" r="2.5" fill="currentColor" className="twinkle3" />
      <circle cx="350" cy="60" r="2" fill="currentColor" className="twinkle1" />
      <circle cx="200" cy="20" r="3" fill="currentColor" className="twinkle2" />
      <circle cx="250" cy="45" r="1.5" fill="currentColor" className="twinkle3" />
      {/* Hilal ve Yıldız - büyük */}
      <circle cx="200" cy="80" r="30" stroke="currentColor" strokeWidth="3" fill="currentColor" opacity="0.06" {...S} />
      <circle cx="212" cy="80" r="24" stroke="none" fill="currentColor" opacity="0.03" />
      <path d="M240 65 L244 75 L255 75 L246 82 L249 92 L240 85 L231 92 L234 82 L225 75 L236 75 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.15" {...S} />
      {/* Selanik silüet */}
      <path d="M0 200 L30 190 L50 195 L80 180 L100 185 Q120 160 130 170 L140 165 L160 175 L180 160 L200 170 L220 155 L240 165 L260 175 L280 170 L300 180 L320 175 L350 185 L380 190 L400 195 L400 350 L0 350 Z" fill="currentColor" opacity="0.08" />
      {/* Ev - doğduğu ev büyük */}
      <rect x="140" y="180" width="120" height="90" rx="4" stroke="currentColor" strokeWidth="3" fill="currentColor" opacity="0.06" {...S} className="rise" />
      <path d="M130 180 L200 140 L270 180" stroke="currentColor" strokeWidth="3" fill="currentColor" opacity="0.04" {...S} />
      {/* Pencereler */}
      <rect x="155" y="200" width="25" height="20" rx="3" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.1" {...S} />
      <rect x="220" y="200" width="25" height="20" rx="3" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.1" {...S} />
      <line x1="167" y1="200" x2="167" y2="220" stroke="currentColor" strokeWidth="1" opacity="0.3" {...S} />
      <line x1="232" y1="200" x2="232" y2="220" stroke="currentColor" strokeWidth="1" opacity="0.3" {...S} />
      {/* Kapı */}
      <rect x="183" y="235" width="34" height="35" rx="3" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.08" {...S} />
      <circle cx="211" cy="253" r="2" fill="currentColor" opacity="0.3" />
      {/* Beşik - sağda */}
      <path d="M310 260 Q310 240 330 235 Q350 240 350 260" stroke="currentColor" strokeWidth="2.5" {...S} />
      <path d="M305 260 L355 260" stroke="currentColor" strokeWidth="2.5" {...S} />
      <path d="M305 260 Q330 270 355 260" stroke="currentColor" strokeWidth="2" {...S} />
      {/* Yıldız ışığı beşiğe doğru */}
      <line x1="240" y1="80" x2="330" y2="230" stroke="currentColor" strokeWidth="1" strokeDasharray="8 6" opacity="0.15" {...S} />
      {/* 1881 */}
      <text x="310" y="310" fontSize="32" fill="currentColor" opacity="0.12" fontWeight="bold" fontFamily="serif">1881</text>
      {/* Selanik yazı */}
      <text x="160" y="330" fontSize="14" fill="currentColor" opacity="0.25" fontFamily="serif" fontWeight="bold">SELANİK</text>
    </svg>
  );
}

function SceneKahramanOkul() {
  return (
    <svg viewBox="0 0 400 350" className="w-full h-full max-w-[400px]">
      <style>{`
        @keyframes writeAnim { from{stroke-dashoffset:100} to{stroke-dashoffset:0} }
        .write{stroke-dasharray:100;animation:writeAnim 2s ease-out both}
      `}</style>
      {/* Okul binası */}
      <rect x="80" y="80" width="240" height="160" rx="5" stroke="currentColor" strokeWidth="3" fill="currentColor" opacity="0.05" {...S} />
      <path d="M70 80 L200 30 L330 80" stroke="currentColor" strokeWidth="3" fill="currentColor" opacity="0.04" {...S} />
      {/* Çan */}
      <path d="M195 25 L195 15 M190 25 Q195 35 200 25" stroke="currentColor" strokeWidth="2" {...S} />
      {/* Pencereler - 3x2 */}
      {[100, 175, 250].map(x => [105, 165].map(y => (
        <rect key={`${x}-${y}`} x={x} y={y} width="30" height="25" rx="2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.06" {...S} />
      )))}
      {/* Kapı */}
      <rect x="180" y="195" width="40" height="45" rx="3" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.08" {...S} />
      {/* Kara tahta */}
      <rect x="50" y="280" width="120" height="50" rx="4" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.1" {...S} />
      <text x="65" y="310" fontSize="18" fill="currentColor" opacity="0.3" fontWeight="bold" className="write">"Kemal"</text>
      {/* Kitap ve kalem */}
      <path d="M250 280 L250 320 Q250 325 255 325 L300 325 Q305 325 305 320 L305 280 Q305 275 300 275 L255 275 Q250 275 250 280Z" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.05" {...S} />
      <line x1="277" y1="275" x2="277" y2="325" stroke="currentColor" strokeWidth="1.5" opacity="0.15" {...S} />
      {/* Kalem */}
      <path d="M330 330 L345 275 L350 278 L335 333 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.12" {...S} />
      <path d="M330 330 L328 338 L335 333" fill="currentColor" opacity="0.2" />
      {/* Yıldız - başarı */}
      <path d="M360 260 L363 270 L374 270 L365 276 L368 286 L360 280 L352 286 L355 276 L346 270 L357 270 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.12" {...S} />
    </svg>
  );
}

function SceneKahramanCanakkale() {
  return (
    <svg viewBox="0 0 400 350" className="w-full h-full max-w-[400px]">
      <style>{`
        @keyframes wave { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes flagWave { 0%,100%{d:path('M180 50 L230 60 L180 75')} 50%{d:path('M180 50 L235 55 L180 70')} }
        .wave1{animation:wave 3s ease-in-out infinite}
        .wave2{animation:wave 3.5s ease-in-out infinite 0.5s}
      `}</style>
      {/* Gelibolu tepeleri */}
      <path d="M0 200 Q50 160 100 180 Q150 140 200 160 Q250 130 300 150 Q350 120 400 140 L400 350 L0 350 Z" fill="currentColor" opacity="0.06" />
      <path d="M0 220 Q80 200 150 210 Q220 195 300 205 Q360 190 400 200 L400 350 L0 350 Z" fill="currentColor" opacity="0.04" />
      {/* Siper */}
      <path d="M50 250 L80 250 L80 235 L120 235 L120 250 L160 250 L160 230 L200 230 L200 250 L240 250" stroke="currentColor" strokeWidth="3" fill="currentColor" opacity="0.06" {...S} />
      {/* Bayrak - siperde */}
      <line x1="180" y1="100" x2="180" y2="230" stroke="currentColor" strokeWidth="2.5" {...S} />
      <path d="M180 100 L230 115 L180 130" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.12" {...S} />
      <circle cx="205" cy="115" r="5" stroke="currentColor" strokeWidth="1.5" {...S} />
      <path d="M213 110 L215 115 L219 115 L216 118 L217 122 L213 119 L209 122 L210 118 L207 115 L211 115 Z" stroke="currentColor" strokeWidth="0.8" fill="currentColor" opacity="0.15" {...S} />
      {/* Asker siluetleri */}
      <circle cx="90" cy="222" r="8" stroke="currentColor" strokeWidth="2" {...S} />
      <line x1="90" y1="230" x2="90" y2="250" stroke="currentColor" strokeWidth="2" {...S} />
      <circle cx="140" cy="218" r="8" stroke="currentColor" strokeWidth="2" {...S} />
      <line x1="140" y1="226" x2="140" y2="250" stroke="currentColor" strokeWidth="2" {...S} />
      {/* Lider figürü - daha büyük, dik duruş */}
      <circle cx="300" cy="180" r="14" stroke="currentColor" strokeWidth="2.5" {...S} />
      <line x1="300" y1="194" x2="300" y2="260" stroke="currentColor" strokeWidth="2.5" {...S} />
      <line x1="300" y1="210" x2="280" y2="235" stroke="currentColor" strokeWidth="2" {...S} />
      <line x1="300" y1="210" x2="330" y2="200" stroke="currentColor" strokeWidth="2" {...S} />
      {/* Eliyle işaret ediyor */}
      <path d="M330 200 L345 190" stroke="currentColor" strokeWidth="2" {...S} />
      <path d="M340 185 L350 188 L345 195" stroke="currentColor" strokeWidth="1.5" {...S} />
      {/* Deniz dalgaları - altta */}
      <path d="M0 300 Q30 290 60 300 Q90 310 120 300 Q150 290 180 300 Q210 310 240 300 Q270 290 300 300 Q330 310 360 300 Q390 290 400 300" stroke="currentColor" strokeWidth="2" opacity="0.15" {...S} className="wave1" />
      <path d="M0 320 Q40 310 80 320 Q120 330 160 320 Q200 310 240 320 Q280 330 320 320 Q360 310 400 320" stroke="currentColor" strokeWidth="1.5" opacity="0.1" {...S} className="wave2" />
      {/* 1915 */}
      <text x="20" y="340" fontSize="36" fill="currentColor" opacity="0.08" fontWeight="bold" fontFamily="serif">1915</text>
      {/* ÇANAKKALE */}
      <text x="220" y="340" fontSize="12" fill="currentColor" opacity="0.2" fontFamily="serif" fontWeight="bold">ÇANAKKALE</text>
    </svg>
  );
}

function SceneUyanisIsgal() {
  return (
    <svg viewBox="0 0 400 350" className="w-full h-full max-w-[400px]">
      <style>{`
        @keyframes crack { from{stroke-dashoffset:300} to{stroke-dashoffset:0} }
        .crack{stroke-dasharray:300;animation:crack 2s ease-out both}
      `}</style>
      {/* Anadolu haritası - büyük */}
      <path d="M30 180 Q60 140 100 150 Q140 120 180 130 Q220 100 260 120 Q300 110 340 130 Q370 140 380 160 Q390 180 370 200 Q340 220 300 210 Q260 230 220 220 Q180 235 140 220 Q100 230 60 215 Q30 210 30 180 Z" stroke="currentColor" strokeWidth="3" fill="currentColor" opacity="0.07" {...S} />
      {/* İşgal X'leri - kırmızı tonlu */}
      <g opacity="0.5">
        <path d="M80 160 L100 180 M100 160 L80 180" stroke="currentColor" strokeWidth="3" {...S} />
        <text x="75" y="200" fontSize="8" fill="currentColor" opacity="0.5">İzmir</text>
        <path d="M320 135 L340 155 M340 135 L320 155" stroke="currentColor" strokeWidth="3" {...S} />
        <text x="315" y="170" fontSize="8" fill="currentColor" opacity="0.5">Urfa</text>
        <path d="M170 200 L190 220 M190 200 L170 220" stroke="currentColor" strokeWidth="3" {...S} />
        <text x="165" y="237" fontSize="8" fill="currentColor" opacity="0.5">Adana</text>
        <path d="M250 180 L270 200 M270 180 L250 200" stroke="currentColor" strokeWidth="3" {...S} />
        <text x="245" y="217" fontSize="8" fill="currentColor" opacity="0.5">Antep</text>
      </g>
      {/* Kırık zincir - bağımsızlık */}
      <path d="M100 280 Q120 270 130 280 Q140 290 150 280 Q160 270 170 280" stroke="currentColor" strokeWidth="3" opacity="0.3" {...S} />
      <path d="M230 280 Q240 270 250 280 Q260 290 270 280 Q280 270 290 280" stroke="currentColor" strokeWidth="3" opacity="0.3" {...S} />
      {/* Kırılma noktası */}
      <path d="M170 280 L185 270 L195 290 L205 265 L215 285 L230 280" stroke="currentColor" strokeWidth="2" opacity="0.4" className="crack" {...S} />
      {/* Mondros metni */}
      <rect x="120" y="30" width="160" height="50" rx="5" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.04" {...S} />
      <text x="135" y="55" fontSize="11" fill="currentColor" opacity="0.3" fontWeight="bold">MONDROS ATEŞKESİ</text>
      <text x="155" y="72" fontSize="10" fill="currentColor" opacity="0.2">30 Ekim 1918</text>
      {/* Dikenli tel */}
      <path d="M20 250 L380 250" stroke="currentColor" strokeWidth="1.5" opacity="0.2" {...S} />
      <g opacity="0.3">
        {[50, 100, 150, 200, 250, 300, 350].map(x => (
          <g key={x}>
            <line x1={x-5} y1="245" x2={x+5} y2="255" stroke="currentColor" strokeWidth="1.5" {...S} />
            <line x1={x+5} y1="245" x2={x-5} y2="255" stroke="currentColor" strokeWidth="1.5" {...S} />
          </g>
        ))}
      </g>
    </svg>
  );
}

function SceneUyanisSamsun() {
  return (
    <svg viewBox="0 0 400 350" className="w-full h-full max-w-[400px]">
      <style>{`
        @keyframes sail { 0%,100%{transform:translateX(0)} 50%{transform:translateX(5px)} }
        @keyframes glow { 0%,100%{opacity:0.1} 50%{opacity:0.25} }
        .sail{animation:sail 4s ease-in-out infinite}
        .glow{animation:glow 2s ease-in-out infinite}
      `}</style>
      {/* Deniz */}
      <path d="M0 200 Q50 190 100 200 Q150 210 200 200 Q250 190 300 200 Q350 210 400 200 L400 350 L0 350 Z" fill="currentColor" opacity="0.05" />
      {/* Dalgalar */}
      <path d="M0 220 Q40 210 80 220 Q120 230 160 220 Q200 210 240 220 Q280 230 320 220 Q360 210 400 220" stroke="currentColor" strokeWidth="1.5" opacity="0.1" {...S} />
      <path d="M0 240 Q50 230 100 240 Q150 250 200 240 Q250 230 300 240 Q350 250 400 240" stroke="currentColor" strokeWidth="1" opacity="0.07" {...S} />
      {/* Gemi */}
      <g className="sail">
        <path d="M130 180 L130 120 L180 150 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.08" {...S} />
        <path d="M130 120 L130 90" stroke="currentColor" strokeWidth="2" {...S} />
        <path d="M130 90 L160 120" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.06" {...S} />
        <path d="M90 180 Q130 195 180 180 Q170 200 95 195 Z" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.06" {...S} />
      </g>
      {/* Kıyı - Samsun */}
      <path d="M230 180 Q260 170 290 175 Q320 168 350 172 Q380 175 400 180 L400 200 Q350 195 300 200 Q260 205 230 200 Z" fill="currentColor" opacity="0.08" />
      {/* Lider figürü - gemiden iniyor */}
      <circle cx="210" cy="155" r="12" stroke="currentColor" strokeWidth="2.5" {...S} />
      <line x1="210" y1="167" x2="210" y2="200" stroke="currentColor" strokeWidth="2.5" {...S} />
      <line x1="210" y1="180" x2="195" y2="195" stroke="currentColor" strokeWidth="2" {...S} />
      <line x1="210" y1="180" x2="225" y2="195" stroke="currentColor" strokeWidth="2" {...S} />
      {/* Kalpak */}
      <path d="M200 148 Q200 140 210 137 Q220 140 220 148" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.08" {...S} />
      {/* Güneş - doğuyor */}
      <circle cx="350" cy="100" r="40" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.04" {...S} className="glow" />
      {[0, 30, 60, 90, 120, 150, 180].map(angle => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 350 + Math.cos(rad) * 45;
        const y1 = 100 + Math.sin(rad) * 45;
        const x2 = 350 + Math.cos(rad) * 60;
        const y2 = 100 + Math.sin(rad) * 60;
        return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.5" opacity="0.12" {...S} />;
      })}
      {/* 19 Mayıs */}
      <text x="270" y="280" fontSize="28" fill="currentColor" opacity="0.08" fontWeight="bold" fontFamily="serif">19 MAYIS</text>
      <text x="305" y="310" fontSize="16" fill="currentColor" opacity="0.06" fontFamily="serif">1919</text>
      {/* SAMSUN */}
      <text x="290" y="170" fontSize="11" fill="currentColor" opacity="0.2" fontFamily="serif" fontWeight="bold">SAMSUN</text>
    </svg>
  );
}

function SceneKongreler() {
  return (
    <svg viewBox="0 0 400 350" className="w-full h-full max-w-[400px]">
      {/* Kongre binası - büyük */}
      <rect x="100" y="100" width="200" height="140" rx="5" stroke="currentColor" strokeWidth="3" fill="currentColor" opacity="0.05" {...S} />
      <path d="M85 100 L200 50 L315 100" stroke="currentColor" strokeWidth="3" fill="currentColor" opacity="0.04" {...S} />
      {/* Sütunlar */}
      {[130, 170, 230, 270].map(x => (
        <line key={x} x1={x} y1="100" x2={x} y2="240" stroke="currentColor" strokeWidth="3" {...S} />
      ))}
      {/* Kapı */}
      <path d="M185 240 L185 190 Q200 180 215 190 L215 240" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.06" {...S} />
      {/* Kürsü */}
      <rect x="180" y="260" width="40" height="25" rx="3" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.08" {...S} />
      <line x1="200" y1="260" x2="200" y2="248" stroke="currentColor" strokeWidth="2" {...S} />
      {/* İnsanlar - kongre delegeleri */}
      {[80, 110, 140, 260, 290, 320].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={270 + (i % 2) * 8} r="7" stroke="currentColor" strokeWidth="1.5" {...S} />
          <line x1={x} y1={277 + (i % 2) * 8} x2={x} y2={300 + (i % 2) * 5} stroke="currentColor" strokeWidth="1.5" {...S} />
        </g>
      ))}
      {/* Belge - karar */}
      <rect x="20" y="30" width="90" height="55" rx="3" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.04" {...S} />
      <line x1="30" y1="45" x2="100" y2="45" stroke="currentColor" strokeWidth="1" opacity="0.2" {...S} />
      <line x1="30" y1="55" x2="95" y2="55" stroke="currentColor" strokeWidth="1" opacity="0.15" {...S} />
      <line x1="30" y1="65" x2="85" y2="65" stroke="currentColor" strokeWidth="1" opacity="0.15" {...S} />
      <text x="30" y="42" fontSize="7" fill="currentColor" opacity="0.25" fontWeight="bold">MİSAK-I MİLLİ</text>
      {/* Ok: Erzurum → Sivas */}
      <rect x="290" y="30" width="90" height="55" rx="3" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.04" {...S} />
      <text x="300" y="50" fontSize="9" fill="currentColor" opacity="0.3" fontWeight="bold">ERZURUM</text>
      <text x="320" y="65" fontSize="7" fill="currentColor" opacity="0.2">→ SİVAS</text>
      <text x="305" y="80" fontSize="7" fill="currentColor" opacity="0.15">MİLLİ İRADE</text>
    </svg>
  );
}

function SceneTBMM() {
  return (
    <svg viewBox="0 0 400 350" className="w-full h-full max-w-[400px]">
      <style>{`
        @keyframes flagFloat { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(2deg)} }
        .flag{animation:flagFloat 3s ease-in-out infinite;transform-origin:200px 30px}
      `}</style>
      {/* Meclis binası - anıtsal */}
      <rect x="60" y="110" width="280" height="150" rx="5" stroke="currentColor" strokeWidth="3" fill="currentColor" opacity="0.05" {...S} />
      {/* Çatı */}
      <path d="M50 110 L200 50 L350 110" stroke="currentColor" strokeWidth="3.5" fill="currentColor" opacity="0.04" {...S} />
      {/* Büyük sütunlar */}
      {[90, 140, 190, 210, 260, 310].map(x => (
        <line key={x} x1={x} y1="110" x2={x} y2="260" stroke="currentColor" strokeWidth="3.5" {...S} />
      ))}
      {/* Bayrak */}
      <g className="flag">
        <line x1="200" y1="10" x2="200" y2="50" stroke="currentColor" strokeWidth="2.5" {...S} />
        <path d="M200 10 L245 18 L200 28" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.12" {...S} />
        <circle cx="218" cy="18" r="4" stroke="currentColor" strokeWidth="1" {...S} />
        <path d="M228 14 L230 18 L234 18 L231 21 L232 25 L228 22 L224 25 L225 21 L222 18 L226 18 Z" stroke="currentColor" strokeWidth="0.8" fill="currentColor" opacity="0.15" {...S} />
      </g>
      {/* 23 Nisan 1920 - büyük */}
      <text x="80" y="300" fontSize="42" fill="currentColor" opacity="0.06" fontWeight="bold" fontFamily="serif">23 NİSAN</text>
      <text x="145" y="335" fontSize="24" fill="currentColor" opacity="0.05" fontFamily="serif">1920</text>
      {/* ANKARA */}
      <text x="170" y="95" fontSize="10" fill="currentColor" opacity="0.2" fontFamily="serif" fontWeight="bold">ANKARA</text>
      {/* Egemenlik yazısı */}
      <text x="90" y="280" fontSize="8" fill="currentColor" opacity="0.2" fontStyle="italic">"Egemenlik kayıtsız şartsız milletindir"</text>
    </svg>
  );
}

function SceneCepheler() {
  return (
    <svg viewBox="0 0 400 350" className="w-full h-full max-w-[400px]">
      <style>{`
        @keyframes arrowMove { from{stroke-dashoffset:20} to{stroke-dashoffset:0} }
        .arrow{stroke-dasharray:10 5;animation:arrowMove 1.5s linear infinite}
      `}</style>
      {/* Anadolu haritası */}
      <path d="M30 170 Q60 130 100 140 Q140 110 180 120 Q220 90 260 110 Q300 100 340 120 Q370 130 380 150 Q390 170 370 190 Q340 210 300 200 Q260 220 220 210 Q180 225 140 210 Q100 220 60 205 Q30 200 30 170 Z" stroke="currentColor" strokeWidth="3" fill="currentColor" opacity="0.06" {...S} />
      {/* Doğu cephesi oku */}
      <path d="M310 120 L350 100" stroke="currentColor" strokeWidth="2.5" className="arrow" {...S} />
      <path d="M345 92 L355 98 L348 105" stroke="currentColor" strokeWidth="2" {...S} />
      <text x="340" y="85" fontSize="9" fill="currentColor" opacity="0.35" fontWeight="bold">DOĞU</text>
      {/* Güney cephesi oku */}
      <path d="M200 210 L200 250" stroke="currentColor" strokeWidth="2.5" className="arrow" {...S} />
      <path d="M195 244 L200 255 L205 244" stroke="currentColor" strokeWidth="2" {...S} />
      <text x="180" y="270" fontSize="9" fill="currentColor" opacity="0.35" fontWeight="bold">GÜNEY</text>
      {/* Batı cephesi oku */}
      <path d="M80 150 L40 170" stroke="currentColor" strokeWidth="2.5" className="arrow" {...S} />
      <path d="M45 162 L35 168 L42 176" stroke="currentColor" strokeWidth="2" {...S} />
      <text x="15" y="195" fontSize="9" fill="currentColor" opacity="0.35" fontWeight="bold">BATI</text>
      {/* Kalkan ve kılıç - merkez */}
      <path d="M180 130 Q180 115 200 108 Q220 115 220 130 L220 170 Q200 185 180 170 Z" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.06" {...S} />
      <line x1="200" y1="115" x2="200" y2="170" stroke="currentColor" strokeWidth="1.5" opacity="0.2" {...S} />
      <line x1="185" y1="145" x2="215" y2="145" stroke="currentColor" strokeWidth="1.5" opacity="0.2" {...S} />
      {/* Savaş tarihleri */}
      <g opacity="0.2">
        <text x="20" y="300" fontSize="8" fill="currentColor">I. İnönü - 1921</text>
        <text x="20" y="315" fontSize="8" fill="currentColor">II. İnönü - 1921</text>
        <text x="200" y="300" fontSize="8" fill="currentColor">Sakarya - 1921</text>
        <text x="200" y="315" fontSize="8" fill="currentColor" fontWeight="bold">Büyük Taarruz - 1922</text>
      </g>
      {/* Zafer yıldızı */}
      <path d="M340 280 L345 295 L360 295 L348 305 L352 320 L340 310 L328 320 L332 305 L320 295 L335 295 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.1" {...S} />
    </svg>
  );
}

function SceneLozan() {
  return (
    <svg viewBox="0 0 400 350" className="w-full h-full max-w-[400px]">
      <style>{`
        @keyframes penSign { from{stroke-dashoffset:80} to{stroke-dashoffset:0} }
        .sign{stroke-dasharray:80;animation:penSign 2s ease-out 0.5s both}
      `}</style>
      {/* Konferans masası - büyük */}
      <rect x="50" y="150" width="300" height="15" rx="4" stroke="currentColor" strokeWidth="3" fill="currentColor" opacity="0.1" {...S} />
      <line x1="80" y1="165" x2="80" y2="260" stroke="currentColor" strokeWidth="3" {...S} />
      <line x1="320" y1="165" x2="320" y2="260" stroke="currentColor" strokeWidth="3" {...S} />
      {/* Delegeler - solda */}
      <circle cx="120" cy="120" r="12" stroke="currentColor" strokeWidth="2" {...S} />
      <line x1="120" y1="132" x2="120" y2="155" stroke="currentColor" strokeWidth="2" {...S} />
      <circle cx="165" cy="118" r="12" stroke="currentColor" strokeWidth="2" {...S} />
      <line x1="165" y1="130" x2="165" y2="155" stroke="currentColor" strokeWidth="2" {...S} />
      {/* İsmet İnönü - ortada, daha belirgin */}
      <circle cx="200" cy="105" r="15" stroke="currentColor" strokeWidth="2.5" {...S} />
      <line x1="200" y1="120" x2="200" y2="155" stroke="currentColor" strokeWidth="2.5" {...S} />
      <path d="M190 100 Q190 90 200 87 Q210 90 210 100" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.06" {...S} />
      {/* Delegeler - sağda */}
      <circle cx="240" cy="118" r="12" stroke="currentColor" strokeWidth="2" {...S} />
      <line x1="240" y1="130" x2="240" y2="155" stroke="currentColor" strokeWidth="2" {...S} />
      <circle cx="280" cy="120" r="12" stroke="currentColor" strokeWidth="2" {...S} />
      <line x1="280" y1="132" x2="280" y2="155" stroke="currentColor" strokeWidth="2" {...S} />
      {/* Antlaşma belgesi */}
      <rect x="150" y="155" width="100" height="60" rx="3" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.04" {...S} />
      <line x1="165" y1="170" x2="235" y2="170" stroke="currentColor" strokeWidth="1" opacity="0.2" {...S} />
      <line x1="165" y1="180" x2="230" y2="180" stroke="currentColor" strokeWidth="1" opacity="0.15" {...S} />
      <line x1="165" y1="190" x2="225" y2="190" stroke="currentColor" strokeWidth="1" opacity="0.15" {...S} />
      {/* İmza */}
      <path d="M180 200 Q190 195 200 200 Q210 205 220 200" stroke="currentColor" strokeWidth="1.5" opacity="0.3" className="sign" {...S} />
      {/* Zeytin dalları */}
      <path d="M60 280 Q80 260 90 270 Q100 260 110 270 Q120 258 130 268" stroke="currentColor" strokeWidth="2" opacity="0.2" {...S} />
      <path d="M270 280 Q280 260 290 270 Q300 260 310 270 Q320 258 330 268" stroke="currentColor" strokeWidth="2" opacity="0.2" {...S} />
      {/* Lozan - büyük */}
      <text x="100" y="320" fontSize="36" fill="currentColor" opacity="0.06" fontWeight="bold" fontFamily="serif">LOZAN 1923</text>
    </svg>
  );
}

function SceneInkilaplar() {
  return (
    <svg viewBox="0 0 400 350" className="w-full h-full max-w-[400px]">
      <style>{`
        @keyframes typewriter { from{width:0} to{width:160px} }
        @keyframes smokeRise { 0%{transform:translateY(0);opacity:0.3} 100%{transform:translateY(-20px);opacity:0} }
        .smoke{animation:smokeRise 3s ease-out infinite}
      `}</style>
      {/* Harf Devrimi - sol */}
      <text x="20" y="80" fontSize="50" fill="currentColor" opacity="0.15" fontWeight="bold" fontFamily="serif">A</text>
      <text x="65" y="80" fontSize="50" fill="currentColor" opacity="0.12" fontWeight="bold" fontFamily="serif">B</text>
      <text x="110" y="80" fontSize="50" fill="currentColor" opacity="0.09" fontWeight="bold" fontFamily="serif">C</text>
      {/* Ok - eski → yeni */}
      <path d="M160 60 L190 60" stroke="currentColor" strokeWidth="2.5" {...S} />
      <path d="M185 55 L195 60 L185 65" stroke="currentColor" strokeWidth="2" {...S} />
      {/* Eski yazı - siliniyor */}
      <text x="20" y="120" fontSize="14" fill="currentColor" opacity="0.08" fontFamily="serif" style={{textDecoration:'line-through'}}>عثمانلی</text>
      {/* Şapka Devrimi - sağ üst */}
      <ellipse cx="300" cy="65" rx="35" ry="12" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.08" {...S} />
      <path d="M275 65 Q275 35 300 28 Q325 35 325 65" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.05" {...S} />
      <path d="M270 65 L330 65" stroke="currentColor" strokeWidth="2" {...S} />
      {/* Fabrika - alt sol */}
      <rect x="30" y="180" width="120" height="100" rx="4" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.05" {...S} />
      <rect x="50" y="145" width="20" height="40" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.07" {...S} />
      <rect x="90" y="155" width="20" height="30" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.07" {...S} />
      <rect x="120" y="160" width="18" height="25" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.07" {...S} />
      {/* Baca dumanı */}
      <path d="M60 145 Q55 130 65 120 Q58 108 68 100" stroke="currentColor" strokeWidth="2" opacity="0.15" className="smoke" {...S} />
      <path d="M100 155 Q95 142 105 135" stroke="currentColor" strokeWidth="2" opacity="0.12" className="smoke" {...S} />
      {/* Pencereler */}
      <rect x="45" y="200" width="20" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.2" {...S} />
      <rect x="80" y="200" width="20" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.2" {...S} />
      <rect x="115" y="200" width="20" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.2" {...S} />
      {/* Cumhuriyet - sağ alt */}
      <rect x="200" y="170" width="180" height="120" rx="8" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.04" {...S} />
      <text x="220" y="210" fontSize="16" fill="currentColor" opacity="0.2" fontWeight="bold">CUMHURİYET</text>
      <text x="230" y="235" fontSize="11" fill="currentColor" opacity="0.15">29 Ekim 1923</text>
      {/* Kadın hakları */}
      <text x="230" y="265" fontSize="9" fill="currentColor" opacity="0.12">Kadın Hakları: 1934</text>
      <text x="230" y="280" fontSize="9" fill="currentColor" opacity="0.12">Medeni Kanun: 1926</text>
    </svg>
  );
}

function SceneAtaturkculuk6Ok() {
  return (
    <svg viewBox="0 0 400 350" className="w-full h-full max-w-[400px]">
      <style>{`
        @keyframes rotateOk { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:0.05} 50%{opacity:0.1} }
        .spin{animation:rotateOk 30s linear infinite;transform-origin:200px 175px}
        .pulse{animation:pulse 3s ease-in-out infinite}
      `}</style>
      {/* Dış daire */}
      <circle cx="200" cy="175" r="120" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.03" {...S} />
      <circle cx="200" cy="175" r="80" stroke="currentColor" strokeWidth="2" fill="currentColor" className="pulse" {...S} />
      <circle cx="200" cy="175" r="40" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.05" {...S} />
      {/* 6 Ok */}
      <g className="spin">
        {[0, 60, 120, 180, 240, 300].map((angle) => {
          const rad = (angle - 90) * Math.PI / 180;
          const x1 = 200 + Math.cos(rad) * 45;
          const y1 = 175 + Math.sin(rad) * 45;
          const x2 = 200 + Math.cos(rad) * 115;
          const y2 = 175 + Math.sin(rad) * 115;
          const ax = 200 + Math.cos(rad) * 118;
          const ay = 175 + Math.sin(rad) * 118;
          const leftRad = (angle - 90 + 150) * Math.PI / 180;
          const rightRad = (angle - 90 - 150) * Math.PI / 180;
          const alx = ax + Math.cos(leftRad) * 10;
          const aly = ay + Math.sin(leftRad) * 10;
          const arx = ax + Math.cos(rightRad) * 10;
          const ary = ay + Math.sin(rightRad) * 10;
          return (
            <g key={angle}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="3" {...S} />
              <path d={`M${alx} ${aly} L${ax} ${ay} L${arx} ${ary}`} stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.15" {...S} />
            </g>
          );
        })}
      </g>
      {/* İlke isimleri */}
      <text x="200" y="30" fontSize="11" fill="currentColor" opacity="0.35" textAnchor="middle" fontWeight="bold">Cumhuriyetçilik</text>
      <text x="340" y="110" fontSize="11" fill="currentColor" opacity="0.3" textAnchor="middle" fontWeight="bold">Milliyetçilik</text>
      <text x="340" y="260" fontSize="11" fill="currentColor" opacity="0.3" textAnchor="middle" fontWeight="bold">Halkçılık</text>
      <text x="200" y="335" fontSize="11" fill="currentColor" opacity="0.35" textAnchor="middle" fontWeight="bold">Devletçilik</text>
      <text x="60" y="260" fontSize="11" fill="currentColor" opacity="0.3" textAnchor="middle" fontWeight="bold">Laiklik</text>
      <text x="60" y="110" fontSize="11" fill="currentColor" opacity="0.3" textAnchor="middle" fontWeight="bold">İnkılapçılık</text>
    </svg>
  );
}

// ========================
// YENİ SAHNELER - 5'er sahne/ünite
// ========================

function SceneKahramanHarbiye() {
  return (
    <svg viewBox="0 0 400 350" className="w-full h-full max-w-[400px]">
      <style>{`
        @keyframes swordGlint { 0%,100%{opacity:0.1} 50%{opacity:0.4} }
        .glint{animation:swordGlint 2s ease-in-out infinite}
      `}</style>
      {/* Harp Okulu binası */}
      <rect x="60" y="90" width="280" height="140" rx="5" stroke="currentColor" strokeWidth="3" fill="currentColor" opacity="0.05" {...S} />
      <path d="M50 90 L200 35 L350 90" stroke="currentColor" strokeWidth="3" fill="currentColor" opacity="0.04" {...S} />
      {/* Büyük kapı */}
      <path d="M175 230 L175 160 Q200 140 225 160 L225 230" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.06" {...S} />
      {/* Pencereler */}
      {[85, 130, 270, 315].map(x => (
        <rect key={x} x={x} y="120" width="25" height="30" rx="2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.06" {...S} />
      ))}
      {/* Askeri apolet */}
      <path d="M80 270 Q95 260 110 270 L110 290 L80 290 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.08" {...S} />
      <line x1="85" y1="275" x2="105" y2="275" stroke="currentColor" strokeWidth="1.5" opacity="0.2" {...S} />
      <line x1="85" y1="282" x2="105" y2="282" stroke="currentColor" strokeWidth="1.5" opacity="0.2" {...S} />
      {/* Kılıç */}
      <line x1="200" y1="260" x2="200" y2="340" stroke="currentColor" strokeWidth="3" {...S} />
      <path d="M190 260 L200 250 L210 260" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.06" {...S} />
      <line x1="188" y1="270" x2="212" y2="270" stroke="currentColor" strokeWidth="3" {...S} />
      <line x1="195" y1="260" x2="205" y2="330" stroke="currentColor" strokeWidth="1" opacity="0.1" className="glint" {...S} />
      {/* Subay figürü */}
      <circle cx="310" cy="260" r="14" stroke="currentColor" strokeWidth="2.5" {...S} />
      <line x1="310" y1="274" x2="310" y2="320" stroke="currentColor" strokeWidth="2.5" {...S} />
      <line x1="310" y1="290" x2="290" y2="310" stroke="currentColor" strokeWidth="2" {...S} />
      <line x1="310" y1="290" x2="330" y2="310" stroke="currentColor" strokeWidth="2" {...S} />
      {/* Kasket */}
      <path d="M298 254 L322 254" stroke="currentColor" strokeWidth="2" {...S} />
      <path d="M300 254 Q300 242 310 238 Q320 242 320 254" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.06" {...S} />
      {/* HARBİYE */}
      <text x="130" y="340" fontSize="14" fill="currentColor" opacity="0.2" fontFamily="serif" fontWeight="bold">HARBİYE MEKTEBİ</text>
    </svg>
  );
}

function SceneKahramanLider() {
  return (
    <svg viewBox="0 0 400 350" className="w-full h-full max-w-[400px]">
      <style>{`
        @keyframes pulse2 { 0%,100%{r:35} 50%{r:40} }
        .pulse2{animation:pulse2 3s ease-in-out infinite}
      `}</style>
      {/* Lider figürü - merkez, büyük */}
      <circle cx="200" cy="100" r="30" stroke="currentColor" strokeWidth="3" {...S} />
      <line x1="200" y1="130" x2="200" y2="210" stroke="currentColor" strokeWidth="3" {...S} />
      <line x1="200" y1="155" x2="165" y2="190" stroke="currentColor" strokeWidth="2.5" {...S} />
      <line x1="200" y1="155" x2="235" y2="190" stroke="currentColor" strokeWidth="2.5" {...S} />
      {/* Kalpak */}
      <path d="M183 90 Q183 72 200 65 Q217 72 217 90" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.06" {...S} />
      {/* Işık halesi */}
      <circle cx="200" cy="100" r="35" stroke="currentColor" strokeWidth="1" opacity="0.08" className="pulse2" {...S} />
      {/* Askeri madalyalar */}
      <circle cx="192" cy="145" r="4" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.1" {...S} />
      <circle cx="208" cy="145" r="4" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.1" {...S} />
      {/* Sol: Trablusgarp */}
      <rect x="20" y="240" width="100" height="60" rx="4" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.04" {...S} />
      <text x="30" y="265" fontSize="9" fill="currentColor" opacity="0.25" fontWeight="bold">TRABLUSGARP</text>
      <text x="40" y="282" fontSize="8" fill="currentColor" opacity="0.15">1911</text>
      {/* Orta: Balkan Savaşları */}
      <rect x="150" y="240" width="100" height="60" rx="4" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.04" {...S} />
      <text x="155" y="265" fontSize="9" fill="currentColor" opacity="0.25" fontWeight="bold">BALKAN SAVAŞI</text>
      <text x="177" y="282" fontSize="8" fill="currentColor" opacity="0.15">1912</text>
      {/* Sağ: 1. Dünya Savaşı */}
      <rect x="280" y="240" width="100" height="60" rx="4" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.04" {...S} />
      <text x="288" y="265" fontSize="9" fill="currentColor" opacity="0.25" fontWeight="bold">DÜNYA SAVAŞI</text>
      <text x="310" y="282" fontSize="8" fill="currentColor" opacity="0.15">1914</text>
      {/* Bağlantı çizgileri */}
      <line x1="70" y1="240" x2="200" y2="210" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.12" {...S} />
      <line x1="200" y1="210" x2="200" y2="240" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.12" {...S} />
      <line x1="330" y1="240" x2="200" y2="210" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.12" {...S} />
      {/* Üst başlık */}
      <text x="100" y="40" fontSize="13" fill="currentColor" opacity="0.15" fontFamily="serif" fontWeight="bold">Savaştan savaşa bir asker</text>
    </svg>
  );
}

function SceneUyanisCemiyetler() {
  return (
    <svg viewBox="0 0 400 350" className="w-full h-full max-w-[400px]">
      <style>{`
        @keyframes handUp { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .hand{animation:handUp 2s ease-in-out infinite}
      `}</style>
      {/* Toplantı odası */}
      <rect x="50" y="80" width="300" height="160" rx="6" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.04" {...S} />
      {/* Masa */}
      <rect x="80" y="180" width="240" height="10" rx="3" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.08" {...S} />
      <line x1="100" y1="190" x2="100" y2="240" stroke="currentColor" strokeWidth="2.5" {...S} />
      <line x1="300" y1="190" x2="300" y2="240" stroke="currentColor" strokeWidth="2.5" {...S} />
      {/* İnsanlar - cemiyetler */}
      {[110, 150, 200, 250, 290].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={155} r="9" stroke="currentColor" strokeWidth="2" {...S} />
          <line x1={x} y1={164} x2={x} y2={183} stroke="currentColor" strokeWidth="2" {...S} />
          {i === 2 && <g className="hand"><line x1={x} y1={168} x2={x + 15} y2={148} stroke="currentColor" strokeWidth="2" {...S} /></g>}
        </g>
      ))}
      {/* Yararlı cemiyetler - sol */}
      <rect x="30" y="260" width="150" height="70" rx="4" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.06" {...S} />
      <text x="42" y="282" fontSize="9" fill="currentColor" opacity="0.3" fontWeight="bold">YARARLI CEMİYETLER</text>
      <text x="42" y="298" fontSize="7" fill="currentColor" opacity="0.2">• Müdafaa-i Hukuk</text>
      <text x="42" y="310" fontSize="7" fill="currentColor" opacity="0.2">• Reddi İlhak</text>
      <text x="42" y="322" fontSize="7" fill="currentColor" opacity="0.2">• Kilikyalılar</text>
      {/* Zararlı cemiyetler - sağ */}
      <rect x="220" y="260" width="150" height="70" rx="4" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.04" {...S} />
      <text x="232" y="282" fontSize="9" fill="currentColor" opacity="0.25" fontWeight="bold">ZARARLI CEMİYETLER</text>
      <text x="232" y="298" fontSize="7" fill="currentColor" opacity="0.15">• Mavri Mira</text>
      <text x="232" y="310" fontSize="7" fill="currentColor" opacity="0.15">• Pontus Rum</text>
      <text x="232" y="322" fontSize="7" fill="currentColor" opacity="0.15">• Wilson Prensipleri</text>
      {/* VS çizgisi */}
      <line x1="200" y1="260" x2="200" y2="330" stroke="currentColor" strokeWidth="2" strokeDasharray="6 3" opacity="0.15" {...S} />
      {/* Bayrak sembolü üstte */}
      <line x1="200" y1="25" x2="200" y2="75" stroke="currentColor" strokeWidth="2" {...S} />
      <path d="M200 25 L235 35 L200 48" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.1" {...S} />
    </svg>
  );
}

function SceneUyanisDirenis() {
  return (
    <svg viewBox="0 0 400 350" className="w-full h-full max-w-[400px]">
      <style>{`
        @keyframes flame { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(1.2)} }
        .flame{animation:flame 1.5s ease-in-out infinite;transform-origin:center bottom}
      `}</style>
      {/* Köy silüeti */}
      <path d="M0 200 Q30 180 60 190 Q100 175 140 185 Q170 170 200 180 Q230 165 260 180 Q300 170 340 185 Q370 178 400 188 L400 350 L0 350 Z" fill="currentColor" opacity="0.05" />
      {/* Direniş figürleri - silah tutan köylüler */}
      <g>
        <circle cx="80" cy="175" r="10" stroke="currentColor" strokeWidth="2" {...S} />
        <line x1="80" y1="185" x2="80" y2="220" stroke="currentColor" strokeWidth="2" {...S} />
        <line x1="80" y1="195" x2="60" y2="160" stroke="currentColor" strokeWidth="2" {...S} />
        <line x1="55" y1="155" x2="65" y2="165" stroke="currentColor" strokeWidth="1.5" {...S} />
      </g>
      <g>
        <circle cx="160" cy="165" r="10" stroke="currentColor" strokeWidth="2" {...S} />
        <line x1="160" y1="175" x2="160" y2="215" stroke="currentColor" strokeWidth="2" {...S} />
        <line x1="160" y1="188" x2="140" y2="155" stroke="currentColor" strokeWidth="2" {...S} />
      </g>
      <g>
        <circle cx="320" cy="170" r="10" stroke="currentColor" strokeWidth="2" {...S} />
        <line x1="320" y1="180" x2="320" y2="220" stroke="currentColor" strokeWidth="2" {...S} />
        <line x1="320" y1="190" x2="340" y2="155" stroke="currentColor" strokeWidth="2" {...S} />
      </g>
      {/* Kadın figürü - mermi taşıyor */}
      <circle cx="240" cy="168" r="10" stroke="currentColor" strokeWidth="2" {...S} />
      <line x1="240" y1="178" x2="240" y2="218" stroke="currentColor" strokeWidth="2" {...S} />
      <rect x="228" y="182" width="24" height="15" rx="3" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.06" {...S} />
      {/* Ateş */}
      <g className="flame">
        <path d="M195 240 Q200 220 205 240 Q210 225 215 240 Q210 250 205 248 Q200 252 195 240 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.12" {...S} />
      </g>
      {/* KUVAYIMİLLİYE yazı */}
      <text x="80" y="290" fontSize="24" fill="currentColor" opacity="0.07" fontWeight="bold" fontFamily="serif">KUVAYIMİLLİYE</text>
      {/* Meşale */}
      <line x1="200" y1="240" x2="200" y2="270" stroke="currentColor" strokeWidth="3" {...S} />
      {/* Alt açıklama */}
      <text x="80" y="330" fontSize="9" fill="currentColor" opacity="0.2" fontStyle="italic">"Ya istiklal ya ölüm!"</text>
    </svg>
  );
}

function SceneHazirlikMisak() {
  return (
    <svg viewBox="0 0 400 350" className="w-full h-full max-w-[400px]">
      <style>{`
        @keyframes drawBorder { from{stroke-dashoffset:600} to{stroke-dashoffset:0} }
        .border-draw{stroke-dasharray:600;animation:drawBorder 3s ease-out both}
      `}</style>
      {/* Anadolu haritası - büyük */}
      <path d="M40 160 Q70 120 110 130 Q150 95 190 110 Q230 80 270 100 Q310 85 350 110 Q380 120 390 140 Q400 160 380 180 Q350 200 310 190 Q270 210 230 200 Q190 215 150 200 Q110 210 70 195 Q40 190 40 160 Z" stroke="currentColor" strokeWidth="3" fill="currentColor" opacity="0.06" className="border-draw" {...S} />
      {/* Milli sınırlar - kalın kırmızı çizgi */}
      <path d="M40 160 Q70 120 110 130 Q150 95 190 110 Q230 80 270 100 Q310 85 350 110 Q380 120 390 140 Q400 160 380 180 Q350 200 310 190 Q270 210 230 200 Q190 215 150 200 Q110 210 70 195 Q40 190 40 160 Z" stroke="currentColor" strokeWidth="4" opacity="0.3" strokeDasharray="10 5" className="border-draw" {...S} />
      {/* İç şehirler */}
      <circle cx="200" cy="145" r="4" fill="currentColor" opacity="0.2" />
      <text x="190" y="140" fontSize="7" fill="currentColor" opacity="0.3">Ankara</text>
      <circle cx="120" cy="155" r="3" fill="currentColor" opacity="0.15" />
      <text x="108" y="150" fontSize="7" fill="currentColor" opacity="0.2">İzmir</text>
      <circle cx="310" cy="130" r="3" fill="currentColor" opacity="0.15" />
      <text x="300" y="125" fontSize="7" fill="currentColor" opacity="0.2">Erzurum</text>
      {/* Belge - Misak-ı Milli */}
      <rect x="100" y="240" width="200" height="80" rx="5" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.05" {...S} />
      <text x="130" y="265" fontSize="14" fill="currentColor" opacity="0.3" fontWeight="bold" fontFamily="serif">MİSAK-I MİLLİ</text>
      <line x1="120" y1="278" x2="280" y2="278" stroke="currentColor" strokeWidth="1" opacity="0.15" {...S} />
      <text x="115" y="295" fontSize="8" fill="currentColor" opacity="0.2">28 Ocak 1920 - Son Osmanlı Meclisi</text>
      <text x="115" y="310" fontSize="8" fill="currentColor" opacity="0.15">"Milli sınırlar içinde vatan bir bütündür"</text>
      {/* Kalem */}
      <path d="M320 250 L335 230 L340 235 L325 255 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.1" {...S} />
    </svg>
  );
}

function SceneHazirlikSonMeclis() {
  return (
    <svg viewBox="0 0 400 350" className="w-full h-full max-w-[400px]">
      <style>{`
        @keyframes doorClose { from{transform:scaleX(1)} to{transform:scaleX(0)} }
        .closing{animation:doorClose 3s ease-in-out both;transform-origin:left center}
      `}</style>
      {/* Osmanlı Meclis binası */}
      <rect x="80" y="80" width="240" height="150" rx="5" stroke="currentColor" strokeWidth="3" fill="currentColor" opacity="0.05" {...S} />
      <path d="M70 80 L200 30 L330 80" stroke="currentColor" strokeWidth="3" fill="currentColor" opacity="0.04" {...S} />
      {/* Osmanlı arması */}
      <circle cx="200" cy="55" r="12" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.06" {...S} />
      {/* Sütunlar */}
      {[110, 160, 240, 290].map(x => (
        <line key={x} x1={x} y1="80" x2={x} y2="230" stroke="currentColor" strokeWidth="3" {...S} />
      ))}
      {/* Kapılar - kapanıyor */}
      <rect x="175" y="170" width="50" height="60" rx="3" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.08" {...S} />
      <path d="M175 170 L175 230" stroke="currentColor" strokeWidth="3" opacity="0.3" {...S} />
      {/* X işareti - kapatılma */}
      <path d="M130 250 L270 310 M270 250 L130 310" stroke="currentColor" strokeWidth="3" opacity="0.15" {...S} />
      {/* İngiliz askerleri - meclis basılması */}
      <g opacity="0.25">
        <circle cx="50" cy="180" r="8" stroke="currentColor" strokeWidth="1.5" {...S} />
        <line x1="50" y1="188" x2="50" y2="215" stroke="currentColor" strokeWidth="1.5" {...S} />
        <circle cx="350" cy="180" r="8" stroke="currentColor" strokeWidth="1.5" {...S} />
        <line x1="350" y1="188" x2="350" y2="215" stroke="currentColor" strokeWidth="1.5" {...S} />
      </g>
      {/* Tarih */}
      <text x="80" y="340" fontSize="11" fill="currentColor" opacity="0.2" fontWeight="bold">16 Mart 1920 — İstanbul'un işgali</text>
      <text x="80" y="300" fontSize="10" fill="currentColor" opacity="0.15" fontStyle="italic">"Meclis basıldı, milletvekilleri tutuklandı"</text>
    </svg>
  );
}

function SceneTBMMAnayasa() {
  return (
    <svg viewBox="0 0 400 350" className="w-full h-full max-w-[400px]">
      {/* Anayasa kitabı - büyük */}
      <path d="M100 60 L100 250 Q100 260 110 260 L200 260 Q200 260 200 250 L200 60 Q200 50 190 50 L110 50 Q100 50 100 60 Z" stroke="currentColor" strokeWidth="3" fill="currentColor" opacity="0.05" {...S} />
      <path d="M200 60 L200 250 Q200 260 210 260 L290 260 Q300 260 300 250 L300 60 Q300 50 290 50 L210 50 Q200 50 200 60 Z" stroke="currentColor" strokeWidth="3" fill="currentColor" opacity="0.04" {...S} />
      <line x1="200" y1="50" x2="200" y2="260" stroke="currentColor" strokeWidth="3" {...S} />
      {/* Yazılar */}
      <text x="115" y="90" fontSize="10" fill="currentColor" opacity="0.25" fontWeight="bold">1921</text>
      <text x="115" y="110" fontSize="9" fill="currentColor" opacity="0.2">TEŞKİLAT-I</text>
      <text x="115" y="125" fontSize="9" fill="currentColor" opacity="0.2">ESASİYE</text>
      <line x1="115" y1="135" x2="185" y2="135" stroke="currentColor" strokeWidth="1" opacity="0.1" {...S} />
      <text x="115" y="155" fontSize="7" fill="currentColor" opacity="0.15">Madde 1:</text>
      <text x="115" y="168" fontSize="7" fill="currentColor" opacity="0.15">Egemenlik</text>
      <text x="115" y="181" fontSize="7" fill="currentColor" opacity="0.15">kayıtsız şartsız</text>
      <text x="115" y="194" fontSize="7" fill="currentColor" opacity="0.15">milletindir.</text>
      {/* Terazi - adalet */}
      <line x1="350" y1="80" x2="350" y2="180" stroke="currentColor" strokeWidth="2.5" {...S} />
      <line x1="320" y1="120" x2="380" y2="120" stroke="currentColor" strokeWidth="2.5" {...S} />
      <path d="M320 120 L310 160 L330 160 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.06" {...S} />
      <path d="M380 120 L370 160 L390 160 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.06" {...S} />
      <circle cx="350" cy="80" r="5" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.08" {...S} />
      {/* Güç: Millet */}
      <text x="120" y="290" fontSize="18" fill="currentColor" opacity="0.08" fontWeight="bold" fontFamily="serif">MİLLİ EGEMENLİK</text>
      {/* Yeni devlet yapısı */}
      <rect x="50" y="300" width="300" height="30" rx="4" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.03" {...S} />
      <text x="100" y="320" fontSize="9" fill="currentColor" opacity="0.2">Yasama + Yürütme = TBMM (Güçler birliği)</text>
    </svg>
  );
}

function SceneTBMMIsyanlar() {
  return (
    <svg viewBox="0 0 400 350" className="w-full h-full max-w-[400px]">
      <style>{`
        @keyframes shakeX { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-3px)} 75%{transform:translateX(3px)} }
        .shake{animation:shakeX 1s ease-in-out infinite}
      `}</style>
      {/* Anadolu haritası */}
      <path d="M30 150 Q60 115 100 125 Q140 95 180 105 Q220 75 260 95 Q300 80 340 105 Q370 115 380 135 Q390 150 370 170 Q340 190 300 180 Q260 200 220 190 Q180 205 140 190 Q100 200 60 185 Q30 180 30 150 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.05" {...S} />
      {/* İsyan noktaları - alev sembolleri */}
      {[
        { x: 100, y: 120, label: 'Bolu' },
        { x: 150, y: 145, label: 'Konya' },
        { x: 200, y: 100, label: 'Yozgat' },
        { x: 280, y: 110, label: 'Pontus' },
      ].map(p => (
        <g key={p.label} className="shake">
          <path d={`M${p.x-5} ${p.y} Q${p.x} ${p.y-15} ${p.x+5} ${p.y} Q${p.x+8} ${p.y-10} ${p.x+10} ${p.y}`} stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.15" {...S} />
          <text x={p.x - 10} y={p.y + 15} fontSize="7" fill="currentColor" opacity="0.25">{p.label}</text>
        </g>
      ))}
      {/* TBMM - merkez, sağlam */}
      <rect x="155" y="200" width="90" height="45" rx="4" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.08" {...S} />
      <text x="170" y="225" fontSize="14" fill="currentColor" opacity="0.3" fontWeight="bold">TBMM</text>
      {/* Asker - isyanları bastırma */}
      <g>
        <circle cx="80" cy="260" r="10" stroke="currentColor" strokeWidth="2" {...S} />
        <line x1="80" y1="270" x2="80" y2="305" stroke="currentColor" strokeWidth="2" {...S} />
        <line x1="80" y1="285" x2="100" y2="275" stroke="currentColor" strokeWidth="2" {...S} />
      </g>
      {/* İstiklal Mahkemeleri */}
      <rect x="180" y="270" width="170" height="50" rx="4" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.04" {...S} />
      <text x="195" y="292" fontSize="10" fill="currentColor" opacity="0.25" fontWeight="bold">İSTİKLAL MAHKEMELERİ</text>
      <text x="210" y="308" fontSize="8" fill="currentColor" opacity="0.15">İç düşmanla mücadele</text>
      {/* Kalkan */}
      <path d="M190 145 Q190 135 200 130 Q210 135 210 145 L210 165 Q200 172 190 165 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.06" {...S} />
    </svg>
  );
}

function SceneCepheDogu() {
  return (
    <svg viewBox="0 0 400 350" className="w-full h-full max-w-[400px]">
      <style>{`
        @keyframes marchRight { from{transform:translateX(-10px)} to{transform:translateX(0)} }
        .march{animation:marchRight 2s ease-out both}
      `}</style>
      {/* Doğu Anadolu dağları */}
      <path d="M0 200 Q40 150 100 170 Q160 130 220 155 Q280 120 340 145 Q380 130 400 150 L400 350 L0 350 Z" fill="currentColor" opacity="0.06" />
      <path d="M0 230 Q60 210 120 220 Q180 200 250 215 Q320 195 400 210 L400 350 L0 350 Z" fill="currentColor" opacity="0.04" />
      {/* Kazım Karabekir figürü */}
      <circle cx="120" cy="145" r="14" stroke="currentColor" strokeWidth="2.5" {...S} />
      <line x1="120" y1="159" x2="120" y2="210" stroke="currentColor" strokeWidth="2.5" {...S} />
      <line x1="120" y1="175" x2="145" y2="160" stroke="currentColor" strokeWidth="2" {...S} />
      <path d="M145 155 L155 160 L148 165" stroke="currentColor" strokeWidth="1.5" {...S} />
      {/* Kalpak */}
      <path d="M108 138 Q108 125 120 120 Q132 125 132 138" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.06" {...S} />
      {/* Türk bayrağı */}
      <line x1="180" y1="100" x2="180" y2="170" stroke="currentColor" strokeWidth="2" {...S} />
      <path d="M180 100 L215 110 L180 122" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.1" {...S} />
      {/* Gümrü & Kars */}
      <rect x="250" y="100" width="130" height="60" rx="4" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.04" {...S} />
      <text x="265" y="122" fontSize="10" fill="currentColor" opacity="0.25" fontWeight="bold">GÜMRÜ ANTLAŞMASI</text>
      <text x="275" y="140" fontSize="9" fill="currentColor" opacity="0.2">3 Aralık 1920</text>
      <text x="265" y="155" fontSize="7" fill="currentColor" opacity="0.15">TBMM'nin ilk askeri zaferi</text>
      {/* Askerler - sağa yürüyor */}
      <g className="march">
        {[220, 250, 280].map(x => (
          <g key={x}>
            <circle cx={x} cy={210} r="7" stroke="currentColor" strokeWidth="1.5" {...S} />
            <line x1={x} y1={217} x2={x} y2={240} stroke="currentColor" strokeWidth="1.5" {...S} />
          </g>
        ))}
      </g>
      {/* DOĞU CEPHESİ */}
      <text x="50" y="300" fontSize="28" fill="currentColor" opacity="0.06" fontWeight="bold" fontFamily="serif">DOĞU CEPHESİ</text>
    </svg>
  );
}

function SceneCepheGuney() {
  return (
    <svg viewBox="0 0 400 350" className="w-full h-full max-w-[400px]">
      <style>{`
        @keyframes shieldPulse { 0%,100%{opacity:0.06} 50%{opacity:0.12} }
        .sp{animation:shieldPulse 2.5s ease-in-out infinite}
      `}</style>
      {/* Güney bölge - Antep, Maraş, Urfa */}
      <path d="M50 180 Q100 150 170 160 Q220 140 280 155 Q330 145 380 165 L380 280 L50 280 Z" fill="currentColor" opacity="0.05" />
      {/* Şehir kalkanları */}
      {[
        { x: 100, y: 100, name: 'ANTEP', title: 'GAZİ' },
        { x: 200, y: 80, name: 'MARAŞ', title: 'KAHRAMAN' },
        { x: 300, y: 100, name: 'URFA', title: 'ŞANLI' },
      ].map(city => (
        <g key={city.name}>
          <path d={`M${city.x-20} ${city.y} Q${city.x-20} ${city.y-20} ${city.x} ${city.y-28} Q${city.x+20} ${city.y-20} ${city.x+20} ${city.y} L${city.x+20} ${city.y+25} Q${city.x} ${city.y+35} ${city.x-20} ${city.y+25} Z`} stroke="currentColor" strokeWidth="2.5" fill="currentColor" className="sp" {...S} />
          <text x={city.x - 15} y={city.y + 5} fontSize="8" fill="currentColor" opacity="0.3" fontWeight="bold">{city.name}</text>
          <text x={city.x - 12} y={city.y + 18} fontSize="7" fill="currentColor" opacity="0.2" fontStyle="italic">{city.title}</text>
        </g>
      ))}
      {/* Fransız bayrağı - mağlup */}
      <g opacity="0.2">
        <line x1="200" y1="180" x2="200" y2="220" stroke="currentColor" strokeWidth="1.5" {...S} />
        <rect x="200" y="180" width="30" height="18" rx="1" stroke="currentColor" strokeWidth="1" fill="currentColor" opacity="0.04" {...S} />
        <path d="M210 240 L220 220 L230 240" stroke="currentColor" strokeWidth="2" {...S} />
      </g>
      {/* Ankara Antlaşması */}
      <rect x="100" y="290" width="200" height="40" rx="4" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.04" {...S} />
      <text x="115" y="312" fontSize="10" fill="currentColor" opacity="0.25" fontWeight="bold">ANKARA ANTLAŞMASI - 1921</text>
      <text x="140" y="325" fontSize="8" fill="currentColor" opacity="0.15">Güney cephesi kapandı</text>
      {/* Direniş figürleri */}
      {[80, 310].map(x => (
        <g key={x}>
          <circle cx={x} cy={180} r="8" stroke="currentColor" strokeWidth="2" {...S} />
          <line x1={x} y1={188} x2={x} y2={220} stroke="currentColor" strokeWidth="2" {...S} />
        </g>
      ))}
    </svg>
  );
}

function SceneCepheInonu() {
  return (
    <svg viewBox="0 0 400 350" className="w-full h-full max-w-[400px]">
      <style>{`
        @keyframes defenseGlow { 0%,100%{opacity:0.06} 50%{opacity:0.15} }
        .defense{animation:defenseGlow 2s ease-in-out infinite}
      `}</style>
      {/* İnönü tepeleri */}
      <path d="M0 180 Q50 140 120 160 Q180 130 240 150 Q300 125 360 140 Q390 135 400 145 L400 350 L0 350 Z" fill="currentColor" opacity="0.06" />
      {/* Savunma hattı */}
      <path d="M30 200 L100 195 L170 200 L240 195 L310 200 L370 195" stroke="currentColor" strokeWidth="3" strokeDasharray="12 5" opacity="0.2" className="defense" {...S} />
      {/* İsmet İnönü figürü */}
      <circle cx="200" cy="130" r="15" stroke="currentColor" strokeWidth="2.5" {...S} />
      <line x1="200" y1="145" x2="200" y2="200" stroke="currentColor" strokeWidth="2.5" {...S} />
      <path d="M188 124 Q188 112 200 108 Q212 112 212 124" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.06" {...S} />
      {/* Dürbün */}
      <line x1="200" y1="165" x2="230" y2="150" stroke="currentColor" strokeWidth="2" {...S} />
      <circle cx="233" cy="148" r="5" stroke="currentColor" strokeWidth="1.5" {...S} />
      {/* I. İnönü */}
      <rect x="20" y="240" width="160" height="45" rx="4" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.04" {...S} />
      <text x="35" y="262" fontSize="11" fill="currentColor" opacity="0.25" fontWeight="bold">I. İNÖNÜ MUHAREBESİ</text>
      <text x="45" y="278" fontSize="9" fill="currentColor" opacity="0.2">10 Ocak 1921</text>
      {/* II. İnönü */}
      <rect x="220" y="240" width="160" height="45" rx="4" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.04" {...S} />
      <text x="230" y="262" fontSize="11" fill="currentColor" opacity="0.25" fontWeight="bold">II. İNÖNÜ MUHAREBESİ</text>
      <text x="245" y="278" fontSize="9" fill="currentColor" opacity="0.2">31 Mart 1921</text>
      {/* Sonuç */}
      <text x="60" y="320" fontSize="10" fill="currentColor" opacity="0.2" fontStyle="italic">"Siz orada yalnız düşmanı değil, milletin makus talihini de yendiniz"</text>
      {/* Bağlantı ok */}
      <path d="M180 262 L220 262" stroke="currentColor" strokeWidth="2" {...S} />
      <path d="M215 257 L225 262 L215 267" stroke="currentColor" strokeWidth="1.5" {...S} />
    </svg>
  );
}

function SceneCepheSakarya() {
  return (
    <svg viewBox="0 0 400 350" className="w-full h-full max-w-[400px]">
      <style>{`
        @keyframes riverFlow { 0%{stroke-dashoffset:0} 100%{stroke-dashoffset:-40} }
        .river{stroke-dasharray:15 5;animation:riverFlow 3s linear infinite}
      `}</style>
      {/* Sakarya Nehri */}
      <path d="M350 30 Q320 60 330 90 Q340 120 310 150 Q280 180 300 210 Q320 240 290 270 Q260 300 280 340" stroke="currentColor" strokeWidth="4" opacity="0.15" className="river" {...S} />
      {/* Nehrin batısı - Türk tarafı */}
      <path d="M0 180 Q60 160 120 170 Q180 150 240 165 L240 350 L0 350 Z" fill="currentColor" opacity="0.05" />
      {/* Savunma hattı */}
      <path d="M50 200 L100 205 L150 195 L200 200 L250 195" stroke="currentColor" strokeWidth="3" opacity="0.2" {...S} />
      {/* Başkomutan - at üstünde */}
      <circle cx="150" cy="140" r="13" stroke="currentColor" strokeWidth="2.5" {...S} />
      <path d="M140 153 L140 185 Q150 195 160 185 L160 153" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.04" {...S} />
      {/* At */}
      <path d="M125 185 Q130 175 140 185 Q150 195 160 185 Q170 175 175 185" stroke="currentColor" strokeWidth="2" {...S} />
      <path d="M120 185 L120 210 M175 185 L175 210" stroke="currentColor" strokeWidth="2" {...S} />
      {/* Kalpak */}
      <path d="M140 133 Q140 122 150 118 Q160 122 160 133" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.06" {...S} />
      {/* Kırılan kaburga - sembolik */}
      <text x="50" y="90" fontSize="8" fill="currentColor" opacity="0.2" fontStyle="italic">"Hattı müdafaa yoktur,</text>
      <text x="50" y="104" fontSize="8" fill="currentColor" opacity="0.2" fontStyle="italic">sathı müdafaa vardır.</text>
      <text x="50" y="118" fontSize="8" fill="currentColor" opacity="0.2" fontStyle="italic">O satıh bütün vatandır."</text>
      {/* Başkomutan */}
      <text x="50" y="260" fontSize="22" fill="currentColor" opacity="0.06" fontWeight="bold" fontFamily="serif">SAKARYA</text>
      <text x="50" y="290" fontSize="12" fill="currentColor" opacity="0.15" fontWeight="bold">23 Ağustos - 13 Eylül 1921</text>
      {/* Gazilik + Mareşallik */}
      <rect x="50" y="310" width="200" height="25" rx="3" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.04" {...S} />
      <text x="60" y="328" fontSize="9" fill="currentColor" opacity="0.2" fontWeight="bold">Mustafa Kemal → GAZİ + MAREŞAL</text>
    </svg>
  );
}

function SceneLozanSaltanat() {
  return (
    <svg viewBox="0 0 400 350" className="w-full h-full max-w-[400px]">
      <style>{`
        @keyframes fall { from{transform:translateY(0) rotate(0deg)} to{transform:translateY(30px) rotate(15deg)} }
        .falling{animation:fall 3s ease-in both}
      `}</style>
      {/* Taht */}
      <rect x="150" y="80" width="100" height="120" rx="5" stroke="currentColor" strokeWidth="3" fill="currentColor" opacity="0.06" {...S} />
      <path d="M140 80 L200 40 L260 80" stroke="currentColor" strokeWidth="3" fill="currentColor" opacity="0.04" {...S} />
      {/* Taç - düşüyor */}
      <g className="falling" opacity="0.3">
        <path d="M175 50 L180 30 L190 45 L200 25 L210 45 L220 30 L225 50 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.1" {...S} />
      </g>
      {/* X üstüne - kaldırılma */}
      <path d="M160 90 L240 190 M240 90 L160 190" stroke="currentColor" strokeWidth="3" opacity="0.15" {...S} />
      {/* Ok - tahttan meclise */}
      <path d="M200 210 L200 250" stroke="currentColor" strokeWidth="2.5" {...S} />
      <path d="M195 244 L200 255 L205 244" stroke="currentColor" strokeWidth="2" {...S} />
      {/* TBMM */}
      <rect x="120" y="260" width="160" height="50" rx="5" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.06" {...S} />
      <text x="160" y="285" fontSize="14" fill="currentColor" opacity="0.3" fontWeight="bold">T.B.M.M.</text>
      <text x="140" y="302" fontSize="8" fill="currentColor" opacity="0.2">Millet Egemenliği</text>
      {/* Tarih */}
      <text x="30" y="340" fontSize="10" fill="currentColor" opacity="0.2" fontWeight="bold">1 Kasım 1922 — Saltanat kaldırıldı</text>
      {/* Sol: Osmanlı devri */}
      <text x="20" y="130" fontSize="9" fill="currentColor" opacity="0.15" fontWeight="bold">SALTANAT</text>
      <text x="20" y="145" fontSize="7" fill="currentColor" opacity="0.1">600+ yıl</text>
      {/* Sağ: Cumhuriyet devri */}
      <text x="300" y="290" fontSize="9" fill="currentColor" opacity="0.15" fontWeight="bold">MİLLET</text>
      <text x="300" y="305" fontSize="7" fill="currentColor" opacity="0.1">Egemenlik</text>
    </svg>
  );
}

function SceneLozanZafer() {
  return (
    <svg viewBox="0 0 400 350" className="w-full h-full max-w-[400px]">
      <style>{`
        @keyframes confetti { 0%{transform:translateY(0);opacity:0.4} 100%{transform:translateY(40px);opacity:0} }
        .conf{animation:confetti 3s ease-out infinite}
      `}</style>
      {/* Zafer takı */}
      <path d="M100 100 Q100 40 200 30 Q300 40 300 100" stroke="currentColor" strokeWidth="4" fill="currentColor" opacity="0.04" {...S} />
      <line x1="100" y1="100" x2="100" y2="220" stroke="currentColor" strokeWidth="4" {...S} />
      <line x1="300" y1="100" x2="300" y2="220" stroke="currentColor" strokeWidth="4" {...S} />
      {/* ZAFER yazısı */}
      <text x="155" y="80" fontSize="24" fill="currentColor" opacity="0.2" fontWeight="bold" fontFamily="serif">ZAFER</text>
      {/* Konfeti */}
      {[130, 170, 200, 230, 270].map((x, i) => (
        <rect key={x} x={x} y={90 + i * 5} width="4" height="4" rx="1" fill="currentColor" opacity="0.2" className="conf" style={{animationDelay: `${i * 0.3}s`}} />
      ))}
      {/* İnsanlar - kutlama */}
      {[120, 160, 200, 240, 280].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={200} r="8" stroke="currentColor" strokeWidth="2" {...S} />
          <line x1={x} y1={208} x2={x} y2={235} stroke="currentColor" strokeWidth="2" {...S} />
          {i % 2 === 0 && <line x1={x} y1={215} x2={x + 12} y2={195} stroke="currentColor" strokeWidth="1.5" {...S} />}
        </g>
      ))}
      {/* Bağımsız Türkiye */}
      <rect x="60" y="260" width="280" height="60" rx="6" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.04" {...S} />
      <text x="85" y="288" fontSize="16" fill="currentColor" opacity="0.2" fontWeight="bold" fontFamily="serif">BAĞIMSIZ TÜRKİYE</text>
      <text x="115" y="308" fontSize="9" fill="currentColor" opacity="0.15">Tam bağımsızlık, dünya tarafından tanındı</text>
      {/* Bayraklar */}
      <g opacity="0.3">
        <line x1="70" y1="150" x2="70" y2="100" stroke="currentColor" strokeWidth="2" {...S} />
        <path d="M70 100 L95 108 L70 118" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.1" {...S} />
        <line x1="330" y1="150" x2="330" y2="100" stroke="currentColor" strokeWidth="2" {...S} />
        <path d="M330 100 L355 108 L330 118" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.1" {...S} />
      </g>
    </svg>
  );
}

function SceneInkilapHukuk() {
  return (
    <svg viewBox="0 0 400 350" className="w-full h-full max-w-[400px]">
      {/* Terazi - büyük */}
      <line x1="200" y1="30" x2="200" y2="150" stroke="currentColor" strokeWidth="3" {...S} />
      <line x1="120" y1="80" x2="280" y2="80" stroke="currentColor" strokeWidth="3" {...S} />
      <circle cx="200" cy="30" r="8" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.06" {...S} />
      <path d="M120 80 L100 130 L140 130 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.05" {...S} />
      <path d="M280 80 L260 130 L300 130 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.05" {...S} />
      {/* Sol kefe: Eski hukuk */}
      <text x="95" y="148" fontSize="8" fill="currentColor" opacity="0.15" textAnchor="middle">Mecelle</text>
      {/* Sağ kefe: Yeni hukuk */}
      <text x="280" y="148" fontSize="8" fill="currentColor" opacity="0.25" fontWeight="bold" textAnchor="middle">Medeni K.</text>
      {/* Hukuk inkılapları listesi */}
      <rect x="40" y="170" width="150" height="150" rx="5" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.04" {...S} />
      <text x="55" y="195" fontSize="10" fill="currentColor" opacity="0.25" fontWeight="bold">HUKUK DEVRİMLERİ</text>
      <line x1="55" y1="202" x2="175" y2="202" stroke="currentColor" strokeWidth="1" opacity="0.1" {...S} />
      <text x="55" y="220" fontSize="8" fill="currentColor" opacity="0.2">• Medeni Kanun (1926)</text>
      <text x="55" y="238" fontSize="8" fill="currentColor" opacity="0.2">• Anayasa (1924)</text>
      <text x="55" y="256" fontSize="8" fill="currentColor" opacity="0.2">• Ceza Kanunu (1926)</text>
      <text x="55" y="274" fontSize="8" fill="currentColor" opacity="0.2">• Ticaret Kanunu (1926)</text>
      <text x="55" y="292" fontSize="8" fill="currentColor" opacity="0.2">• Borçlar Kanunu (1926)</text>
      {/* Kadın hakları */}
      <rect x="210" y="170" width="150" height="150" rx="5" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.04" {...S} />
      <text x="225" y="195" fontSize="10" fill="currentColor" opacity="0.25" fontWeight="bold">KADIN HAKLARI</text>
      <line x1="225" y1="202" x2="345" y2="202" stroke="currentColor" strokeWidth="1" opacity="0.1" {...S} />
      {/* Kadın figürleri */}
      <circle cx="260" cy="240" r="12" stroke="currentColor" strokeWidth="2" {...S} />
      <line x1="260" y1="252" x2="260" y2="290" stroke="currentColor" strokeWidth="2" {...S} />
      <circle cx="310" cy="240" r="12" stroke="currentColor" strokeWidth="2" {...S} />
      <line x1="310" y1="252" x2="310" y2="290" stroke="currentColor" strokeWidth="2" {...S} />
      <text x="225" y="310" fontSize="8" fill="currentColor" opacity="0.2">Seçme-Seçilme: 1934</text>
    </svg>
  );
}

function SceneInkilapToplum() {
  return (
    <svg viewBox="0 0 400 350" className="w-full h-full max-w-[400px]">
      <style>{`
        @keyframes clockTick { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .tick{animation:clockTick 10s linear infinite;transform-origin:320px 80px}
      `}</style>
      {/* Takvim ve saat - modern zaman */}
      <circle cx="320" cy="80" r="35" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.04" {...S} />
      <text x="305" y="85" fontSize="12" fill="currentColor" opacity="0.15">12</text>
      <text x="350" y="85" fontSize="9" fill="currentColor" opacity="0.12">3</text>
      <text x="315" y="112" fontSize="9" fill="currentColor" opacity="0.12">6</text>
      <text x="290" y="85" fontSize="9" fill="currentColor" opacity="0.12">9</text>
      <g className="tick">
        <line x1="320" y1="80" x2="320" y2="55" stroke="currentColor" strokeWidth="2" {...S} />
        <line x1="320" y1="80" x2="340" y2="80" stroke="currentColor" strokeWidth="1.5" {...S} />
      </g>
      {/* Okul */}
      <rect x="30" y="50" width="120" height="80" rx="4" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.05" {...S} />
      <path d="M25 50 L90 20 L155 50" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.04" {...S} />
      <rect x="70" y="95" width="25" height="35" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.06" {...S} />
      <text x="45" y="145" fontSize="8" fill="currentColor" opacity="0.2" fontWeight="bold">TEVHİD-İ TEDRİSAT</text>
      {/* Toplumsal değişimler */}
      <rect x="30" y="170" width="160" height="150" rx="5" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.04" {...S} />
      <text x="42" y="195" fontSize="10" fill="currentColor" opacity="0.25" fontWeight="bold">TOPLUM DEVRİMLERİ</text>
      <line x1="42" y1="202" x2="178" y2="202" stroke="currentColor" strokeWidth="1" opacity="0.1" {...S} />
      <text x="42" y="220" fontSize="8" fill="currentColor" opacity="0.2">• Takvim değişimi</text>
      <text x="42" y="236" fontSize="8" fill="currentColor" opacity="0.2">• Ölçü-tartı (metrik)</text>
      <text x="42" y="252" fontSize="8" fill="currentColor" opacity="0.2">• Soyadı Kanunu (1934)</text>
      <text x="42" y="268" fontSize="8" fill="currentColor" opacity="0.2">• Tekke-zaviye kapatma</text>
      <text x="42" y="284" fontSize="8" fill="currentColor" opacity="0.2">• Kılık-kıyafet devrimi</text>
      {/* Ekonomi */}
      <rect x="210" y="170" width="160" height="150" rx="5" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.04" {...S} />
      <text x="222" y="195" fontSize="10" fill="currentColor" opacity="0.25" fontWeight="bold">EKONOMİ DEVRİMLERİ</text>
      <line x1="222" y1="202" x2="358" y2="202" stroke="currentColor" strokeWidth="1" opacity="0.1" {...S} />
      <text x="222" y="220" fontSize="8" fill="currentColor" opacity="0.2">• İzmir İktisat Kongresi</text>
      <text x="222" y="236" fontSize="8" fill="currentColor" opacity="0.2">• Kabotaj Kanunu</text>
      <text x="222" y="252" fontSize="8" fill="currentColor" opacity="0.2">• Aşar vergisi kaldırma</text>
      <text x="222" y="268" fontSize="8" fill="currentColor" opacity="0.2">• Devlet fabrikaları</text>
      <text x="222" y="284" fontSize="8" fill="currentColor" opacity="0.2">• Tarım ve sanayi</text>
      {/* Çağdaşlaşma */}
      <text x="100" y="340" fontSize="14" fill="currentColor" opacity="0.1" fontWeight="bold" fontFamily="serif">ÇAĞDAŞLAŞMA</text>
    </svg>
  );
}

function SceneAtaturkculukBulusma() {
  return (
    <svg viewBox="0 0 400 350" className="w-full h-full max-w-[400px]">
      <style>{`
        @keyframes heartbeat { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
        .hb{animation:heartbeat 2s ease-in-out infinite;transform-origin:200px 175px}
      `}</style>
      {/* Atatürk figürü - halkla */}
      <circle cx="200" cy="80" r="20" stroke="currentColor" strokeWidth="3" {...S} />
      <line x1="200" y1="100" x2="200" y2="160" stroke="currentColor" strokeWidth="3" {...S} />
      {/* Kalpak */}
      <path d="M186 72 Q186 58 200 53 Q214 58 214 72" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.06" {...S} />
      {/* Kollar açık - halkı kucaklıyor */}
      <line x1="200" y1="125" x2="155" y2="150" stroke="currentColor" strokeWidth="2.5" {...S} />
      <line x1="200" y1="125" x2="245" y2="150" stroke="currentColor" strokeWidth="2.5" {...S} />
      {/* Halk dairesi */}
      <circle cx="200" cy="175" r="80" stroke="currentColor" strokeWidth="2" opacity="0.08" className="hb" {...S} />
      {/* Halk figürleri - çevresinde */}
      {[
        { x: 130, y: 200 }, { x: 160, y: 230 }, { x: 200, y: 245 },
        { x: 240, y: 230 }, { x: 270, y: 200 },
        { x: 140, y: 170 }, { x: 260, y: 170 },
      ].map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="7" stroke="currentColor" strokeWidth="1.5" {...S} />
          <line x1={p.x} y1={p.y + 7} x2={p.x} y2={p.y + 22} stroke="currentColor" strokeWidth="1.5" {...S} />
        </g>
      ))}
      {/* Sözler */}
      <text x="60" y="300" fontSize="9" fill="currentColor" opacity="0.2" fontStyle="italic">"Benim en büyük eserim Türkiye Cumhuriyeti'dir"</text>
      <text x="90" y="340" fontSize="11" fill="currentColor" opacity="0.12" fontWeight="bold" fontFamily="serif">ATATÜRKÇÜ DÜŞÜNCE</text>
    </svg>
  );
}

function SceneAtaturkculukCumMill() {
  return (
    <svg viewBox="0 0 400 350" className="w-full h-full max-w-[400px]">
      {/* İki ilke - büyük kartlar */}
      {/* Cumhuriyetçilik */}
      <rect x="20" y="30" width="170" height="140" rx="8" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.05" {...S} />
      <text x="40" y="60" fontSize="13" fill="currentColor" opacity="0.3" fontWeight="bold">CUMHURİYETÇİLİK</text>
      <line x1="40" y1="70" x2="170" y2="70" stroke="currentColor" strokeWidth="1" opacity="0.1" {...S} />
      {/* Oy sandığı */}
      <rect x="75" y="85" width="40" height="35" rx="3" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.08" {...S} />
      <line x1="85" y1="85" x2="105" y2="85" stroke="currentColor" strokeWidth="2" {...S} />
      <rect x="90" y="78" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.06" {...S} />
      <text x="40" y="140" fontSize="7" fill="currentColor" opacity="0.2">Halk yönetimi seçer</text>
      <text x="40" y="155" fontSize="7" fill="currentColor" opacity="0.2">Egemenlik milletindir</text>
      {/* Milliyetçilik */}
      <rect x="210" y="30" width="170" height="140" rx="8" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.05" {...S} />
      <text x="230" y="60" fontSize="13" fill="currentColor" opacity="0.3" fontWeight="bold">MİLLİYETÇİLİK</text>
      <line x1="230" y1="70" x2="360" y2="70" stroke="currentColor" strokeWidth="1" opacity="0.1" {...S} />
      {/* Bayrak */}
      <line x1="295" y1="80" x2="295" y2="130" stroke="currentColor" strokeWidth="2" {...S} />
      <path d="M295 80 L330 92 L295 105" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.1" {...S} />
      <circle cx="310" cy="92" r="4" stroke="currentColor" strokeWidth="1" {...S} />
      <text x="230" y="140" fontSize="7" fill="currentColor" opacity="0.2">Millet birliği esastır</text>
      <text x="230" y="155" fontSize="7" fill="currentColor" opacity="0.2">Birleştirici milliyetçilik</text>
      {/* Laiklik */}
      <rect x="20" y="190" width="170" height="130" rx="8" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.05" {...S} />
      <text x="60" y="220" fontSize="13" fill="currentColor" opacity="0.3" fontWeight="bold">LAİKLİK</text>
      <line x1="40" y1="230" x2="170" y2="230" stroke="currentColor" strokeWidth="1" opacity="0.1" {...S} />
      {/* Din ve devlet ayrımı */}
      <circle cx="75" cy="260" r="15" stroke="currentColor" strokeWidth="2" {...S} />
      <circle cx="115" cy="260" r="15" stroke="currentColor" strokeWidth="2" {...S} />
      <text x="68" y="264" fontSize="7" fill="currentColor" opacity="0.2">Din</text>
      <text x="105" y="264" fontSize="7" fill="currentColor" opacity="0.2">Devlet</text>
      <text x="40" y="300" fontSize="7" fill="currentColor" opacity="0.2">Vicdan özgürlüğü</text>
      {/* İnkılapçılık */}
      <rect x="210" y="190" width="170" height="130" rx="8" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.05" {...S} />
      <text x="230" y="220" fontSize="13" fill="currentColor" opacity="0.3" fontWeight="bold">İNKILAPÇILIK</text>
      <line x1="230" y1="230" x2="360" y2="230" stroke="currentColor" strokeWidth="1" opacity="0.1" {...S} />
      {/* Ok - ilerleme */}
      <path d="M270 260 L330 260" stroke="currentColor" strokeWidth="3" {...S} />
      <path d="M322 252 L335 260 L322 268" stroke="currentColor" strokeWidth="2.5" {...S} />
      <text x="230" y="300" fontSize="7" fill="currentColor" opacity="0.2">Sürekli gelişme ve</text>
      <text x="230" y="312" fontSize="7" fill="currentColor" opacity="0.2">çağdaşlaşma</text>
    </svg>
  );
}

function SceneAtaturkculukHalDev() {
  return (
    <svg viewBox="0 0 400 350" className="w-full h-full max-w-[400px]">
      {/* Halkçılık */}
      <rect x="20" y="30" width="360" height="130" rx="8" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.05" {...S} />
      <text x="130" y="60" fontSize="16" fill="currentColor" opacity="0.3" fontWeight="bold">HALKÇILIK</text>
      <line x1="40" y1="70" x2="360" y2="70" stroke="currentColor" strokeWidth="1" opacity="0.1" {...S} />
      {/* Eşit insanlar */}
      {[80, 140, 200, 260, 320].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={100} r="10" stroke="currentColor" strokeWidth="2" {...S} />
          <line x1={x} y1={110} x2={x} y2={135} stroke="currentColor" strokeWidth="2" {...S} />
        </g>
      ))}
      <text x="100" y="155" fontSize="8" fill="currentColor" opacity="0.2">Sınıf ayrımı yok — herkes eşit vatandaş</text>
      {/* Devletçilik */}
      <rect x="20" y="180" width="360" height="140" rx="8" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.05" {...S} />
      <text x="120" y="210" fontSize="16" fill="currentColor" opacity="0.3" fontWeight="bold">DEVLETÇİLİK</text>
      <line x1="40" y1="220" x2="360" y2="220" stroke="currentColor" strokeWidth="1" opacity="0.1" {...S} />
      {/* Fabrikalar */}
      {[80, 170, 260].map(x => (
        <g key={x}>
          <rect x={x} y={240} width="60" height="40" rx="3" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.06" {...S} />
          <rect x={x + 10} y={225} width="12" height="20" rx="1" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.05" {...S} />
          <rect x={x + 30} y={230} width="12" height="15" rx="1" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.05" {...S} />
        </g>
      ))}
      <text x="80" y="300" fontSize="8" fill="currentColor" opacity="0.2">Devlet ekonomiyi yönlendirir — özel sektörle birlikte</text>
      {/* Alt başlık */}
      <text x="70" y="340" fontSize="12" fill="currentColor" opacity="0.12" fontWeight="bold" fontFamily="serif">Altı ilke bir bütündür, birbirini tamamlar</text>
    </svg>
  );
}

function SceneDefault() {
  return (
    <svg viewBox="0 0 400 350" className="w-full h-full max-w-[400px]">
      {/* Bayrak */}
      <line x1="200" y1="30" x2="200" y2="250" stroke="currentColor" strokeWidth="3" {...S} />
      <path d="M200 30 L300 60 L200 90" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.1" {...S} />
      <circle cx="240" cy="60" r="12" stroke="currentColor" strokeWidth="2" {...S} />
      <path d="M260 52 L264 60 L272 60 L266 66 L268 74 L260 68 L252 74 L254 66 L248 60 L256 60 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.15" {...S} />
      {/* Kitap */}
      <path d="M120 260 L120 200 Q120 195 125 195 L190 195 Q195 195 195 200 L195 260" stroke="currentColor" strokeWidth="2.5" {...S} />
      <path d="M195 260 L195 200 Q195 195 200 195 L265 195 Q270 195 270 200 L270 260" stroke="currentColor" strokeWidth="2.5" {...S} />
      <line x1="120" y1="260" x2="270" y2="260" stroke="currentColor" strokeWidth="2.5" {...S} />
    </svg>
  );
}

// Sahne eşleştirme haritası
const SCENE_MAP: Record<string, () => JSX.Element> = {
  'kahraman-dogum': SceneKahramanDogum,
  'kahraman-okul': SceneKahramanOkul,
  'kahraman-harbiye': SceneKahramanHarbiye,
  'kahraman-canakkale': SceneKahramanCanakkale,
  'kahraman-lider': SceneKahramanLider,
  'uyanis-mondros': SceneUyanisIsgal,
  'uyanis-isgal': SceneUyanisIsgal,
  'uyanis-cemiyetler': SceneUyanisCemiyetler,
  'uyanis-samsun': SceneUyanisSamsun,
  'uyanis-direnis': SceneUyanisDirenis,
  'hazirlik-amasya': SceneKongreler,
  'hazirlik-erzurum': SceneKongreler,
  'hazirlik-sivas': SceneKongreler,
  'hazirlik-misak': SceneHazirlikMisak,
  'hazirlik-sonmeclis': SceneHazirlikSonMeclis,
  'tbmm-acilis': SceneTBMM,
  'tbmm-anayasa': SceneTBMMAnayasa,
  'tbmm-isyanlar': SceneTBMMIsyanlar,
  'tbmm-meclis': SceneTBMM,
  'tbmm-bayrak': SceneTBMM,
  'cephe-dogu': SceneCepheDogu,
  'cephe-guney': SceneCepheGuney,
  'cephe-inonu': SceneCepheInonu,
  'cephe-sakarya': SceneCepheSakarya,
  'cephe-taarruz': SceneCepheler,
  'lozan-saltanat': SceneLozanSaltanat,
  'lozan-mudanya': SceneLozan,
  'lozan-masa': SceneLozan,
  'lozan-baris': SceneLozan,
  'lozan-zafer': SceneLozanZafer,
  'inkilap-cumhuriyet': SceneInkilaplar,
  'inkilap-harf': SceneInkilaplar,
  'inkilap-sapka': SceneInkilaplar,
  'inkilap-hukuk': SceneInkilapHukuk,
  'inkilap-toplum': SceneInkilapToplum,
  'ataturkculuk-6ok': SceneAtaturkculuk6Ok,
  'ataturkculuk-bulusma': SceneAtaturkculukBulusma,
  'ataturkculuk-cummill': SceneAtaturkculukCumMill,
  'ataturkculuk-haldev': SceneAtaturkculukHalDev,
  'ataturkculuk-bayrak': SceneAtaturkculuk6Ok,
  'default': SceneDefault,
};

// Her ünite için sahne dizisi
function generateDoodleScenes(unitName: string): DoodleScene[] {
  const lower = unitName.toLowerCase();

  if (lower.includes('kahraman') || lower.includes('doğuyor') || lower.includes('doguyor')) {
    return [
      { caption: 'Selanik, 1881 — Bir kahraman dünyaya geliyor', date: '1881', scene: 'kahraman-dogum' },
      { caption: 'Askeri okullarda parlak bir öğrenci — Matematik öğretmeni ona "Kemal" adını verir', date: '1893', scene: 'kahraman-okul' },
      { caption: 'Harbiye Mektebi — Genç bir subay olarak yetişiyor', date: '1902', scene: 'kahraman-harbiye' },
      { caption: 'Çanakkale\'de efsane doğuyor — "Ben size taarruzu değil, ölmeyi emrediyorum!"', date: '1915', scene: 'kahraman-canakkale' },
      { caption: 'Trablusgarp\'tan Balkan Savaşları\'na, savaştan savaşa bir lider yükseliyor', scene: 'kahraman-lider' },
    ];
  }

  if (lower.includes('uyanış') || lower.includes('uyanis') || lower.includes('milli uyan')) {
    return [
      { caption: 'Mondros Ateşkesi — Osmanlı silah bırakıyor, Anadolu işgal ediliyor', date: '1918', scene: 'uyanis-mondros' },
      { caption: 'İşgal güçleri İzmir, Urfa, Adana, Antep\'e giriyor', date: '1919', scene: 'uyanis-isgal' },
      { caption: 'Yararlı ve zararlı cemiyetler kuruluyor — Millet örgütleniyor', scene: 'uyanis-cemiyetler' },
      { caption: '19 Mayıs — Mustafa Kemal Samsun\'a çıkıyor, mücadele başlıyor', date: '1919', scene: 'uyanis-samsun' },
      { caption: 'Kuvayımilliye — Halk silahlanıyor, direniş büyüyor', scene: 'uyanis-direnis' },
    ];
  }

  if (lower.includes('hazırlık') || lower.includes('hazirlik') || lower.includes('kongre')) {
    return [
      { caption: 'Amasya Genelgesi — "Milletin istiklalini yine milletin azim ve kararı kurtaracaktır"', date: '1919', scene: 'hazirlik-amasya' },
      { caption: 'Erzurum Kongresi — Doğu\'da milli irade birleşiyor', date: '1919', scene: 'hazirlik-erzurum' },
      { caption: 'Sivas Kongresi — Tüm cemiyetler tek çatı altında: "Anadolu ve Rumeli Müdafaa-i Hukuk"', date: '1919', scene: 'hazirlik-sivas' },
      { caption: 'Misak-ı Milli — Son Osmanlı Meclisi milli sınırları çiziyor', date: '1920', scene: 'hazirlik-misak' },
      { caption: 'İstanbul işgal edildi, Meclis basıldı — Artık tek yol: Ankara!', date: '1920', scene: 'hazirlik-sonmeclis' },
    ];
  }

  if (lower.includes('tbmm') || lower.includes('meclis') || lower.includes('açılış') || lower.includes('acilis')) {
    return [
      { caption: '23 Nisan 1920 — TBMM Ankara\'da açılıyor', date: '1920', scene: 'tbmm-acilis' },
      { caption: '"Egemenlik kayıtsız şartsız milletindir" — Yeni devletin temeli', scene: 'tbmm-meclis' },
      { caption: '1921 Anayasası — Teşkilat-ı Esasiye Kanunu: Milli egemenlik yasalaşıyor', date: '1921', scene: 'tbmm-anayasa' },
      { caption: 'TBMM\'ye karşı isyanlar ve İstiklal Mahkemeleri — İç düşmanla mücadele', scene: 'tbmm-isyanlar' },
      { caption: 'Yeni Türk devleti doğuyor — Bayrak dalgalanıyor', scene: 'tbmm-bayrak' },
    ];
  }

  if (lower.includes('cephe')) {
    return [
      { caption: 'Doğu Cephesi — Kazım Karabekir\'in zaferi, Gümrü Antlaşması', date: '1920', scene: 'cephe-dogu' },
      { caption: 'Güney Cephesi — Antep, Maraş, Urfa\'nın kahramanlığı', date: '1920', scene: 'cephe-guney' },
      { caption: 'I. ve II. İnönü Muharebeleri — "Milletin makus talihini yendiniz!"', date: '1921', scene: 'cephe-inonu' },
      { caption: 'Sakarya Meydan Muharebesi — "Hattı müdafaa yoktur, sathı müdafaa vardır"', date: '1921', scene: 'cephe-sakarya' },
      { caption: 'Büyük Taarruz — 26 Ağustos 1922, düşman denize döküldü!', date: '1922', scene: 'cephe-taarruz' },
    ];
  }

  if (lower.includes('mudanya') || lower.includes('lozan')) {
    return [
      { caption: 'Saltanatın kaldırılması — Padişahlık sona eriyor', date: '1922', scene: 'lozan-saltanat' },
      { caption: 'Mudanya Ateşkesi — Silahlar susuyor, barış masası kuruluyor', date: '1922', scene: 'lozan-mudanya' },
      { caption: 'Lozan Barış Konferansı — İsmet Paşa masada, Türkiye\'nin haklarını savunuyor', date: '1923', scene: 'lozan-masa' },
      { caption: 'Lozan Barış Antlaşması imzalandı — Türkiye\'nin tapusu', date: '1923', scene: 'lozan-baris' },
      { caption: 'Zafer! — Tam bağımsızlık dünya tarafından tanındı', scene: 'lozan-zafer' },
    ];
  }

  if (lower.includes('inkılap') || lower.includes('inkilap')) {
    return [
      { caption: 'Cumhuriyetin İlanı — 29 Ekim 1923, yeni devletin doğuşu', date: '1923', scene: 'inkilap-cumhuriyet' },
      { caption: 'Harf Devrimi — Latin alfabesine geçiş, Millet Mektepleri', date: '1928', scene: 'inkilap-harf' },
      { caption: 'Şapka Kanunu, kıyafet devrimi — Çağdaş görünüm', date: '1925', scene: 'inkilap-sapka' },
      { caption: 'Hukuk devrimleri — Medeni Kanun, kadın hakları, eşitlik', date: '1926', scene: 'inkilap-hukuk' },
      { caption: 'Toplum ve ekonomi devrimleri — Takvim, fabrikalar, eğitim birliği', scene: 'inkilap-toplum' },
    ];
  }

  if (lower.includes('atatürkçü') || lower.includes('ataturkcu') || lower.includes('ilke')) {
    return [
      { caption: 'Atatürkçü Düşünce Sistemi — Bir milletin yol haritası', scene: 'ataturkculuk-bulusma' },
      { caption: 'Atatürkçülüğün 6 İlkesi — Bir bütünün parçaları', scene: 'ataturkculuk-6ok' },
      { caption: 'Cumhuriyetçilik, Milliyetçilik, Laiklik, İnkılapçılık', scene: 'ataturkculuk-cummill' },
      { caption: 'Halkçılık ve Devletçilik — Eşitlik ve kalkınma', scene: 'ataturkculuk-haldev' },
      { caption: 'Altı ok bir bayrak altında — Çağdaş Türkiye\'nin ilkeleri', scene: 'ataturkculuk-bayrak' },
    ];
  }

  return [
    { caption: unitName, scene: 'default' },
  ];
}

export function InteractiveNarrationView({
  unitName,
  subjectName,
  onComplete,
  onExit
}: InteractiveNarrationViewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const scenes = generateDoodleScenes(unitName);
  const progress = ((currentSlide + 1) / scenes.length) * 100;
  const scene = scenes[currentSlide];
  const SceneComponent = SCENE_MAP[scene.scene] || SCENE_MAP.default;

  const goToSlide = (index: number, dir: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(dir);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimating(false);
    }, 400);
  };

  const handleNext = () => {
    if (currentSlide < scenes.length - 1) {
      goToSlide(currentSlide + 1, 'next');
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1, 'prev');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') handleNext();
      else if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, isAnimating]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header - minimal */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border p-3 z-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onExit} className="shrink-0">
              <X className="w-5 h-5" />
            </Button>
            <Progress value={progress} className="flex-1 h-2" />
            <span className="text-xs font-medium text-muted-foreground shrink-0">
              {currentSlide + 1}/{scenes.length}
            </span>
          </div>
        </div>
      </div>

      {/* Doodle Scene - TAM EKRAN GÖRSEL */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-0">
        <div
          className={cn(
            "w-full max-w-lg flex flex-col items-center transition-all duration-400",
            isAnimating && direction === 'next' && "translate-x-8 opacity-0",
            isAnimating && direction === 'prev' && "-translate-x-8 opacity-0"
          )}
        >
          {/* BÜYÜK DOODLE - ana içerik */}
          <div className="w-full text-red-800 dark:text-red-400 mb-4">
            <SceneComponent />
          </div>

          {/* Tarih badge */}
          {scene.date && (
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-red-900/10 border border-red-800/20 mb-3">
              <span className="text-sm font-bold text-red-700 dark:text-red-400">{scene.date}</span>
            </div>
          )}

          {/* Kısa açıklama - Google Doodle tarzı */}
          <p className="text-center text-lg md:text-xl font-semibold text-foreground leading-snug px-2">
            {scene.caption}
          </p>

          {/* Slayt göstergeleri */}
          <div className="flex justify-center gap-2 mt-6">
            {scenes.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index, index > currentSlide ? 'next' : 'prev')}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  index === currentSlide
                    ? "w-8 bg-red-700 dark:bg-red-400"
                    : "w-2 bg-muted-foreground/20 hover:bg-muted-foreground/40"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky bottom-0 bg-card/80 backdrop-blur-sm border-t border-border p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="flex-1 h-12"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Geri
          </Button>

          <Button
            onClick={handleNext}
            className="flex-1 h-12 font-bold bg-red-700 hover:bg-red-800 text-white"
          >
            {currentSlide === scenes.length - 1 ? (
              <>
                <CheckCircle className="w-5 h-5 mr-1" />
                Quiz'e Başla
              </>
            ) : (
              <>
                İleri
                <ChevronRight className="w-5 h-5 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
