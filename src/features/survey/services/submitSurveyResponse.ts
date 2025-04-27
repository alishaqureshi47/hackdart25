import SurveyRepository from "../repositories/survey.repository";
import { SurveyAnswer } from "../types/surveyFirebaseTypes";
import ModerationResult from "@/features/moderation/types/moderationTypes";
import { moderateSurveyResponse } from "@/features/moderation/services/moderateSurveyResponse";

export async function submitSurveyResponse(
  surveyId: string,
  responses: SurveyAnswer[],
  respondentId: string
) {
  if (!surveyId || surveyId.trim() === "") {
    throw new Error("Invalid surveyId: surveyId cannot be null, empty, or whitespace.");
  }

  if (!respondentId || respondentId.trim() === "") {
    throw new Error("Invalid respondentId: respondentId cannot be null, empty, or whitespace.");
  }

  if (!responses || responses.length === 0) {
    throw new Error("Invalid responses: responses cannot be null or an empty array.");
  }

  const surveyRepo = new SurveyRepository();

  try {
    if (true) {
      // Moderate the survey responses
      const moderationResult = await moderateSurveyResponse(responses);

      // If moderation fails, throw an error
      if (!moderationResult) {
        throw new Error("Moderation failed: One or more survey responses were flagged.");
      }
    }

    // Validate and submit the moderated survey responses
    await surveyRepo.submitSurveyResponse(surveyId, responses, respondentId);
    console.log("Survey responses submitted successfully.");
  } catch (error) {
    console.error("Error submitting survey responses:", error);
    throw error;
  }
}