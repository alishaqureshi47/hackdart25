'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { getUserId } from '@/features/auth/getUser';
import { FirebaseSurvey } from '@/features/survey/types/surveyFirebaseTypes';
import { fetchSurveyById } from '@/features/survey/services/fetchSurveyById';
import SurveyAnswersDisplay from '@/shared/components/surveys/SurveyAnswersDisplay';


export default function SurveyAnswersPage() {
  const { data: session, status } = useSession();

  // Initial auth check - this works fine
  if (status === "unauthenticated") {
    redirect("/login");
  }

  return (
    <Suspense fallback={<div>Loading survey...</div>}>
      <SurveyAnswersContent />
    </Suspense>
  );
}

function SurveyAnswersContent() {
  const router = useRouter();
  const { data: session, status } = useSession();
  if (status === "unauthenticated") redirect("/login");

  // Replace context with state variable
  const [userId, setUserId] = useState<string | null>(null);
  // Rest of your state variables remain the same
  
  // Fetch user ID when session is available
  useEffect(() => {
    const fetchUserId = async () => {
      if (session?.user?.email) {
        try {
          const id = await getUserId(session.user.email);
          setUserId(id);
        } catch (error) {
          console.error("Failed to fetch user ID:", error);
          // Handle error - redirect to login or show message
        }
      }
    };
    
    fetchUserId();
  }, [session]);
  const params = useSearchParams();
  const surveyId = params.get("id") as string;
  
  const [survey, setSurvey] = useState<FirebaseSurvey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


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