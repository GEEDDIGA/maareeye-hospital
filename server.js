const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// PostgreSQL Connection Pool
let pool;
try {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    user: process.env.DB_USER || process.env.PGUSER || 'postgres',
    password: process.env.DB_PASSWORD || process.env.PGPASSWORD || 'password',
    host: process.env.DB_HOST || process.env.PGHOST || 'maareeye-db.railway.internal' || 'localhost',
    port: process.env.DB_PORT || process.env.PGPORT || 5432,
    database: process.env.DB_NAME || process.env.PGDATABASE || 'maareeye_hospital',
  });
  
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });
  
  console.log('Database pool initialized successfully');
} catch (err) {
  console.error('Failed to initialize database pool:', err.message);
  pool = null;
}

// Database Initialization Function
const initializeDatabase = async () => {
  if (!pool) {
    console.log('Pool not initialized, skipping database initialization');
    return;
  }
  
  try {
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'hospitals'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('Database tables already exist, skipping initialization');
      return;
    }
    
    console.log('Initializing database schema...');
    
    await pool.query(`
      DROP TABLE IF EXISTS appointments CASCADE;
      DROP TABLE IF EXISTS doctors CASCADE;
      DROP TABLE IF EXISTS patients CASCADE;
      DROP TABLE IF EXISTS hospitals CASCADE;
    `);
    
    await pool.query(`
      CREATE TABLE hospitals (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(500),
        phone VARCHAR(20),
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await pool.query(`
      CREATE TABLE doctors (
        id SERIAL PRIMARY KEY,
        hospital_id INTEGER NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        specialization VARCHAR(255),
        phone VARCHAR(20),
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await pool.query(`
      CREATE TABLE patients (
        id SERIAL PRIMARY KEY,
        hospital_id INTEGER NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20),
        date_of_birth DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await pool.query(`
      CREATE TABLE appointments (
        id SERIAL PRIMARY KEY,
        hospital_id INTEGER NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
        doctor_id INTEGER NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
        patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        time TIME NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await pool.query('CREATE INDEX idx_doctors_hospital ON doctors(hospital_id);');
    await pool.query('CREATE INDEX idx_patients_hospital ON patients(hospital_id);');
    await pool.query('CREATE INDEX idx_appointments_hospital ON appointments(hospital_id);');
    await pool.query('CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);');
    await pool.query('CREATE INDEX idx_appointments_patient ON appointments(patient_id);');
    await pool.query('CREATE INDEX idx_appointments_date ON appointments(date);');
    
    const hospitalResult = await pool.query(`
      INSERT INTO hospitals (name, address, phone, email) 
      VALUES ('Maareeye Hospital', '123 Main St, Mogadishu', '+252-1-234567', 'info@maareeye.com')
      RETURNING id;
    `);
    const hospitalId = hospitalResult.rows[0].id;
    
    await pool.query(`
      INSERT INTO doctors (hospital_id, name, specialization, phone, email) VALUES
      ($1, 'Dr. Ahmed Hassan', 'Cardiology', '+252-1-111111', 'ahmed@maareeye.com'),
      ($1, 'Dr. Fatima Mohamed', 'Pediatrics', '+252-1-222222', 'fatima@maareeye.com'),
      ($1, 'Dr. Mohamed Ali', 'General Surgery', '+252-1-333333', 'mohamed@maareeye.com');
    `, [hospitalId]);
    
    await pool.query(`
      INSERT INTO patients (hospital_id, name, email, phone, date_of_birth) VALUES
      ($1, 'Hassan Abdi', 'hassan@example.com', '+252-1-444444', '1990-01-15'),
      ($1, 'Amina Ahmed', 'amina@example.com', '+252-1-555555', '1985-06-20'),
      ($1, 'Samir Ibrahim', 'samir@example.com', '+252-1-666666', '1992-03-10');
    `, [hospitalId]);
    
    const doctors = await pool.query('SELECT id FROM doctors WHERE hospital_id = $1;', [hospitalId]);
    const patients = await pool.query('SELECT id FROM patients WHERE hospital_id = $1;', [hospitalId]);
    
    if (doctors.rows.length > 0 && patients.rows.length > 0) {
      await pool.query(`
        INSERT INTO appointments (hospital_id, doctor_id, patient_id, date, time, notes) VALUES
        ($1, $2, $3, CURRENT_DATE, '09:00:00', 'Regular checkup'),
        ($1, $2, $4, CURRENT_DATE, '10:30:00', 'Follow-up visit'),
        ($1, $3, $5, CURRENT_DATE, '14:00:00', 'Emergency visit');
      `, [hospitalId, doctors.rows[0].id, patients.rows[0].id, patients.rows[1].id, patients.rows[2].id]);
    }
    
    console.log('Database schema initialized successfully with sample data');
  } catch (err) {
    console.error('Error initializing database schema:', err.message);
  }
};

if (pool) {
  initializeDatabase().catch(err => console.error('Initialization error:', err));
}

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Maareeye Hospital System is running' });
});

// Database Test Endpoint
app.get('/api/db-test', async (req, res) => {
  try {
    if (!pool) {
      return res.status(500).json({ status: 'Error', error: 'Database pool not initialized' });
    }
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
    if (!pool) {
      return res.status(500).json({ status: 'Error', error: 'Database pool not initialized' });
    }
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
    if (!pool) {
      return res.status(500).json({ status: 'Error', error: 'Database pool not initialized' });
    }
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
    if (!pool) {
      return res.status(500).json({ status: 'Error', error: 'Database pool not initialized' });
    }
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
    if (!pool) {
      return res.status(500).json({ status: 'Error', error: 'Database pool not initialized' });
    }
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
