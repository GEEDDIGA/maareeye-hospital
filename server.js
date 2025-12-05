const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// PostgreSQL Connection Pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'maareeye_hospital'
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Root Endpoint
app.get('/', (req, res) => {
   res.json({ status: 'OK', message: 'Maareeye Hospital System is running' });
  });


// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Maareeye Hospital System is running' });
});

// Database Test Endpoint
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'OK', database: 'Connected', time: result.rows[0] });
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ status: 'Error', error: err.message });
  }
});

// Hospital Info Endpoint
app.get('/api/hospital', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, address, phone, email FROM hospitals LIMIT 1'
    );
    if (result.rows.length === 0) {
      return res.json({ status: 'No hospitals found', data: null });
    }
    res.json({ status: 'OK', data: result.rows[0] });
  } catch (err) {
    console.error('Error fetching hospital:', err);
    res.status(500).json({ status: 'Error', error: err.message });
  }
});

// Get All Doctors
app.get('/api/doctors', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, specialization, phone, email FROM doctors ORDER BY name'
    );
    res.json({ status: 'OK', data: result.rows });
  } catch (err) {
    console.error('Error fetching doctors:', err);
    res.status(500).json({ status: 'Error', error: err.message });
  }
});

// Get All Patients
app.get('/api/patients', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, phone, date_of_birth FROM patients ORDER BY name'
    );
    res.json({ status: 'OK', data: result.rows });
  } catch (err) {
    console.error('Error fetching patients:', err);
    res.status(500).json({ status: 'Error', error: err.message });
  }
});

// Get All Appointments
app.get('/api/appointments', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.id, a.date, a.time, p.name as patient_name, d.name as doctor_name 
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.date DESC
    `);
    res.json({ status: 'OK', data: result.rows });
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ status: 'Error', error: err.message });
  }
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
  console.log(`Maareeye Hospital System API running on port ${PORT}`);
  console.log(`Database: ${process.env.DB_NAME || 'maareeye_hospital'}`);
});

module.exports = app;
