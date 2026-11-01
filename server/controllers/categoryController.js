const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');

// GET /api/categories?restaurantId=...
const getCategories = async (req, res) => {
  const filter = {};
  if (req.query.restaurantId) filter.restaurantId = req.query.restaurantId;
  const categories = await Category.find(filter).sort({ displayOrder: 1, name: 1 });
  res.json({ success: true, count: categories.length, data: categories });
};

// POST /api/categories
const createCategory = async (req, res) => {
  const { name, description, displayOrder, restaurantId } = req.body;
  if (!name || !restaurantId) {
    return res.status(400).json({ success: false, message: 'name and restaurantId are required' });
  }
  const category = await Category.create({ name, description, displayOrder, restaurantId });
  res.status(201).json({ success: true, data: category });
};

// PUT /api/categories/:id
const updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
  res.json({ success: true, data: category });
};

// DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

  const itemCount = await MenuItem.countDocuments({ categoryId: category._id });
  if (itemCount > 0) {
    return res.status(400).json({
      success: false,
      message: `Cannot delete category: ${itemCount} menu item(s) still use it. Reassign or delete those items first.`,
    });
  }
  await category.deleteOne();
  res.json({ success: true, message: 'Category deleted' });
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
