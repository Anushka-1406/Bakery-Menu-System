const express = require('express');
const router = express.Router();
const {
  getQuestions,
  askQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/chatbotController');
const { protect } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

// Public: fetch predefined questions + ask
router.get('/questions', asyncHandler(getQuestions));
router.post('/questions/ask', asyncHandler(askQuestion));

// Admin-only writes
router.post('/questions', protect, asyncHandler(createQuestion));
router.put('/questions/:id', protect, asyncHandler(updateQuestion));
router.delete('/questions/:id', protect, asyncHandler(deleteQuestion));

module.exports = router;
