"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { deleteUser } from '@/features/auth/deleteUser';
import { redirect } from "next/navigation";
import './dashboard.css';
import { useRouter } from 'next/navigation';
import SurveyCard from '@/shared/components/surveycard';


const DashboardPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "unauthenticated") {
    redirect("/login");
  }

  return (
    <div className="dashboard-container">
      {/* DESKTOP SIDEBAR */}
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <button
            className="sidebar-button explore"
            onClick={() => router.push("/surveys/explore")}
          >
            Explore
          </button>
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
              <option value="length">Length (Shortest to Longest)</option>
            </select>
          </div>
        </div>
        <div className="cards-grid">
          <div className="survey-card">Survey Placeholder</div>
          <div className="survey-card">Survey Placeholder</div>
          <div className="survey-card">Survey Placeholder</div>
        </div>
      </main>

      {/* MOBILE‐ONLY BOTTOM BAR */}
      <nav className="mobile-bar">
        <button
          className="sidebar-button explore"
          onClick={() => router.push("/surveys/explore")}
        >
          Explore
        </button>
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