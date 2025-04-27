// app/services/createSurvey.ts

import { CreateSurveyInput, PrethoughtQuestion } from '../types/surveyAppTypes'
import SurveyRepository from '../repositories/survey.repository'

// Array of all default header images
const DEFAULT_HEADER_PATHS = [
  'business.png',
  'creative.png',
  'tech.png',
  'social.png',
  'health.png',
  'env.png',
] as const

// Utility to pick one at random
function getRandomElement<T>(arr: readonly T[]): T {
  const idx = Math.floor(Math.random() * arr.length)
  return arr[idx]
}

interface RawPrethoughtQuestion {
  questionText: string
  questionDetails?: string
}

export async function createSurvey(
    authorId: string,
    topic: string,
    objective: string,
    isModerated: boolean = false,
    rawQuestions?: RawPrethoughtQuestion[] | string[],
    imageFile?: File | null,
    imagePath?: string,
): Promise<void> {
  if (!authorId) {
    throw new Error('Author ID is required, and was not found');
  }

    // Normalize questions
    const prethoughtQuestions: PrethoughtQuestion[] = (rawQuestions || []).map((raw) => {
        if (typeof raw === 'string') {
            return { questionText: raw, questionDetails: '' }
        }
        return {
            questionText: raw.questionText,
            questionDetails: raw.questionDetails || '',
        }
    })
    
    // Assemble the payload
    const surveyData: CreateSurveyInput = {
        topic,
        objective,
        prethoughtQuestions
    }
    
    // Persist
    const surveyRepo = new SurveyRepository();
    
    // Check if a file exists
    if (imageFile) {
        // If a file exists, send the file and null for the path
        await surveyRepo.createSurvey(surveyData, authorId, isModerated, imageFile, undefined)
    } 
    else {
        // If no file exists, send null for the file and a random path
        // Pick a random default header or use the one that the user chose
        const selectedHeaderPath = imagePath || getRandomElement(DEFAULT_HEADER_PATHS);
        await surveyRepo.createSurvey(surveyData, authorId, isModerated, undefined, selectedHeaderPath)
    }
}