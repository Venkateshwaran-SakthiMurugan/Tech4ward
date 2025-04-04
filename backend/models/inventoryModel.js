const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema(
  {
    crop: {
      type: String,
      required: [true, 'Please add a crop name'],
      unique: true,
    },
    total_quantity_kg: {
      type: Number,
      required: [true, 'Please add a total quantity in kg'],
      min: [0, 'Quantity cannot be negative'],
    },
    village_contributions: [
      {
        village: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Village',
        },
        quantity_kg: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Inventory', inventorySchema);