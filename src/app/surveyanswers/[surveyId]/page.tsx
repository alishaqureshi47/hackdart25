'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FirebaseSurvey } from '@/features/survey/types/surveyFirebaseTypes';
import { fetchSurveyById } from '@/features/survey/services/fetchSurveyById'; // you will create this
import SurveyAnswersPage from '@/app/surveyanswers/page';

export default function SurveyAnswersWrapperPage() {
  const { surveyId } = useParams();
  const [survey, setSurvey] = useState<FirebaseSurvey | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSurvey() {
      try {
        const fetchedSurvey = await fetchSurveyById(surveyId as string);
        setSurvey(fetchedSurvey);
      } catch (error) {
        console.error('Error fetching survey:', error);
      } finally {
        setLoading(false);
      }
    }

    if (surveyId) {
      loadSurvey();
    }
  }, [surveyId]);

  if (loading) {
    return <div className="p-8">Loading responses...</div>;
  }

  if (!survey) {
    return <div className="p-8">Survey not found.</div>;
  }

  return <SurveyAnswersPage survey={survey} />;
}
