/**
 * Force Create Admin User
 * 
 * This script directly creates an admin user in the database
 * with bcrypt-hashed password, bypassing any model validation issues.
 * 
 * Run with: node scripts/force-create-admin.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB without using the User model to avoid schema issues
async function createAdmin() {
  try {
    console.log('Starting force admin creation process...');
    
    // Set JWT secret as fallback
    if (!process.env.JWT_SECRET) {
      process.env.JWT_SECRET = 'buildholding-jwt-secret-key-default';
      console.log('WARNING: Using default JWT_SECRET');
    }
    
    // Connect to MongoDB directly
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/buildholding';
    console.log(`Connecting to MongoDB at: ${MONGO_URI}`);
    
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB successfully.');
    
    // Generate password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // Reference the User collection directly
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Check if admin exists
    const existingAdmin = await usersCollection.findOne({ email: 'admin@buildholding.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists. Updating password...');
      
      // Update admin
      await usersCollection.updateOne(
        { email: 'admin@buildholding.com' },
        { 
          $set: { 
            password: hashedPassword,
            lastLogin: new Date(),
            updatedAt: new Date()
          } 
        }
      );
      
      console.log('Admin password updated successfully!');
    } else {
      console.log('Creating new admin user...');
      
      // Create admin user
      await usersCollection.insertOne({
        email: 'admin@buildholding.com',
        password: hashedPassword,
        displayName: 'Administrator',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('Admin user created successfully!');
    }
    
    console.log('\n======= LOGIN CREDENTIALS =======');
    console.log('Email: admin@buildholding.com');
    console.log('Password: admin123');
    console.log('=================================\n');
    
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
    
    console.log('IMPORTANT: Start your backend server with: npm start');
    console.log('Then try logging in with the credentials above.');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    // Ensure connection is closed even if there's an error
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed.');
    }
    process.exit();
  }
}

// Run the function
createAdmin();
