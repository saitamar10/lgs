/**
 * Başarı oranına göre XP hesaplar
 */
export function calculateExperimentXP(successPercentage: number): number {
  if (successPercentage >= 100) return 150; // Mükemmel
  if (successPercentage >= 80) return 100;  // Harika
  if (successPercentage >= 60) return 75;   // İyi
  return 50;                                // Pratik yap
}

/**
 * Başarı oranına göre mesaj döndürür
 */
export function getSuccessMessage(percentage: number, topicName: string): string {
  if (percentage >= 100) {
    return `Mükemmel! ${topicName} konusunu tamamen anladın! 🎉`;
  }
  if (percentage >= 80) {
    return `Harika! %${Math.round(percentage)} başarı gösterdin! 🌟`;
  }
  if (percentage >= 60) {
    return `İyi! %${Math.round(percentage)} başarılısın! 👍`;
  }
  return `Pratik yapmalısın! %${Math.round(percentage)} başarı. 💪`;
}

/**
 * Başarı oranına göre renk döndürür
 */
export function getSuccessColor(percentage: number): string {
  if (percentage >= 100) return 'text-success';
  if (percentage >= 80) return 'text-primary';
  if (percentage >= 60) return 'text-warning';
  return 'text-destructive';
}

/**
 * Başarı oranına göre badge variant döndürür
 */
export function getSuccessBadgeVariant(percentage: number): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (percentage >= 100) return 'default';
  if (percentage >= 80) return 'default';
  if (percentage >= 60) return 'secondary';
  return 'destructive';
}

/**
 * Tamamlanma süresini formatlar
 */
export function formatCompletionTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} saniye`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes} dakika`;
  }

  return `${minutes} dakika ${remainingSeconds} saniye`;
}
