// Import the SurveyRepository
import SurveyRepository from "../repositories/survey.repository";

// Initialize the repository
const surveyRepository = new SurveyRepository();

// Function to delete a survey with safety checks
export async function removeSurvey(surveyId: string): Promise<void> {
  // Safety checks for surveyId
  if (!surveyId || typeof surveyId !== 'string' || surveyId.trim() === '') {
    throw new Error('Invalid survey ID provided.');
  }

  try {
    // Call the deleteSurvey method from the repository
    await surveyRepository.deleteSurvey(surveyId);
    console.log(`Survey with ID ${surveyId} deleted successfully.`);
  } catch (error) {
    console.error(`Failed to delete survey with ID ${surveyId}:`, error);
    throw error; // Re-throw the error if needed
  }
}