/**
 * F1 Tifosi Tracker - Database Configuration
 * * This module initializes the connection to the MySQL database.
 * We utilize a connection pool to manage concurrent requests efficiently,
 * which is critical for handling multiple telemetry data streams.
 */

const mysql = require('mysql2');
require('dotenv').config();

// Initialize the MySQL Connection Pool
// Connection pooling allows for reuse of database connections, 
// reducing overhead and improving application scalability.
const pool = mysql.createPool({
    host: process.env.DB_HOST,         // Database endpoint
    user: process.env.DB_USER,         // Authorized DB user
    password: process.env.DB_PASSWORD, // Encrypted/Environment-stored password
    database: process.env.DB_NAME,     // Target schema: f1_db
    waitForConnections: true,          // Queue requests when pool is full
    connectionLimit: 10,               // Maximum number of concurrent connections
    queueLimit: 0                      // Unlimited queue length for pending requests
});

/**
 * Exporting Promise-based Wrapper
 * Using .promise() allows the use of async/await in our route handlers, 
 * leading to cleaner, non-blocking code and easier error handling.
 */
module.exports = pool.promise();