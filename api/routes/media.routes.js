const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/media.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { singleUpload, uploadErrorHandler } = require('../middleware/upload.middleware');

// All routes are protected for admin only
router.use(protect);
router.use(authorize('admin'));

// Upload routes with error handling
router.post(
  '/upload', 
  singleUpload('file'), 
  uploadErrorHandler, 
  mediaController.uploadMedia
);

// Media management routes
router.get('/', mediaController.getMediaFiles);
router.get('/type/:type', mediaController.getMediaByType);
router.get('/:id', mediaController.getMediaFile);
router.put('/:id', mediaController.updateMedia);
router.delete('/:id', mediaController.deleteMedia);

module.exports = router;
