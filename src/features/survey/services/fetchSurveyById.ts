import SurveyRepository from "../repositories/survey.repository";
import { FirebaseSurvey } from "../types/surveyFirebaseTypes"; // Adjust the path to your type definitions

/**
 * Wrapper function to fetch a survey by ID with additional safety checks.
 * @param surveyId - The ID of the survey to fetch.
 * @returns A promise resolving to the survey object in FirebaseSurvey format.
 */
export async function fetchSurveyById(surveyId: string): Promise<FirebaseSurvey | null> {
    // Initialize the repository
    const surveyRepository = new SurveyRepository();
    // Perform safety checks for surveyId
    if (!surveyId || typeof surveyId !== "string" || surveyId.trim() === "") {
        throw new Error("Invalid survey ID provided.");
    }

    try {
        // Call the fetchSurveyById function
        const survey = await surveyRepository.fetchSurveyById(surveyId);

        // Additional checks (e.g., ensure required fields are present)
        if (!survey) {
            console.error(`Survey with ID ${surveyId} not found.`);
            return null;
        }

        if (!survey.title || !survey.authorId) {
            throw new Error(`Survey with ID ${surveyId} is missing required fields.`);
        }

        return survey;
    } 
    catch (error) {
        console.error(`Error fetching survey with ID ${surveyId}:`, error);
        throw error;
    }
}