const mongoose = require('mongoose');

const villageSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a village name'],
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Village', villageSchema);