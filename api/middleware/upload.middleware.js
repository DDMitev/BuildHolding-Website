const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create upload directory if it doesn't exist
const uploadDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create subfolder based on file type
    let folder = 'images';
    
    if (file.mimetype.startsWith('video/')) {
      folder = 'videos';
    } else if (!file.mimetype.startsWith('image/')) {
      folder = 'documents';
    }
    
    const destinationPath = path.join(uploadDir, folder);
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }
    
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, uniquePrefix + extension);
  }
});

// Filter file types
const fileFilter = (req, file, cb) => {
  // Accept images, videos, and documents
  if (
    file.mimetype.startsWith('image/') ||
    file.mimetype.startsWith('video/') ||
    file.mimetype === 'application/pdf' ||
    file.mimetype.includes('spreadsheet') ||
    file.mimetype.includes('document') ||
    file.mimetype.includes('presentation')
  ) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Only images, videos, and common document formats are allowed.'), false);
  }
};

// Create upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit
  }
});

// Export middleware options for different upload types
module.exports = {
  // For single file uploads
  singleUpload: (fieldName = 'file') => upload.single(fieldName),
  
  // For multiple files with the same field name (max 5)
  multipleUpload: (fieldName = 'files', maxCount = 5) => upload.array(fieldName, maxCount),
  
  // For multiple files with different field names
  fieldsUpload: (fields) => upload.fields(fields),
  
  // Error handler for multer
  uploadErrorHandler: (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred during upload
      return res.status(400).json({
        error: 'Upload Error',
        message: err.message
      });
    } else if (err) {
      // Other errors
      return res.status(500).json({
        error: 'Server Error',
        message: err.message
      });
    }
    next();
  }
};
