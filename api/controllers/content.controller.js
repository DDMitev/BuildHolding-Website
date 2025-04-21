const PageContent = require('../models/content.model');

// @desc    Get all page content
// @route   GET /api/content
// @access  Public
exports.getAllContent = async (req, res) => {
  try {
    // Parse query parameters
    const { section, page, locale } = req.query;
    
    // Build query
    const query = {};
    
    if (section) {
      query.section = section;
    }
    
    if (page) {
      query.page = page;
    }
    
    // Execute query
    const contents = await PageContent.find(query);
    
    // Filter by locale if specified
    let contentData = contents;
    if (locale && ['en', 'bg', 'ru'].includes(locale)) {
      contentData = contents.map(content => {
        // For each content item, pick only the specified locale content
        const filtered = { ...content._doc };
        
        // Filter text content by locale
        if (filtered.text) {
          filtered.text = { [locale]: content.text[locale] || content.text.en };
        }
        
        return filtered;
      });
    }
    
    // Send response with fallback to empty data for frontend stability
    res.status(200).json({
      success: true,
      count: contentData.length,
      data: contentData.length > 0 ? contentData : []
    });
  } catch (error) {
    // Even on error, return a valid response with empty data
    res.status(200).json({
      success: false,
      count: 0,
      data: [],
      error: error.message
    });
  }
};

// @desc    Get content by page
// @route   GET /api/content/page/:page
// @access  Public
exports.getContentByPage = async (req, res) => {
  try {
    const { page } = req.params;
    const { locale = 'en' } = req.query;
    
    // Find content for the specified page
    const contents = await PageContent.find({ page });
    
    // Filter by locale if specified
    let contentData = contents;
    if (['en', 'bg', 'ru'].includes(locale)) {
      contentData = contents.map(content => {
        // For each content item, pick only the specified locale content
        const filtered = { ...content._doc };
        
        // Filter text content by locale
        if (filtered.text) {
          filtered.text = { [locale]: content.text[locale] || content.text.en };
        }
        
        return filtered;
      });
    }
    
    // Group content by section
    const groupedContent = contentData.reduce((acc, item) => {
      if (!acc[item.section]) {
        acc[item.section] = [];
      }
      acc[item.section].push(item);
      return acc;
    }, {});
    
    // Send response, ensuring we always return something valid for the client
    res.status(200).json({
      success: true,
      page,
      locale,
      data: Object.keys(groupedContent).length > 0 ? groupedContent : {}
    });
  } catch (error) {
    // Return empty data with success: false on error
    res.status(200).json({
      success: false,
      page: req.params.page,
      locale: req.query.locale || 'en',
      data: {},
      error: error.message
    });
  }
};

// @desc    Get content by section
// @route   GET /api/content/section/:section
// @access  Public
exports.getContentBySection = async (req, res) => {
  try {
    const { section } = req.params;
    const { locale = 'en' } = req.query;
    
    // Find content for the specified section
    const contents = await PageContent.find({ section });
    
    // Filter by locale if specified
    let contentData = contents;
    if (['en', 'bg', 'ru'].includes(locale)) {
      contentData = contents.map(content => {
        // For each content item, pick only the specified locale content
        const filtered = { ...content._doc };
        
        // Filter text content by locale
        if (filtered.text) {
          filtered.text = { [locale]: content.text[locale] || content.text.en };
        }
        
        return filtered;
      });
    }
    
    // Send response
    res.status(200).json({
      success: true,
      section,
      locale,
      count: contentData.length,
      data: contentData
    });
  } catch (error) {
    // Return empty array with success: false on error
    res.status(200).json({
      success: false,
      section: req.params.section,
      locale: req.query.locale || 'en',
      count: 0,
      data: [],
      error: error.message
    });
  }
};

// @desc    Get a single content item
// @route   GET /api/content/:id
// @access  Public
exports.getContentItem = async (req, res) => {
  try {
    const content = await PageContent.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Content item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server Error',
      message: error.message
    });
  }
};

// @desc    Create a new content item
// @route   POST /api/content
// @access  Private (Admin only)
exports.createContent = async (req, res) => {
  try {
    // Validate required fields
    const { page, section, key } = req.body;
    
    if (!page || !section || !key) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Page, section and key are required fields'
      });
    }
    
    // Check if content with same key already exists
    const exists = await PageContent.findOne({ page, section, key });
    
    if (exists) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Content with this key already exists for this page and section'
      });
    }
    
    // Create the content item
    const content = await PageContent.create(req.body);
    
    res.status(201).json({
      success: true,
      data: content
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

// @desc    Update a content item
// @route   PUT /api/content/:id
// @access  Private (Admin only)
exports.updateContent = async (req, res) => {
  try {
    // Find and update content
    const content = await PageContent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!content) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Content item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: content
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

// @desc    Delete a content item
// @route   DELETE /api/content/:id
// @access  Private (Admin only)
exports.deleteContent = async (req, res) => {
  try {
    const content = await PageContent.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Content item not found'
      });
    }
    
    await content.deleteOne();
    
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

// @desc    Update content text translations
// @route   PATCH /api/content/:id/text
// @access  Private (Admin only)
exports.updateContentText = async (req, res) => {
  try {
    const { text } = req.body;
    
    // Validate text object
    if (!text || typeof text !== 'object') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Text must be an object with locale keys'
      });
    }
    
    // Find content
    const content = await PageContent.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Content item not found'
      });
    }
    
    // Update text for each locale
    content.text = {
      ...content.text,
      ...text
    };
    
    // Save changes
    await content.save();
    
    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server Error',
      message: error.message
    });
  }
};
