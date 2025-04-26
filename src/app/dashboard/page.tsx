"use client";

import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";
import "./dashboard.css"; 

export default function Dashboard() {
  const { data: session, status } = useSession();

  // Protect this page - redirect to login if not authenticated
  if (status === "unauthenticated") {
    redirect("/login");
  }

  // Show loading state while session is being fetched
  if (status === "loading") {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="logo-container">
            <Image 
              src="/logo.png" 
              alt="Quipp Logo" 
              width={32} 
              height={32} 
            />
            <span className="logo-text">QUIPP</span>
          </div>
          
          <div className="user-actions">
            {/* User email display */}
            <div className="user-email">
              {session?.user?.email}
            </div>
            
            {/* Logout button */}
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="logout-button"
            >
              Log out
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="main-content">
        <div className="dashboard-card">
          <div className="card-header">
            <h1>Dashboard</h1>
            <p>
              Welcome back, {session?.user?.name || session?.user?.email?.split('@')[0]}
            </p>
          </div>
          <div className="card-body">
            <div className="user-data-section">
              <h2>Your Account Information</h2>
              
              <div className="data-row">
                <strong>Email:</strong>
                <span>{session?.user?.email}</span>
              </div>
              
              <div className="data-row">
                <strong>Name:</strong>
                <span>{session?.user?.name || "Not provided"}</span>
              </div>
              
              <div className="status-message info">
                <p>We're transitioning to Firebase for better data storage!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}