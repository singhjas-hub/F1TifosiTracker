import React from 'react';

const DriverCard = ({ driver, isFollowing, onFollow }) => {
  return (
    <div className="driver-card">
      {/* 1. Update to driver_number */}
      <div className="driver-number">#{driver.driver_number}</div>
      
      <div className="driver-info">
        {/* 2. Combine first_name and last_name */}
        <h3>{driver.first_name} {driver.last_name}</h3>
        
        {/* 3. This stays the same if you haven't linked teams yet, 
               or you can use driver.nationality for now */}
        <p className="team-name">{driver.nationality}</p>
      </div>

      <button 
        className={isFollowing ? "follow-btn following" : "follow-btn"} 
        onClick={onFollow}
      >
        {isFollowing ? '✓ Following' : '+ Follow'}
      </button>
    </div>
  );
};

export default DriverCard;