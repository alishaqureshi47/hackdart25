import { db } from '@/firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { CreateSurveyInput } from '../types/surveyAppTypes';
import { FirebaseSurvey } from '../types/surveyFirebaseTypes';
import { geminiGenerate } from '@/features/gemini/utils/geminiGenerate';
import { Type } from '@google/genai';

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
            description: "Options for multiple-choice questions, only applicable for multiple-choice questions"
          },
          rangeSize: { 
            type: Type.NUMBER,
            description: "The size of the range for range questions, only applicable for range questions"
          },
        },
        required: ["questionText", "questionType"],
      },
    },
  },
  required: ["title", "description", "questions"],
};

export default class SurveyRepository {
  /**
   * Creates a new survey.
   * @param surveyData - The survey data object.
   * @param authorId - The ID of the author creating the survey.
   * @param imageFile - The image file to upload (optional).
   * @param imagePath - The path to an existing image (optional).
   * @returns A promise resolving to void
   */
  async createSurvey(
    surveyData: CreateSurveyInput,
    authorId: string,
    imageFile?: File | null,
    imagePath?: string
  ): Promise<void> {
    let imageUrl = "";

    // Upload the file to Firebase Storage if provided
    if (imageFile) {
      try {
        const storage = getStorage();
        const storageRef = ref(storage, `surveys/${Date.now()}-${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref); // Get the file's URL
      } catch (error: any) {
        throw new Error("Failed to upload image to Firebase Storage: " + error.message);
      }
    } else if (imagePath) {
      // Use the existing image path if provided
      imageUrl = imagePath;
    }

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
    firebaseSurvey.imageUrl = imageUrl; // Attach the image URL
    firebaseSurvey.authorId = authorId; // Attach the author ID

    // Store the survey in Firebase
    const surveyDoc = {
      ...firebaseSurvey,
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
      ${index + 1}. ${q.questionText} (${q.questionDetails})`).join('\n')}
      Range questions should have min and max fields as specified in the schema, and the rest should NOT have min and max fields. Range questions should NOT have an options field.
      Range questions should be in the format of: 'In a scale of 1 to 10, how would you rate your experience with this product?' or 'On a scale of 1 to 15, how comfortable do you feel with X?'`;
  }
}