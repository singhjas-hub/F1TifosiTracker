/**
 * Profile Component
 * Purpose: Manages user-specific preferences and account lifecycle actions.
 * Features:
 * - Persistent Preferences: Updates the 'fav_team' in the Users table via PUT.
 * - Relational Archival: Triggers the multi-stage deletion/migration process.
 * - Audit Visibility: Conditionally renders the Archive component to view historical data.
 */

import React, { useState } from 'react';
import Archive from './Archive'; 

const Profile = ({ user, favTeam, setFavTeam, onLogout }) => {
    // Local state to toggle the visibility of the historical audit trail
    const [showArchive, setShowArchive] = useState(false);

    /**
     * Preference Update Handler
     * Communicates with the /api/profile/update endpoint to persist 
     * theme choices in the database.
     */
    const handleUpdate = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/profile/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: user, favTeam: favTeam })
            });

            if (response.ok) {
                alert("Preferences saved to database!");
            } else {
                alert("Failed to update preferences.");
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("Could not connect to the server.");
        }
    };

    /**
     * Account Deletion & Migration Handler
     * This triggers the 'Nontrivial' backend logic that purges active data
     * while preserving an audit trail in the Deleted_Users table.
     */
    const handleDeleteAccount = async () => {
        const confirm = window.confirm(
            "Warning: This will permanently archive your account data and end your session. Proceed?"
        );
        
        if (confirm) {
            try {
                const response = await fetch(`http://localhost:5000/api/profile/delete/${user}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    alert("Account successfully archived. You have been logged out.");
                    onLogout(); // Clears local session state in App.js
                }
            } catch (error) {
                alert("Critical Error: Migration failed.");
            }
        }
    };

    return (
        <div className="profile-container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ borderBottom: '2px solid var(--f1-red)', paddingBottom: '10px' }}>
                User Settings
            </h2>
            
            <div className="profile-card" style={{ background: '#1f1f27', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
                <p style={{ marginBottom: '20px' }}><strong>Tifosi Member:</strong> {user}</p>
                
                <div className="input-group" style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', color: '#ccc' }}>
                        Favorite Team (Dashboard Theme)
                    </label>
                    <select 
                        value={favTeam} 
                        onChange={(e) => setFavTeam(e.target.value)}
                        style={{ width: '100%', padding: '10px', background: '#15151e', color: 'white', border: '1px solid #333' }}
                    >
                        <option value="Ferrari">Ferrari</option>
                        <option value="Mercedes">Mercedes</option>
                        <option value="Red Bull">Red Bull</option>
                        <option value="McLaren">McLaren</option>
                        <option value="Williams">Williams</option>
                    </select>
                </div>

                <button 
                    onClick={handleUpdate}
                    style={{ background: '#e10600', color: 'white', border: 'none', padding: '12px', width: '100%', cursor: 'pointer', fontWeight: 'bold', marginBottom: '15px', borderRadius: '4px' }}
                >
                    Save Preferences
                </button>

                <hr style={{ border: '0', borderTop: '1px solid #333', margin: '20px 0' }} />

                <button 
                    onClick={handleDeleteAccount}
                    style={{ background: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', padding: '10px', width: '100%', cursor: 'pointer', borderRadius: '4px', marginBottom: '15px' }}
                >
                    Delete My Account
                </button>

                {/* Audit Trail Toggle: Showcases the 'Deleted_Users' historical table */}
                <button 
                    onClick={() => setShowArchive(!showArchive)}
                    style={{ 
                        background: '#333', 
                        color: '#ffd700', 
                        border: '1px solid #ffd700', 
                        padding: '10px', 
                        width: '100%', 
                        cursor: 'pointer', 
                        borderRadius: '4px',
                        fontWeight: 'bold'
                    }}
                >
                    {showArchive ? "Hide Archive" : "View Historical User Audit"}
                </button>
            </div>

            {showArchive && (
                <div style={{ marginTop: '30px' }}>
                    <Archive />
                </div>
            )}
        </div>
    );
};

export default Profile;