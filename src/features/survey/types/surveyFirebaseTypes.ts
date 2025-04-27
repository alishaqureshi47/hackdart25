export interface FirebaseSurvey {
  authorId: string;
  title: string;
  description: string;
  createdAt: Date;
  questions: SurveyQuestion[];
  imageUrl: string;
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
  rangeSize: number; // how big the range is
}