CREATE DATABASE
-- Create Drivers Table

CREATE TABLE Drivers (
    driver_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    driver_number INT,
    nationality VARCHAR(50)
);

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

-- Create Watchlist Table (M:N for Users and Drivers)
CREATE TABLE Watchlist (
    watchlist_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    driver_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (driver_id) REFERENCES Drivers(driver_id)
);

