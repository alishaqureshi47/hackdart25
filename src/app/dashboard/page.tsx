"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { deleteUser } from '@/features/auth/deleteUser';
import { redirect } from "next/navigation";
import './dashboard.css';
import { useRouter } from 'next/navigation';

const DashboardPage: React.FC = () => {
  const { data: session, status } = useSession();
  if (status === "unauthenticated") {
    redirect("/login");
  }

  const router = useRouter();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <nav className="sidebar-nav">
                    <button className="sidebar-button explore">Explore</button>
                    <button className="sidebar-button create" onClick={() => {
                      router.push("/surveys/create");
                    }}>
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
                        onClick={() => {
                          router.push("/profile");
                        }}
                      >
                        Profile
                      </button>
                    </div>

                </nav>
            </aside>

            {/* Main Content */}
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
        </div>
    );
};

export default DashboardPage;
