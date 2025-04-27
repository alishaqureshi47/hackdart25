"use client";

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { deleteUser } from '@/features/auth/deleteUser';
import { redirect } from "next/navigation";
import './profile.css'; // assuming your CSS file is named profile.css
import { useRouter } from 'next/navigation';

const ProfilePage: React.FC = () => {
  const { data: session, status } = useSession();
  if (status === "unauthenticated") {
    redirect("/login");
  }

  const router = useRouter();

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
        <div className="filter-sort-bar">
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
        </div>

        {/* Survey Cards */}
        <div className="cards-grid">
          <div className="survey-card">Survey Placeholder</div>
          <div className="survey-card">Survey Placeholder</div>
          <div className="survey-card">Survey Placeholder</div>
        </div>
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
