-- 1. Insert Constructors (2025 Grid)
INSERT INTO Constructors (team_name, base_location, engine_supplier) VALUES 
('Ferrari', 'Maranello, Italy', 'Ferrari'),
('Mercedes', 'Brackley, UK', 'Mercedes'),
('Red Bull Racing', 'Milton Keynes, UK', 'Honda RBPT'),
('McLaren', 'Woking, UK', 'Mercedes'),
('Williams', 'Grove, UK', 'Mercedes');

-- 2. Insert Drivers (The 2025 Lineup)
INSERT INTO Drivers (first_name, last_name, driver_number, nationality) VALUES 
-- Ferrari's New Superteam
('Lewis', 'Hamilton', 44, 'British'), 
('Charles', 'Leclerc', 16, 'Monegasque'),
-- Red Bull
('Max', 'Verstappen', 1, 'Dutch'),
('Sergio', 'Perez', 11, 'Mexican'),
-- McLaren
('Lando', 'Norris', 4, 'British'),
('Oscar', 'Piastri', 81, 'Australian'),
-- Mercedes (Post-Hamilton Era)
('George', 'Russell', 63, 'British'),
('Kimi', 'Antonelli', 12, 'Italian'),
-- Williams (Sainz's New Home)
('Carlos', 'Sainz', 55, 'Spanish'),
('Alex', 'Albon', 23, 'Thai');

-- 3. Insert Initial 2025 Calendar
INSERT INTO Grand_Prix (circuit_name, country, race_date) VALUES 
('Albert Park Circuit', 'Australia', '2025-03-16'),
('Shanghai International Circuit', 'China', '2025-03-23'),
('Suzuka International Racing Course', 'Japan', '2025-04-06');