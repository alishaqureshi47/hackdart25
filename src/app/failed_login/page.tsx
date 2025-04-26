"use client";


import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";
import "./failed_login.css"; 

export default function Dashboard() {
    const { data: session, status, } = useSession();

    if (status === "loading") {
        return (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        );
    }
    if (session?.user?.email?.endsWith('.edu')){
        redirect('/dashboard');
    }
    else{
    
    
    
    return(
        <div className="container">
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
                  </div>
                </div>
              </nav>

        
        {/* Main content */}
        <div className="main-content">
            <div className="dashboard-card">
                <div className="card-header">
                <h1>Invalid Login</h1>
                <h2>
                    Welcome ,<strong> {session?.user?.name || session?.user?.email?.split('@')[0]}  </strong> 
                </h2>
                <p>
                    Unfortunately, we only allow users with a .edu email to access this site.  
                
                    Please log out and try again with an email ending in <strong>.edu</strong>
                    
                </p>
                </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="logout-button"
            >
              Log out   
            </button>
        </div>
    </div> 
    );
}
}