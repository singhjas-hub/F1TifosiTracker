F1 Tifosi Tracker

Project Description
The F1 Tifosi Tracker is a full-stack telemetry and driver management dashboard designed for Formula 1 enthusiasts. The application provides real-time race statistics, driver performance metrics, and a personalized Watchlist system.

A core focus of this project is the implementation of nontrivial SQL queries, including:
1. Window Functions: For calculating driver positions and session-best deltas.

2. Temporal Tracking: An archival system that migrates deleted user data into a historical audit trail using SQL interval arithmetic to calculate account lifespans.

3. Relational Integrity: Managed sequential deletions to maintain foreign key constraints between users and their telemetry watchlists.


Tech Stack:
Frontend: React.js, CSS3 (Custom Tifosi Theme)

Backend: Node.js, Express.js

Database: MySQL 8.0

API: RESTful Architecture


Prerequisites:
Node.js (v18.x or higher)

npm (v9.x or higher)

MySQL Server (v8.0+)

MySQL Workbench (Recommended for schema management)


Setup:
Run the provided schema scripts to create the following tables:

Users: Active user accounts and preferences.

Drivers: Master registry of 2025 F1 drivers and car specs.

Race_Stats: Multi-lap telemetry data.

watchlist: Relational table linking users to followed drivers.

Deleted_Users: Archival table for historical audit trails.

Crucial: Ensure the following temporal columns are present for the Archival feature:
ALTER TABLE Users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE Deleted_Users ADD COLUMN created_at TIMESTAMP NULL, ADD COLUMN deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;


Backend Setup:
Navigate to the backend directory.

Install dependencies:
npm install

Update database credentials in server.js (host, user, password).

To start the server:
node server.js


Frontend Setup:
Navigate to the root directory.

Install dependencies and start the React app:

npm install
npm start

Credentials:
You can create an account to access the tracker. 
If you want to use an old account, you can use:
Username = yes
password = yes


