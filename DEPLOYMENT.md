# Maareeye Hospital - Complete Deployment Guide

## Table of Contents
1. Local Development Setup
2. Railway.app Deployment
3. Render.com Deployment
4. Verification & Testing
5. Troubleshooting

---

## 1. LOCAL DEVELOPMENT SETUP

### Prerequisites
- Node.js 14+ installed
- PostgreSQL 12+ installed and running
- Git installed
- Terminal/Command line access

### Step-by-Step Local Setup

#### 1.1 Clone the Repository
```bash
git clone https://github.com/GEEDDIGA/maareeye-hospital.git
cd maareeye-hospital
```

#### 1.2 Install Node Dependencies
```bash
npm install
```

#### 1.3 Create PostgreSQL Database
Open PostgreSQL terminal (psql) and run:
```sql
CREATE DATABASE maareeye_hospital;
```

#### 1.4 Create Database Tables
Connect to the database:
```sql
\c maareeye_hospital
```

Create tables:
```sql
CREATE TABLE hospitals (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialization VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE patients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  date_of_birth DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES patients(id),
  doctor_id INTEGER REFERENCES doctors(id),
  date DATE NOT NULL,
  time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO hospitals (name, address, phone, email) VALUES
('Maareeye Hospital', '123 Health Street, Mogadishu', '+252-612-345678', 'info@maareeye.com');
```

#### 1.5 Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` file:
```
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=maareeye_hospital
PORT=3000
NODE_ENV=development
```

#### 1.6 Start Local Development Server
```bash
# Development mode with auto-reload
npm run dev

# OR Production mode
npm start
```

**Expected Output:**
```
Maareeye Hospital System API running on port 3000
Database: maareeye_hospital
```

#### 1.7 Test Local API
```bash
# In a new terminal window, test the health endpoint
curl http://localhost:3000/api/health

# Expected response:
# {"status":"OK","message":"Maareeye Hospital System is running"}
```

---

## 2. RAILWAY.APP DEPLOYMENT

### Prerequisites
- Railway.app account (free at railway.app)
- GitHub account with maareeye-hospital repository
- Railway CLI (optional, for advanced usage)

### Step-by-Step Railway Deployment

#### 2.1 Create Railway Project
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Click "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub account
5. Select `GEEDDIGA/maareeye-hospital` repository
6. Click "Deploy Now"

#### 2.2 Railway Automatically Detects Node.js
Railway will:
- Detect package.json
- Install npm dependencies
- Run `npm start` command
- Create a public URL

#### 2.3 Add PostgreSQL Database to Railway
1. In Railway Dashboard, click "+New"
2. Select "Database"
3. Select "PostgreSQL"
4. Railway will create database automatically

#### 2.4 Connect Database to Web Service
1. Go to Web Service settings
2. Click "Variables"
3. Add from PostgreSQL plugin:
   - `DB_USER` - from DATABASE_USER
   - `DB_PASSWORD` - from DATABASE_PASSWORD
   - `DB_HOST` - from DATABASE_URL (extract host)
   - `DB_PORT` - from DATABASE_URL (extract port)
   - `DB_NAME` - from DATABASE_NAME
   - `NODE_ENV` = production
   - `PORT` = 3000

Alternatively, Railway provides `DATABASE_URL` which can be parsed:
```
postgresql://user:password@host:5432/database
```

#### 2.5 Create Tables on Railway PostgreSQL
1. Connect to Railway PostgreSQL from your local machine:
```bash
psql postgresql://user:password@host:5432/database
```

2. Run the table creation SQL (same as local setup above)

#### 2.6 Deploy
1. Railway automatically redeploys when you push to GitHub
2. Check deployment status in Railway Dashboard
3. Once deployed, click "View" to open the public URL

#### 2.7 Verify Railway Deployment
```bash
# Replace YOUR_RAILWAY_URL with actual URL
curl https://YOUR_RAILWAY_URL/api/health

# Should return:
# {"status":"OK","message":"Maareeye Hospital System is running"}
```

**Railway Features:**
- Automatic GitHub integration
- Auto-deploys on push
- Free tier available
- PostgreSQL included
- Environment variables managed in dashboard

