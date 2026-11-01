const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

// Public read (menu page needs categories), writes protected
router.get('/', asyncHandler(getCategories));
router.post('/', protect, asyncHandler(createCategory));
router.put('/:id', protect, asyncHandler(updateCategory));
router.delete('/:id', protect, asyncHandler(deleteCategory));

module.exports = router;
