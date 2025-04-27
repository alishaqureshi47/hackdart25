'use client';

import { FirebaseSurvey, SurveyAnswer } from '@/features/survey/types/surveyFirebaseTypes';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './surveyanswers.css';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00c49f', '#ffbb28'];

export default function SurveyAnswersPage({ survey }: { survey: FirebaseSurvey }) {
    const questions = survey.questions;
    const allResponses = (survey.responses ?? []) as SurveyAnswer[];
  
    if (allResponses.length === 0) {
      return <div className="survey-loading">No responses found.</div>;
    }
  
    return (
      <div className="survey-page-container">
        <div className="survey-content-wrapper">
          <h1 className="survey-title">{survey.title}</h1>
  
          {questions.map((question, qIndex) => {
            const answersForThisQuestion = allResponses.filter((response: any) => {
              return response.questionType === question.questionType;
            });
  
            return (
              <div key={qIndex} className="survey-question-card">
                <h2 className="survey-question-text">{question.questionText}</h2>
  
                {answersForThisQuestion.length === 0 ? (
                  <p className="survey-no-responses">No responses yet for this question 😔</p>
                ) : (
                  <>
                    {/* your piechart / barchart / text rendering based on question type */}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  
  

// Helper: count multiple choice answers
function countMultipleChoiceAnswers(answers: SurveyAnswer[]) {
  const counts: { [option: string]: number } = {};
  answers.forEach((a: any) => {
    const option = a.selectedOption;
    counts[option] = (counts[option] || 0) + 1;
  });
  return Object.keys(counts).map(option => ({ name: option, value: counts[option] }));
}

// Helper: count range slider answers
function countRangeAnswers(answers: SurveyAnswer[]) {
  const counts: { [num: number]: number } = {};
  answers.forEach((a: any) => {
    const value = a.selectedValue;
    counts[value] = (counts[value] || 0) + 1;
  });
  return Object.keys(counts).map(num => ({ name: num, value: counts[Number(num)] }));
}
