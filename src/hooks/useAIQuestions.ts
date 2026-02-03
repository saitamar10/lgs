import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AIQuestion {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  difficulty: number;
  xp_value: number;
  unit_id?: string;
  image_url?: string; // Optional image URL for math questions
}

interface GenerateQuestionsParams {
  subjectName: string;
  unitName: string;
  difficulty: number;
  count?: number;
}

export function useAIQuestions() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuestions = async ({
    subjectName,
    unitName,
    difficulty,
    count = 5
  }: GenerateQuestionsParams): Promise<AIQuestion[]> => {
    setIsGenerating(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-questions', {
        body: { subjectName, unitName, difficulty, count }
      });

      if (fnError) {
        throw fnError;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return data?.questions || [];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sorular üretilemedi';
      setError(message);
      console.error('Failed to generate questions:', err);
      return [];
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateQuestions,
    isGenerating,
    error
  };
}
