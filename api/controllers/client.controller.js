const Client = require('../models/client.model');

// @desc    Get all clients
// @route   GET /api/clients
// @access  Public
exports.getClients = async (req, res) => {
  try {
    // Parse query parameters
    const { featured, industry, limit = 10, page = 1 } = req.query;
    
    // Build query
    const query = {};
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    if (industry) {
      query.industry = industry;
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const clients = await Client.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Client.countDocuments(query);
    
    // Send response
    res.status(200).json({
      success: true,
      count: clients.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: clients
    });
  } catch (error) {
    // Return a valid response with empty data on error to prevent frontend issues
    res.status(200).json({
      success: false,
      count: 0,
      data: [],
      error: error.message
    });
  }
};

// @desc    Get featured clients
// @route   GET /api/clients/featured
// @access  Public
exports.getFeaturedClients = async (req, res) => {
  try {
    // Get limit from query params or default to 5
    const { limit = 5 } = req.query;
    
    // Get featured clients
    const clients = await Client.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    // Send response
    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients
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

// @desc    Get clients with testimonials
// @route   GET /api/clients/testimonials
// @access  Public
exports.getClientTestimonials = async (req, res) => {
  try {
    // Get limit from query params or default to 5
    const { limit = 5 } = req.query;
    
    // Get clients with testimonials
    const clients = await Client.find({ 
      'testimonial.text.en': { $exists: true, $ne: '' } 
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    // Send response
    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients
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

// @desc    Get a single client
// @route   GET /api/clients/:id
// @access  Public
exports.getClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Client not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server Error',
      message: error.message
    });
  }
};

// @desc    Create a new client
// @route   POST /api/clients
// @access  Private (Admin only)
exports.createClient = async (req, res) => {
  try {
    // Create the client
    const client = await Client.create(req.body);
    
    res.status(201).json({
      success: true,
      data: client
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

// @desc    Update a client
// @route   PUT /api/clients/:id
// @access  Private (Admin only)
exports.updateClient = async (req, res) => {
  try {
    // Find and update client
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!client) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Client not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: client
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

// @desc    Delete a client
// @route   DELETE /api/clients/:id
// @access  Private (Admin only)
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Client not found'
      });
    }
    
    await client.deleteOne();
    
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

// @desc    Toggle client featured status
// @route   PATCH /api/clients/:id/featured
// @access  Private (Admin only)
exports.toggleFeatured = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Client not found'
      });
    }
    
    // Toggle featured status
    client.featured = !client.featured;
    await client.save();
    
    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server Error',
      message: error.message
    });
  }
};

// @desc    Update client testimonial
// @route   PATCH /api/clients/:id/testimonial
// @access  Private (Admin only)
exports.updateTestimonial = async (req, res) => {
  try {
    const { testimonial } = req.body;
    
    // Find client
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Client not found'
      });
    }
    
    // Update testimonial
    client.testimonial = testimonial;
    await client.save();
    
    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server Error',
      message: error.message
    });
  }
};
