"use client";

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { deleteUser } from '@/features/auth/deleteUser';
import { redirect } from "next/navigation";
import './profile.css'; 
import YourSurveyCard from "@/shared/components/yoursurveycard/yoursurveycard";
import { fetchAllSurveysForUser } from '@/features/survey/services/fetchAllSurveysForUser';
import { FirebaseSurvey } from '@/features/survey/types/surveyFirebaseTypes';
import SurveyAnswersPage from '@/shared/components/surveys/SurveyAnswersDisplay';
import { useRouter } from 'next/navigation';
import { getUserId } from '@/features/auth/getUser';



const ProfilePage: React.FC = () => {
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
  
  const [loading, setLoading] = useState(true);
  const [surveys, setSurveys] = useState<FirebaseSurvey[]>([]);

  useEffect(() => {
    const loadSurveys = async () => {
      try {
        const fetchedSurveys = await fetchAllSurveysForUser(userId || ''); // only for this user
        setSurveys(fetchedSurveys);
        console.log("user id", userId);
      } catch (error) {
        console.error("Error fetching surveys:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSurveys();
  }, [userId]);
  function handleDeleteProfile() {
    if (session?.user?.email) {
      deleteUser(session.user.email);
      redirect("/login");
    } else {
      console.error("Email not available");
    }
  }

  return (
    <div className="profile-container">
      {/* Top Profile Card */}
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-pic-placeholder">
            {/* Profile picture circle */}
            <img src={session?.user?.image || "blank-profile.png"} alt="" className="profile-pic" />
          </div>
          <div className="profile-text">
            <h2>{session?.user?.name || "Your Name"}</h2>
            <p>{session?.user?.email?.split('@')[1] || "University Name"}</p>
            <p>{session?.user?.email || "your-email@domain.com"}</p>
          </div>
        </div>
        <button className="logout-button" onClick={() => signOut({ callbackUrl: "/login" })}>
          Logout
        </button>
      </div>

      {/* Your Surveys Section */}
      <h3 className="your-surveys-heading">Your Surveys</h3>

      <div className="your-surveys-section">
        {/* Filter and Sort */}
        {/* <div className="filter-sort-bar">
          <div className="filter-section">
            <label htmlFor="filter">Filter by:</label>
            <select id="filter" className="filter-select">
              <option value="topic">Topic</option>
              <option value="length">Length</option>
              <option value="time">Time Published</option>
            </select>
          </div>

          <div className="sort-section">
            <label htmlFor="sort">Sort by:</label>
            <select id="sort" className="sort-select">
              <option value="popular">Most Popular</option>
              <option value="a-z">A-Z</option>
              <option value="length">Length (Longest to Shortest)</option>
              <option value="shortest">Length (Shortest to Longest)</option>
            </select>
          </div>
        </div> */}

        {/* Survey Cards */}
        { surveys.length > 0 ? (
          <div className="cards-grid">
          {loading ? (
            <p>Loading surveys...</p>
          ) : (
            surveys.map((survey, index) => (
              <YourSurveyCard
                id={survey.id}
                key={index}
                title={survey.title}
                description={survey.description}
                datePublished={new Date(survey.createdAt)}
                timeToFill={Math.max(1, Math.floor(survey.questions.length / 2)).toString()}
                numQuestions={survey.questions.length}
                imageUrl={survey.imageUrl || "https://source.unsplash.com/random/800x600?survey"}
                onEdit={() => router.push(`/surveys/edit?id=${survey.id}`)}
                onViewResponses={() => router.push(`/surveys/results?id=${survey.id}`)}
                onClick={() => router.push(`/surveys/view?id=${survey.id}`)}
              />
            ))
          )}
        </div>
        ) : (
          <p>No surveys here yet!</p>
        )}
      </div>

      

      {/* Delete Profile Button */}
      <div className="delete-profile-container">
        <button className="delete-profile-button"
          onClick={handleDeleteProfile}
        >
          Delete Profile
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
