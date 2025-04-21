const Partner = require('../models/partner.model');

// @desc    Get all partners
// @route   GET /api/partners
// @access  Public
exports.getPartners = async (req, res) => {
  try {
    // Parse query parameters
    const { featured, category, limit = 10, page = 1 } = req.query;
    
    // Build query
    const query = {};
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    if (category) {
      query.category = category;
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const partners = await Partner.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Partner.countDocuments(query);
    
    // Send response
    res.status(200).json({
      success: true,
      count: partners.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: partners
    });
  } catch (error) {
    // Even on error, return a valid response with empty data to prevent frontend issues
    res.status(200).json({
      success: false,
      count: 0,
      data: [],
      error: error.message
    });
  }
};

// @desc    Get featured partners
// @route   GET /api/partners/featured
// @access  Public
exports.getFeaturedPartners = async (req, res) => {
  try {
    // Get limit from query params or default to 5
    const { limit = 5 } = req.query;
    
    // Get featured partners
    const partners = await Partner.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    // Send response
    res.status(200).json({
      success: true,
      count: partners.length,
      data: partners
    });
  } catch (error) {
    // Return empty array on error for frontend stability
    res.status(200).json({
      success: false,
      count: 0,
      data: [],
      error: error.message
    });
  }
};

// @desc    Get a single partner
// @route   GET /api/partners/:id
// @access  Public
exports.getPartner = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    
    if (!partner) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Partner not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: partner
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server Error',
      message: error.message
    });
  }
};

// @desc    Create a new partner
// @route   POST /api/partners
// @access  Private (Admin only)
exports.createPartner = async (req, res) => {
  try {
    // Create the partner
    const partner = await Partner.create(req.body);
    
    res.status(201).json({
      success: true,
      data: partner
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Validation error
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        error: 'Validation Error',
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      error: 'Server Error',
      message: error.message
    });
  }
};

// @desc    Update a partner
// @route   PUT /api/partners/:id
// @access  Private (Admin only)
exports.updatePartner = async (req, res) => {
  try {
    // Find and update partner
    const partner = await Partner.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!partner) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Partner not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: partner
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Validation error
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        error: 'Validation Error',
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      error: 'Server Error',
      message: error.message
    });
  }
};

// @desc    Delete a partner
// @route   DELETE /api/partners/:id
// @access  Private (Admin only)
exports.deletePartner = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    
    if (!partner) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Partner not found'
      });
    }
    
    await partner.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server Error',
      message: error.message
    });
  }
};

// @desc    Toggle partner featured status
// @route   PATCH /api/partners/:id/featured
// @access  Private (Admin only)
exports.toggleFeatured = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    
    if (!partner) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Partner not found'
      });
    }
    
    // Toggle featured status
    partner.featured = !partner.featured;
    await partner.save();
    
    res.status(200).json({
      success: true,
      data: partner
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server Error',
      message: error.message
    });
  }
};
