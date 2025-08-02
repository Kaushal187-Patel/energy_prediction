-- Energy Smart Forecaster AI Database Schema
-- Database for storing energy consumption data and predictions

-- Create database
CREATE DATABASE IF NOT EXISTS energy_forecaster_db;
USE energy_forecaster_db;

-- 1. Homes table - Store home information
CREATE TABLE homes (
    home_id INT PRIMARY KEY,
    household_size INT NOT NULL,
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Appliances table - Store appliance types and their characteristics
CREATE TABLE appliances (
    appliance_id INT AUTO_INCREMENT PRIMARY KEY,
    appliance_type VARCHAR(50) NOT NULL UNIQUE,
    avg_power_consumption DECIMAL(5,2), -- kWh per hour
    efficiency_rating VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Weather data table - Store weather information
CREATE TABLE weather_data (
    weather_id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    outdoor_temperature DECIMAL(4,1) NOT NULL, -- Celsius
    humidity DECIMAL(5,2), -- Percentage
    wind_speed DECIMAL(5,2), -- m/s
    solar_radiation DECIMAL(8,2), -- W/m²
    season ENUM('Winter', 'Spring', 'Summer', 'Fall') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_date (date)
);

-- 4. Energy consumption records - Main data table
CREATE TABLE energy_consumption (
    consumption_id INT AUTO_INCREMENT PRIMARY KEY,
    home_id INT NOT NULL,
    appliance_type VARCHAR(50) NOT NULL,
    energy_consumption DECIMAL(6,2) NOT NULL, -- kWh
    consumption_time TIME NOT NULL,
    consumption_date DATE NOT NULL,
    outdoor_temperature DECIMAL(4,1) NOT NULL,
    season ENUM('Winter', 'Spring', 'Summer', 'Fall') NOT NULL,
    household_size INT NOT NULL,
    is_weekend BOOLEAN DEFAULT FALSE,
    hour_of_day INT GENERATED ALWAYS AS (HOUR(consumption_time)) STORED,
    day_of_week INT GENERATED ALWAYS AS (DAYOFWEEK(consumption_date)) STORED,
    month_of_year INT GENERATED ALWAYS AS (MONTH(consumption_date)) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (home_id) REFERENCES homes(home_id),
    INDEX idx_date (consumption_date),
    INDEX idx_appliance (appliance_type),
    INDEX idx_season (season),
    INDEX idx_temperature (outdoor_temperature),
    INDEX idx_hour (hour_of_day)
);

-- 5. ML Model predictions table
CREATE TABLE energy_predictions (
    prediction_id INT AUTO_INCREMENT PRIMARY KEY,
    home_id INT NOT NULL,
    prediction_date DATE NOT NULL,
    prediction_time TIME NOT NULL,
    appliance_type VARCHAR(50),
    predicted_consumption DECIMAL(6,2) NOT NULL,
    actual_consumption DECIMAL(6,2),
    model_used VARCHAR(50) NOT NULL, -- 'linear_regression', 'knn', 'random_forest'
    model_accuracy DECIMAL(5,4), -- R² score
    prediction_confidence DECIMAL(5,4),
    outdoor_temperature DECIMAL(4,1),
    season ENUM('Winter', 'Spring', 'Summer', 'Fall'),
    household_size INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (home_id) REFERENCES homes(home_id),
    INDEX idx_prediction_date (prediction_date),
    INDEX idx_model (model_used)
);

-- 6. Model performance tracking
CREATE TABLE model_performance (
    performance_id INT AUTO_INCREMENT PRIMARY KEY,
    model_name VARCHAR(50) NOT NULL,
    training_date DATE NOT NULL,
    rmse_score DECIMAL(8,4),
    r2_score DECIMAL(6,4),
    mae_score DECIMAL(8,4),
    training_samples INT,
    test_samples INT,
    feature_count INT,
    model_version VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. User sessions and API usage
CREATE TABLE user_sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    session_token VARCHAR(255) UNIQUE,
    user_ip VARCHAR(45),
    predictions_made INT DEFAULT 0,
    session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 8. Energy efficiency insights
CREATE TABLE efficiency_insights (
    insight_id INT AUTO_INCREMENT PRIMARY KEY,
    home_id INT NOT NULL,
    analysis_date DATE NOT NULL,
    total_daily_consumption DECIMAL(8,2),
    peak_hour INT,
    peak_consumption DECIMAL(6,2),
    efficiency_score DECIMAL(4,2), -- 0-100 scale
    recommendations TEXT,
    potential_savings DECIMAL(6,2), -- kWh
    cost_savings DECIMAL(8,2), -- Currency
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (home_id) REFERENCES homes(home_id),
    INDEX idx_analysis_date (analysis_date),
    INDEX idx_efficiency_score (efficiency_score)
);

-- Insert sample appliance data
INSERT INTO appliances (appliance_type, avg_power_consumption, efficiency_rating) VALUES
('Air Conditioning', 3.50, 'A'),
('Heater', 3.20, 'B'),
('Fridge', 0.25, 'A+'),
('Washing Machine', 1.20, 'A'),
('Dishwasher', 1.10, 'A'),
('Oven', 1.20, 'B'),
('Microwave', 1.00, 'A'),
('TV', 1.20, 'A'),
('Computer', 1.00, 'A'),
('Lights', 1.00, 'A+');

-- Create views for common queries

-- Daily consumption summary
CREATE VIEW daily_consumption_summary AS
SELECT 
    consumption_date,
    COUNT(*) as total_records,
    SUM(energy_consumption) as total_consumption,
    AVG(energy_consumption) as avg_consumption,
    MIN(energy_consumption) as min_consumption,
    MAX(energy_consumption) as max_consumption,
    AVG(outdoor_temperature) as avg_temperature,
    season
FROM energy_consumption
GROUP BY consumption_date, season;

-- Appliance efficiency view
CREATE VIEW appliance_efficiency AS
SELECT 
    appliance_type,
    COUNT(*) as usage_count,
    AVG(energy_consumption) as avg_consumption,
    MIN(energy_consumption) as min_consumption,
    MAX(energy_consumption) as max_consumption,
    STDDEV(energy_consumption) as consumption_stddev
FROM energy_consumption
GROUP BY appliance_type;

-- Hourly consumption patterns
CREATE VIEW hourly_patterns AS
SELECT 
    hour_of_day,
    COUNT(*) as usage_count,
    AVG(energy_consumption) as avg_consumption,
    appliance_type,
    season
FROM energy_consumption
GROUP BY hour_of_day, appliance_type, season;

-- Seasonal consumption trends
CREATE VIEW seasonal_trends AS
SELECT 
    season,
    appliance_type,
    COUNT(*) as usage_count,
    AVG(energy_consumption) as avg_consumption,
    AVG(outdoor_temperature) as avg_temperature,
    AVG(household_size) as avg_household_size
FROM energy_consumption
GROUP BY season, appliance_type;

-- Model accuracy comparison
CREATE VIEW model_comparison AS
SELECT 
    model_name,
    AVG(r2_score) as avg_r2_score,
    AVG(rmse_score) as avg_rmse_score,
    COUNT(*) as training_sessions,
    MAX(training_date) as latest_training
FROM model_performance
GROUP BY model_name
ORDER BY avg_r2_score DESC;

-- Create stored procedures for common operations

DELIMITER //

-- Procedure to insert energy consumption data
CREATE PROCEDURE InsertEnergyConsumption(
    IN p_home_id INT,
    IN p_appliance_type VARCHAR(50),
    IN p_energy_consumption DECIMAL(6,2),
    IN p_consumption_time TIME,
    IN p_consumption_date DATE,
    IN p_outdoor_temperature DECIMAL(4,1),
    IN p_season VARCHAR(10),
    IN p_household_size INT
)
BEGIN
    DECLARE is_weekend_val BOOLEAN DEFAULT FALSE;
    
    -- Check if it's weekend
    IF DAYOFWEEK(p_consumption_date) IN (1, 7) THEN
        SET is_weekend_val = TRUE;
    END IF;
    
    INSERT INTO energy_consumption (
        home_id, appliance_type, energy_consumption, consumption_time,
        consumption_date, outdoor_temperature, season, household_size, is_weekend
    ) VALUES (
        p_home_id, p_appliance_type, p_energy_consumption, p_consumption_time,
        p_consumption_date, p_outdoor_temperature, p_season, p_household_size, is_weekend_val
    );
END //

-- Procedure to get consumption predictions
CREATE PROCEDURE GetConsumptionPredictions(
    IN p_home_id INT,
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT 
        prediction_date,
        appliance_type,
        predicted_consumption,
        actual_consumption,
        model_used,
        model_accuracy,
        ABS(predicted_consumption - COALESCE(actual_consumption, 0)) as prediction_error
    FROM energy_predictions
    WHERE home_id = p_home_id
    AND prediction_date BETWEEN p_start_date AND p_end_date
    ORDER BY prediction_date DESC, predicted_consumption DESC;
END //

-- Procedure to calculate daily efficiency score
CREATE PROCEDURE CalculateEfficiencyScore(
    IN p_home_id INT,
    IN p_date DATE,
    OUT p_efficiency_score DECIMAL(4,2)
)
BEGIN
    DECLARE total_consumption DECIMAL(8,2);
    DECLARE expected_consumption DECIMAL(8,2);
    DECLARE household_size_val INT;
    
    -- Get household size
    SELECT household_size INTO household_size_val 
    FROM homes WHERE home_id = p_home_id;
    
    -- Calculate total consumption for the day
    SELECT COALESCE(SUM(energy_consumption), 0) INTO total_consumption
    FROM energy_consumption
    WHERE home_id = p_home_id AND consumption_date = p_date;
    
    -- Calculate expected consumption based on household size and appliances
    SET expected_consumption = household_size_val * 8.5; -- Average daily consumption per person
    
    -- Calculate efficiency score (lower consumption = higher score)
    IF total_consumption > 0 THEN
        SET p_efficiency_score = GREATEST(0, 100 - ((total_consumption - expected_consumption) / expected_consumption * 100));
    ELSE
        SET p_efficiency_score = 100;
    END IF;
    
    SET p_efficiency_score = LEAST(100, GREATEST(0, p_efficiency_score));
END //

DELIMITER ;

-- Create triggers for data validation and automation

DELIMITER //

-- Trigger to validate energy consumption values
CREATE TRIGGER validate_consumption_before_insert
BEFORE INSERT ON energy_consumption
FOR EACH ROW
BEGIN
    -- Validate consumption is positive
    IF NEW.energy_consumption < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Energy consumption cannot be negative';
    END IF;
    
    -- Validate temperature range
    IF NEW.outdoor_temperature < -50 OR NEW.outdoor_temperature > 60 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Temperature out of valid range (-50 to 60°C)';
    END IF;
    
    -- Validate household size
    IF NEW.household_size < 1 OR NEW.household_size > 20 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Household size must be between 1 and 20';
    END IF;
END //

-- Trigger to update model performance after prediction
CREATE TRIGGER update_model_performance_after_prediction
AFTER INSERT ON energy_predictions
FOR EACH ROW
BEGIN
    -- Update session prediction count if session exists
    UPDATE user_sessions 
    SET predictions_made = predictions_made + 1,
        last_activity = CURRENT_TIMESTAMP
    WHERE session_token IS NOT NULL
    LIMIT 1;
END //

DELIMITER ;

-- Create indexes for better performance
CREATE INDEX idx_consumption_composite ON energy_consumption(consumption_date, appliance_type, home_id);
CREATE INDEX idx_temperature_season ON energy_consumption(outdoor_temperature, season);
CREATE INDEX idx_household_consumption ON energy_consumption(household_size, energy_consumption);
CREATE INDEX idx_time_patterns ON energy_consumption(hour_of_day, day_of_week, is_weekend);

-- Sample data insertion (using the existing CSV structure)
-- This would typically be done via data import, but here's the structure:

/*
Example data insertion:
INSERT INTO homes (home_id, household_size, location) VALUES 
(1, 4, 'City Center'),
(2, 2, 'Suburbs'),
(3, 5, 'Rural Area');

-- Weather data would be inserted daily
INSERT INTO weather_data (date, outdoor_temperature, humidity, wind_speed, solar_radiation, season) VALUES
('2023-12-02', -1.0, 65.0, 12.5, 150.0, 'Fall');

-- Energy consumption data (from your CSV)
CALL InsertEnergyConsumption(94, 'Fridge', 0.2, '21:12:00', '2023-12-02', -1.0, 'Fall', 2);
*/

-- Grant permissions (adjust as needed for your environment)
-- GRANT SELECT, INSERT, UPDATE ON energy_forecaster_db.* TO 'app_user'@'localhost';
-- GRANT EXECUTE ON PROCEDURE energy_forecaster_db.InsertEnergyConsumption TO 'app_user'@'localhost';
-- GRANT EXECUTE ON PROCEDURE energy_forecaster_db.GetConsumptionPredictions TO 'app_user'@'localhost';

-- Show table structure
SHOW TABLES;