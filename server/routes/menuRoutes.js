const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  toggleAvailability,
  deleteMenuItem,
} = require('../controllers/menuController');
const { protect } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

// Public reads for the customer-facing menu
router.get('/', asyncHandler(getMenuItems));
router.get('/:id', asyncHandler(getMenuItem));

// Admin-only writes
router.post('/', protect, asyncHandler(createMenuItem));
router.put('/:id', protect, asyncHandler(updateMenuItem));
router.patch('/:id/availability', protect, asyncHandler(toggleAvailability));
router.delete('/:id', protect, asyncHandler(deleteMenuItem));

module.exports = router;
