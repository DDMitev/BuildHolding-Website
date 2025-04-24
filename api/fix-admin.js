const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Simple script to properly create an admin user
// Run with: node fix-admin.js

async function fixAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/buildholding');
    console.log('Connected to MongoDB');

    // Access users collection directly
    const db = mongoose.connection.db;
    const users = db.collection('users');
    
    // Create hashed password using the correct bcryptjs version
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // First try to find and update existing admin
    const existingAdmin = await users.findOne({ email: 'admin@buildholding.com' });
    
    if (existingAdmin) {
      console.log('Found existing admin, updating password...');
      await users.updateOne(
        { email: 'admin@buildholding.com' },
        { $set: { password: hashedPassword } }
      );
      console.log('Admin password updated');
    } else {
      console.log('Creating new admin user...');
      await users.insertOne({
        email: 'admin@buildholding.com',
        password: hashedPassword,
        displayName: 'Admin',
        role: 'admin',
        createdAt: new Date()
      });
      console.log('New admin user created');
    }
    
    console.log('Success! Use these credentials:');
    console.log('Email: admin@buildholding.com');
    console.log('Password: admin123');
    
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error:', error);
  }
}

fixAdmin();
