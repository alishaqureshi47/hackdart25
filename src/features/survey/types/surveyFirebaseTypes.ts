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
  responses: RangeAnswer[]; // Array of answers for this question type
}

export interface TextQuestion {
  questionText: string;
  questionType: "text";
  responses: RangeAnswer[]; // Array of answers for this question type
}

export interface RangeQuestion {
  questionText: string;
  questionType: "range";
  rangeSize: number; // how big the range is
  responses: RangeAnswer[]; // Array of answers for this question type
}

export type SurveyAnswer =
  | MultipleChoiceAnswer
  | TextAnswer
  | RangeAnswer;

export interface MultipleChoiceAnswer {
  selectedOption: string; // The selected option for the multiple-choice question
  selectedOptionIndex: number; // The index of the selected option
}

export interface TextAnswer {
  answerText: string; // The text response for the text question
}

export interface RangeAnswer {
  selectedValue: number; // The selected value within the range
}