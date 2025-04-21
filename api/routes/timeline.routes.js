const express = require('express');
const router = express.Router();
const timelineController = require('../controllers/timeline.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Public routes
router.get('/', timelineController.getTimelineEvents);
router.get('/featured', timelineController.getFeaturedEvents);
router.get('/decade/:decade', timelineController.getEventsByDecade);
router.get('/:id', timelineController.getTimelineEvent);

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), timelineController.createEvent);
router.put('/:id', protect, authorize('admin'), timelineController.updateEvent);
router.delete('/:id', protect, authorize('admin'), timelineController.deleteEvent);
router.patch('/:id/featured', protect, authorize('admin'), timelineController.toggleFeatured);

module.exports = router;
