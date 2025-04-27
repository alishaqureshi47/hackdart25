import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GOOGLE_AI_API_KEY;

const ai = new GoogleGenAI({ apiKey });

/**
 * Calls the Gemini API with a given prompt and optional model.
 * @param prompt - The prompt to send to the Gemini API.
 * @param model - The model to use (defaults to "gemini-2.0-flash").
 * @returns The generated content from the Gemini API.
 */
export async function geminiGenerate(prompt: string, model: string = "gemini-2.0-flash", responseSchema?: object): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      ...(responseSchema ? { config: { responseMimeType: 'application/json', responseSchema } } : {}),
    });
	  if (!response || !response.text) {
        throw new Error("No response from Gemini API.");
    }
    return response.text;
  } 
  catch (error) {
	console.error("Error generating content:", error);
	throw error;
  }
}