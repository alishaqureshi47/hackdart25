'use client';

import { FirebaseSurvey, SurveyQuestion, SurveyAnswer, MultipleChoiceAnswer, TextAnswer, RangeAnswer } from '@/features/survey/types/surveyFirebaseTypes';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, Text
} from 'recharts';
import './surveyanswers.css';
import { useState } from 'react';

// Define the new structure
export interface SurveyResponse {
  respondentId: string; // ID of the user who submitted the survey
  submittedAt: Date; // Timestamp of when the survey was submitted
  responses: SurveyAnswer[]; // Array of answers for this respondent
}

interface DataPoint {
  name: string;
  value: number;
}

// Color palette for charts
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00c49f', '#ffbb28', '#ff8042', '#d0ed57', '#a4de6c', '#d88484'];

export default function SurveyAnswersDisplay({ survey }: { survey: FirebaseSurvey }) {
  const questions = survey.questions;
  const allResponses = (survey.responses ?? []) as SurveyResponse[];
  const [showPieChart, setShowPieChart] = useState<{[key: number]: boolean}>({});
  
  // Toggle between pie and bar for multiple choice
  const toggleChartType = (index: number) => {
    setShowPieChart(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (allResponses.length === 0) {
    return <div className="survey-loading">No responses found.</div>;
  }

  // Get total respondents count
  const totalRespondents = allResponses.length;

  // Extract all answers across all responses
  const extractAnswersForQuestion = (questionIndex: number, questionType: string): SurveyAnswer[] => {
    const allAnswers: SurveyAnswer[] = [];
    
    allResponses.forEach(response => {
      // Each respondent's answers are stored in response.responses
      const answers = response.responses || [];
      
      // Find the answer matching the current question
      const answer = answers.find((a, idx) => 
        a.questionType === questionType && idx === questionIndex
      );
      
      if (answer) {
        allAnswers.push(answer);
      }
    });
    
    return allAnswers;
  };

  return (
    <div className="survey-page-container">
      <div className="survey-content-wrapper">
        <h1 className="survey-title">{survey.title}</h1>
        <div className="survey-total-responses">
          Total responses: <span className="highlight">{totalRespondents}</span>
        </div>

        {questions.map((question, qIndex) => {
          // Get all answers for this question across all respondents
          const answersForThisQuestion = extractAnswersForQuestion(qIndex, question.questionType);
          const hasResponses = answersForThisQuestion.length > 0;

          return (
            <div key={qIndex} className="survey-question-card">
              <h2 className="survey-question-text">
                <span className="question-number">{qIndex + 1}.</span> {question.questionText}
              </h2>
              <div className="survey-question-type">
                {question.questionType === 'multiple-choice' ? 'Multiple Choice' : 
                 question.questionType === 'range' ? 'Scale Rating' : 'Text Response'}
              </div>
              
              {!hasResponses ? (
                <p className="survey-no-responses">No responses yet for this question 😔</p>
              ) : (
                <div className="survey-response-visualization">
                  {question.questionType === 'multiple-choice' && (
                    <>
                      <div className="chart-toggle">
                        <button 
                          className={!showPieChart[qIndex] ? 'active' : ''}
                          onClick={() => toggleChartType(qIndex)}
                        >
                          Bar Chart
                        </button>
                        <button 
                          className={showPieChart[qIndex] ? 'active' : ''}
                          onClick={() => toggleChartType(qIndex)}
                        >
                          Pie Chart
                        </button>
                      </div>
                      
                      {showPieChart[qIndex] ? (
                        <MultipleChoicePieChart 
                          answers={answersForThisQuestion as MultipleChoiceAnswer[]} 
                        />
                      ) : (
                        <MultipleChoiceBarChart 
                          answers={answersForThisQuestion as MultipleChoiceAnswer[]} 
                        />
                      )}
                    </>
                  )}
                  
                  {question.questionType === 'range' && (
                    <RangeBarChart 
                      answers={answersForThisQuestion as RangeAnswer[]} 
                      maxRange={(question as any).rangeSize || 5} 
                    />
                  )}
                  
                  {question.questionType === 'text' && (
                    <TextResponseList 
                      answers={answersForThisQuestion as TextAnswer[]} 
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Multiple Choice Pie Chart Component
function MultipleChoicePieChart({ answers }: { answers: MultipleChoiceAnswer[] }) {
  const data = countMultipleChoiceAnswers(answers);
  const total = answers.length;
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <Text 
        x={x} 
        y={y} 
        fill={COLORS[index % COLORS.length]}
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </Text>
    );
  };
  
  return (
    <div className="chart-container pie-container">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} responses (${((value as number) / total * 100).toFixed(1)}%)`, 'Count']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Option</th>
              <th>Count</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.value}</td>
                <td>{((item.value / total) * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Multiple Choice Bar Chart Component
function MultipleChoiceBarChart({ answers }: { answers: MultipleChoiceAnswer[] }) {
  const data = countMultipleChoiceAnswers(answers);
  
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end"
            height={80}
          />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" name="Responses">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Range Bar Chart Component
function RangeBarChart({ answers, maxRange }: { answers: RangeAnswer[], maxRange: number }) {
  // Prepare data with all possible values (1 to maxRange)
  const fullRangeData: DataPoint[] = [];
  for (let i = 1; i <= maxRange; i++) {
    fullRangeData.push({ name: `${i}`, value: 0 });
  }
  
  // Count actual answers
  const counts = countRangeAnswers(answers);
  
  // Merge to ensure all values are represented
  counts.forEach(item => {
    const index = fullRangeData.findIndex(d => d.name === item.name);
    if (index !== -1) {
      fullRangeData[index].value = item.value;
    }
  });
  
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={fullRangeData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" name="Responses" />
        </BarChart>
      </ResponsiveContainer>
      
      <div className="range-label-container">
        <div className="range-min">Low (1)</div>
        <div className="range-max">High ({maxRange})</div>
      </div>
    </div>
  );
}

// Text Response List Component
function TextResponseList({ answers }: { answers: TextAnswer[] }) {
  return (
    <div className="text-responses">
      {answers.length > 0 ? (
        <ul className="response-list">
          {answers.map((answer, index) => (
            <li key={index} className="text-response-item">
              <div className="response-number">{index + 1}</div>
              <div className="response-text">{answer.answerText}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-text-responses">No text responses yet.</p>
      )}
    </div>
  );
}

// Helper: count multiple choice answers
function countMultipleChoiceAnswers(answers: MultipleChoiceAnswer[]): DataPoint[] {
  const counts: { [option: string]: number } = {};
  answers.forEach((a) => {
    const option = a.selectedOption;
    counts[option] = (counts[option] || 0) + 1;
  });
  return Object.keys(counts).map(option => ({ name: option, value: counts[option] }));
}

// Helper: count range slider answers
function countRangeAnswers(answers: RangeAnswer[]): DataPoint[] {
  const counts: { [num: number]: number } = {};
  answers.forEach((a) => {
    const value = a.selectedValue;
    counts[value] = (counts[value] || 0) + 1;
  });
  return Object.keys(counts).map(num => ({ name: String(num), value: counts[Number(num)] }));
}