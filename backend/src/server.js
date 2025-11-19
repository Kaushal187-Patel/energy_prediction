import bcrypt from 'bcryptjs';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';
import pkg from 'pg';
import { Server } from 'socket.io';
import analyticsService from './services/analyticsService.js';
import weatherService from './services/weatherService.js';

const { Pool } = pkg;
dotenv.config();

// Validate required environment variables and set fallback
const jwtSecretValue = process.env.JWT_SECRET;
if (!jwtSecretValue || (typeof jwtSecretValue === 'string' && jwtSecretValue.trim() === '')) {
  console.warn('⚠️  WARNING: JWT_SECRET is not set in environment variables!');
  console.warn('⚠️  Please create a .env file in the backend directory with: JWT_SECRET=your_secret_key');
  console.warn('⚠️  Using a default secret for development (NOT SECURE FOR PRODUCTION)');
  // Use a consistent fallback secret so tokens remain valid across server restarts
  process.env.JWT_SECRET = 'default_dev_secret_change_in_production_energy_ai_2024';
  console.warn('⚠️  Fallback JWT_SECRET set. Tokens will be valid until server restart.');
} else {
  console.log('✅ JWT_SECRET is configured');
}

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});
const port = 3001;

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', JSON.stringify(req.body));
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint
app.post('/api/test', (req, res) => {
  console.log('Test endpoint called:', req.body);
  res.json({ 
    message: 'Test endpoint working',
    received: req.body 
  });
});

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
pool.connect()
  .then((client) => {
    console.log('PostgreSQL connected successfully');
    client.release();
    
    // Test query to ensure database is accessible
    return pool.query('SELECT NOW()');
  })
  .then(() => {
    console.log('Database connection test successful');
  })
  .catch((err) => {
    console.error('Error connecting to database:', err.message);
    console.error('Database connection details:', {
      host: pool.options.host,
      port: pool.options.port,
      database: pool.options.database,
      user: pool.options.user
    });
    console.log('⚠️  Server will continue, but database operations may fail');
    console.log('⚠️  Please ensure PostgreSQL is running and accessible');
  });

