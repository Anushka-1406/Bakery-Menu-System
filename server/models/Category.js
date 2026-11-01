const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  },
  { timestamps: true }
);

categorySchema.index({ restaurantId: 1, displayOrder: 1 });

module.exports = mongoose.model('Category', categorySchema);
