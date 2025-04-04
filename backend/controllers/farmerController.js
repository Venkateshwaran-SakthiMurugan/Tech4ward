const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Farmer = require('../models/farmerModel');
const Village = require('../models/villageModel');

// @desc    Get all farmers
// @route   GET /api/farmers
// @access  Public
const getFarmers = asyncHandler(async (req, res) => {
  const farmers = await Farmer.find().populate('village', 'name');
  res.status(200).json(farmers);
});

// @desc    Create a farmer
// @route   POST /api/farmers
// @access  Private/Admin
const createFarmer = asyncHandler(async (req, res) => {
  const { name, village } = req.body;

  if (!name || !village) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // Check if village exists
  const villageExists = await Village.findById(village);

  if (!villageExists) {
    res.status(400);
    throw new Error('Village not found');
  }

  const farmer = await Farmer.create({
    name,
    village,
  });

  if (farmer) {
    res.status(201).json(farmer);
  } else {
    res.status(400);
    throw new Error('Invalid farmer data');
  }
});

// @desc    Get farmers by village
// @route   GET /api/farmers/village/:villageId
// @access  Public
const getFarmersByVillage = asyncHandler(async (req, res) => {
  const villageIdOrName = req.params.villageId;
  let villageId = villageIdOrName;

  // Check if the parameter is a name instead of an ID
  if (!mongoose.Types.ObjectId.isValid(villageIdOrName)) {
    // Try to find the village by name
    const village = await Village.findOne({ name: villageIdOrName });
    if (!village) {
      res.status(404);
      throw new Error(`Village with name "${villageIdOrName}" not found`);
    }
    villageId = village._id;
  }

  const farmers = await Farmer.find({ village: villageId }).populate(
    'village',
    'name'
  );

  if (farmers.length > 0) {
    res.status(200).json(farmers);
  } else {
    res.status(200).json([]); // Return empty array instead of error for no farmers
  }
});

// @desc    Get farmer by ID
// @route   GET /api/farmers/:id
// @access  Public
const getFarmerById = asyncHandler(async (req, res) => {
  const farmer = await Farmer.findById(req.params.id).populate('village', 'name');

  if (farmer) {
    res.status(200).json(farmer);
  } else {
    res.status(404);
    throw new Error('Farmer not found');
  }
});

module.exports = {
  getFarmers,
  createFarmer,
  getFarmersByVillage,
  getFarmerById,
};