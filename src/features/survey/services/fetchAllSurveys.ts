import SurveyRepository from "../repositories/survey.repository"; 
import { FirebaseSurvey } from "../types/surveyFirebaseTypes";

export async function fetchAllSurveys() {
  const surveyRepo = new SurveyRepository();

  try {
	const surveys: FirebaseSurvey[] = await surveyRepo.fetchAllSurveys();
	console.log("Fetched All Surveys:", surveys);
	return surveys;
  } catch (error) {
	console.error("Error fetching all surveys:", error);
	throw error;
  }
}

// Example usage
fetchAllSurveys();