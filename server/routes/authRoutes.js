const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

router.post('/login', asyncHandler(login));
router.get('/me', protect, asyncHandler(getMe));

module.exports = router;
