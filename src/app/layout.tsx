"use client";
import Nav from "../components/Nav"
import { SessionProvider } from "next-auth/react";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="top-navbar">
          <Nav />
        </div>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}