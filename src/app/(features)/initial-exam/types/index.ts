export type ExamStep = 'safety' | 'treatment' | 'review';

export interface SafetyQuestion {
  id: string;
  text: string;
  subItems?: string[];
  options: {
    id: string;
    text: string;
  }[];
}

export interface TreatmentQuestion {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
  }[];
}

export interface ExamAnswers {
  safety: Record<string, string>;
  treatment: Record<string, string>;
}

export type ExamAnswerTypes = 'safety' | 'treatment';