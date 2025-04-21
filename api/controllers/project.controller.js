const Project = require('../models/project.model');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res) => {
  try {
    // Parse query parameters
    const { category, status, featured, limit = 10, page = 1 } = req.query;
    
    // Build query
    const query = {};
    
    if (category) {
      query['category.en'] = category;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Project.countDocuments(query);
    
    // Send response
    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server Error',
      message: error.message
    });
  }
};

// @desc    Get featured projects
// @route   GET /api/projects/featured
// @access  Public
exports.getFeaturedProjects = async (req, res) => {
  try {
    // Get limit from query params or default to 5
    const { limit = 5 } = req.query;
    
    // Get featured projects
    const projects = await Project.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    // Send response with fallback to ensure client always gets data
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects.length > 0 ? projects : [] // Ensure we always return an array
    });
  } catch (error) {
    // Even on server error, return an empty array to prevent frontend issues
    res.status(200).json({
      success: false,
      count: 0,
      data: [],
      error: error.message
    });
  }
};

// @desc    Get a single project
// @route   GET /api/projects/:id
// @access  Public
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Project not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server Error',
      message: error.message
    });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Admin only)
exports.createProject = async (req, res) => {
  try {
    // Create the project
    const project = await Project.create(req.body);
    
    res.status(201).json({
      success: true,
      data: project
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

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (Admin only)
exports.updateProject = async (req, res) => {
  try {
    // Find and update project
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Project not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: project
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

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (Admin only)
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Project not found'
      });
    }
    
    await project.deleteOne();
    
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

// @desc    Update project status
// @route   PATCH /api/projects/:id/status
// @access  Private (Admin only)
exports.updateProjectStatus = async (req, res) => {
  try {
    const { status, completionPercentage } = req.body;
    
    // Validate status
    if (!['planned', 'in-progress', 'complete'].includes(status)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid status value'
      });
    }
    
    // Find and update project status
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(completionPercentage !== undefined && { completionPercentage })
      },
      { new: true }
    );
    
    if (!project) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Project not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server Error',
      message: error.message
    });
  }
};

// @desc    Toggle project featured status
// @route   PATCH /api/projects/:id/featured
// @access  Private (Admin only)
exports.toggleFeatured = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Project not found'
      });
    }
    
    // Toggle featured status
    project.featured = !project.featured;
    await project.save();
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server Error',
      message: error.message
    });
  }
};
