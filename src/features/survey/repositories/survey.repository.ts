import { db } from '@/firebase/firebase';
import { collection, addDoc, getDocs, getDoc, query, where, updateDoc, doc, arrayUnion, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { CreateSurveyInput } from '../types/surveyAppTypes';
import { FirebaseSurvey, SurveyAnswer } from '../types/surveyFirebaseTypes';
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

  /**
   * Fetches a survey by ID
   * @param surveyId - The ID of the survey
   * @returns A promise resolving to the survey object
   */
  public async fetchSurveyById(surveyId: string): Promise<FirebaseSurvey | null> {
    // Safety check for surveyId
    if (!surveyId || typeof surveyId !== "string" || surveyId.trim() === "") {
      throw new Error("Invalid survey ID provided.");
    }
  
    try {
      // Reference to the specific survey document
      const surveyDocRef = doc(db, "surveys", surveyId);
  
      // Fetch the document from Firebase
      const surveySnapshot = await getDoc(surveyDocRef);
  
      // Check if the document exists
      if (!surveySnapshot.exists()) {
        console.error(`Survey with ID ${surveyId} does not exist.`);
        return null;
      }
  
      // Map the document data to the FirebaseSurvey type
      const surveyData = surveySnapshot.data();
      const survey: FirebaseSurvey = {
        id: surveyData.id, // Document ID
        authorId: surveyData.authorId,
        title: surveyData.title,
        description: surveyData.description,
        createdAt: surveyData.createdAt.toDate(), // Convert Firestore Timestamp to JavaScript Date
        questions: surveyData.questions,
        imageUrl: surveyData.imageUrl,
        responses: surveyData.responses,
      };
  
      return survey;
    } catch (error) {
      console.error(`Failed to fetch survey with ID ${surveyId}:`, error);
      throw error;
    }
  }

  /**
   * Fetches the surveys from Firebase.
   * @returns A promise resolving to an array of surveys.
   */
  public async fetchAllSurveys(): Promise<FirebaseSurvey[]> {
    const surveysCollection = collection(db, "surveys");
    const snapshot = await getDocs(surveysCollection);

    return snapshot.docs.map((doc: any) => ({
      id: doc.id, // Include the document ID
      ...doc.data(),
    })) as FirebaseSurvey[];
  }

  /**
   * Fetches the surveys of a specific user
   * @param userId - The ID of the user
   * @returns A promise resolving to an array of surveys
   */
  public async fetchSurveysByUser(userId: string): Promise<FirebaseSurvey[]> {
    const surveysCollection = collection(db, "surveys");
    const userSurveysQuery = query(surveysCollection, where("authorId", "==", userId));
    const snapshot = await getDocs(userSurveysQuery);

    return snapshot.docs.map((doc: any) => ({
      id: doc.id, // Include the document ID
      ...doc.data(),
    })) as FirebaseSurvey[];
  }

  /**
   * Fetches the answers of a specific survey
   * @param surveyId - The ID of the survey
   * @returns A promise resolving to an array of answers
   */
  public async fetchSurveyAnswers(surveyId: string): Promise<SurveyAnswer[]> {
    const surveyDocRef = doc(db, "surveys", surveyId); // Reference to the specific survey document
    const surveySnapshot = await getDoc(surveyDocRef); // Fetch the survey document
  
    if (!surveySnapshot.exists()) {
      throw new Error(`Survey with ID ${surveyId} does not exist.`);
    }
  
    const surveyData = surveySnapshot.data(); // Get the survey data
    return (surveyData.responses || []) as SurveyAnswer[]; // Return the responses as an array of SurveyAnswer
  }


  /**
   * Submits a response to a survey
   * @param surveyId - The ID of the survey
   * @param response - The response to add (SurveyAnswer object)
   * @param respondentId - The ID of the respondent, to keep track of surveys responded
   * @returns A promise that resolves when the response is added
   */
  public async submitSurveyResponse(
    surveyId: string,
    responses: SurveyAnswer[],
    respondentId: string
  ): Promise<void> {
    if (!responses || responses.length === 0) {
      throw new Error("Responses array cannot be null or empty.");
    }
  
    const surveyDocRef = doc(db, "surveys", surveyId);
    const userDocRef = doc(db, "users", respondentId); // Reference to the user's document
  
    // Build the response object to be added
    const responsePayload = {
      respondentId,
      responses,
      submittedAt: new Date().toISOString(), // Add a timestamp for when the response was submitted
    };
  
    try {
      // Check if the user has already responded to this survey
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        if (userData.respondedSurveys && userData.respondedSurveys.includes(surveyId)) {
          return; // User has already responded to this survey, so we can skip adding the response
        }
      }
  
      // Update the survey document with the new response
      await updateDoc(surveyDocRef, {
        responses: arrayUnion(responsePayload), // Add the response payload to the responses array
      });
  
      // Update the user's document to track that they have responded to this survey
      await updateDoc(userDocRef, {
        respondedSurveys: arrayUnion(surveyId), // Add the survey ID to the user's respondedSurveys array
      });
  
      console.log("Survey response submitted successfully.");
    } catch (error) {
      console.error("Error submitting survey response:", error);
      throw error;
    }
  }

  /**
   * Deletes a survey by ID
   * @param surveyId - The ID of the survey to delete
   * @returns A promise that resolves when the survey is deleted
   */
  public async deleteSurvey(surveyId: string): Promise<void> {
    const surveyDocRef = doc(db, "surveys", surveyId);
  
    // Delete associated responses (if stored in a subcollection)
    const responsesCollectionRef = collection(db, `surveys/${surveyId}/responses`);
    const responsesSnapshot = await getDocs(responsesCollectionRef);
  
    const deletePromises = responsesSnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  
    // Delete the survey document
    await deleteDoc(surveyDocRef);
  }
}