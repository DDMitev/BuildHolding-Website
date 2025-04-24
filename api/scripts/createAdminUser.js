const mongoose = require('mongoose');
const User = require('../models/user.model');
require('dotenv').config();

/**
 * Script to force create an admin user
 * Run this with: node scripts/createAdminUser.js
 */
const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/buildholding', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
    
    // Check if admin user exists
    const adminEmail = 'admin@buildholding.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('Admin user already exists. Updating password...');
      
      // Update admin password
      existingAdmin.password = 'admin123';
      await existingAdmin.save();
      console.log('Admin password updated successfully!');
    } else {
      console.log('Creating new admin user...');
      
      // Create new admin user
      const adminUser = new User({
        email: adminEmail,
        password: 'admin123',
        displayName: 'Admin',
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('Admin user created successfully!');
    }
    
    console.log('\nUse these credentials to log in:');
    console.log('Email: admin@buildholding.com');
    console.log('Password: admin123');
    
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
    console.log('Done.');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

// Run the function
createAdminUser();
