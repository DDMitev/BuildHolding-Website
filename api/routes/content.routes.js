const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Public routes
router.get('/', contentController.getAllContent);
router.get('/page/:page', contentController.getContentByPage);
router.get('/section/:section', contentController.getContentBySection);
router.get('/:id', contentController.getContentItem);

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), contentController.createContent);
router.put('/:id', protect, authorize('admin'), contentController.updateContent);
router.delete('/:id', protect, authorize('admin'), contentController.deleteContent);
router.patch('/:id/text', protect, authorize('admin'), contentController.updateContentText);

module.exports = router;
