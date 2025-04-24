const mongoose = require('mongoose');
const User = require('../models/user.model');
require('dotenv').config();

/**
 * Script to ensure an admin user exists in the database
 * This will create a default admin if no users exist
 */
const ensureAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/buildholding');
    console.log('MongoDB connected');
    
    // Check if any users exist
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      console.log('No users found. Creating default admin user...');
      
      // Create default admin user
      const defaultAdmin = new User({
        email: 'admin@buildholding.com',
        password: 'admin123',
        displayName: 'Admin',
        role: 'admin'
      });
      
      await defaultAdmin.save();
      console.log('Default admin user created successfully!');
      console.log('Email: admin@buildholding.com');
      console.log('Password: admin123');
      console.log('IMPORTANT: Please change this password after first login!');
    } else {
      console.log(`Found ${userCount} existing users. No need to create default admin.`);
    }
    
    mongoose.disconnect();
    console.log('MongoDB disconnected');
    
  } catch (error) {
    console.error('Error ensuring admin user:', error);
    process.exit(1);
  }
};

// Run the function
ensureAdmin();
