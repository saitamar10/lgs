import { ExperimentType } from '@/types/experiments';

/**
 * Fen Bilimleri dersini tespit eder
 */
export function isScienceSubject(subjectId: string, subjectName: string): boolean {
  const lowerName = subjectName.toLowerCase();
  return lowerName.includes('fen') || lowerName.includes('science');
}

/**
 * İnkılap Tarihi dersini tespit eder
 */
export function isHistorySubject(subjectId: string, subjectName: string): boolean {
  const name = subjectName;
  const lower = name.toLowerCase();
  return name.includes('İnkılap') || name.includes('inkılap') || lower.includes('inkilap');
}

/**
 * Ünite adına göre deney tipini belirler
 */
export function getExperimentTypeForUnit(unitName: string): ExperimentType {
  const lowerName = unitName.toLowerCase();

  // Anahtar kelime eşleştirme
  const mapping: Record<string, ExperimentType> = {
    'fotosentez': 'photosynthesis',
    'photosynthesis': 'photosynthesis',
    'bitki': 'photosynthesis',

    'hücre': 'cell-division',
    'mitoz': 'cell-division',
    'mayoz': 'cell-division',
    'bölünme': 'cell-division',
    'cell': 'cell-division',

    'elektrik': 'electric-circuit',
    'devre': 'electric-circuit',
    'ampul': 'electric-circuit',
    'pil': 'electric-circuit',
    'akım': 'electric-circuit',
    'electric': 'electric-circuit',
    'circuit': 'electric-circuit',

    'asit': 'acid-base',
    'baz': 'acid-base',
    'ph': 'acid-base',
    'nötr': 'acid-base',
    'acid': 'acid-base',
    'base': 'acid-base',

    'kuvvet': 'force-pressure',
    'basınç': 'force-pressure',
    'hareket': 'force-pressure',
    'sürtünme': 'force-pressure',
    'force': 'force-pressure',
    'pressure': 'force-pressure',
  };

  // İlk eşleşen anahtar kelimeyi bul
  const matchedKey = Object.keys(mapping).find(key =>
    lowerName.includes(key)
  );

  // Eşleşme varsa ilgili tipi, yoksa generic döndür
  return matchedKey ? mapping[matchedKey] : 'generic';
}

/**
 * Deney tipine göre Türkçe isim döndürür
 */
export function getExperimentTypeName(type: ExperimentType): string {
  const names: Record<ExperimentType, string> = {
    'photosynthesis': 'Fotosentez',
    'cell-division': 'Hücre Bölünmesi',
    'electric-circuit': 'Elektrik Devreleri',
    'acid-base': 'Asit-Baz',
    'force-pressure': 'Kuvvet ve Basınç',
    'generic': 'Genel Deney'
  };

  return names[type];
}

/**
 * Deney tipine göre emoji döndürür
 */
export function getExperimentEmoji(type: ExperimentType): string {
  const emojis: Record<ExperimentType, string> = {
    'photosynthesis': '🌱',
    'cell-division': '🧬',
    'electric-circuit': '💡',
    'acid-base': '🧪',
    'force-pressure': '⚙️',
    'generic': '🔬'
  };

  return emojis[type];
}
