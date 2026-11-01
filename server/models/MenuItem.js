const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    unit: { type: String, enum: ['piece', 'kg', '100g', 'glass'], default: 'piece' },
    image: { type: String, default: '' },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    isVegetarian: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
    isPopular: { type: Boolean, default: false },
    isSpicy: { type: Boolean, default: false },
    isChefSpecial: { type: Boolean, default: false },
  },
  { timestamps: true }
);

menuItemSchema.index({ restaurantId: 1, categoryId: 1 });
menuItemSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('MenuItem', menuItemSchema);
