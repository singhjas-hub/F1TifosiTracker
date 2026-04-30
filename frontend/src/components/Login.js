import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
    const [isSignUp, setIsSignUp] = useState(false); 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp && password !== confirmPassword) {
        alert("Passwords do not match! Please check your entry.");
        return; // This stops the function here
    }
    const endpoint = isSignUp ? '/api/register' : '/api/login';
    
    try {
        const response = await fetch(`http://localhost:5000${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            // If it's a new registration, maybe switch to login mode or just log them in
            alert(data.message);
            if (!isSignUp) onLogin(data.username); 
            else setIsSignUp(false); // Switch to login mode after registering
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
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                
                {/* Only show this if they are signing up */}
                {isSignUp && (
                    <div className="input-group">
                        <label>Confirm Password</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
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