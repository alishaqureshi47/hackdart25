'use client';

import { SurveyAnswer } from '@/features/survey/types/surveyFirebaseTypes'; // adjust path if needed
import './surveyanswers.css'; 

export default function SurveyAnswersPage({ answers }: { answers: SurveyAnswer[] }) {
  return (
    <div className="p-8 flex flex-col gap-8">
      <h1 className="text-3xl font-bold mb-6">Your Survey Responses</h1>

      {answers.length === 0 ? (
        <p className="text-gray-500">No answers submitted yet.</p>
      ) : (
        answers.map((answer, index) => (
          <div key={index} className="p-6 rounded-xl shadow-md bg-white">
            {answer.questionType === 'multiple-choice' && (
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-2">Multiple Choice</h2>
                <div className="mt-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
                  You selected: <strong>{answer.selectedOption}</strong>
                </div>
              </div>
            )}

            {answer.questionType === 'text' && (
              <div className="flex flex-col items-start">
                <h2 className="text-xl font-semibold mb-2">Text Response</h2>
                <div className="bg-gray-100 p-4 rounded-lg border-l-4 border-blue-500 w-full">
                  <p className="text-gray-700 italic">"{answer.answerText}"</p>
                </div>
              </div>
            )}

            {answer.questionType === 'range' && (
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-2">Range Response</h2>
                <div className="w-full">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={answer.selectedValue}
                    disabled
                    className="w-full accent-blue-500"
                  />
                  <div className="text-center mt-2 text-blue-600 font-bold">
                    Selected: {answer.selectedValue}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
