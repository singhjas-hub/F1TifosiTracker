const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); // Allows us to read JSON sent from React

app.use((req, res, next) => {
    setTimeout(next, 2000); 
});

// --- REGISTER ROUTE ---
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
        const [rows] = await db.query('SELECT * FROM Drivers');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching drivers" });
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
    try {
        const username = req.params.username;
        // 1. Get User ID
        const [user] = await db.query('SELECT user_id FROM Users WHERE username = ?', [username]);
        const userId = user[0].user_id;

        // 2. Delete from Watchlist first (Child table)
        await db.query('DELETE FROM Watchlist WHERE user_id = ?', [userId]);

        // 3. Delete from Users (Parent table)
        await db.query('DELETE FROM Users WHERE user_id = ?', [userId]);

        res.json({ message: "Account and data deleted successfully." });
    } catch (err) {
        res.status(500).json({ message: "Error deleting account." });
    }
});