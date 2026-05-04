// src/components/DriverCard.js
import React from 'react';

const DriverCard = ({ driver, isFollowing, onFollow, onClick }) => {
  return (
    <div className="driver-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="driver-number">#{driver.driver_number}</div>
      
      <div className="driver-info">
        <h3>{driver.first_name} {driver.last_name}</h3>
        {/* Shows Team Name if it exists, otherwise falls back to Nationality */}
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