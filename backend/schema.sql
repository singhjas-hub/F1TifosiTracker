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


