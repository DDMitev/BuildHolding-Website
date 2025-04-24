const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const User = require('./models/user.model');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Set a default JWT_SECRET if not provided in environment
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'buildholding-jwt-secret-key-default';
  console.log('WARNING: Using default JWT_SECRET. Set JWT_SECRET in .env for production.');
}

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('dev')); // HTTP request logger
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/buildholding';

console.log('Attempting to connect to MongoDB at:', MONGO_URI);

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log('Connected to MongoDB successfully');
    
    // Create admin user
    try {
      // Explicitly check for admin user
      console.log('Checking for admin user...');
      let adminUser = await User.findOne({ email: 'admin@buildholding.com' });
      
      if (adminUser) {
        console.log('Admin user found:', adminUser.email);
      } else {
        console.log('No admin user found. Creating one...');
        
        // Create a new admin with explicitly hashed password for more reliability
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        
        adminUser = new User({
          email: 'admin@buildholding.com',
          password: hashedPassword,
          displayName: 'Admin',
          role: 'admin'
        });
        
        // Save admin user with error handling
        try {
          await adminUser.save();
          console.log('Admin user created successfully:');
          console.log('Email: admin@buildholding.com');
          console.log('Password: admin123');
        } catch (saveError) {
          console.error('Failed to save admin user:', saveError.message);
          // Try an alternative approach if saving fails
          try {
            await User.create({
              email: 'admin@buildholding.com',
              password: 'admin123', // Will be hashed by the schema
              displayName: 'Admin',
              role: 'admin'
            });
            console.log('Admin user created with alternative method');
          } catch (altError) {
            console.error('Alternative admin creation also failed:', altError.message);
          }
        }
      }
    } catch (error) {
      console.error('Error handling admin user:', error.message);
    }
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    console.error('Please check your MongoDB connection and try again.');
    // Continue running the app even if DB connection fails
  });

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/projects', require('./routes/project.routes'));
app.use('/api/partners', require('./routes/partner.routes'));
app.use('/api/clients', require('./routes/client.routes'));
app.use('/api/timeline', require('./routes/timeline.routes'));
app.use('/api/certifications', require('./routes/certification.routes'));
app.use('/api/content', require('./routes/content.routes'));
app.use('/api/media', require('./routes/media.routes'));

// Add healthcheck route
app.get('/api/healthcheck', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API is running',
    time: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Debug route to create admin
app.post('/api/create-admin', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // Try to find existing admin
    const existingAdmin = await User.findOne({ email: 'admin@buildholding.com' });
    
    if (existingAdmin) {
      // Update admin password
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      
      res.status(200).json({
        success: true,
        message: 'Admin user updated successfully',
        email: 'admin@buildholding.com',
      });
    } else {
      // Create new admin
      const newAdmin = new User({
        email: 'admin@buildholding.com',
        password: hashedPassword,
        displayName: 'Admin',
        role: 'admin'
      });
      
      await newAdmin.save();
      
      res.status(201).json({
        success: true,
        message: 'Admin user created successfully',
        email: 'admin@buildholding.com',
      });
    }
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating admin user',
      error: error.message
    });
  }
});

// Base route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to BuildHolding API',
    documentation: '/api/docs',
    version: '1.0.0',
    healthcheck: '/api/healthcheck'
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found` 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    error: err.name || 'Server Error',
    message: err.message || 'Something went wrong on the server'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`Default login: admin@buildholding.com / admin123`);
});
