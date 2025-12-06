const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// MOCK DATA - In-memory database for Maamule Hospital Management System
const mockData = {
  hospital: {
    id: 1,
    name: 'Maamule Hospital Management System',
    address: '123 Main St, Mogadishu',
    phone: '+252-1-234567',
    email: 'info@maamule.com'
  },
  doctors: [
    { id: 1, name: 'Dr. Ahmed Hassan', specialization: 'Cardiology', phone: '+252-1-111111', email: 'ahmed@maamule.com' },
    { id: 2, name: 'Dr. Fatima Mohamed', specialization: 'Pediatrics', phone: '+252-1-222222', email: 'fatima@maamule.com' },
    { id: 3, name: 'Dr. Mohamed Ali', specialization: 'General Surgery', phone: '+252-1-333333', email: 'mohamed@maamule.com' }
  ],
  patients: [
    { id: 1, name: 'Hassan Abdi', email: 'hassan@example.com', phone: '+252-1-444444', date_of_birth: '1990-01-15' },
    { id: 2, name: 'Amina Ahmed', email: 'amina@example.com', phone: '+252-1-555555', date_of_birth: '1985-06-20' },
    { id: 3, name: 'Samir Ibrahim', email: 'samir@example.com', phone: '+252-1-666666', date_of_birth: '1992-03-10' }
  ],
  appointments: [
    { id: 1, date: new Date().toISOString().split('T')[0], time: '09:00:00', patient_name: 'Hassan Abdi', doctor_name: 'Dr. Ahmed Hassan' },
    { id: 2, date: new Date().toISOString().split('T')[0], time: '10:30:00', patient_name: 'Amina Ahmed', doctor_name: 'Dr. Ahmed Hassan' },
    { id: 3, date: new Date().toISOString().split('T')[0], time: '14:00:00', patient_name: 'Samir Ibrahim', doctor_name: 'Dr. Mohamed Ali' }
  ]
};

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Maamule Hospital System is running' });
});

// Hospital Info Endpoint - WITH MOCK DATA
app.get('/api/hospital', (req, res) => {
  res.json({ status: 'OK', data: mockData.hospital });
});

// Get All Doctors - WITH MOCK DATA
app.get('/api/doctors', (req, res) => {
  res.json({ status: 'OK', data: mockData.doctors });
});

// Get All Patients - WITH MOCK DATA
app.get('/api/patients', (req, res) => {
  res.json({ status: 'OK', data: mockData.patients });
});

// Get All Appointments - WITH MOCK DATA
app.get('/api/appointments', (req, res) => {
  res.json({ status: 'OK', data: mockData.appointments });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ status: 'Error', error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ status: 'Error', message: 'Endpoint not found' });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Maamule Hospital System API running on port ${PORT}`);
  console.log('Using MOCK DATA - No database required');
});

module.exports = app;
