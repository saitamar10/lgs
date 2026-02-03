export type ExperimentType =
  | 'photosynthesis'
  | 'cell-division'
  | 'electric-circuit'
  | 'acid-base'
  | 'force-pressure'
  | 'generic';

export interface ExperimentStep {
  id: string;
  title: string;
  instruction: string;
  validationFn: (state: ExperimentState) => boolean;
  correctFeedback: string;
  incorrectFeedback: string;
  hintText?: string;
  mascotMessage?: string;
}

export interface ExperimentConfig {
  id: string;
  unitId: string;
  unitName: string;
  type: ExperimentType;
  title: string;
  description: string;
  steps: ExperimentStep[];
  totalSteps: number;
  estimatedTime: number; // minutes
}

export interface ExperimentState {
  currentStepIndex: number;
  completedSteps: string[];
  incorrectAttempts: Record<string, number>;
  interactionData: Record<string, any>; // Experiment-specific data
  startTime: Date;
  endTime?: Date;
}

export interface ExperimentResult {
  unitId: string;
  experimentId: string;
  totalSteps: number;
  correctSteps: number;
  successPercentage: number;
  xpAwarded: number;
  completionTime: number; // seconds
}

export interface ExperimentProgress {
  userId: string;
  unitId: string;
  experimentType: ExperimentType;
  completed: boolean;
  bestScore: number;
  attempts: number;
  lastAttemptAt?: Date;
}
