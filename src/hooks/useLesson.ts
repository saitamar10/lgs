import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LessonSlide {
  title: string;
  content: string;
  icon: 'intro' | 'concept' | 'example' | 'tip' | 'summary';
  highlight?: string;
  mascotMood?: 'happy' | 'thinking' | 'celebrating' | 'encouraging';
  mascotMessage?: string;
}

export function useLesson() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateLesson = async (
    subjectName: string,
    unitName: string
  ): Promise<LessonSlide[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: funcError } = await supabase.functions.invoke('generate-lesson', {
        body: { subjectName, unitName }
      });

      if (funcError) {
        let errorMsg = 'Ders içeriği yüklenemedi';
        try {
          if (funcError.context) {
            const errorBody = await funcError.context.json();
            errorMsg = errorBody?.error || funcError.message || errorMsg;
          } else if (funcError.message) {
            errorMsg = funcError.message;
          }
        } catch {
          errorMsg = funcError.message || errorMsg;
        }
        throw new Error(errorMsg);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      return data.slides || [];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ders içeriği yüklenemedi';
      setError(message);
      console.error('Lesson generation error:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateLesson,
    isLoading,
    error
  };
}
