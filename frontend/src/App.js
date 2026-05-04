import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Navbar from './components/Navbar'; 
import DriverCard from './components/DriverCard'; 
import Results from './components/Results'; 
import Profile from './components/Profile';

function App() {
  const [user, setUser] = useState(null);
  const [favTeam, setFavTeam] = useState('Ferrari'); 
  const [view, setView] = useState('dashboard');
  const [drivers, setDrivers] = useState([]); 
  const [watchlist, setWatchlist] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState(null); 

  useEffect(() => {
    const savedUser = localStorage.getItem('tifosiUser');
    if (savedUser) setUser(savedUser);
  }, []);

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([
        fetch('http://localhost:5000/api/drivers').then(res => res.json()),
        fetch(`http://localhost:5000/api/watchlist/${user}`).then(res => res.json()),
        fetch(`http://localhost:5000/api/profile/${user}`).then(res => res.json())
      ]).then(([driverData, watchData, profileData]) => {
        setDrivers(driverData);
        setWatchlist(watchData.map(item => item.driver_id));
        if (profileData.fav_team) setFavTeam(profileData.fav_team);
        setLoading(false);
      }).catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
    }
  }, [user]);

  const handleLogin = (username) => {
    setUser(username);
    localStorage.setItem('tifosiUser', username);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('tifosiUser');
    setView('dashboard');
  };

  const toggleFollow = async (driverId) => {
    const response = await fetch('http://localhost:5000/api/watchlist/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, driverId })
    });
    if (response.ok) {
      const data = await response.json();
      setWatchlist(prev => 
        data.following ? [...prev, driverId] : prev.filter(id => id !== driverId)
      );
    }
  };

  return (
    <div className={`app-container theme-${favTeam.toLowerCase().replace(/\s/g, '')}`}>
      {user && <Navbar user={user} onLogout={handleLogout} setView={setView} />}
      
      <main>
        {!user ? (
          <Login onLogin={handleLogin} />
        ) : (
          <>
            {loading ? (
              <div className="loader">Pit stop in progress... Loading data...</div>
            ) : (
              <>
                {view === 'dashboard' && (
                  <div className="dashboard-content" style={{ padding: '20px' }}>
                    <div className="dashboard-header">
                        <h2>2025 F1 Grid</h2>
                        {/* Watchlist toggle removed for a cleaner UI */}
                    </div>
                    <div className="driver-grid">
                      {drivers.map((driver) => (
                        <DriverCard 
                          key={driver.driver_id} 
                          driver={driver} 
                          isFollowing={watchlist.includes(driver.driver_id)} 
                          onFollow={() => toggleFollow(driver.driver_id)}
                          onClick={() => setSelectedDriver(driver)} 
                        />
                      ))}
                    </div>
                  </div>
                )}

                {view === 'watchlist' && (
                  <div className="watchlist-content" style={{ padding: '20px' }}>
                    <h2>My Tifosi Watchlist</h2>
                    <div className="driver-grid">
                      {drivers.filter(d => watchlist.includes(d.driver_id)).length > 0 ? (
                        drivers.filter(d => watchlist.includes(d.driver_id)).map((driver) => (
                          <DriverCard 
                            key={driver.driver_id} 
                            driver={driver} 
                            isFollowing={true} 
                            onFollow={() => toggleFollow(driver.driver_id)}
                            onClick={() => setSelectedDriver(driver)} 
                          />
                        ))
                      ) : (
                        <p>Your watchlist is empty.</p>
                      )}
                    </div>
                  </div>
                )}

                {selectedDriver && (
                  <div className="modal-overlay" onClick={() => setSelectedDriver(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                      <button className="close-btn" onClick={() => setSelectedDriver(null)}>×</button>
                      
                      <div className="modal-header">
                        <span className="big-number">#{selectedDriver.driver_number}</span>
                        <h2>{selectedDriver.first_name} {selectedDriver.last_name}</h2>
                        <p className="modal-team">{selectedDriver.team_name}</p>
                      </div>

                      <div className="modal-grid">
                        <div className="modal-section">
                          <h3>Physical Stats</h3>
                          <p><strong>Height:</strong> {selectedDriver.height_cm} cm</p>
                          <p><strong>Weight:</strong> {selectedDriver.weight_kg} kg</p>
                          <p><strong>Nationality:</strong> {selectedDriver.nationality}</p>
                        </div>

                        <div className="modal-section">
                          <h3>Performance</h3>
                          <p><strong>Fastest Lap (2025):</strong> <span className="timer">{selectedDriver.fastest_lap_time || 'N/A'}</span></p>
                          <p><strong>Career Podiums:</strong> {selectedDriver.career_podiums}</p>
                        </div>

                        <div className="modal-section full-width">
                          <h3>Power Unit Specs</h3>
                          <div className="engine-bar">
                            <p><strong>Manufacturer:</strong> {selectedDriver.engine_supplier}</p>
                            <p><strong>Output:</strong> {selectedDriver.horsepower} HP</p>
                            <p><strong>Top Speed:</strong> {selectedDriver.top_speed_kph} KPH</p>
                          </div>
                        </div>
                      </div>

                      <button className="close-telemetry-btn" onClick={() => setSelectedDriver(null)}>
                        Close Telemetry
                      </button>
                    </div>
                  </div>
                )}

                {view === 'results' && <Results watchlist={watchlist} />}
                {view === 'profile' && (
                  <Profile 
                    user={user} 
                    favTeam={favTeam} 
                    setFavTeam={setFavTeam} 
                    onLogout={handleLogout} 
                  />
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;