/**
 * Archive Component
 * * Purpose: Provides a historical audit interface for deleted user accounts.
 * This component visualizes temporal data processed by the backend's SQL engine,
 * specifically showcasing account "lifespans" calculated via interval arithmetic.
 */

import React, { useState, useEffect } from 'react';

const Archive = () => {
    const [archivedData, setArchivedData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/archive')
            .then(res => res.json())
            .then(data => setArchivedData(data))
            .catch(err => console.error("Archive fetch error:", err));
    }, []);

    return (
        <div className="archive-table-wrapper">
            <h3 style={{ color: '#ffd700', marginBottom: '15px' }}>Historical User Audit</h3>
            <table className="stats-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Joined</th>
                        <th>Deleted</th>
                        <th>Lifespan</th>
                    </tr>
                </thead>
                <tbody>
                    {archivedData.length > 0 ? (
                        archivedData.map((row, index) => (
                            <tr key={index}>
                                <td>{row.username}</td>
                                <td>{row.joined}</td>
                                <td>{row.left_date}</td>
                                <td style={{ color: '#00ff00', fontWeight: 'bold' }}>
                                    {row.account_lifespan}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center', opacity: 0.5, padding: '20px' }}>
                                No archived records found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Archive;