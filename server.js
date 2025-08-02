import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pkg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URI
});

// Create users table if not exists
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create predictions table if not exists
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
    const { name, email, password } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );
    
    const token = jwt.sign({ userId: result.rows[0].id }, process.env.PAYLOAD_SECRET);
    
    res.json({ token, user: result.rows[0] });
  } catch (error) {
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
    const { email, password } = req.body;
    
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.id }, process.env.PAYLOAD_SECRET);
    
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update profile endpoint
app.put('/api/update-profile', async (req, res) => {
  try {
    const { name } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.PAYLOAD_SECRET);
    
    await pool.query('UPDATE users SET name = $1 WHERE id = $2', [name, decoded.userId]);
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Store prediction endpoint
app.post('/api/store-prediction', async (req, res) => {
  try {
    const { temperature, householdSize, season, date, devices, predictedConsumption, modelUsed, confidence } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    
    let userId = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.PAYLOAD_SECRET);
        userId = decoded.userId;
      } catch (error) {
        // Continue without user ID if token is invalid
      }
    }
    
    const result = await pool.query(
      'INSERT INTO predictions (user_id, temperature, household_size, season, date, devices, predicted_consumption, model_used, confidence) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      [userId, temperature, householdSize, season, date, JSON.stringify(devices), predictedConsumption, modelUsed, confidence]
    );
    
    res.json({ message: 'Prediction stored successfully', id: result.rows[0].id });
  } catch (error) {
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
    
    const decoded = jwt.verify(token, process.env.PAYLOAD_SECRET);
    
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