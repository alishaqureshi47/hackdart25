export interface CreateSurveyInput {
  topic: string; // The topic of the survey
  objective: string; // The objective of the survey
  prethoughtQuestions?: PrethoughtQuestion[]; // Array of prethought questions
  defaultHeaderPaths?: readonly string[]   // all defaults
  selectedHeaderPath?: string              // the one chosen at random
}

export interface PrethoughtQuestion {
  questionText: string; // The text of the question
  questionDetails?: string; // Additional details about the question
}