"use client";

import React from 'react';
import './profile.css';

const ProfilePage: React.FC = () => {
  return (
    <div className="profile-container">
      {/* Top Profile Card */}
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-pic-placeholder">
            {/* Profile picture circle */}
          </div>
          <div className="profile-text">
            <h2>Your Name</h2>
            <p>University Name</p>
            <p>your-email@domain.com</p>
          </div>
        </div>
        <button className="logout-button">Logout</button>
      </div>

      {/* Your Surveys Section */}
      <h3 className="your-surveys-heading">Your Surveys</h3>
        <div className="your-surveys-section">
        

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

        <div className="cards-grid">
            <div className="survey-card">Survey Placeholder</div>
            <div className="survey-card">Survey Placeholder</div>
            <div className="survey-card">Survey Placeholder</div>
        </div>
        </div>


      {/* Delete Profile Button */}
      <div className="delete-profile-container">
        <button className="delete-profile-button">Delete Profile</button>
      </div>
    </div>
  );
};

export default ProfilePage;
