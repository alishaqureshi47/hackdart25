"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import './dashboard.css';
import { useRouter } from 'next/navigation';
import SurveyCard from '@/shared/components/surveycard/surveycard';
import { fetchAllSurveys } from '@/features/survey/services/fetchAllSurveys';
import { FirebaseSurvey } from '@/features/survey/types/surveyFirebaseTypes';

const DashboardPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [surveys, setSurveys] = useState<FirebaseSurvey[]>([]);

  useEffect(() => {
    const loadSurveys = async () => {
      try {
        const fetchedSurveys = await fetchAllSurveys();
        setSurveys(fetchedSurveys);
        console.log(fetchedSurveys);
      } catch (error) {
        console.error("Error fetching surveys:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSurveys();
  }, []);

  if (status === "unauthenticated") {
    redirect("/");
  }

  return (
    <div className="dashboard-container">
      {/* DESKTOP SIDEBAR */}
      <aside className="sidebar">
        <nav className="sidebar-nav">
          {/* <button
            className="sidebar-button explore"
            onClick={() => router.push("/surveys/explore")}
          >
            Explore
          </button> */}
          <button
            className="sidebar-button create"
            onClick={() => router.push("/surveys/create")}
          >
            <span className="create-text">Create</span>
            <span className="create-plus">+</span>
          </button>
          <div className="domain-toggle">
            <p>Show:</p>
            <label>
              <input type="checkbox" name="domain-own" defaultChecked />
              Your Domain
            </label>
            <label>
              <input type="checkbox" name="domain-public" />
              Public
            </label>
          </div>
          <div className="settings-dropdown">
            <button
              className="sidebar-button profile-button"
              onClick={() => router.push("/profile")}
            >
              Profile
            </button>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
          { surveys.length > 0 ? (
          <div className="cards-grid">
            {loading ? (
              <p>Loading surveys...</p>
            ) : (
              surveys.map((survey, index) => (
                <SurveyCard
                  id={survey.id}
                  key={index}
                  title={survey.title}
                  description={survey.description}
                  datePublished={new Date(survey.createdAt)}
                  timeToFill={Math.max(1, Math.floor(survey.questions.length / 2)).toString()}
                  numQuestions={survey.questions.length}
                  imageUrl={survey.imageUrl || "https://source.unsplash.com/random/800x600?survey"}
                />
              ))
            )}
          </div>
          ) : (
            <p>No surveys!</p>
          )}  
      </main>

      {/* MOBILE‐ONLY BOTTOM BAR */}
      <nav className="mobile-bar">
        {/* <button
          className="sidebar-button explore"
          onClick={() => router.push("/surveys/explore")}
        >
          Explore
        </button> */}
        <button
          className="sidebar-button create"
          onClick={() => router.push("/surveys/create")}
        >
          <span className="create-text">Create</span>
          <span className="create-plus">+</span>
        </button>
        <button
          className="sidebar-button profile-button"
          onClick={() => router.push("/profile")}
        >
          Profile
        </button>
      </nav>
    </div>
  );
};

export default DashboardPage;
