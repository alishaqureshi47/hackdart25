'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { FirebaseSurvey } from '@/features/survey/types/surveyFirebaseTypes';
import { fetchSurveyById } from '@/features/survey/services/fetchSurveyById';
import SurveyAnswersDisplay from '@/shared/components/surveys/SurveyAnswersDisplay';

export default function SurveyAnswersPage() {
  const { data: session, status } = useSession();
  const router = useRouter(); // Add router
  const { userId } = useUser();
  const params = useSearchParams();
  const surveyId = params.get("id") as string;
  
  const [survey, setSurvey] = useState<FirebaseSurvey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial auth check - this works fine
  if (status === "unauthenticated") {
    redirect("/login");
  }

  useEffect(() => {
    // Skip if we're still waiting for auth or user data
    if (status === "loading" || !userId) {
      return;
    }
    
    async function loadSurvey() {
      if (!surveyId) {
        setError("Invalid survey ID");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log("Fetching survey with ID:", surveyId); // Debug log
        
        const surveyData = await fetchSurveyById(surveyId);
        console.log("Survey data loaded:", surveyData); // Debug log
        
        if (!surveyData) {
          setError("Survey not found");
          setLoading(false);
          return;
        }
        
        if (surveyData.authorId !== userId) {
          // Use router.push instead of redirect here
          console.log("Not authorized, redirecting..."); // Debug log
          router.push("/notfound");
          return;
        }
        
        setSurvey(surveyData);
        setLoading(false);
      } catch (err) {
        console.error("Error loading survey:", err);
        setError("Failed to load survey data");
        setLoading(false);
      }
    }
    
    loadSurvey();
  }, [surveyId, userId, status, router]); // Add router and status to dependencies

  // Debug output for troubleshooting
  console.log("Render state:", { loading, error, surveyId, userId, hasData: !!survey });

  if (loading) {
    return <div className="survey-loading">Loading survey data...</div>;
  }

  if (error || !survey) {
    return <div className="survey-error">{error || "Survey not found"}</div>;
  }

  return <SurveyAnswersDisplay survey={survey} />;
}