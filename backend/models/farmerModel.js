const mongoose = require('mongoose');

const farmerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a farmer name'],
    },
    village: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Village',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Farmer', farmerSchema);