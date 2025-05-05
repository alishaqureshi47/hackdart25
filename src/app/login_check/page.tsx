"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./login_check.css";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [signedOut, setSignedOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      if (session.user.email.endsWith(".edu")) {
        router.push("/dashboard");
      } else {
        signOut({ redirect: false }).then(() => {
          setSignedOut(true);
        });
      }
    }
  }, [session, status, router]);

  useEffect(() => {
    if (signedOut) {
      // 🛡️ Disable all clicks globally
      document.body.style.pointerEvents = "none";
    } else {
      // ✅ Make sure we re-enable it if not signedOut
      document.body.style.pointerEvents = "auto";
    }

    // Clean up if user navigates away
    return () => {
      document.body.style.pointerEvents = "auto";
    };
  }, [signedOut]);

  if (status === "loading") {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container invalid-login-page">
      {/* Full page stays as is */}
      <div className="main-content">
        <div className="dashboard-card">
          <div className="card-header">
            {signedOut ? (
              <>
                <h1>Invalid Login</h1>
                <h2>
                  Hello, <strong>{session?.user?.name || "Guest"}</strong>
                </h2>
                <p>
                  You have been signed out because we only allow emails ending with <strong>.edu</strong>.
                  Please click the button below to return to the login page.
                </p>
                {/* 🛡️ manually re-enable clicks only on this button */}
                <button
                  onClick={() => window.location.assign("/login")}
                  className="logout-button"
                  style={{ pointerEvents: "auto" }}
                >
                  Go to Login
                </button>
              </>
            ) : (
              <>
                <h1>Welcome</h1>
                <h2>
                  Hello, <strong>{session?.user?.name || session?.user?.email?.split("@")[0]}</strong>
                </h2>
                <p>Checking your account...</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
