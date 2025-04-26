"use client";

import React from 'react';
import './page.css';

interface DomainDisplayProps {
    domainName: string;
    isLoading: boolean;
    onLogout: () => void;
}

const DomainDisplay: React.FC<DomainDisplayProps> = ({ domainName, isLoading, onLogout }) => {
    return (
        <div className="domain-container">
            <div className="domain-card">

                <div className="logo">
                    <img src="/logo.png" alt="Quipp Logo" className="logo-img" />
                    <span className="logo-text">QUIPP</span>
                </div>

                <h1 className="main-heading">You are currently in:</h1>

                <div className="domain-box">
                    {isLoading ? (
                        <div className="spinner">
                            <span></span>
                        </div>
                    ) : (
                        <p className="domain-value">{domainName}</p>
                    )}
                </div>

                <div className="button-group">
                    <button className="primary-button" onClick={onLogout}>
                        Log Out
                    </button>
                    <button className="secondary-button" onClick={() => window.location.href = '/dashboard'}>
                        Continue to Dashboard <span className="arrow">→</span>
                    </button>
                </div>


            </div>
        </div>
    );
};

export default DomainDisplay;
