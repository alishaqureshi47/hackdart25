import SurveyRepository from "../repositories/survey.repository"; 

async function fetchAllSurveysForUser(userId: string) {
	const surveyRepo = new SurveyRepository();

	try {
		const surveys = await surveyRepo.fetchSurveysByUser(userId);
		console.log("Fetched Surveys for User:", surveys);
		return surveys;
	} catch (error) {
		console.error("Error fetching surveys for user:", error);
		throw error;
	}
}