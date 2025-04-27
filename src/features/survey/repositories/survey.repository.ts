import { db } from '@/firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { CreateSurveyInput } from '../types/surveyAppTypes';
import { FirebaseSurvey } from '../types/surveyFirebaseTypes';
import { geminiGenerate } from '@/features/gemini/utils/geminiGenerate';
import { Type } from '@google/genai';

export default class SurveyRepository {
  /**
   * Creates a new survey.
   * @param surveyData - The survey data object.
   * @param authorId - The ID of the author creating the survey.
   * @returns A promise resolving to void
   */
  async createSurvey(
    surveyData: CreateSurveyInput,
    authorId: string
  ): Promise<void> {
    
    // Define the schema for the expected JSON response
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        title: { 
          type: Type.STRING,
          description: "The title of the survey"
        },
        description: { 
          type: Type.STRING, 
          description: "A brief description of the survey for the potential respondents"
        },
        questions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              questionText: { 
                type: Type.STRING,
                description: "The question itself, what is being asked"
              },
              questionType: { 
                type: Type.STRING,
                enum: ["multiple-choice", "text", "range"],
                description: "The type of the question"
              },
              options: {
                type: Type.ARRAY,
                items: { 
                  type: Type.STRING,
                },
                description: "Options for multiple-choice questions, if applicable"
              },
              min: { 
                type: Type.NUMBER,
                description: "Minimum value for range questions, if applicable"
              },
              max: { 
                type: Type.NUMBER,
                description: "Maximum value for range questions, if applicable"
              },
            },
            required: ["questionText", "questionType"],
          },
        },
      },
      required: ["title", "description", "questions"],
    };

    // Construct the prompt for the AI
    const prompt = this.constructPrompt(surveyData);
    if (!prompt) {
      throw new Error('Failed to construct prompt from survey data.');
    }

    // Call the AI to generate the survey
    const aiResponse = await geminiGenerate(prompt, "gemini-2.0-flash", responseSchema);
    if (!aiResponse) {
      throw new Error('AI response is null or undefined.');
    }

    // Parse the AI response into a FirebaseSurvey object
    let firebaseSurvey: FirebaseSurvey;
    try {
      firebaseSurvey = JSON.parse(aiResponse);
    } catch (error) {
      throw new Error('Failed to parse AI response into FirebaseSurvey object. Response was: ' + aiResponse);
    }

    // Add metadata to the survey
    firebaseSurvey.createdAt = new Date();

    // Store the survey in Firebase
    const surveyDoc = {
      ...firebaseSurvey,
      authorId, // Include the authorId
    };

    try {
      const surveyCollection = collection(db, 'surveys'); // Get the 'surveys' collection
      await addDoc(surveyCollection, surveyDoc); // Add the document to the collection
    } catch (error: any) {
      throw new Error('Failed to store survey in Firebase: ' + error.message);
    }
  }

  /**
   * Constructs a prompt for the AI based on survey data.
   * @param surveyData - The survey data object.
   * @returns The constructed prompt string.
   */
  private constructPrompt(surveyData: CreateSurveyInput): string {
    return `Generate a survey for college students as a JSON object with the specified schema. The user provided the following details about the survey. The JSON fields should NOT look like this though:
    Topic: ${surveyData.topic}
    Objective: ${surveyData.objective}
    Pre-thought questions by the user: ${surveyData.prethoughtQuestions?.map((q, index) => `
      ${index + 1}. ${q.questionText} (${q.questionDetails})`).join('\n')}`;
  }
}