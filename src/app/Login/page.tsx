"use client";
import React, { useState } from 'react';
import './login.css'; // Import the CSS file

interface Props {}

const Login: React.FC<Props> = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleRememberMeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRememberMe(event.target.checked);
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log('Front-end Login Data:', { email, password, rememberMe });
        // In a real application, you would send this data to your back-end
        // for authentication.
    };

    return (
        <div className="container">
            <div className="login-section">
                <div className="logo">
                    <img src="/logo.png" alt="Quipp logo" />
                    <span>QUIPP</span>
                </div>
                <h1>Login</h1>
                <p className="tagline">Login to your campus email.</p>

                <button className="google-login">
                    <img src="/google_logo.png" alt="Sign in with Google" />
                    <span>Sign in with Google</span>
                </button>

                <div className="options">
                    <label>
                        <input
                            type="checkbox"
                            name="remember"
                            checked={rememberMe}
                            onChange={handleRememberMeChange}
                        />{' '}
                        Remember me
                    </label>                    
                </div>                
            </div>
            <div className="promo-section">
                <div className="promo-content">
                    <h2>Survey for Survey.</h2>
                    <p className="sub-headline">Quick and Precise .</p>                    
                </div>
            </div>
        </div>
    );
};

export default Login;