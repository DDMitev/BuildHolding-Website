/**
 * Railway Setup Script
 * 
 * This script runs during deployment to set up initial data,
 * including the admin user.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function setupDatabase() {
  try {
    console.log('Starting setup process...');
    
    // Connect to MongoDB - use the MongoDB connection string from Railway
    // The MONGODB_URI environment variable should be set in Railway dashboard
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      console.error('ERROR: MONGODB_URI environment variable is not set');
      console.error('Please set the MONGODB_URI in your Railway project variables');
      process.exit(1);
    }
    
    console.log(`Connecting to MongoDB at: ${MONGODB_URI.includes('@') ? MONGODB_URI.split('@')[1] : 'MongoDB Atlas'}...`);
    
    // Connect with options specifically for Railway
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    
    console.log('Connected to MongoDB successfully');
    
    // Check if we need to create users collection
    const collections = await mongoose.connection.db.listCollections().toArray();
    const hasUsers = collections.some(collection => collection.name === 'users');
    
    if (!hasUsers) {
      console.log('Creating users collection...');
      await mongoose.connection.db.createCollection('users');
    }
    
    // Access users collection directly
    const db = mongoose.connection.db;
    const users = db.collection('users');
    
    // Create hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // Check if admin exists
    const existingAdmin = await users.findOne({ email: 'admin@buildholding.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists. Updating password...');
      
      // Update admin
      await users.updateOne(
        { email: 'admin@buildholding.com' },
        { 
          $set: { 
            password: hashedPassword,
            lastLogin: new Date(),
            updatedAt: new Date()
          } 
        }
      );
      
      console.log('Admin password updated successfully');
    } else {
      console.log('Creating new admin user...');
      
      // Create admin user
      await users.insertOne({
        email: 'admin@buildholding.com',
        password: hashedPassword,
        displayName: 'Administrator',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('Admin user created successfully');
    }
    
    console.log('Setup completed successfully!');
    
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    
  } catch (error) {
    console.error('Setup error:', error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

// Run the setup function
setupDatabase();
