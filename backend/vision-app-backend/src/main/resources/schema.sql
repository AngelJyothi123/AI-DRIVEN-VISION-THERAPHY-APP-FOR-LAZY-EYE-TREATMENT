-- Vision Therapy App Database Schema
-- MySQL Database

-- Create database (uncomment if needed)
-- CREATE DATABASE IF NOT EXISTS vision_app_db;
-- USE vision_app_db;

-- Doctors table
CREATE TABLE IF NOT EXISTS doctor (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    qualification VARCHAR(255),
    hospital VARCHAR(255),
    role ENUM('DOCTOR', 'PATIENT') DEFAULT 'DOCTOR',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Patients table
CREATE TABLE IF NOT EXISTS patient (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    age INT,
    password VARCHAR(255) NOT NULL,
    doctor_id BIGINT,
    role ENUM('DOCTOR', 'PATIENT') DEFAULT 'PATIENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctor(id)
);

-- Exercises table
CREATE TABLE IF NOT EXISTS exercise (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('camera', 'non-camera') NOT NULL,
    duration INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Exercise sessions table
CREATE TABLE IF NOT EXISTS exercise_session (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    exercise_id BIGINT NOT NULL,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    FOREIGN KEY (patient_id) REFERENCES patient(id),
    FOREIGN KEY (exercise_id) REFERENCES exercise(id)
);

-- Exercise results table
CREATE TABLE IF NOT EXISTS exercise_result (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT NOT NULL,
    accuracy DECIMAL(5,2),
    focus_duration INT,
    movement_score DECIMAL(5,2),
    improvement_score DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES exercise_session(id)
);

-- Recommendations table
CREATE TABLE IF NOT EXISTS recommendation (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    doctor_id BIGINT NOT NULL,
    patient_id BIGINT NOT NULL,
    exercise_id BIGINT NOT NULL,
    duration INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctor(id),
    FOREIGN KEY (patient_id) REFERENCES patient(id),
    FOREIGN KEY (exercise_id) REFERENCES exercise(id)
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    appointment_time TIMESTAMP NOT NULL,
    status ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED') DEFAULT 'SCHEDULED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patient(id),
    FOREIGN KEY (doctor_id) REFERENCES doctor(id)
);

-- Sample Data Insertion

-- Insert sample doctors (passwords are BCrypt hashed for "password123")
INSERT INTO doctor (name, email, phone, password, qualification, hospital) VALUES 
('Dr. John Smith', 'john.smith@hospital.com', '1234567890', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'MD - Ophthalmologist', 'City General Hospital'),
('Dr. Sarah Johnson', 'sarah.johnson@visioncare.com', '9876543210', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'MD - Pediatric Ophthalmologist', 'Childrens Vision Clinic')
ON DUPLICATE KEY UPDATE email=email;

-- Insert sample patients (passwords are BCrypt hashed for "password123")
INSERT INTO patient (name, email, phone, age, password, doctor_id) VALUES 
('Alice Brown', 'alice.brown@email.com', '5551234567', 25, '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1),
('Bob Wilson', 'bob.wilson@email.com', '5559876543', 30, '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1),
('Charlie Davis', 'charlie.davis@email.com', '5555555555', 15, '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2)
ON DUPLICATE KEY UPDATE email=email;

-- Insert sample exercises
INSERT INTO exercise (name, type, duration, description) VALUES 
('Eye Tracking Exercise', 'camera', 300, 'Follow moving objects with your eyes to improve tracking ability'),
('Focus Training', 'non-camera', 180, 'Practice focusing on near and far objects alternately'),
('Peripheral Vision', 'camera', 240, 'Expand your peripheral vision awareness through guided exercises'),
('Hand-Eye Coordination', 'camera', 360, 'Improve coordination between visual input and motor responses'),
('Visual Memory', 'non-camera', 120, 'Enhance visual memory through pattern recognition exercises')
ON DUPLICATE KEY UPDATE name=name;

-- Insert sample recommendations
INSERT INTO recommendation (doctor_id, patient_id, exercise_id, duration) VALUES 
(1, 1, 1, 300),  -- Dr. Smith recommends Eye Tracking for Alice
(1, 1, 2, 180),  -- Dr. Smith recommends Focus Training for Alice
(1, 2, 3, 240),  -- Dr. Smith recommends Peripheral Vision for Bob
(2, 3, 1, 300),  -- Dr. Johnson recommends Eye Tracking for Charlie
(2, 3, 4, 360)   -- Dr. Johnson recommends Hand-Eye Coordination for Charlie
ON DUPLICATE KEY UPDATE doctor_id=doctor_id;

-- Insert sample appointments
INSERT INTO appointment (patient_id, doctor_id, appointment_time, status) VALUES 
(1, 1, '2024-01-15 10:00:00', 'SCHEDULED'),
(2, 1, '2024-01-15 11:00:00', 'SCHEDULED'),
(3, 2, '2024-01-16 14:00:00', 'SCHEDULED'),
(1, 1, '2024-01-22 10:00:00', 'SCHEDULED')
ON DUPLICATE KEY UPDATE patient_id=patient_id;
