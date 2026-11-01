const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }
  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin || !(await admin.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
  const token = generateToken(admin._id);
  res.json({
    success: true,
    token,
    admin: { id: admin._id, name: admin.name, email: admin.email, restaurantId: admin.restaurantId },
  });
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ success: true, admin: req.admin });
};

module.exports = { login, getMe };
