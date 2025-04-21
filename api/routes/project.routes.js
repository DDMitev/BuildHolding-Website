const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { singleUpload, uploadErrorHandler } = require('../middleware/upload.middleware');

// Public routes
router.get('/', projectController.getProjects);
router.get('/featured', projectController.getFeaturedProjects);
router.get('/:id', projectController.getProject);

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), projectController.createProject);
router.put('/:id', protect, authorize('admin'), projectController.updateProject);
router.delete('/:id', protect, authorize('admin'), projectController.deleteProject);
router.patch('/:id/status', protect, authorize('admin'), projectController.updateProjectStatus);
router.patch('/:id/featured', protect, authorize('admin'), projectController.toggleFeatured);

module.exports = router;
