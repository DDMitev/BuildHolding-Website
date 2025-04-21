const Timeline = require('../models/timeline.model');

// @desc    Get all timeline events
// @route   GET /api/timeline
// @access  Public
exports.getTimelineEvents = async (req, res) => {
  try {
    // Parse query parameters
    const { featured, limit = 20, page = 1 } = req.query;
    
    // Build query
    const query = {};
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const events = await Timeline.find(query)
      .sort({ year: 1 }) // Sort chronologically
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Timeline.countDocuments(query);
    
    // Send response
    res.status(200).json({
      success: true,
      count: events.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: events
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

// @desc    Get featured timeline events
// @route   GET /api/timeline/featured
// @access  Public
exports.getFeaturedEvents = async (req, res) => {
  try {
    // Get featured events
    const events = await Timeline.find({ featured: true })
      .sort({ year: 1 });
    
    // Send response
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
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

// @desc    Get timeline events by decade
// @route   GET /api/timeline/decade/:decade
// @access  Public
exports.getEventsByDecade = async (req, res) => {
  try {
    const decade = parseInt(req.params.decade);
    
    // Validate decade parameter
    if (isNaN(decade) || decade % 10 !== 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Decade must be a multiple of 10'
      });
    }
    
    // Calculate year range for the decade
    const startYear = decade;
    const endYear = decade + 9;
    
    // Find events in decade range
    const events = await Timeline.find({
      year: { $gte: startYear, $lte: endYear }
    }).sort({ year: 1 });
    
    res.status(200).json({
      success: true,
      count: events.length,
      decade,
      startYear,
      endYear,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server Error',
      message: error.message
    });
  }
};

// @desc    Get a single timeline event
// @route   GET /api/timeline/:id
// @access  Public
exports.getTimelineEvent = async (req, res) => {
  try {
    const event = await Timeline.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Timeline event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server Error',
      message: error.message
    });
  }
};

// @desc    Create a new timeline event
// @route   POST /api/timeline
// @access  Private (Admin only)
exports.createEvent = async (req, res) => {
  try {
    // Create the event
    const event = await Timeline.create(req.body);
    
    res.status(201).json({
      success: true,
      data: event
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

// @desc    Update a timeline event
// @route   PUT /api/timeline/:id
// @access  Private (Admin only)
exports.updateEvent = async (req, res) => {
  try {
    // Find and update event
    const event = await Timeline.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!event) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Timeline event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: event
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

// @desc    Delete a timeline event
// @route   DELETE /api/timeline/:id
// @access  Private (Admin only)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Timeline.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Timeline event not found'
      });
    }
    
    await event.deleteOne();
    
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

// @desc    Toggle timeline event featured status
// @route   PATCH /api/timeline/:id/featured
// @access  Private (Admin only)
exports.toggleFeatured = async (req, res) => {
  try {
    const event = await Timeline.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Timeline event not found'
      });
    }
    
    // Toggle featured status
    event.featured = !event.featured;
    await event.save();
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server Error',
      message: error.message
    });
  }
};
