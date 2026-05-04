/**
 * F1 Tifosi Tracker - Database Schema & Seed Data
 * Version: 2.0
 * Includes: Core Registry, Telemetry, Watchlist, and Archival Audit tables.
 */

-- CREATE DATABASE f1_db;
USE f1_db;

-- 1. TABLE STRUCTURES 

-- Constructors Table: Stores team-level technical specs
CREATE TABLE Constructors (
    team_id INT PRIMARY KEY AUTO_INCREMENT,
    team_name VARCHAR(50) NOT NULL,
    base_location VARCHAR(100),
    engine_supplier VARCHAR(50),
    horsepower INT,
    top_speed_kph INT
);

-- Drivers Table: Master registry with physical and performance stats
CREATE TABLE Drivers (
    driver_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    driver_number INT,
    nationality VARCHAR(50),
    team_id INT,
    height_cm INT,
    weight_kg INT,
    fastest_lap_time VARCHAR(10),
    career_podiums INT DEFAULT 0,
    FOREIGN KEY (team_id) REFERENCES Constructors(team_id)
);

-- Users Table: Active accounts with temporal tracking for audit analysis
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    fav_team VARCHAR(50) DEFAULT 'Ferrari',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Watchlist Table: M:N relationship between Users and Drivers
CREATE TABLE Watchlist (
    watchlist_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    driver_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (driver_id) REFERENCES Drivers(driver_id)
);

-- Race_Stats Table: High-resolution telemetry for dynamic leaderboard logic
CREATE TABLE Race_Stats (
    stat_id INT AUTO_INCREMENT PRIMARY KEY,
    driver_id INT,
    track_name VARCHAR(50),
    lap_time_seconds DECIMAL(6, 3),
    lap_number INT DEFAULT 1,
    position INT, -- Pre-calculated for performance
    FOREIGN KEY (driver_id) REFERENCES Drivers(driver_id)
);

-- Deleted_Users Table: Archival audit trail for user lifecycles
CREATE TABLE Deleted_Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255),
    created_at TIMESTAMP NULL,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

