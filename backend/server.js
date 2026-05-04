/**
 * F1 Tifosi Tracker - Backend Server
 * Architecture: Node.js / Express with MySQL
 * Purpose: Handles real-time telemetry calculations, user authentication, 
 * and automated data archival migrations.
 */

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); 

// 1. AUTHENTICATION (Security & Hashing)
/**
 * Register a new Tifosi member.
 * Demonstrates: Password hashing via bcrypt and Parameterized SQL Queries to prevent Injection.
 */
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [existingUser] = await db.query('SELECT * FROM Users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Username already taken." });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await db.query(
            'INSERT INTO Users (username, password_hash) VALUES (?, ?)',
            [username, hashedPassword]
        );
        res.status(201).json({ message: "Tifosi account created successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Server error during registration." });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM Users WHERE username = ?', [username]);
        if (rows.length === 0) return res.status(400).json({ message: "Invalid credentials." });

        const isMatch = await bcrypt.compare(password, rows[0].password_hash);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

        res.status(200).json({ username: rows[0].username, message: "Login successful!" });
    } catch (err) {
        res.status(500).json({ message: "Server error." });
    }
});

// 2. DRIVER & TELEMETRY LOGIC

/**
 * Fetches the 2025 Grid with Technical Specs.
 * Demonstrates: LEFT JOIN to combine Driver and Constructor tables.
 */
app.get('/api/drivers', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT d.*, c.team_name, c.engine_supplier, c.horsepower, c.top_speed_kph 
            FROM Drivers d
            LEFT JOIN Constructors c ON d.team_id = c.team_id
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch driver stats" });
    }
});

/**
 * Advanced Telemetry Engine.
 * Demonstrates: 
 * - RANK() Window Function: Calculates real-time lap positions.
 * - MIN() OVER Partition: Finds driver's personal best across the session.
 * - Scalar Subquery: Anchors current times against the Lap 1 leader for delta analysis.
 */
app.get('/api/stats/:track', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                rs.*, 
                d.last_name, 
                d.driver_id,
                RANK() OVER(PARTITION BY rs.lap_number ORDER BY rs.lap_time_seconds ASC) as position,
                MIN(rs.lap_time_seconds) OVER(PARTITION BY rs.driver_id) as personal_best,
                (SELECT MIN(lap_time_seconds) FROM Race_Stats WHERE track_name = ? AND lap_number = 1) as session_best
            FROM Race_Stats rs
            JOIN Drivers d ON rs.driver_id = d.driver_id
            WHERE rs.track_name = ?
            ORDER BY rs.lap_number ASC, rs.lap_time_seconds ASC
        `, [req.params.track, req.params.track]);
        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
});

// 3. WATCHLIST SYSTEM (Relational M:N)
app.get('/api/watchlist/:username', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT driver_id FROM Watchlist WHERE user_id = (SELECT user_id FROM Users WHERE username = ?)', 
            [req.params.username]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching watchlist" });
    }
});

app.post('/api/watchlist/toggle', async (req, res) => {
    const { username, driverId } = req.body;
    try {
        const [user] = await db.query('SELECT user_id FROM Users WHERE username = ?', [username]);
        const userId = user[0].user_id;

        const [existing] = await db.query('SELECT * FROM Watchlist WHERE user_id = ? AND driver_id = ?', [userId, driverId]);

        if (existing.length > 0) {
            await db.query('DELETE FROM Watchlist WHERE user_id = ? AND driver_id = ?', [userId, driverId]);
            res.json({ following: false });
        } else {
            await db.query('INSERT INTO Watchlist (user_id, driver_id) VALUES (?, ?)', [userId, driverId]);
            res.json({ following: true });
        }
    } catch (err) {
        res.status(500).json({ message: "Error updating watchlist" });
    }
});

// 4. ARCHIVAL & DELETION (Integrity Management)
/**
 * Account Purge.
 * Demonstrates: Sequential deletion to satisfy Foreign Key constraints 
 * and migration of temporal data to an Audit table.
 */
app.delete('/api/profile/delete/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const [userData] = await db.query('SELECT user_id, username, created_at FROM Users WHERE username = ?', [username]);
        if (userData.length === 0) return res.status(404).json({ error: "User not found" });

        const userId = userData[0].user_id;

        // 1. Move to Archive
        await db.query(`
            INSERT INTO Deleted_Users (username, created_at, deleted_at)
            VALUES (?, ?, NOW())
        `, [userData[0].username, userData[0].created_at]);

        // 2. Satisfy Foreign Key constraints by purging child rows first
        await db.query('DELETE FROM watchlist WHERE user_id = ?', [userId]);

        // 3. Final removal from active Users table
        await db.query('DELETE FROM Users WHERE user_id = ?', [userId]);

        res.json({ message: "Account and watchlist archived and cleared." });
    } catch (err) {
        res.status(500).json({ error: "Relational migration failed." });
    }
});

/**
 * Lifespan Audit.
 * Demonstrates: DATE_FORMAT for reporting and TIMESTAMPDIFF for temporal calculations.
 */
app.get('/api/archive', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                username,
                DATE_FORMAT(created_at, '%b %d, %Y') as joined,
                DATE_FORMAT(deleted_at, '%b %d, %Y') as left_date,
                CASE 
                    WHEN TIMESTAMPDIFF(SECOND, created_at, deleted_at) < 86400 
                    THEN 'New Account (< 24h)'
                    ELSE CONCAT(TIMESTAMPDIFF(DAY, created_at, deleted_at), ' Days Active')
                END AS account_lifespan
            FROM Deleted_Users
            ORDER BY deleted_at DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
});

// 5. PROFILE SETTINGS
app.get('/api/profile/:username', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT fav_team FROM Users WHERE username = ?', [req.params.username]);
        res.json(rows[0] || { fav_team: 'Ferrari' });
    } catch (err) {
        res.status(500).json({ message: "Error fetching profile" });
    }
});

app.put('/api/profile/update', async (req, res) => {
    const { username, favTeam } = req.body;
    try {
        await db.query('UPDATE Users SET fav_team = ? WHERE username = ?', [favTeam, username]);
        res.json({ message: "Profile updated!" });
    } catch (err) {
        res.status(500).json({ message: "Error updating profile" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server sprinting on port ${PORT}`));