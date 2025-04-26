import { CreateSurveyInput, PrethoughtQuestion } from '../types/surveyAppTypes';
import SurveyRepository from '../repositories/survey.repository';

interface RawPrethoughtQuestion {
    questionText: string; // The text of the question
    questionDetails?: string; // Optional additional details about the question
}

export async function createSurvey(
    topic: string,
    objective: string,
    rawQuestions?: RawPrethoughtQuestion[]
): Promise<void> {
    // Ensure rawQuestions is defined, default to an empty array if undefined
    const prethoughtQuestions: PrethoughtQuestion[] = (rawQuestions || []).map((rawQuestion) => ({
        questionText: rawQuestion.questionText,
        questionDetails: rawQuestion.questionDetails || '', // Default to an empty string if not provided
    }));

    // Assemble the parameters into the appropriate object type
    const surveyData: CreateSurveyInput = {
        topic,
        objective,
        prethoughtQuestions,
    };

    // Create an instance of SurveyRepository and call the createSurvey method
    const surveyRepo = new SurveyRepository();
    await surveyRepo.createSurvey(surveyData);
}