const Media = require('../models/media.model');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

// @desc    Upload a media file
// @route   POST /api/media/upload
// @access  Private (Admin only)
exports.uploadMedia = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'No file uploaded'
      });
    }

    // Get file data
    const { filename, path: filePath, mimetype, size } = req.file;
    
    // Get dimensions for images if possible
    let dimensions = null;
    if (mimetype.startsWith('image/')) {
      // In a real implementation, you'd use a library like sharp to get dimensions
      // This is a placeholder
      dimensions = {
        width: 800,
        height: 600
      };
    }
    
    // Create media document in database
    const media = await Media.create({
      name: req.body.name || filename,
      url: `/uploads/${filePath.split('uploads/')[1]}`, // Normalize path for frontend
      type: mimetype.startsWith('image/') ? 'image' : 
            mimetype.startsWith('video/') ? 'video' : 'document',
      size,
      dimensions,
      alt: {
        en: req.body.altEn || filename,
        bg: req.body.altBg || filename,
        ru: req.body.altRu || ''
      },
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
      uploadedBy: req.user._id
    });
    
    res.status(201).json({
      success: true,
      data: media
    });
  } catch (error) {
    // If there's an error, try to delete the uploaded file
    if (req.file) {
      try {
        await unlinkAsync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file after failed upload:', unlinkError);
      }
    }
    
    res.status(500).json({
      error: 'Server Error',
      message: error.message
    });
  }
};

// @desc    Get all media files
// @route   GET /api/media
// @access  Private (Admin only)
exports.getMediaFiles = async (req, res) => {
  try {
    // Parse query parameters
    const { 
      type, 
      search, 
      limit = 20, 
      page = 1 
    } = req.query;
    
    // Build query
    const query = {};
    
    if (type) {
      query.type = type;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const mediaFiles = await Media.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Media.countDocuments(query);
    
    // Send response
    res.status(200).json({
      success: true,
      count: mediaFiles.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: mediaFiles
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server Error',
      message: error.message
    });
  }
};

// @desc    Get a single media file
// @route   GET /api/media/:id
// @access  Private (Admin only)
exports.getMediaFile = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Media file not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: media
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server Error',
      message: error.message
    });
  }
};

// @desc    Update media metadata
// @route   PUT /api/media/:id
// @access  Private (Admin only)
exports.updateMedia = async (req, res) => {
  try {
    const { name, alt, tags, isUsed } = req.body;
    
    // Build update object
    const updateData = {};
    
    if (name) updateData.name = name;
    if (alt) {
      updateData.alt = {
        en: alt.en || '',
        bg: alt.bg || '',
        ru: alt.ru || ''
      };
    }
    if (tags) {
      updateData.tags = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());
    }
    if (isUsed !== undefined) updateData.isUsed = isUsed;
    
    // Find and update media
    const media = await Media.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!media) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Media file not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: media
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server Error',
      message: error.message
    });
  }
};

// @desc    Delete a media file
// @route   DELETE /api/media/:id
// @access  Private (Admin only)
exports.deleteMedia = async (req, res) => {
  try {
    // Find media file
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Media file not found'
      });
    }
    
    // Check if media is in use
    if (media.isUsed) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Cannot delete a media file that is currently in use'
      });
    }
    
    // Construct file path
    const filePath = path.join(process.cwd(), media.url);
    
    // Delete file from disk
    try {
      await unlinkAsync(filePath);
    } catch (unlinkError) {
      console.error('Error deleting file from disk:', unlinkError);
      // Continue even if file deletion fails
    }
    
    // Remove from database
    await media.deleteOne();
    
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

// @desc    Get media by type
// @route   GET /api/media/type/:type
// @access  Private (Admin only)
exports.getMediaByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { limit = 20, page = 1 } = req.query;
    
    // Validate type
    if (!['image', 'video', 'document'].includes(type)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid media type'
      });
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get media files by type
    const mediaFiles = await Media.find({ type })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count
    const total = await Media.countDocuments({ type });
    
    res.status(200).json({
      success: true,
      count: mediaFiles.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: mediaFiles
    });
  } catch (error) {
    // On error, return empty array with success false
    res.status(200).json({
      success: false,
      count: 0,
      total: 0,
      totalPages: 0,
      currentPage: 1,
      data: [],
      error: error.message
    });
  }
};
