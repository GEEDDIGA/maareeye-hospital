# Maareeye Hospital Management System

## Overview
Maareeye is a Hospital Management System built with Node.js + Express backend and PostgreSQL database. It provides a RESTful API for managing hospital operations including doctors, patients, appointments, and hospital information.

## Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Runtime**: Node.js >= 14.0.0
- **Package Manager**: npm

## Prerequisites
Before you begin, ensure you have installed:
- Node.js (v14 or higher) - [Download](https://nodejs.org/)
- PostgreSQL (v12 or higher) - [Download](https://www.postgresql.org/download/)
- Git - [Download](https://git-scm.com/)

## Installation & Local Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/GEEDDIGA/maareeye-hospital.git
cd maareeye-hospital
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL connection details:
```
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=maareeye_hospital
PORT=3000
```

### Step 4: Create PostgreSQL Database
```sql
CREATE DATABASE maareeye_hospital;
```

### Step 5: Set Up Database Tables
Connect to your database and run:
```sql
-- Create hospitals table
CREATE TABLE hospitals (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create doctors table
CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialization VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create patients table
CREATE TABLE patients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  date_of_birth DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create appointments table
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES patients(id),
  doctor_id INTEGER REFERENCES doctors(id),
  date DATE NOT NULL,
  time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Step 6: Run the Application Locally
```bash
# Development mode with auto-reload
npm run dev

# OR Production mode
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check
- **GET** `/api/health` - Check if server is running
- **Response**: `{ status: 'OK', message: 'Maareeye Hospital System is running' }`

### Database Test
- **GET** `/api/db-test` - Test database connection
- **Response**: `{ status: 'OK', database: 'Connected', time: {...} }`

### Hospital Information
- **GET** `/api/hospital` - Get hospital information
- **Response**: Hospital details (id, name, address, phone, email)

### Doctors
- **GET** `/api/doctors` - Get all doctors
- **Response**: Array of doctor objects

### Patients
- **GET** `/api/patients` - Get all patients
- **Response**: Array of patient objects

### Appointments
- **GET** `/api/appointments` - Get all appointments
- **Response**: Array of appointment objects with patient and doctor names

## Deployment

### Option 1: Deploy to Railway

1. Push your code to GitHub
2. Go to [Railway.app](https://railway.app/)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select the `maareeye-hospital` repository
5. Railway will auto-detect Node.js
6. Add environment variables:
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_HOST`
   - `DB_PORT`
   - `DB_NAME`
   - `PORT`
7. Deploy and wait for build to complete

**Railway PostgreSQL Setup**:
- Add PostgreSQL plugin from Railway
- Railway will provide connection string
- Update `.env` with Railway PostgreSQL credentials

### Option 2: Deploy to Render

1. Go to [Render.com](https://render.com/)
2. Click "New+" → "Web Service"
3. Connect your GitHub account
4. Select `maareeye-hospital` repository
5. Configure:
   - **Name**: maareeye-hospital
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add environment variables (same as Railway)
7. Add Render PostgreSQL:
   - Go to Databases → Create PostgreSQL
   - Link to your web service
   - Use provided connection string
8. Deploy

## Environment Variables Reference

```
DB_USER=postgres              # PostgreSQL username
DB_PASSWORD=your_password     # PostgreSQL password
DB_HOST=localhost             # Database host (localhost for local, provided by hosting for cloud)
DB_PORT=5432                  # Database port
DB_NAME=maareeye_hospital     # Database name
PORT=3000                     # Server port (auto-assigned on Railway/Render)
NODE_ENV=production           # Optional: Set to 'production' on cloud
```

## npm Commands

- `npm install` - Install dependencies
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload

## Project Structure

```
maareeye-hospital/
├── server.js          # Main Express application
├── package.json       # Dependencies and scripts
├── .env.example       # Environment variables template
├── README.md          # This file
└── database/          # Database schemas and migrations (optional)
```

## Testing the API

You can test the API using:

### Using curl
```bash
# Health check
curl http://localhost:3000/api/health

# Get doctors
curl http://localhost:3000/api/doctors

# Get patients
curl http://localhost:3000/api/patients
```

### Using Postman
1. Import the API endpoints
2. Set base URL: `http://localhost:3000`
3. Test each endpoint

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check `.env` credentials match your PostgreSQL setup
- Ensure database exists: `CREATE DATABASE maareeye_hospital;`

### Port Already in Use
- Change PORT in `.env` to a different port
- Or kill the process using the port

### npm install Fails
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## License
MIT License - Free to use and modify

## Support
For issues and questions, please create an issue on GitHub or contact the development team.

## Contributors
Hospital Management System Team - Maareeye Project
