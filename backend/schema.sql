use f1_db;

CREATE TABLE Drivers (
    driver_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    driver_number INT,
    nationality VARCHAR(50)
);

ALTER TABLE Drivers ADD COLUMN team_id INT;

-- 2. Link them to the Constructors (Assuming your seed_data IDs match)
-- Ferrari (Team ID 1)
UPDATE Drivers SET team_id = 1 WHERE last_name IN ('Hamilton', 'Leclerc');
-- Mercedes (Team ID 2)
UPDATE Drivers SET team_id = 2 WHERE last_name IN ('Russell', 'Antonelli');
-- Red Bull (Team ID 3)
UPDATE Drivers SET team_id = 3 WHERE last_name IN ('Verstappen', 'Perez');
-- McLaren (Team ID 4)
UPDATE Drivers SET team_id = 4 WHERE last_name IN ('Norris', 'Piastri');
-- Williams (Team ID 5)
UPDATE Drivers SET team_id = 5 WHERE last_name IN ('Sainz', 'Albon');

-- 3. Add Foreign Key Constraint for data integrity
ALTER TABLE Drivers ADD CONSTRAINT FK_DriverTeam 
FOREIGN KEY (team_id) REFERENCES Constructors(team_id);


-- Create Constructors Table
CREATE TABLE Constructors (
    team_id INT PRIMARY KEY AUTO_INCREMENT,
    team_name VARCHAR(50) NOT NULL,
    base_location VARCHAR(100),
    engine_supplier VARCHAR(50)
);

-- Create Grand Prix Table
CREATE TABLE Grand_Prix (
    gp_id INT PRIMARY KEY AUTO_INCREMENT,
    circuit_name VARCHAR(100) NOT NULL,
    country VARCHAR(50),
    race_date DATE
);

-- Create Results Table (The Many-to-Many Bridge)
CREATE TABLE Results (
    result_id INT PRIMARY KEY AUTO_INCREMENT,
    driver_id INT NOT NULL,
    team_id INT NOT NULL,
    gp_id INT NOT NULL,
    position INT,
    points DECIMAL(4,1),
    FOREIGN KEY (driver_id) REFERENCES Drivers(driver_id),
    FOREIGN KEY (team_id) REFERENCES Constructors(team_id),
    FOREIGN KEY (gp_id) REFERENCES Grand_Prix(gp_id)
);

-- Create Users Table
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

ALTER TABLE Users ADD COLUMN fav_team VARCHAR(50) DEFAULT 'Ferrari';

-- Create Watchlist Table (M:N for Users and Drivers)
CREATE TABLE Watchlist (
    watchlist_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    driver_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (driver_id) REFERENCES Drivers(driver_id)
);

-- 1. Add physical and performance stats to Drivers
ALTER TABLE Drivers 
ADD COLUMN height_cm INT,
ADD COLUMN weight_kg INT,
ADD COLUMN fastest_lap_time VARCHAR(10),
ADD COLUMN career_podiums INT DEFAULT 0;

-- 2. Add technical specs to Constructors
ALTER TABLE Constructors 
ADD COLUMN horsepower INT,
ADD COLUMN top_speed_kph INT;

-- 3. Populate some sample data for your 2025 stars
UPDATE Drivers SET height_cm = 174, weight_kg = 73, fastest_lap_time = '1:16.627' WHERE last_name = 'Hamilton';
UPDATE Drivers SET height_cm = 181, weight_kg = 72, fastest_lap_time = '1:16.732' WHERE last_name = 'Verstappen';
UPDATE Constructors SET horsepower = 1000, top_speed_kph = 350 WHERE team_name = 'Ferrari';

-- 4. Populate the rest of the team with the new DriverCard information
-- Update Ferrari
UPDATE Drivers SET team_id = 1, height_cm = 174, weight_kg = 73, fastest_lap_time = '1:16.627', career_podiums = 104 WHERE last_name = 'Hamilton';
UPDATE Drivers SET team_id = 1, height_cm = 180, weight_kg = 69, fastest_lap_time = '1:17.221', career_podiums = 30 WHERE last_name = 'Leclerc';

