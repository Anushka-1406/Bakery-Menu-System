const express = require('express');
const router = express.Router();
const {
  getRestaurant,
  updateRestaurant,
  getDashboardStats,
  getQrCode,
} = require('../controllers/restaurantController');
const { protect } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

router.get('/:id', asyncHandler(getRestaurant));
router.put('/:id', protect, asyncHandler(updateRestaurant));
router.get('/:id/dashboard', protect, asyncHandler(getDashboardStats));
router.get('/:id/qr', protect, asyncHandler(getQrCode));

module.exports = router;
