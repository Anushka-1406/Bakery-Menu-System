const MenuItem = require('../models/MenuItem');

// GET /api/menu?restaurantId=...&category=...&search=...&veg=true&available=true
const getMenuItems = async (req, res) => {
  const { restaurantId, category, search, veg, available } = req.query;
  const filter = {};
  if (restaurantId) filter.restaurantId = restaurantId;
  if (category) filter.categoryId = category;
  if (veg === 'true') filter.isVegetarian = true;
  if (veg === 'false') filter.isVegetarian = false;
  if (available === 'true') filter.isAvailable = true;
  if (available === 'false') filter.isAvailable = false;
  if (search) filter.$text = { $search: search };

  const items = await MenuItem.find(filter).populate('categoryId', 'name displayOrder').sort({ name: 1 });
  res.json({ success: true, count: items.length, data: items });
};

// GET /api/menu/:id
const getMenuItem = async (req, res) => {
  const item = await MenuItem.findById(req.params.id).populate('categoryId', 'name');
  if (!item) return res.status(404).json({ success: false, message: 'Menu item not found' });
  res.json({ success: true, data: item });
};

// POST /api/menu
const createMenuItem = async (req, res) => {
  const { name, price, categoryId, restaurantId } = req.body;
  if (!name || price === undefined || !categoryId || !restaurantId) {
    return res
      .status(400)
      .json({ success: false, message: 'name, price, categoryId and restaurantId are required' });
  }
  const item = await MenuItem.create(req.body);
  res.status(201).json({ success: true, data: item });
};

// PUT /api/menu/:id
const updateMenuItem = async (req, res) => {
  const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) return res.status(404).json({ success: false, message: 'Menu item not found' });
  res.json({ success: true, data: item });
};

// PATCH /api/menu/:id/availability  (quick toggle without full edit)
const toggleAvailability = async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Menu item not found' });
  item.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : !item.isAvailable;
  await item.save();
  res.json({ success: true, data: item });
};

// DELETE /api/menu/:id
const deleteMenuItem = async (req, res) => {
  const item = await MenuItem.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Menu item not found' });
  res.json({ success: true, message: 'Menu item deleted' });
};

module.exports = {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  toggleAvailability,
  deleteMenuItem,
};
