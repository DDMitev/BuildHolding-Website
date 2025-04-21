const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partner.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Public routes
router.get('/', partnerController.getPartners);
router.get('/featured', partnerController.getFeaturedPartners);
router.get('/:id', partnerController.getPartner);

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), partnerController.createPartner);
router.put('/:id', protect, authorize('admin'), partnerController.updatePartner);
router.delete('/:id', protect, authorize('admin'), partnerController.deletePartner);
router.patch('/:id/featured', protect, authorize('admin'), partnerController.toggleFeatured);

module.exports = router;
