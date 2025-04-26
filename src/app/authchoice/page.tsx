"use client";

import React, { useState, useEffect } from 'react';
import DomainDisplay from './domaindisplay';
import './page.css';

const AuthChoicePage: React.FC = () => {
    const [domainName, setDomainName] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const currentDomain = window.location.hostname;
            setDomainName(currentDomain || 'Could not determine domain');
            setIsLoading(false);
        }
    }, []);

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            window.location.href = "/Login"; 
        }
    };

    return (
        <DomainDisplay domainName={domainName} isLoading={isLoading} onLogout={handleLogout} />
    );
};

export default AuthChoicePage;
