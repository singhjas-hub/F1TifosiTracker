/**
 * DriverCard Component
 * * Purpose: A reusable UI tile that displays individual driver identity and team data.
 * Features: 
 * - Event Bubbling Management: Prevents card-click actions when the follow button is pressed.
 * - Dynamic Styling: Reflects follow-status via conditional class assignment.
 * - Fallback Logic: Ensures UI stability by defaulting to nationality if team data is missing.
 */

import React from 'react';

const DriverCard = ({ driver, isFollowing, onFollow, onClick }) => {
    return (
        <div 
            className="driver-card" 
            onClick={onClick} 
            style={{ cursor: 'pointer' }}
        >
            {/* Semantic background element for aesthetic depth */}
            <div className="driver-number">#{driver.driver_number}</div>
            
            <div className="driver-info">
                <h3>{driver.first_name} {driver.last_name}</h3>
                
                {/* Relational Fallback: Prioritizes the Team Name (from Constructor JOIN) 
                  over the base Nationality column.
                */}
                <p className="team-name">{driver.team_name || driver.nationality}</p>
            </div>

            <button 
                className={isFollowing ? "follow-btn following" : "follow-btn"} 
                onClick={(e) => {
                    e.stopPropagation(); 
                    onFollow();
                }}
            >
                {isFollowing ? '✓ Following' : '+ Follow'}
            </button>
        </div>
    );
};

export default DriverCard;