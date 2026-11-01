const QRCode = require('qrcode');
const Restaurant = require('../models/Restaurant');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
const ChatbotQuestion = require('../models/ChatbotQuestion');

// GET /api/restaurant/:id
const getRestaurant = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found' });
  res.json({ success: true, data: restaurant });
};

// PUT /api/restaurant/:id
const updateRestaurant = async (req, res) => {
  const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found' });
  res.json({ success: true, data: restaurant });
};

// GET /api/restaurant/:id/dashboard  -> stats for admin dashboard cards
const getDashboardStats = async (req, res) => {
  const restaurantId = req.params.id;
  const [totalItems, availableItems, unavailableItems, totalCategories, totalQuestions] = await Promise.all([
    MenuItem.countDocuments({ restaurantId }),
    MenuItem.countDocuments({ restaurantId, isAvailable: true }),
    MenuItem.countDocuments({ restaurantId, isAvailable: false }),
    Category.countDocuments({ restaurantId }),
    ChatbotQuestion.countDocuments({ restaurantId }),
  ]);
  res.json({
    success: true,
    data: { totalItems, availableItems, unavailableItems, totalCategories, totalQuestions },
  });
};

// GET /api/restaurant/:id/qr  -> generates & stores QR pointing to the public menu URL
const getQrCode = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found' });

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const menuUrl = `${clientUrl}/menu/${restaurant._id}`;
  const qrDataUrl = await QRCode.toDataURL(menuUrl, { width: 500, margin: 2 });

  restaurant.menuUrl = menuUrl;
  restaurant.qrCode = qrDataUrl;
  await restaurant.save();

  res.json({ success: true, data: { menuUrl, qrCode: qrDataUrl } });
};

module.exports = { getRestaurant, updateRestaurant, getDashboardStats, getQrCode };
