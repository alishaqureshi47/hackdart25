"use client";
import Nav from "../components/Nav"
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import initialSetup from "@/features/animations/services/initialSetup";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  
  /*
    *
    * This effect forces the scrollbar to recalculate its width
    * on route changes. This is important for layouts that use
    * scrollbars, as it ensures that the scrollbar width is always
    * accurate and does not cause layout shifts.
    * It is ultimately necessary because of an unknown underlying issue with scrollbar.
  */
  useEffect(() => {
    // Force scrollbar recalculation on route changes
    const forceScrollbarRecalculation = () => {
      document.documentElement.style.overflow = '';
      document.documentElement.style.overflow = 'auto';
      
      // Force layout recalculation
      window.dispatchEvent(new Event('resize'));
    };
    
    // Run immediately
    forceScrollbarRecalculation();
    
    // Small delay to ensure DOM has updated
    const timer = setTimeout(forceScrollbarRecalculation, 100);
    
    return () => clearTimeout(timer);
  }, [pathname]); // Re-run when the route changes

  useEffect(() => {
    initialSetup(); // animation setup
  }, []);

  return (
    <html lang="en">
      <body>
        <div className="preloader">
          <div className="loader"></div>
          <span>Loading...</span>
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