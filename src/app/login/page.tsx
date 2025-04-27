"use client";
import React, { Suspense } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import './login.css';

// Create a separate component for the parts that use search params
function LoginContent() {
  const { data: session, status } = useSession();
  
  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    await signIn("google", { 
      callbackUrl: "/failed_login",
      // Force a new consent prompt to ensure we bypass any cached permissions
      prompt: "consent"
    });
  };

  // Redirect if already authenticated
  if (status === "authenticated" && session) {
    redirect("/dashboard");
  }

  return (
    <div className="login-section">
      <div className="logo">
        <img src="/QuippLogo.png" alt="Quipp logo" />
      </div>
      <h1><center>Login</center></h1>
      <p className="tagline">Sign in using your campus email.</p>

      <ErrorMessage />

      <button 
        className="google-login" 
        onClick={handleGoogleSignIn}
        disabled={status === "loading"}
      >
        <img src="/google_logo.png" alt="Google logo" />
        <span>{status === "loading" ? "Loading..." : "Sign in with Google"}</span>
      </button>
    </div>
  );
}

// Separate component that uses useSearchParams
function ErrorMessage() {
  // Import useSearchParams inside the component that uses it
  const { useSearchParams } = require('next/navigation');
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');

  if (!error) return null;

  return (
    <div className="error-message">
      {error === "Callback" ? 
        "There was an issue with Google authentication. Make sure you're using an allowed account." : 
        `Error: ${error}`}
    </div>
  );
}

export default function Login() {
  return (
    <div className="container">
      <Suspense fallback={
        <div className="login-section">
          <div className="logo">
            <img src="/QuippLogo.png" alt="Quipp logo" />
          </div>
          <h1><center>Login</center></h1>
          <p className="tagline">Loading...</p>
        </div>
      }>
        <LoginContent />
      </Suspense>
    </div>
  );
}