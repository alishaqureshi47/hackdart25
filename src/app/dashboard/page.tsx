"use client";

import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import "./dashboard.css"; 

// Simple UserData type
type UserData = {
  email: string;
  name: string | null | undefined;
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Protect this page - redirect to login if not authenticated
  if (status === "unauthenticated") {
    redirect("/login");
  }

  // Fetch user data when component loads
  useEffect(() => {
    async function fetchUserData() {
      if (status === "authenticated") {
        try {
          const response = await fetch('/api/user');
          if (response.ok) {
            const data = await response.json();
            setUserData(data.userData);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    
    fetchUserData();
  }, [status]);

  // Save user data function
  async function saveUserData() {
    if (!session?.user?.email) return;
    
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
          name: session.user.name
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setUserData({
          email: session.user.email,
          name: session.user.name
        });
        setSaveMessage("Profile data saved successfully!");
      } else {
        setSaveMessage("Failed to save profile data.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      setSaveMessage("An error occurred while saving.");
    } finally {
      setIsSaving(false);
      
      // Clear success message after 3 seconds
      if (saveMessage && !saveMessage.includes("Failed") && !saveMessage.includes("error")) {
        setTimeout(() => setSaveMessage(null), 3000);
      }
    }
  }

  // Show loading state while session is being fetched
  if (status === "loading" || (status === "authenticated" && loading)) {
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
              
              {userData ? (
                <>
                  <div className="data-row">
                    <strong>Email:</strong>
                    <span>{userData.email}</span>
                  </div>
                  
                  <div className="data-row">
                    <strong>Name:</strong>
                    <span>{userData.name || "Not provided"}</span>
                  </div>
                  
                  <div className="status-message success">
                    <p>Your account data has been stored in MongoDB!</p>
                  </div>
                </>
              ) : (
                <div className="status-message warning">
                  <p>User data not found. Click below to save your data.</p>
                </div>
              )}
              
              {/* Simple save button */}
              <button 
                onClick={saveUserData}
                disabled={isSaving} 
                className="save-button"
              >
                {isSaving ? "Saving..." : "Save Profile Data"}
              </button>
              
              {/* Save message */}
              {saveMessage && (
                <div className={`status-message ${saveMessage.includes("success") ? "success" : "error"}`}>
                  <p>{saveMessage}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}