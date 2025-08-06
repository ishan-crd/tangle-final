-- Populate States and Societies for Tangle App
-- Run this in your Supabase SQL Editor

-- First, ensure we have India as a country
INSERT INTO countries (id, name, code) 
VALUES ('1', 'India', 'IN')
ON CONFLICT (id) DO NOTHING;

-- Insert states for India
INSERT INTO states (id, country_id, name, code) VALUES
('1', '1', 'Delhi', 'DL'),
('2', '1', 'Maharashtra', 'MH'),
('3', '1', 'Karnataka', 'KA'),
('4', '1', 'Uttar Pradesh', 'UP'),
('5', '1', 'Haryana', 'HR'),
('6', '1', 'Telangana', 'TS'),
('7', '1', 'Tamil Nadu', 'TN'),
('8', '1', 'West Bengal', 'WB'),
('9', '1', 'Gujarat', 'GJ'),
('10', '1', 'Punjab', 'PB')
ON CONFLICT (id) DO NOTHING;

-- Insert societies for each state
-- Delhi societies
INSERT INTO societies (id, state_id, name, address) VALUES
('1', '1', 'New Greens', 'Delhi'),
('2', '1', 'Plak Rounds', 'Delhi'),
('3', '1', 'Vasant Vihar', 'Delhi'),
('4', '1', 'Greater Kailash', 'Delhi'),
('5', '1', 'Saket', 'Delhi');

-- Maharashtra societies
INSERT INTO societies (id, state_id, name, address) VALUES
('6', '2', 'Bandra West', 'Mumbai'),
('7', '2', 'Juhu', 'Mumbai'),
('8', '2', 'Powai', 'Mumbai'),
('9', '2', 'Koregaon Park', 'Pune'),
('10', '2', 'Baner', 'Pune'),
('11', '2', 'Kharadi', 'Pune');

-- Karnataka societies
INSERT INTO societies (id, state_id, name, address) VALUES
('12', '3', 'Koramangala', 'Bangalore'),
('13', '3', 'Indiranagar', 'Bangalore'),
('14', '3', 'Whitefield', 'Bangalore');

-- Uttar Pradesh societies
INSERT INTO societies (id, state_id, name, address) VALUES
('15', '4', 'Eldeco Utopia', 'Noida'),
('16', '4', 'Ajnara', 'Ghaziabad'),
('17', '4', 'Shipra Neo', 'Ghaziabad'),
('18', '4', 'ATS Indira', 'Ghaziabad'),
('19', '4', 'Palm Greens', 'Noida'),
('20', '4', 'Supertech Ecovillage', 'Noida'),
('21', '4', 'Jaypee Greens', 'Noida');

-- Haryana societies
INSERT INTO societies (id, state_id, name, address) VALUES
('22', '5', 'DLF Phase 1', 'Gurgaon'),
('23', '5', 'Suncity Township', 'Gurgaon'),
('24', '5', 'Palm Springs', 'Gurgaon');

-- Telangana societies
INSERT INTO societies (id, state_id, name, address) VALUES
('25', '6', 'Banjara Hills', 'Hyderabad'),
('26', '6', 'Jubilee Hills', 'Hyderabad'),
('27', '6', 'Gachibowli', 'Hyderabad');

-- Tamil Nadu societies
INSERT INTO societies (id, state_id, name, address) VALUES
('28', '7', 'T Nagar', 'Chennai'),
('29', '7', 'Adyar', 'Chennai'),
('30', '7', 'Anna Nagar', 'Chennai');

-- West Bengal societies
INSERT INTO societies (id, state_id, name, address) VALUES
('31', '8', 'Park Street', 'Kolkata'),
('32', '8', 'Salt Lake', 'Kolkata'),
('33', '8', 'New Town', 'Kolkata');

-- Gujarat societies
INSERT INTO societies (id, state_id, name, address) VALUES
('34', '9', 'Satellite', 'Ahmedabad'),
('35', '9', 'Vastrapur', 'Ahmedabad'),
('36', '9', 'Navrangpura', 'Ahmedabad');

-- Punjab societies
INSERT INTO societies (id, state_id, name, address) VALUES
('37', '10', 'Sector 7', 'Chandigarh'),
('38', '10', 'Sector 10', 'Chandigarh'),
('39', '10', 'Sector 15', 'Chandigarh');

-- Verify the data
SELECT 'Countries:' as info;
SELECT * FROM countries;

SELECT 'States:' as info;
SELECT s.*, c.name as country_name 
FROM states s 
JOIN countries c ON s.country_id = c.id 
ORDER BY s.name;

SELECT 'Societies:' as info;
SELECT so.*, s.name as state_name, c.name as country_name
FROM societies so
JOIN states s ON so.state_id = s.id
JOIN countries c ON s.country_id = c.id
ORDER BY s.name, so.name;

-- Test query to get societies by state
SELECT 'Societies in Delhi:' as test_query;
SELECT so.name as society_name, s.name as state_name
FROM societies so
JOIN states s ON so.state_id = s.id
WHERE s.name = 'Delhi'
ORDER BY so.name;

SELECT 'Societies in Uttar Pradesh:' as test_query;
SELECT so.name as society_name, s.name as state_name
FROM societies so
JOIN states s ON so.state_id = s.id
WHERE s.name = 'Uttar Pradesh'
ORDER BY so.name; 