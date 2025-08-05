import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pkg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'energyai',
  password: 'Kaushal@8697',
  port: 5432,
  ssl: false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

// Handle connection errors
pool.on('error', (err) => {
  console.error('Database connection error:', err);
  console.log('Attempting to reconnect...');
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(() => {
      pool.connect();
    }, 5000);
  } else {
    console.log('PostgreSQL connected successfully');
    release();
  }
});

// Create users table
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create predictions table
pool.query(`
  CREATE TABLE IF NOT EXISTS predictions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    temperature FLOAT,
    household_size INTEGER,
    season VARCHAR(50),
    date DATE,
    devices JSONB,
    predicted_consumption FLOAT,
    model_used VARCHAR(100),
    confidence FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  try {
    console.log('Signup request received:', req.body);
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );
    
    console.log('User created successfully:', result.rows[0]);
    const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET);
    res.json({ token, user: result.rows[0] });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.code === '23505') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { email, password } = req.body;
    
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    console.log('User found:', result.rows.length > 0);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    console.log('Login successful for user:', user.email);
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Store prediction endpoint
app.post('/api/store-prediction', async (req, res) => {
  try {
    console.log('Store prediction request received:', req.body);
    const { temperature, householdSize, season, date, devices, predictedConsumption, modelUsed, confidence } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    
    let userId = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
        console.log('User ID from token:', userId);
      } catch (error) {
        console.log('No valid token provided');
      }
    }
    
    console.log('Inserting prediction with data:', {
      userId, temperature, householdSize, season, date, devices, predictedConsumption, modelUsed, confidence
    });
    
    const result = await pool.query(
      'INSERT INTO predictions (user_id, temperature, household_size, season, date, devices, predicted_consumption, model_used, confidence) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      [userId, temperature, householdSize, season, date, JSON.stringify(devices), predictedConsumption, modelUsed, confidence]
    );
    
    console.log('Prediction stored successfully with ID:', result.rows[0].id);
    res.json({ message: 'Prediction stored successfully', id: result.rows[0].id });
  } catch (error) {
    console.error('Store prediction error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user predictions endpoint
app.get('/api/predictions', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const result = await pool.query(
      'SELECT * FROM predictions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10',
      [decoded.userId]
    );
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});