-- Update Red Bull
UPDATE Drivers SET team_id = 3, height_cm = 181, weight_kg = 72, fastest_lap_time = '1:16.732', career_podiums = 100 WHERE last_name = 'Verstappen';
UPDATE Drivers SET team_id = 3, height_cm = 173, weight_kg = 64, fastest_lap_time = '1:18.112', career_podiums = 35 WHERE last_name = 'Perez';

-- Update McLaren
UPDATE Drivers SET team_id = 4, height_cm = 170, weight_kg = 68, fastest_lap_time = '1:17.844', career_podiums = 15 WHERE last_name = 'Norris';
UPDATE Drivers SET team_id = 4, height_cm = 178, weight_kg = 68, fastest_lap_time = '1:18.002', career_podiums = 3 WHERE last_name = 'Piastri';

-- Update Mercedes
UPDATE Drivers SET team_id = 2, height_cm = 185, weight_kg = 70, fastest_lap_time = '1:17.554', career_podiums = 11 WHERE last_name = 'Russell';
UPDATE Drivers SET team_id = 2, height_cm = 176, weight_kg = 65, fastest_lap_time = '1:19.432', career_podiums = 0 WHERE last_name = 'Antonelli';

-- Update Williams
UPDATE Drivers SET team_id = 5, height_cm = 178, weight_kg = 66, fastest_lap_time = '1:17.901', career_podiums = 25 WHERE last_name = 'Sainz';
UPDATE Drivers SET team_id = 5, height_cm = 186, weight_kg = 73, fastest_lap_time = '1:18.442', career_podiums = 0 WHERE last_name = 'Albon';

-- Ensure Constructor technical specs are set
UPDATE Constructors SET horsepower = 1000, top_speed_kph = 352 WHERE team_id = 1; -- Ferrari
UPDATE Constructors SET horsepower = 995, top_speed_kph = 349 WHERE team_id = 2; -- Mercedes
UPDATE Constructors SET horsepower = 1010, top_speed_kph = 355 WHERE team_id = 3; -- Red Bull
UPDATE Constructors SET horsepower = 1005, top_speed_kph = 350 WHERE team_id = 4; -- McLaren
UPDATE Constructors SET horsepower = 995, top_speed_kph = 345 WHERE team_id = 5; -- Williams

-- 5 Data synchronization issue fix

-- 1. Ensure the Drivers have the correct Team IDs
UPDATE Drivers SET team_id = 1 WHERE last_name IN ('Hamilton', 'Leclerc');   -- Ferrari
UPDATE Drivers SET team_id = 2 WHERE last_name IN ('Russell', 'Antonelli'); -- Mercedes
UPDATE Drivers SET team_id = 3 WHERE last_name IN ('Verstappen', 'Perez');  -- Red Bull
UPDATE Drivers SET team_id = 4 WHERE last_name IN ('Norris', 'Piastri');    -- McLaren
UPDATE Drivers SET team_id = 5 WHERE last_name IN ('Sainz', 'Albon');       -- Williams

