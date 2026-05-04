const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); // Allows us to read JSON sent from React


// REGISTER ROUTE
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Check if user already exists (Parameterized Query)
        const [existingUser] = await db.query('SELECT * FROM Users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Username already taken." });
        }

        // 2. Hash the password (Security)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 3. Insert into MySQL (Parameterized Query)
        await db.query(
            'INSERT INTO Users (username, password_hash) VALUES (?, ?)',
            [username, hashedPassword]
        );

        res.status(201).json({ message: "Tifosi account created successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during registration." });
    }
});

// --- LOGIN ROUTE ---
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM Users WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(400).json({ message: "Invalid username or password." });
        }

        const user = rows[0];
        // Compare the provided password with the hash in the DB
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid username or password." });
        }

        res.status(200).json({ username: user.username, message: "Login successful!" });
    } catch (err) {
        res.status(500).json({ message: "Server error." });
    }
});

// Toggle follow status in the database
app.post('/api/watchlist/toggle', async (req, res) => {
    const { username, driverId } = req.body;

    try {
        // 1. Get the user_id first
        const [user] = await db.query('SELECT user_id FROM Users WHERE username = ?', [username]);
        const userId = user[0].user_id;

        // 2. Check if the link already exists
        const [existing] = await db.query(
            'SELECT * FROM Watchlist WHERE user_id = ? AND driver_id = ?', 
            [userId, driverId]
        );

        if (existing.length > 0) {
            // Unfollow: Remove the link
            await db.query('DELETE FROM Watchlist WHERE user_id = ? AND driver_id = ?', [userId, driverId]);
            res.json({ following: false });
        } else {
            // Follow: Create the link
            await db.query('INSERT INTO Watchlist (user_id, driver_id) VALUES (?, ?)', [userId, driverId]);
            res.json({ following: true });
        }
    } catch (err) {
        res.status(500).json({ message: "Error updating watchlist" });
    }
});

// Get all drivers from the database
app.get('/api/drivers', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                d.*, 
                c.team_name, 
                c.engine_supplier, 
                c.horsepower, 
                c.top_speed_kph 
            FROM Drivers d
            LEFT JOIN Constructors c ON d.team_id = c.team_id
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch driver stats" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server sprinting on port ${PORT}`));

// Get user profile (including fav team)
app.get('/api/profile/:username', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT fav_team FROM Users WHERE username = ?', [req.params.username]);
        res.json(rows[0] || { fav_team: 'Ferrari' });
    } catch (err) {
        res.status(500).json({ message: "Error fetching profile" });
    }
});

// Update user profile (fav team)
app.put('/api/profile/update', async (req, res) => {
    const { username, favTeam } = req.body;
    try {
        await db.query('UPDATE Users SET fav_team = ? WHERE username = ?', [favTeam, username]);
        res.json({ message: "Profile updated!" });
    } catch (err) {
        res.status(500).json({ message: "Error updating profile" });
    }
});

// Get specific user's watchlist driver IDs
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


app.delete('/api/profile/delete/:username', async (req, res) => {
    const { username } = req.params;

    try {
        // 1. Get the user_id first (we need it to clean up the watchlist)
        const [userData] = await db.query('SELECT user_id, username, created_at FROM Users WHERE username = ?', [username]);
        
        if (userData.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const userId = userData[0].user_id;

        // 2. ARCHIVE: Move the user data to the archive table
        await db.query(`
            INSERT INTO Deleted_Users (username, created_at, deleted_at)
            VALUES (?, ?, NOW())
        `, [userData[0].username, userData[0].created_at]);

        // 3. CLEANUP: Delete from Watchlist first to satisfy Foreign Key constraint
        // This is the "Nontrivial" dependency management part!
        await db.query('DELETE FROM watchlist WHERE user_id = ?', [userId]);

        // 4. FINAL DELETE: Now we can safely remove the user
        await db.query('DELETE FROM Users WHERE user_id = ?', [userId]);

        res.json({ message: "Account and watchlist successfully archived and cleared." });
    } catch (err) {
        console.error("Archive Error:", err);
        res.status(500).json({ error: "Migration failed due to database constraints." });
    }
});


app.get('/api/stats/:track', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                rs.*, 
                d.last_name, 
                d.driver_id,
                RANK() OVER(PARTITION BY rs.lap_number ORDER BY rs.lap_time_seconds ASC) as position,
                MIN(rs.lap_time_seconds) OVER(PARTITION BY rs.driver_id) as personal_best,
                -- NEW ANCHOR: The fastest time from Lap 1 only
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

app.get('/api/archive', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                username,
                DATE_FORMAT(created_at, '%b %d, %Y') as joined,
                DATE_FORMAT(deleted_at, '%b %d, %Y') as left_date,
                -- NONTRIVIAL: Calculate lifespan. If created/deleted same day, show 'New'
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

app.post('/api/delete-account/:userId', async (req, res) => {
    const { userId } = req.params;
    
    try {
        // 1. Move the user to the archive table using a subquery
        await db.query(`
            INSERT INTO Deleted_Users (username, created_at)
            SELECT username, created_at FROM Users WHERE id = ?
        `, [userId]);

        // 2. Remove the user from the active session table
        await db.query(`DELETE FROM Users WHERE id = ?`, [userId]);

        res.json({ message: "Account archived successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Migration to archive failed." });
   
    }
});