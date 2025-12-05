-- Maareeye Hospital Management System Database Schema
-- PostgreSQL Initialization Script

-- Drop existing tables if they exist (for clean initialization)
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS hospitals CASCADE;

-- Create hospitals table
CREATE TABLE hospitals (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create doctors table
CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialization VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  hospital_id INTEGER REFERENCES hospitals(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create patients table
CREATE TABLE patients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  date_of_birth DATE,
  address TEXT,
  medical_history TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create appointments table
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id INTEGER NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_doctors_hospital_id ON doctors(hospital_id);
CREATE INDEX idx_doctors_name ON doctors(name);
CREATE INDEX idx_patients_name ON patients(name);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(date);

-- Insert sample data
INSERT INTO hospitals (name, address, phone, email) VALUES
('Maareeye Hospital', '123 Main Street, Mogadishu', '+252-1-234567', 'info@maareeye.com');

INSERT INTO doctors (name, specialization, phone, email, hospital_id) VALUES
('Dr. Ahmed Hassan', 'General Practitioner', '+252-123456789', 'ahmed@maareeye.com', 1),
('Dr. Fatima Mohamed', 'Pediatrician', '+252-234567890', 'fatima@maareeye.com', 1),
('Dr. Omar Ali', 'Surgeon', '+252-345678901', 'omar@maareeye.com', 1);

INSERT INTO patients (name, email, phone, date_of_birth, address) VALUES
('Hassan Ibrahim', 'hassan@example.com', '+252-111111111', '1985-05-15', '456 Oak Ave, Mogadishu'),
('Amina Abdullahi', 'amina@example.com', '+252-222222222', '1990-08-20', '789 Pine Rd, Mogadishu'),
('Mohamed Yusuf', 'mohamed@example.com', '+252-333333333', '1980-03-10', '321 Elm St, Mogadishu');

INSERT INTO appointments (patient_id, doctor_id, date, time, status) VALUES
(1, 1, '2025-12-10', '09:00:00', 'scheduled'),
(2, 2, '2025-12-11', '10:30:00', 'scheduled'),
(3, 3, '2025-12-12', '14:00:00', 'scheduled');

-- Verify tables were created successfully
SELECT 'Maareeye Hospital Database Schema Initialized Successfully!' AS status;
