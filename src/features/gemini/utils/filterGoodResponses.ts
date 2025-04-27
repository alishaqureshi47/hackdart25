import { Type } from "@google/genai";
import { geminiGenerate } from "./geminiGenerate";

/**
 * This function evaluates a prompt to determine if it is appropriate for a student survey or if it should be discarded due to lack of quality.
 * @param prompt The prompt to be evaluated
 * @returns The evaluation of the prompt, true if it is appropriate for a student survey, false if it should be discarded
 */
export async function filterGoodResponses(text: string): Promise<boolean> {
	const evaluationPrompt = `Evaluate the following content to determine if it is an appropriate answer for a student survey or if it should be discarded due to lack of quality or troll: "${text}". Take into account that they are usually short surveys. They don't need to be super insightful answers, but for example an empty answer or a single letter is considered wrong and should rule it out. Answer with true if it is appropriate for a student survey, false if it should be discarded.`;

    const responseSchema = {
        type: Type.BOOLEAN
    }
    interface responseSchema {
        appropriate: boolean;
    }

	const result = await geminiGenerate(evaluationPrompt, "gemini-2.0-flash", responseSchema);
    const parsed: responseSchema = JSON.parse(result);


    return parsed.appropriate;
}