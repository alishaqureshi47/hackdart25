"use client";
import React from 'react';
import { signIn, useSession } from 'next-auth/react';
import { redirect, useSearchParams } from 'next/navigation';
import './login.css';

export default function Login() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  
  // Redirect if already authenticated
  if (status === "authenticated" && session) {
    redirect("/dashboard");
  }

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    await signIn("google", { 
      callbackUrl: "/failed_login",
      // Force a new consent prompt to ensure we bypass any cached permissions
      prompt: "consent"
    });
  };

  return (
    <div className="container">
      <div className="login-section">
        <div className="logo">
          <img src="/QuippLogo.png" alt="Quipp logo" />
        </div>
        <h1><center>Login</center></h1>
        <p className="tagline">Sign in using your campus email.</p>

        {error && (
          <div className="error-message">
            {error === "Callback" ? 
              "There was an issue with Google authentication. Make sure you're using an allowed account." : 
              `Error: ${error}`}
          </div>
        )}

        <button 
          className="google-login" 
          onClick={handleGoogleSignIn}
          disabled={status === "loading"}
        >
          <img src="/google_logo.png"  />
          <span>{status === "loading" ? "Loading..." : "Sign in with Google"}</span>
        </button>
      </div>
    </div>
  );
}