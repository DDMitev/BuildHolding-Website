const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const User = require('./models/user.model');

// Load environment variables
dotenv.config();

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
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/buildholding', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Ensure default admin exists
    try {
      // First check if the admin user with that email already exists
      const existingAdmin = await User.findOne({ email: 'admin@buildholding.com' });
      
      if (existingAdmin) {
        console.log('Default admin user already exists.');
      } else {
        console.log('Creating default admin user...');
        
        // Create default admin user with explicit password
        const defaultAdmin = new User({
          email: 'admin@buildholding.com',
          password: 'admin123', // Will be hashed by the model's pre-save hook
          displayName: 'Admin',
          role: 'admin'
        });
        
        const savedAdmin = await defaultAdmin.save();
        console.log('Default admin user created successfully!');
        console.log('Email: admin@buildholding.com');
        console.log('Password: admin123');
        console.log('IMPORTANT: Please change this password after first login!');
      }
    } catch (error) {
      console.error('Error creating admin user:', error);
    }
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
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

// Base route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to BuildHolding API',
    documentation: '/api/docs',
    version: '1.0.0'
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
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
