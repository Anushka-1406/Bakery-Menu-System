const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    logo: { type: String, default: '' },
    description: { type: String, default: '' },
    openingHours: { type: String, default: '9:00 AM - 9:00 PM' },
    menuUrl: { type: String, default: '' },
    qrCode: { type: String, default: '' }, // base64 data URL of generated QR
  },
  { timestamps: true }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
