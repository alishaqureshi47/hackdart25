"use client";
import Nav from "../components/Nav"
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import initialSetup from "@/features/animations/services/initialSetup";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    initialSetup(); // animation setup
  }, []);
  return (
    <html lang="en">
      <body>
        <div className="preloader">
          <div className="loader"></div>
        </div>
        <div className="general-wrapper">
          <div className="top-navbar">
            <Nav />
            </div>
            <SessionProvider>
              {children}
            </SessionProvider>
          </div>
      </body>
    </html>
  );
}