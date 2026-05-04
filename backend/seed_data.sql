/**
 * F1 Tifosi Tracker - Seed Data
 * Purpose: Populates the f1_db with the 2025 grid, historical telemetry, and track data.
 * Instructions: Run this AFTER schema.sql.
 */

USE f1_db;

-- 1. CONSTRUCTORS (Teams)
-- Using explicit IDs to ensure Foreign Key consistency with Drivers
INSERT INTO Constructors (team_id, team_name, base_location, engine_supplier, horsepower, top_speed_kph) VALUES 
(1, 'Ferrari', 'Maranello, Italy', 'Ferrari', 1000, 352),
(2, 'Mercedes', 'Brackley, UK', 'Mercedes', 995, 349),
(3, 'Red Bull Racing', 'Milton Keynes, UK', 'Honda RBPT', 1010, 355),
(4, 'McLaren', 'Woking, UK', 'Mercedes', 1005, 350),
(5, 'Williams', 'Grove, UK', 'Mercedes', 995, 345);

-- 2. DRIVERS (2025 Lineup)
-- Mapping drivers to their respective team_id from the section above
INSERT INTO Drivers (driver_id, first_name, last_name, driver_number, nationality, team_id, height_cm, weight_kg, fastest_lap_time, career_podiums) VALUES 
(1, 'Lewis', 'Hamilton', 44, 'British', 1, 174, 73, '1:16.627', 104),
(2, 'Charles', 'Leclerc', 16, 'Monegasque', 1, 180, 69, '1:17.221', 32),
(3, 'Max', 'Verstappen', 1, 'Dutch', 3, 181, 72, '1:16.732', 101),
(4, 'Sergio', 'Perez', 11, 'Mexican', 3, 173, 64, '1:18.112', 35),
(5, 'Lando', 'Norris', 4, 'British', 4, 170, 68, '1:17.844', 16),
(6, 'Oscar', 'Piastri', 81, 'Australian', 4, 178, 68, '1:18.002', 9),
(7, 'George', 'Russell', 63, 'British', 2, 185, 70, '1:17.554', 14),
(8, 'Kimi', 'Antonelli', 12, 'Italian', 2, 176, 65, '1:19.432', 0),
(9, 'Carlos', 'Sainz', 55, 'Spanish', 5, 178, 66, '1:17.901', 25),
(10, 'Alexander', 'Albon', 23, 'Thai', 5, 186, 73, '1:18.442', 2);

-- 3. CALENDAR (Tracks)
INSERT INTO Grand_Prix (circuit_name, country, race_date) VALUES 
('Albert Park Circuit', 'Australia', '2025-03-16'),
('Shanghai International Circuit', 'China', '2025-03-23'),
('Suzuka International Racing Course', 'Japan', '2025-04-06'),
('Autodromo Nazionale Monza', 'Italy', '2025-09-07');

-- 4. RACE TELEMETRY (Performance Logs)
-- Data seeding for telemetry visualizations and position ranking logic
INSERT INTO Race_Stats (driver_id, track_name, lap_time_seconds, lap_number, position) VALUES 
-- MONZA (Laps 1-5)
(3, 'Monza', 80.558, 1, 1), (3, 'Monza', 80.122, 2, 1), (3, 'Monza', 79.912, 3, 1), (3, 'Monza', 80.201, 4, 1), (3, 'Monza', 80.050, 5, 1),
(2, 'Monza', 80.821, 1, 2), (2, 'Monza', 80.415, 2, 2), (2, 'Monza', 80.221, 3, 2), (2, 'Monza', 80.610, 4, 2), (2, 'Monza', 80.334, 5, 2),
-- BAHRAIN (Laps 1-5)
(3, 'Bahrain', 90.558, 1, 1), (3, 'Bahrain', 89.912, 2, 1), (3, 'Bahrain', 89.701, 3, 1), (3, 'Bahrain', 90.111, 4, 1), (3, 'Bahrain', 89.850, 5, 1),
(2, 'Bahrain', 91.221, 1, 2), (2, 'Bahrain', 90.540, 2, 2), (2, 'Bahrain', 90.120, 3, 2), (2, 'Bahrain', 90.880, 4, 2), (2, 'Bahrain', 90.410, 5, 2),
-- SILVERSTONE (Laps 1-5)
(3, 'Silverstone', 87.558, 1, 1), (3, 'Silverstone', 87.122, 2, 1), (3, 'Silverstone', 86.912, 3, 1), (3, 'Silverstone', 87.201, 4, 1), (3, 'Silverstone', 87.050, 5, 1);