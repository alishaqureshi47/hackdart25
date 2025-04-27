'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FirebaseSurvey } from '@/features/survey/types/surveyFirebaseTypes';
import { fetchSurveyById } from '@/features/survey/services/fetchSurveyById';
import SurveyAnswersPage from '@/app/surveyanswers/page';
import { useUser } from '@/contexts/UserContext';
import { redirect } from 'next/navigation';

export default function SurveyAnswersWrapperPage() {
  const { surveyId } = useParams();
  const [survey, setSurvey] = useState<FirebaseSurvey | null>(null);
  const [loading, setLoading] = useState(true);

  const { userId } = useUser();


  useEffect(() => {
    async function loadSurvey() {
      try {
        const fetchedSurvey = await fetchSurveyById(surveyId as string, userId || '');
        await setSurvey(fetchedSurvey);
        if (!fetchedSurvey) {
          redirect('/notfound');
        }
      } catch (error) {
        console.error('Error fetching survey:', error);
        redirect('/notfound');
      } finally {
        setLoading(false);
      }
    }

    if (surveyId) {
      loadSurvey();
    }
  }, [surveyId, userId]);

  if (loading) {
    return <div className="p-8">Loading responses...</div>;
  }

  if (!survey) {
    return <div className="p-8">Survey not found.</div>;
  }

  return <SurveyAnswersPage survey={survey} />;
}
