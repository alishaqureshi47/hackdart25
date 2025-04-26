export interface FirebaseSurvey {
  id: string;
  authorId: string;
  title: string;
  description?: string; // Optional
  createdAt: Date;
  questions: SurveyQuestion[];
}

export type SurveyQuestion =
  | MultipleChoiceQuestion
  | TextQuestion
  | RangeQuestion;

export interface MultipleChoiceQuestion {
  questionText: string;
  questionType: "multiple-choice";
  options: string[]; // Required for multiple-choice questions
}

export interface TextQuestion {
  questionText: string;
  questionType: "text";
}

export interface RangeQuestion {
  questionText: string;
  questionType: "range";
  min: number; // Minimum value for the range
  max: number; // Maximum value for the range
  minDescription?: string; // Optional description for the minimum value
  maxDescription?: string; // Optional description for the maximum value
}