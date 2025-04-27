'use client';

import { FirebaseSurvey, SurveyAnswer } from '@/features/survey/types/surveyFirebaseTypes';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './surveyanswers.css';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00c49f', '#ffbb28'];

export default function SurveyAnswersPage({ survey }: { survey: FirebaseSurvey }) {
  const questions = survey.questions;
  const allResponses: SurveyAnswer[][] = survey.responses as SurveyAnswer[][];

  if (!allResponses) {
    return <div className="survey-loading">Loading responses...</div>;
  }

  return (
    <div className="survey-page-container">
      <div className="survey-content-wrapper">
        <h1 className="survey-title">{survey.title}</h1>

        {questions.map((question, qIndex) => {
          const answersForThisQuestion = allResponses
            .map(responseSet => responseSet[qIndex]) // correct typing
            .filter(Boolean); // remove undefined

          if (answersForThisQuestion.length === 0) return null;

          return (
            <div key={qIndex} className="survey-question-card">
              <h2 className="survey-question-text">{question.questionText}</h2>

              {/* MULTIPLE CHOICE AGGREGATION */}
              {question.questionType === 'multiple-choice' && (
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={countMultipleChoiceAnswers(answersForThisQuestion)}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label
                      >
                        {countMultipleChoiceAnswers(answersForThisQuestion).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* RANGE AGGREGATION */}
              {question.questionType === 'range' && (
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={countRangeAnswers(answersForThisQuestion)}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* TEXT RESPONSES */}
              {question.questionType === 'text' && (
                <div className="survey-text-response-list">
                  {answersForThisQuestion.map((a, i) => (
                    <p key={i} className="survey-text-response-item">"{(a as any).answerText}"</p>
                  ))}
                </div>
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