---

## 3. RENDER.COM DEPLOYMENT

### Prerequisites
- Render.com account (free at render.com)
- GitHub account with maareeye-hospital repository
- Render render.yaml file (already in repo)

### Step-by-Step Render Deployment

#### 3.1 Create Render Web Service
1. Go to [render.com](https://render.com)
2. Click "New +"
3. Select "Web Service"
4. Click "Connect account" for GitHub
5. Authorize Render to access GitHub
6. Select `maareeye-hospital` repository

#### 3.2 Configure Web Service
1. **Name:** maareeye-hospital
2. **Environment:** Node
3. **Region:** Choose closest region
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`
6. **Plan:** Free tier
7. Click "Create Web Service"

#### 3.3 Render Auto-Detects render.yaml
Render will automatically:
- Read render.yaml configuration
- Create PostgreSQL database
- Set environment variables
- Deploy the web service

#### 3.4 Verify Database Creation
1. Go to Render Dashboard
2. Click "Databases" in left sidebar
3. Verify `maareeye-db` PostgreSQL database is created
4. Status should show "Available"

#### 3.5 Create Tables on Render PostgreSQL
1. In Render Dashboard, click on `maareeye-db` database
2. Copy connection string
3. Connect from local machine:
```bash
psql your-render-postgres-connection-string
```

4. Run table creation SQL (same as local setup)

#### 3.6 Verify Render Deployment
1. Go to Web Service dashboard
2. Click "Logs" to see deployment progress
3. Once deployed, copy the URL from "On-Render URL"
4. Test the API:
```bash
curl https://YOUR-RENDER-URL/api/health

# Should return:
# {"status":"OK","message":"Maareeye Hospital System is running"}
```

**Render Features from render.yaml:**
- Automatic database provisioning
- Environment variable linking
- Health check endpoint
- Auto-redeploy on GitHub push
- Free tier available

---

## 4. VERIFICATION & TESTING

### Test All Endpoints
After deployment (Local, Railway, or Render), test these endpoints:

```bash
# For LOCAL: Replace with http://localhost:3000
# For RAILWAY: Replace with https://YOUR_RAILWAY_URL
# For RENDER: Replace with https://YOUR_RENDER_URL

BASE_URL="http://localhost:3000"

# Health Check
curl $BASE_URL/api/health

# Database Connection Test
curl $BASE_URL/api/db-test

# Hospital Info
curl $BASE_URL/api/hospital

# Get All Doctors
curl $BASE_URL/api/doctors

# Get All Patients
curl $BASE_URL/api/patients

# Get All Appointments
curl $BASE_URL/api/appointments
```

### Expected Responses
All endpoints should return status 200 with data.

---

## 5. TROUBLESHOOTING

### Local Development Issues

**Port Already in Use:**
```bash
# Change port in .env
PORT=3001
npm start
```

**Database Connection Failed:**
- Verify PostgreSQL is running
- Check credentials in .env
- Verify database exists: `psql -l`

**Dependencies Won't Install:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Railway Issues

**Build Failed:**
- Check Railway logs
- Verify package.json is valid
- Check for runtime errors

**Cannot Connect to Database:**
- Verify PostgreSQL plugin is added
- Check environment variables are linked
- Wait 1-2 minutes for database to be ready

### Render Issues

**Deployment Stuck:**
- Check Render logs
- Verify render.yaml syntax
- Manually trigger redeploy

**Database Not Created:**
- Check render.yaml has correct database config
- Verify PostgreSQL plugin definition
- Try redeploying

### General Issues

**API Returns 500 Error:**
- Check server logs
- Verify database connection
- Check environment variables
- Restart the application

**API Timeout:**
- Check PostgreSQL connection
- Verify network connectivity
- Check server resources

---

## Summary

| Platform | Setup Time | Cost | Database | Auto-Deploy |
|----------|-----------|------|----------|-------------|
| Local | 10-15 min | Free | Your PC | Manual |
| Railway | 5 min | Free | Included | Yes |
| Render | 5 min | Free | Included | Yes |

**Recommended:**
- **Local:** Development and testing
- **Railway or Render:** Production deployment
- **Both:** For redundancy and failover
