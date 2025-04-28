import { SurveyAnswer, TextAnswer } from "@/features/survey/types/surveyFirebaseTypes";
import { filterGoodResponses } from "../utils/filterGoodResponses";

export async function filterAnswers(surveyAnswers: SurveyAnswer[]): Promise<boolean> {
    await Promise.all(surveyAnswers.map(async (answer) => {
        if (answer.questionType === "text") {
            // check text answers
            const textAnswer = answer as TextAnswer;
            const checkResult: boolean = await filterGoodResponses(textAnswer.answerText);
            if (!checkResult) {
                // If one answer is blocked, return false
                return false;
            }
        }
    }));
  return true; // If all answers are valid, return true
}