-- 2. Fill in ALL missing Physical/Performance Stats
UPDATE Drivers SET height_cm = 174, weight_kg = 73, fastest_lap_time = '1:16.627', career_podiums = 104, nationality = 'United Kingdom' WHERE last_name = 'Hamilton';
UPDATE Drivers SET height_cm = 180, weight_kg = 69, fastest_lap_time = '1:17.221', career_podiums = 32, nationality = 'Monaco' WHERE last_name = 'Leclerc';
UPDATE Drivers SET height_cm = 181, weight_kg = 72, fastest_lap_time = '1:16.732', career_podiums = 101, nationality = 'Netherlands' WHERE last_name = 'Verstappen';
UPDATE Drivers SET height_cm = 173, weight_kg = 64, fastest_lap_time = '1:18.112', career_podiums = 35, nationality = 'Mexico' WHERE last_name = 'Perez';
UPDATE Drivers SET height_cm = 170, weight_kg = 68, fastest_lap_time = '1:17.844', career_podiums = 16, nationality = 'United Kingdom' WHERE last_name = 'Norris';
UPDATE Drivers SET height_cm = 178, weight_kg = 68, fastest_lap_time = '1:18.002', career_podiums = 9, nationality = 'Australia' WHERE last_name = 'Piastri';
UPDATE Drivers SET height_cm = 185, weight_kg = 70, fastest_lap_time = '1:17.554', career_podiums = 14, nationality = 'United Kingdom' WHERE last_name = 'Russell';
UPDATE Drivers SET height_cm = 176, weight_kg = 65, fastest_lap_time = '1:19.432', career_podiums = 0, nationality = 'Italy' WHERE last_name = 'Antonelli';
UPDATE Drivers SET height_cm = 178, weight_kg = 66, fastest_lap_time = '1:17.901', career_podiums = 25, nationality = 'Spain' WHERE last_name = 'Sainz';
UPDATE Drivers SET height_cm = 186, weight_kg = 73, fastest_lap_time = '1:18.442', career_podiums = 2, nationality = 'Thailand' WHERE last_name = 'Albon';

-- 3. Ensure Constructors have the Engine Data
UPDATE Constructors SET engine_supplier = 'Ferrari', horsepower = 1000, top_speed_kph = 352 WHERE team_id = 1;
UPDATE Constructors SET engine_supplier = 'Mercedes', horsepower = 995, top_speed_kph = 349 WHERE team_id = 2;
UPDATE Constructors SET engine_supplier = 'Honda RBPT', horsepower = 1010, top_speed_kph = 355 WHERE team_id = 3;
UPDATE Constructors SET engine_supplier = 'Mercedes', horsepower = 1005, top_speed_kph = 350 WHERE team_id = 4;
UPDATE Constructors SET engine_supplier = 'Mercedes', horsepower = 995, top_speed_kph = 345 WHERE team_id = 5;

-- Creating a Race Stats table to store the information for each player
-- 1. Create a table for Race Times
CREATE TABLE Race_Stats (
    stat_id INT AUTO_INCREMENT PRIMARY KEY,
    driver_id INT,
    track_name VARCHAR(50),
    lap_time_seconds DECIMAL(6, 3), -- Store as 80.123 for easier math
    FOREIGN KEY (driver_id) REFERENCES Drivers(driver_id)
);

-- 2. Seed some 2025 Bahrain Data (Sample Times)
INSERT INTO Race_Stats (driver_id, track_name, lap_time_seconds) VALUES 
(1, 'Bahrain', 91.447), -- Hamilton
(2, 'Bahrain', 91.821), -- Leclerc
(3, 'Bahrain', 90.558), -- Verstappen (Leader)
(4, 'Bahrain', 92.112), -- Perez
(5, 'Bahrain', 91.223); -- Norris

-- 1. Add Lap Number to the Stats table
ALTER TABLE Race_Stats ADD COLUMN lap_number INT DEFAULT 1;

-- 2. Add some diverse lap data for Monza (Italian GP)
INSERT INTO Race_Stats (driver_id, track_name, lap_time_seconds, lap_number) VALUES 
(1, 'Monza', 81.447, 12), -- Hamilton
(2, 'Monza', 80.821, 12), -- Leclerc (Leader)
(3, 'Monza', 81.112, 12), -- Verstappen
(7, 'Monza', 81.902, 12), -- Russell
(9, 'Monza', 82.331, 12); -- Sainz

DELETE FROM Race_Stats;

