/**
 * Login Component
 * Purpose: Provides a secure authentication portal for users.
 * Features:
 * - Dynamic Form State: Toggles between 'Login' and 'Registration' modes.
 * - Client-Side Validation: Ensures password parity before hitting the server.
 * - Asynchronous API Communication: Interfaces with the Node/Express backend using the Fetch API.
 */

import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
    // Component State Management
    const [isSignUp, setIsSignUp] = useState(false); 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    /**
     * Form Submission Handler
     * Orchestrates the authentication request based on the current mode (Login vs Register).
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); 

        // Client-side verification for new registrations
        if (isSignUp && password !== confirmPassword) {
            alert("Passwords do not match! Please check your entry.");
            return; 
        }

        // Determine target endpoint based on user intent
        const endpoint = isSignUp ? '/api/register' : '/api/login';
        
        try {
            const response = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                
                // State Transition: 
                // If login was successful, update the root app state.
                // If registration was successful, revert to login mode for security.
                if (!isSignUp) {
                    onLogin(data.username); 
                } else {
                    setIsSignUp(false); 
                }
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("Could not connect to the server.");
        }
    };

    return (
        <div className="login-card">
            <h2>{isSignUp ? 'Create Tifosi Account' : 'Tifosi Login'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Username</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                
                {/* Conditional Rendering: Register-specific field */}
                {isSignUp && (
                    <div className="input-group">
                        <label>Confirm Password</label>
                        <input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                        />
                    </div>
                )}

                <button type="submit" className="login-btn">
                    {isSignUp ? 'Register' : 'Start Tracking'}
                </button>
            </form>
            
            <p className="toggle-text" onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? 'Already a Tifosi? Login here' : 'New here? Create an account'}
            </p>
        </div>
    );
};

export default Login;