import SurveyRepository from "../repositories/survey.repository"; // Adjust the path to your repository
import { SurveyAnswer } from "../types/surveyFirebaseTypes"; // Adjust the path to your types if needed

/**
 * Fetches the answers of a specific survey
 * @param surveyId - The ID of the survey
 * @returns A promise resolving to an array of SurveyAnswer
 */
export async function getSurveyAnswers(surveyId: string): Promise<SurveyAnswer[]> {
    // Ensure the repository is instantiated
    const surveyRepository = new SurveyRepository();
    // Validate the surveyId parameter
    if (!surveyId || typeof surveyId !== "string") {
        throw new Error("Invalid surveyId. It must be a non-empty string.");
    }

    try {
        // Call the repository function to fetch survey answers
        const answers = await surveyRepository.fetchSurveyAnswers(surveyId);

        // Perform additional checks if needed
        if (!Array.isArray(answers)) {
            throw new Error("Invalid data format. Expected an array of SurveyAnswer.");
        }

        return answers; // Return the fetched answers
    } catch (error) {
        console.error("Error fetching survey answers:", error);
        throw error;
    }
}