INSERT INTO Race_Stats (driver_id, track_name, lap_time_seconds, lap_number) VALUES 
(3, 'Monza', 80.558, 1), (3, 'Monza', 80.122, 2), (3, 'Monza', 79.912, 3), (3, 'Monza', 80.201, 4), (3, 'Monza', 80.050, 5),
(2, 'Monza', 80.821, 1), (2, 'Monza', 80.415, 2), (2, 'Monza', 80.221, 3), (2, 'Monza', 80.610, 4), (2, 'Monza', 80.334, 5),
(1, 'Monza', 81.447, 1), (1, 'Monza', 80.932, 2), (1, 'Monza', 80.701, 3), (1, 'Monza', 81.120, 4), (1, 'Monza', 80.510, 5),
(5, 'Monza', 81.223, 1), (5, 'Monza', 80.901, 2), (5, 'Monza', 80.844, 3), (5, 'Monza', 81.002, 4), (5, 'Monza', 80.899, 5),
(7, 'Monza', 81.554, 1), (7, 'Monza', 81.220, 2), (7, 'Monza', 80.992, 3), (7, 'Monza', 81.411, 4), (7, 'Monza', 81.012, 5),
(6, 'Monza', 81.802, 1), (6, 'Monza', 81.442, 2), (6, 'Monza', 81.201, 3), (6, 'Monza', 81.670, 4), (6, 'Monza', 81.332, 5),
(4, 'Monza', 82.112, 1), (4, 'Monza', 81.901, 2), (4, 'Monza', 81.776, 3), (4, 'Monza', 82.003, 4), (4, 'Monza', 81.882, 5),
(9, 'Monza', 82.331, 1), (9, 'Monza', 81.990, 2), (9, 'Monza', 82.102, 3), (9, 'Monza', 82.441, 4), (9, 'Monza', 82.050, 5),
(10, 'Monza', 82.442, 1), (10, 'Monza', 82.101, 2), (10, 'Monza', 82.332, 3), (10, 'Monza', 82.665, 4), (10, 'Monza', 82.201, 5),
(8, 'Monza', 83.432, 1), (8, 'Monza', 82.901, 2), (8, 'Monza', 82.774, 3), (8, 'Monza', 83.112, 4), (8, 'Monza', 82.885, 5);

-- BAHRAIN (Sakhir GP) - Technical, Mid-Range Times
INSERT INTO Race_Stats (driver_id, track_name, lap_time_seconds, lap_number) VALUES 
(3, 'Bahrain', 90.558, 1), (3, 'Bahrain', 89.912, 2), (3, 'Bahrain', 89.701, 3), (3, 'Bahrain', 90.111, 4), (3, 'Bahrain', 89.850, 5),
(2, 'Bahrain', 91.221, 1), (2, 'Bahrain', 90.540, 2), (2, 'Bahrain', 90.120, 3), (2, 'Bahrain', 90.880, 4), (2, 'Bahrain', 90.410, 5),
(1, 'Bahrain', 91.500, 1), (1, 'Bahrain', 91.100, 2), (1, 'Bahrain', 90.750, 3), (1, 'Bahrain', 91.200, 4), (1, 'Bahrain', 90.900, 5),
(5, 'Bahrain', 91.800, 1), (5, 'Bahrain', 91.400, 2), (5, 'Bahrain', 91.250, 3), (5, 'Bahrain', 91.600, 4), (5, 'Bahrain', 91.450, 5),
(7, 'Bahrain', 92.100, 1), (7, 'Bahrain', 91.800, 2), (7, 'Bahrain', 91.600, 3), (7, 'Bahrain', 92.000, 4), (7, 'Bahrain', 91.850, 5),
(6, 'Bahrain', 92.400, 1), (6, 'Bahrain', 92.100, 2), (6, 'Bahrain', 91.900, 3), (6, 'Bahrain', 92.300, 4), (6, 'Bahrain', 92.150, 5),
(4, 'Bahrain', 92.700, 1), (4, 'Bahrain', 92.400, 2), (4, 'Bahrain', 92.200, 3), (4, 'Bahrain', 92.600, 4), (4, 'Bahrain', 92.450, 5),
(9, 'Bahrain', 93.000, 1), (9, 'Bahrain', 92.700, 2), (9, 'Bahrain', 92.500, 3), (9, 'Bahrain', 92.900, 4), (9, 'Bahrain', 92.750, 5),
(10, 'Bahrain', 93.300, 1), (10, 'Bahrain', 93.000, 2), (10, 'Bahrain', 92.800, 3), (10, 'Bahrain', 93.200, 4), (10, 'Bahrain', 93.050, 5),
(8, 'Bahrain', 94.000, 1), (8, 'Bahrain', 93.500, 2), (8, 'Bahrain', 93.300, 3), (8, 'Bahrain', 93.800, 4), (8, 'Bahrain', 93.600, 5);

