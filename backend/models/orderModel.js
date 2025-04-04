const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        crop: {
          type: String,
          required: true,
        },
        quantity_kg: {
          type: Number,
          required: true,
        },
        farmer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Farmer',
        },
      },
    ],
    totalQuantity: {
      type: Number,
      required: true,
      default: 0.0,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'processing', 'shipped', 'delivered'],
      default: 'pending',
    },
    deliveryAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);