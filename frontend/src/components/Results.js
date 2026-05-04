/**
 * Results Component
 * Purpose: Visualizes real-time telemetry and leaderboard dynamics.
 * Features:
 * - Dynamic SVG Rendering: Switches track layouts based on state using custom path coordinates.
 * - Telemetry Engine: Calculates 'Deltas' using a session-anchor (Lap 1, Pos 1) 
 * provided by the SQL backend's scalar subquery.
 * - Contextual Highlighting: Integrates the user's 'Watchlist' and 'Personal Best' 
 * indicators for a personalized data experience.
 */

import React, { useState, useEffect } from 'react';

const Results = ({ watchlist = [] }) => {
    // Component State: Track selection and fetched telemetry data
    const [race, setRace] = useState('Bahrain');
    const [stats, setStats] = useState([]);

    // Geographic SVG coordinates for track visualization
    const trackData = {
        'Bahrain': {
            path: "M150,50 L250,80 L230,120 L280,130 L320,180 L300,240 L350,300 L250,350 L180,320 L150,220 L120,180 L100,100 Z",
            dot: { cx: 150, cy: 50 }
        },
        'Silverstone': {
            path: "M50,150 L120,60 L180,90 L240,40 L320,70 L420,50 L450,150 L400,280 L300,350 L180,320 L120,350 L60,250 Z",
            dot: { cx: 50, cy: 150 }
        },
        'Monza': {
            path: "M60,120 L400,120 C460,120 480,200 480,250 C480,300 440,320 400,320 L150,320 C100,320 80,280 80,250 C80,200 60,160 80,140 Z",
            dot: { cx: 60, cy: 120 }
        }
    };

    /**
     * Effect Hook: Syncs telemetry data whenever the selected track changes.
     * The backend returns RANK() and session_best anchor for each row.
     */
    useEffect(() => {
        fetch(`http://localhost:5000/api/stats/${race}`)
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error("Telemetry fetch error:", err));
    }, [race]);

    return (
        <div className="stats-container">
            <div className="track-box">
                <div className="dropdown-wrapper">
                    <select 
                        className="race-dropdown" 
                        value={race} 
                        onChange={(e) => setRace(e.target.value)}
                    >
                        <option value="Bahrain">Bahrain GP</option>
                        <option value="Silverstone">British GP</option>
                        <option value="Monza">Italian GP</option>
                    </select>
                </div>

                <div className="rotating-track">
                    <svg viewBox="0 0 500 450" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                         <path d={trackData[race].path} />
                         <circle cx={trackData[race].dot.cx} cy={trackData[race].dot.cy} r="9" fill="var(--f1-red)" />
                    </svg>
                </div>
                <h3 className="track-title">{race.toUpperCase()} LIVE TELEMETRY</h3>
            </div>

            {/* Right Section: Processed Leaderboard */}
            <div className="leaderboard" style={{maxHeight: '550px', overflowY: 'auto'}}>
                <table className="stats-table">
                    <thead>
                        <tr>
                            <th>LAP</th>
                            <th>POS</th>
                            <th>DRIVER</th>
                            <th>TIME</th>
                            <th>DELTA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.map((s) => {
                            const lapTime = Number(s.lap_time_seconds);
                            const pbTime = Number(s.personal_best);
                            const lapOneLeaderTime = Number(s.session_best); 
                            
                            // Delta Calculation:
                            // We compare current time to the Lap 1 leader to see 
                            // race evolution relative to the start.
                            const isBaseline = s.lap_number === 1 && s.position === 1;
                            const rawGap = lapTime - lapOneLeaderTime;
                            
                            let displayDelta;
                            let deltaColor;

                            if (isBaseline) {
                                displayDelta = "INTERVAL";
                                deltaColor = 'white';
                            } else {
                                const sign = rawGap < 0 ? "-" : "+";
                                displayDelta = `${sign}${Math.abs(rawGap).toFixed(3)}s`;
                                deltaColor = rawGap < 0 ? '#00ff00' : '#ff4d4d';
                            }
                            
                            const isPersonalBest = lapTime === pbTime;
                            const isOnWatchlist = watchlist.includes(s.driver_id);
                            
                            return (
                                <tr key={s.stat_id} className={isOnWatchlist ? "watchlist-row" : ""}>
                                    <td style={{opacity: 0.6}}>L{s.lap_number}</td>
                                    <td style={{fontWeight: 'bold', color: s.position === 1 ? '#ffd700' : 'white'}}>
                                        P{s.position}
                                    </td>
                                    <td className="bold-text">
                                        {isOnWatchlist && <span className="star-indicator">⭐ </span>}
                                        {s.last_name.toUpperCase()}
                                    </td>
                                    <td className="timer">
                                        {lapTime.toFixed(3)}s
                                        {isPersonalBest && <span className="pb-badge">PB</span>}
                                    </td>
                                    <td style={{ color: deltaColor, fontWeight: 'bold' }}>
                                        {displayDelta}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Results;