-- SILVERSTONE (British GP) - High Aerodynamic, Longer Times
INSERT INTO Race_Stats (driver_id, track_name, lap_time_seconds, lap_number) VALUES 
(3, 'Silverstone', 87.558, 1), (3, 'Silverstone', 87.122, 2), (3, 'Silverstone', 86.912, 3), (3, 'Silverstone', 87.201, 4), (3, 'Silverstone', 87.050, 5),
(2, 'Silverstone', 88.021, 1), (2, 'Silverstone', 87.615, 2), (2, 'Silverstone', 87.421, 3), (2, 'Silverstone', 87.910, 4), (2, 'Silverstone', 87.734, 5),
(1, 'Silverstone', 88.547, 1), (1, 'Silverstone', 88.132, 2), (1, 'Silverstone', 87.901, 3), (1, 'Silverstone', 88.320, 4), (1, 'Silverstone', 88.010, 5),
(5, 'Silverstone', 88.823, 1), (5, 'Silverstone', 88.401, 2), (5, 'Silverstone', 88.244, 3), (5, 'Silverstone', 88.602, 4), (5, 'Silverstone', 88.499, 5),
(7, 'Silverstone', 89.154, 1), (7, 'Silverstone', 88.820, 2), (7, 'Silverstone', 88.592, 3), (7, 'Silverstone', 89.011, 4), (7, 'Silverstone', 88.712, 5),
(6, 'Silverstone', 89.402, 1), (6, 'Silverstone', 89.042, 2), (6, 'Silverstone', 88.801, 3), (6, 'Silverstone', 89.270, 4), (6, 'Silverstone', 88.932, 5),
(4, 'Silverstone', 89.712, 1), (4, 'Silverstone', 89.401, 2), (4, 'Silverstone', 89.276, 3), (4, 'Silverstone', 89.603, 4), (4, 'Silverstone', 89.382, 5),
(9, 'Silverstone', 90.031, 1), (9, 'Silverstone', 89.690, 2), (9, 'Silverstone', 89.502, 3), (9, 'Silverstone', 89.941, 4), (9, 'Silverstone', 89.750, 5),
(10, 'Silverstone', 90.342, 1), (10, 'Silverstone', 89.901, 2), (10, 'Silverstone', 89.732, 3), (10, 'Silverstone', 90.165, 4), (10, 'Silverstone', 89.801, 5),
(8, 'Silverstone', 91.032, 1), (8, 'Silverstone', 90.601, 2), (8, 'Silverstone', 90.374, 3), (8, 'Silverstone', 90.812, 4), (8, 'Silverstone', 90.585, 5);

-- Run this in your MySQL workbench to create the archive table
CREATE TABLE IF NOT EXISTS Deleted_Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255),
    created_at TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM Deleted_Users;

SELECT * FROM Users;

-- Add a 'created_at' column to your active users (auto-fills when they sign up)
ALTER TABLE Users 
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

TRUNCATE TABLE Deleted_Users;