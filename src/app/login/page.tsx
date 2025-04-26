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
      callbackUrl: "/dashboard",
      // Force a new consent prompt to ensure we bypass any cached permissions
      prompt: "consent"
    });
  };

  return (
    <div className="container">
      <div className="login-section">
        <div className="logo">
          <img src="/logo.png" alt="Quipp logo" />
          <span>QUIPP</span>
        </div>
        <h1>Login</h1>
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
          <img src="/google_logo.png" alt="Sign in with Google" />
          <span>{status === "loading" ? "Loading..." : "Sign in with Google"}</span>
        </button>
      </div>
      <div className="promo-section">
        <div className="promo-content">
          <h2>Spend Smarter.</h2>
          <p className="sub-headline">Quickly. Globally.</p>
          <img src="/phone-mockup.png" alt="Microdose Banking App on Phone" />
        </div>
      </div>
    </div>
  );
}