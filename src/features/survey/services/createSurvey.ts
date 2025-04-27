// app/services/createSurvey.ts

import { CreateSurveyInput, PrethoughtQuestion } from '../types/surveyAppTypes'
import SurveyRepository from '../repositories/survey.repository'

// 1) Array of all default header images
const DEFAULT_HEADER_PATHS = [
  '/business.png',
  '/creative.png',
  '/tech.png',
  '/social.png',
  '/health.png',
  '/env.png',
] as const

// 2) Utility to pick one at random
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
  rawQuestions?: RawPrethoughtQuestion[] | string[],
): Promise<void> {
  if (!authorId) {
    throw new Error('Author ID is required')
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

  // 3) Pick a random default header
  const selectedHeaderPath = getRandomElement(DEFAULT_HEADER_PATHS)

  // Assemble the payload
  const surveyData: CreateSurveyInput = {
    topic,
    objective,
    prethoughtQuestions,
    defaultHeaderPaths: DEFAULT_HEADER_PATHS,   // full set, if you still need them
    selectedHeaderPath,                         // the one we randomly chose
  }

  // Persist
  const surveyRepo = new SurveyRepository()
  await surveyRepo.createSurvey(surveyData, authorId)
}