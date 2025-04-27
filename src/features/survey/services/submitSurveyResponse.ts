import SurveyRepository from "../repositories/survey.repository";
import { SurveyAnswer } from "../types/surveyFirebaseTypes";

export async function submitSurveyResponse(surveyId: string, responses: SurveyAnswer[], respondentId: string) {
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
    // Validate and submit the survey responses
    await surveyRepo.submitSurveyResponse(surveyId, responses, respondentId);
    console.log("Survey responses submitted successfully.");
  } catch (error) {
    console.error("Error submitting survey responses:", error);
    throw error;
  }
}