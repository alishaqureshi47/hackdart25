import SurveyRepository from "../repositories/survey.repository"; 

export async function fetchAllSurveys() {
  const surveyRepo = new SurveyRepository();

  try {
	const surveys = await surveyRepo.fetchAllSurveys();
	console.log("Fetched All Surveys:", surveys);
	return surveys;
  } catch (error) {
	console.error("Error fetching all surveys:", error);
	throw error;
  }
}

// Example usage
fetchAllSurveys();