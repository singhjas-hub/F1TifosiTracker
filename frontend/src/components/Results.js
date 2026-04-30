import React from 'react';

const Results = () => {
  return (
    <div className="results-container" style={{ padding: '20px' }}>
      <h2>2025 Race Results</h2>
      <select className="gp-selector" style={{ padding: '10px', background: '#15151e', color: 'white', marginBottom: '20px' }}>
        <option>Select a Grand Prix...</option>
        <option>Australian GP</option>
        <option>Chinese GP</option>
        <option>Japanese GP</option>
      </select>
      
      <p>Results will be pulled from the database here.</p>
    </div>
  );
};

export default Results;