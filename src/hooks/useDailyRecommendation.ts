import { useMemo } from 'react';
import { useSubjects, useUnits, Subject } from '@/hooks/useSubjects';
import { useStudyPlan, calculateDaysRemaining } from '@/hooks/useStudyPlan';
import { useAllStageProgress, getNextStage } from '@/hooks/useStageProgress';

interface DailyRecommendation {
  subject: Subject | null;
  unitId: string | null;
  unitName: string | null;
  message: string;
}

// Day-based subject rotation (0=Sunday, 1=Monday, etc.)
const daySubjectMap: Record<number, string> = {
  0: 'matematik', // Sunday
  1: 'turkce',    // Monday
  2: 'matematik', // Tuesday - more math
  3: 'fen',       // Wednesday
  4: 'inkilap',   // Thursday
  5: 'ingilizce', // Friday
  6: 'din',       // Saturday
};

export function useDailyRecommendation(): DailyRecommendation {
  const { data: subjects } = useSubjects();
  const { data: studyPlan } = useStudyPlan();
  const { data: allProgress } = useAllStageProgress();

  return useMemo(() => {
    if (!subjects || subjects.length === 0) {
      return { subject: null, unitId: null, unitName: null, message: 'Dersler yükleniyor...' };
    }

    const today = new Date();
    const dayOfWeek = today.getDay();
    const recommendedSlug = daySubjectMap[dayOfWeek];

    // Find recommended subject
    let recommendedSubject = subjects.find(s => s.slug === recommendedSlug);
    
    // Fallback to first subject if not found
    if (!recommendedSubject) {
      recommendedSubject = subjects[0];
    }

    // Calculate days remaining for motivation
    const daysRemaining = studyPlan ? calculateDaysRemaining(studyPlan.exam_date) : 0;

    // Create progress map
    const progressMap = new Map<string, any>();
    allProgress?.forEach(p => progressMap.set(p.unit_id, p));

    // Generate motivation message based on day and progress
    const dayMessages: Record<number, string> = {
      0: 'Pazar günü matematik çalışmak için harika! 🧮',
      1: 'Haftaya güçlü başla! Türkçe ile devam et 📚',
      2: 'Salı matematiği güçlendir! 📐',
      3: 'Çarşamba fen günü! Deneyleri öğren 🔬',
      4: 'Tarih bilgini tazele! 🏛️',
      5: 'Cuma İngilizce günü! 🌍',
      6: 'Cumartesi molası - hafif çalış! 🕌',
    };

    const message = daysRemaining > 0 
      ? `${dayMessages[dayOfWeek]} (${daysRemaining} gün kaldı)`
      : dayMessages[dayOfWeek];

    return {
      subject: recommendedSubject,
      unitId: null, // Will be determined by unit selection
      unitName: null,
      message
    };
  }, [subjects, studyPlan, allProgress]);
}
