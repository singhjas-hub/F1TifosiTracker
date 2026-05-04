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
  
  if (!driver || !driver.driver_number) {
    return null;
  }

  return (
    <div className="driver-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="driver-number">#{driver.driver_number}</div>
      
      <div className="driver-info">
        <h3>{driver.first_name} {driver.last_name}</h3>
        <p className="team-name">{driver.team_name || driver.nationality}</p>
        
        <div className="engine-specs" style={{ marginTop: '10px', fontSize: '0.8rem', opacity: 0.8 }}>
          <p style={{ margin: '2px 0' }}><strong>Engine:</strong> {driver.engine_supplier}</p>
          <p style={{ margin: '2px 0' }}><strong>Power:</strong> {driver.horsepower} HP</p>
          <p style={{ margin: '2px 0' }}><strong>V-Max:</strong> {driver.top_speed_kph} KPH</p>
        </div>
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
}

export default DriverCard;