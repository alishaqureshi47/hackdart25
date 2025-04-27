import { moderateContent } from "@/features/moderation/utils/moderateContent";
import { SurveyAnswer, TextAnswer } from "@/features/survey/types/surveyFirebaseTypes";
import ModerationResult from "../types/moderationTypes";

export async function moderateSurveyResponse(surveyAnswers: SurveyAnswer[]): Promise<boolean> {
    await Promise.all(surveyAnswers.map(async (answer) => {
        if (answer.questionType === "text") {
            // Moderate text answers
            const textAnswer = answer as TextAnswer;
            const modResult: ModerationResult = await moderateContent(textAnswer.answerText);
            if (modResult.isFlagged) {
                // If the answer is blocked, return false
                return false;
            }
        }
    }));
  return true; // If all answers are valid, return true
}