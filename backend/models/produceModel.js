const mongoose = require('mongoose');

const produceSchema = mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Farmer',
    },
    crop: {
      type: String,
      required: [true, 'Please add a crop name'],
    },
    quantity_kg: {
      type: Number,
      required: [true, 'Please add a quantity in kg'],
      min: [0, 'Quantity cannot be negative'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Produce', produceSchema);