// Create database tables
async function initializeTables() {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table ready');

    // Create predictions table
    await pool.query(`
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
        cost FLOAT DEFAULT 0,
        carbon_footprint FLOAT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Predictions table ready');

    // Create alerts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS alerts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        type VARCHAR(50),
        message TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Alerts table ready');

    // Create user_settings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_settings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) UNIQUE,
        high_consumption_threshold FLOAT DEFAULT 200,
        cost_threshold FLOAT DEFAULT 50,
        normal_consumption FLOAT DEFAULT 150,
        email_alerts BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ User settings table ready');
  } catch (error) {
    console.error('❌ Error creating database tables:', error.message);
    console.error('Table creation error details:', error);
  }
}

// Initialize tables after a short delay to ensure connection is ready
setTimeout(() => {
  initializeTables();
}, 1000);

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  try {
    console.log('Signup request received:', req.body);
    
    // Validate input
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        details: 'Name, email, and password are required' 
      });
    }
    
    if (typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Invalid name' });
    }
    
    if (typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    if (typeof password !== 'string' || password.length < 3) {
      return res.status(400).json({ error: 'Password must be at least 3 characters long' });
    }
    
    // Check database connection
    try {
      await pool.query('SELECT 1');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return res.status(500).json({ 
        error: 'Database connection failed', 
        details: 'Please ensure PostgreSQL is running and accessible' 
      });
    }
    
    // Hash password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (hashError) {
      console.error('Password hashing error:', hashError);
      return res.status(500).json({ error: 'Failed to process password' });
    }
    
    // Insert user into database
    let result;
    try {
      result = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
        [name.trim(), email.trim().toLowerCase(), hashedPassword]
      );
      console.log('User created successfully:', result.rows[0]);
    } catch (dbError) {
      console.error('Database insert error:', dbError);
      if (dbError.code === '23505') {
        return res.status(400).json({ error: 'Email already exists' });
      } else if (dbError.code === '42P01') {
        return res.status(500).json({ 
          error: 'Database table not found', 
          details: 'Users table does not exist. Please check database setup.' 
        });
      } else {
        return res.status(500).json({ 
          error: 'Database error', 
          details: dbError.message,
          code: dbError.code 
        });
      }
    }
    
    // Generate JWT token
    let jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret || (typeof jwtSecret === 'string' && jwtSecret.trim() === '')) {
      console.error('JWT_SECRET is missing! Setting fallback...');
      jwtSecret = 'default_dev_secret_change_in_production_energy_ai_2024';
      process.env.JWT_SECRET = jwtSecret;
    }
    
    let token;
    try {
      console.log('Using JWT_SECRET:', jwtSecret ? 'Set (length: ' + jwtSecret.length + ')' : 'NOT SET');
      token = jwt.sign({ userId: result.rows[0].id }, jwtSecret);
    } catch (jwtError) {
      console.error('JWT signing error:', jwtError);
      return res.status(500).json({ 
        error: 'Failed to generate authentication token', 
        details: jwtError.message 
      });
    }
    
    res.json({ 
      token, 
      user: result.rows[0],
      message: 'User created successfully' 
    });
  } catch (error) {
    console.error('Unexpected signup error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Server error', 
      details: error.message,
      type: error.constructor.name 
    });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    console.log('=== LOGIN REQUEST START ===');
    console.log('Login request received:', JSON.stringify(req.body));
    
    // Validate input
    const { email, password } = req.body;
    console.log('Extracted email:', email, 'password length:', password ? password.length : 0);
    
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        details: 'Email and password are required' 
      });
    }
    
    if (typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    if (typeof password !== 'string' || password.length === 0) {
      return res.status(400).json({ error: 'Password is required' });
    }
    
    // Check database connection
    try {
      await pool.query('SELECT 1');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return res.status(500).json({ 
        error: 'Database connection failed', 
        details: 'Please ensure PostgreSQL is running and accessible' 
      });
    }
    
    // Find user in database
    let result;
    try {
      result = await pool.query('SELECT * FROM users WHERE email = $1', [email.trim().toLowerCase()]);
      console.log('User found:', result.rows.length > 0);
    } catch (dbError) {
      console.error('Database query error:', dbError);
      return res.status(500).json({ 
        error: 'Database error', 
        details: dbError.message,
        code: dbError.code 
      });
    }
    
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    
    // Verify password
    let isMatch;
    try {
      if (!user.password) {
        console.error('User password is missing in database');
        return res.status(500).json({ error: 'User account error' });
      }
      isMatch = await bcrypt.compare(password, user.password);
    } catch (compareError) {
      console.error('Password comparison error:', compareError);
      return res.status(500).json({ error: 'Failed to verify password' });
    }
    
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    console.log('Login successful for user:', user.email);
    
    // Generate JWT token
    let jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret || (typeof jwtSecret === 'string' && jwtSecret.trim() === '')) {
      console.error('JWT_SECRET is missing! Setting fallback...');
      jwtSecret = 'default_dev_secret_change_in_production_energy_ai_2024';
      process.env.JWT_SECRET = jwtSecret;
    }
    
    let token;
    try {
      console.log('Using JWT_SECRET:', jwtSecret ? 'Set (length: ' + jwtSecret.length + ')' : 'NOT SET');
      token = jwt.sign({ userId: user.id }, jwtSecret);
    } catch (jwtError) {
      console.error('JWT signing error:', jwtError);
      return res.status(500).json({ 
        error: 'Failed to generate authentication token', 
        details: jwtError.message 
      });
    }
    
    console.log('Sending successful login response');
    const responseData = { 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email 
      },
      message: 'Login successful'
    };
    console.log('Response data:', JSON.stringify({ ...responseData, token: '***' }));
    res.json(responseData);
    console.log('=== LOGIN REQUEST SUCCESS ===');
  } catch (error) {
    console.error('=== LOGIN REQUEST ERROR ===');
    console.error('Unexpected login error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Make sure we haven't already sent a response
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Server error', 
        details: error.message,
        type: error.constructor.name 
      });
    } else {
      console.error('Response already sent, cannot send error response');
    }
    console.error('=== LOGIN REQUEST ERROR END ===');
  }
});

// Store prediction endpoint
app.post('/api/store-prediction', async (req, res) => {
  try {
    console.log('Store prediction request received:', req.body);
    const { temperature, householdSize, season, date, devices, predictedConsumption, modelUsed, confidence } = req.body;
    
    // Validate required fields
    if (predictedConsumption == null || modelUsed == null) {
      return res.status(400).json({ error: 'Missing required fields: predictedConsumption and modelUsed are required' });
    }
    
    const token = req.headers.authorization?.split(' ')[1];
    
    let userId = null;
    if (token) {
      try {
        if (!process.env.JWT_SECRET) {
          console.warn('JWT_SECRET not configured, cannot verify token');
        } else {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          userId = decoded.userId;
          console.log('User ID from token:', userId);
        }
      } catch (error) {
        console.log('JWT verification failed:', error.message);
        // Continue without userId - prediction can still be stored
      }
    } else {
      console.log('No token provided - storing prediction without user association');
    }
    
    console.log('Inserting prediction with data:', {
      userId, temperature, householdSize, season, date, devices, predictedConsumption, modelUsed, confidence
    });
    
    // Ensure devices is properly formatted
    let devicesJson = devices;
    if (devices && typeof devices !== 'string') {
      devicesJson = JSON.stringify(devices);
    }
    
    const result = await pool.query(
      'INSERT INTO predictions (user_id, temperature, household_size, season, date, devices, predicted_consumption, model_used, confidence) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      [userId, temperature, householdSize, season, date, devicesJson, predictedConsumption, modelUsed, confidence]
    );
    
    console.log('Prediction stored successfully with ID:', result.rows[0].id);
    res.json({ 
      message: 'Prediction stored successfully', 
      id: result.rows[0].id,
      userId: userId 
    });
  } catch (error) {
    console.error('Store prediction error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Server error', 
      details: error.message 
    });
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

// Get user profile endpoint
app.get('/api/user/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const userResult = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [decoded.userId]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = userResult.rows[0];
    
    // Get prediction statistics
    const statsResult = await pool.query(
      'SELECT COUNT(*) as total_predictions, AVG(predicted_consumption) as avg_consumption, MAX(created_at) as last_prediction FROM predictions WHERE user_id = $1',
      [decoded.userId]
    );
    
    const stats = statsResult.rows[0];
    
    // Get most used model
    const modelResult = await pool.query(
      'SELECT model_used, COUNT(*) as count FROM predictions WHERE user_id = $1 GROUP BY model_used ORDER BY count DESC LIMIT 1',
      [decoded.userId]
    );
    
    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      joinDate: user.created_at,
      totalPredictions: parseInt(stats.total_predictions) || 0,
      averageConsumption: parseFloat(stats.avg_consumption) || 0,
      favoriteModel: modelResult.rows[0]?.model_used || 'N/A',
      lastPrediction: stats.last_prediction || null
    };
    
    res.json(profile);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get prediction history endpoint
app.get('/api/predictions/history', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured in environment variables');
      return res.status(500).json({ error: 'Server configuration error: JWT_SECRET missing' });
    }
    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError.message);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    
    // Check database connection
    let result;
    try {
      console.log(`Fetching predictions for user_id: ${decoded.userId}`);
      result = await pool.query(
        'SELECT id, temperature, household_size, season, date, devices, predicted_consumption, model_used, confidence, created_at FROM predictions WHERE user_id = $1 ORDER BY created_at DESC',
        [decoded.userId]
      );
      console.log(`Found ${result.rows.length} predictions for user ${decoded.userId}`);
    } catch (dbError) {
      console.error('Database query error:', dbError.message);
      console.error('Database error details:', dbError);
      return res.status(500).json({ error: 'Database error', details: dbError.message });
    }
    
    const predictions = result.rows.map(row => {
      // Handle devices field - it might be JSONB (object) or need parsing
      let devices = row.devices;
      if (typeof devices === 'string') {
        try {
          devices = JSON.parse(devices);
        } catch (e) {
          console.warn('Failed to parse devices JSON:', e);
          devices = [];
        }
      }
      if (!devices) {
        devices = [];
      }
      
      return {
        id: row.id,
        temperature: row.temperature,
        householdSize: row.household_size,
        season: row.season,
        date: row.date ? (typeof row.date === 'string' ? row.date : new Date(row.date).toISOString().split('T')[0]) : null,
        devices: devices,
        predictedConsumption: row.predicted_consumption,
        modelUsed: row.model_used,
        confidence: row.confidence,
        createdAt: row.created_at ? (typeof row.created_at === 'string' ? row.created_at : new Date(row.created_at).toISOString()) : null
      };
    });
    
    console.log(`Returning ${predictions.length} predictions`);
    res.json({ predictions });
  } catch (error) {
    console.error('Prediction history error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Weather endpoints
app.get('/api/weather/current', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const weather = await weatherService.getCurrentWeather(lat, lon);
    res.json(weather);
  } catch (error) {
    res.status(500).json({ error: 'Weather service error' });
  }
});

app.get('/api/weather/forecast', async (req, res) => {
  try {
    const { lat, lon, days = 5 } = req.query;
    const forecast = await weatherService.getForecast(lat, lon, days);
    res.json(forecast);
  } catch (error) {
    res.status(500).json({ error: 'Weather service error' });
  }
});

// Analytics endpoints
app.get('/api/analytics/insights', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const predictions = await pool.query(
      'SELECT * FROM predictions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10',
      [decoded.userId]
    );
    
    const weather = await weatherService.getCurrentWeather();
    const insights = analyticsService.generateInsights(predictions.rows, weather);
    const recommendations = analyticsService.generateRecommendations(predictions.rows, weather);
    
    res.json({ insights, recommendations });
  } catch (error) {
    res.status(500).json({ error: 'Analytics error' });
  }
});

app.get('/api/analytics/efficiency', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const predictions = await pool.query(
      'SELECT * FROM predictions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 30',
      [decoded.userId]
    );
    
    const efficiency = analyticsService.calculateEfficiencyScore(predictions.rows);
    const anomalies = analyticsService.detectAnomalies(predictions.rows);
    
    res.json({ efficiency, anomalies: anomalies.length });
  } catch (error) {
    res.status(500).json({ error: 'Analytics error' });
  }
});

// Export endpoints
app.get('/api/export/csv', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const predictions = await pool.query(
      'SELECT * FROM predictions WHERE user_id = $1 ORDER BY created_at DESC',
      [decoded.userId]
    );
    
    const csv = predictions.rows.map(row => 
      `${row.date},${row.temperature},${row.predicted_consumption},${row.model_used},${row.confidence}`
    ).join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=energy_predictions.csv');
    res.send('Date,Temperature,Consumption,Model,Confidence\n' + csv);
  } catch (error) {
    res.status(500).json({ error: 'Export error' });
  }
});

// Real-time monitoring
io.on('connection', (socket) => {
  console.log('Client connected for real-time monitoring');
  
  socket.on('subscribe_monitoring', (userId) => {
    socket.join(`user_${userId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Enhanced store prediction with real-time updates
const originalStorePrediction = app._router.stack.find(layer => 
  layer.route && layer.route.path === '/api/store-prediction'
);

server.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
  console.log(`✅ Health check: http://localhost:${port}/api/health`);
  console.log('✅ Real-time monitoring enabled');
  console.log('✅ CORS enabled for:', ['http://localhost:5173', 'http://127.0.0.1:5173']);
});