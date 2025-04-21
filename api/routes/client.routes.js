const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Public routes
router.get('/', clientController.getClients);
router.get('/featured', clientController.getFeaturedClients);
router.get('/testimonials', clientController.getClientTestimonials);
router.get('/:id', clientController.getClient);

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), clientController.createClient);
router.put('/:id', protect, authorize('admin'), clientController.updateClient);
router.delete('/:id', protect, authorize('admin'), clientController.deleteClient);
router.patch('/:id/featured', protect, authorize('admin'), clientController.toggleFeatured);
router.patch('/:id/testimonial', protect, authorize('admin'), clientController.updateTestimonial);

module.exports = router;
