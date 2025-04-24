const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const User = require('../models/user.model');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Debug route - Only for development
router.get('/check-admin', async (req, res) => {
  try {
    const admin = await User.findOne({ email: 'admin@buildholding.com' });
    
    if (admin) {
      res.status(200).json({
        success: true,
        message: 'Admin user exists',
        email: admin.email,
        displayName: admin.displayName,
        role: admin.role,
        createdAt: admin.createdAt
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Admin user does not exist'
      });
    }
  } catch (error) {
    console.error('Error checking admin:', error);
    res.status(500).json({
      success: false,
      message: 'Server error checking admin',
      error: error.message
    });
  }
});

// Protected routes
router.get('/me', protect, authController.getProfile);
router.put('/me', protect, authController.updateProfile);
router.put('/change-password', protect, authController.changePassword);

module.exports = router;
