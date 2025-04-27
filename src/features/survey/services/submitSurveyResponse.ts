import SurveyRepository from "../repositories/survey.repository";
import { SurveyAnswer } from "../types/surveyFirebaseTypes";

async function submitSurveyResponse(surveyId: string, response: any) { //TODO: take actual user parameters and shape them into a SurveyAnswer
  const surveyRepo = new SurveyRepository();

  try {
    await surveyRepo.submitSurveyResponse(surveyId, response);
    console.log("Survey response submitted successfully.");
  } catch (error) {
    console.error("Error submitting survey response:", error);
    throw error;
  }
}