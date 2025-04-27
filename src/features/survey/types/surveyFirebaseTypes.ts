export interface FirebaseSurvey {
  id: string; // Document ID
  authorId: string;
  // domain: string; //TODO
  title: string;
  description: string;
  createdAt: Date;
  questions: SurveyQuestion[];
  imageUrl: string;
  responses: SurveyAnswer[]; // Array of answers for all questions
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

export type SurveyAnswer =
  | MultipleChoiceAnswer
  | TextAnswer
  | RangeAnswer;

export interface MultipleChoiceAnswer {
  selectedOption: string; // The selected option for the multiple-choice question
  selectedOptionIndex: number; // The index of the selected option
  questionType: "multiple-choice"; // The type of the question
}

export interface TextAnswer {
  answerText: string; // The text response for the text question
  questionType: "text"; // The type of the question
}

export interface RangeAnswer {
  selectedValue: number; // The selected value within the range
  selectedValueIndex: number; // The index of the selected value
  questionType: "range";
}