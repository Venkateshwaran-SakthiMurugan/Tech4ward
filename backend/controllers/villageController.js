const asyncHandler = require('express-async-handler');
const Village = require('../models/villageModel');

// @desc    Get all villages
// @route   GET /api/villages
// @access  Public
const getVillages = asyncHandler(async (req, res) => {
  try {
    const villages = await Village.find().lean().exec();
    res.status(200).json(villages);
  } catch (error) {
    console.error(`Error fetching villages: ${error.message}`);
    res.status(500);
    throw new Error('Failed to fetch villages. Please try again later.');
  }
});

// @desc    Create a village
// @route   POST /api/villages
// @access  Private/Admin
const createVillage = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Please add a village name');
  }

  // Check if village already exists
  const villageExists = await Village.findOne({ name });

  if (villageExists) {
    res.status(400);
    throw new Error('Village already exists');
  }

  const village = await Village.create({
    name,
  });

  if (village) {
    res.status(201).json(village);
  } else {
    res.status(400);
    throw new Error('Invalid village data');
  }
});

// @desc    Get village by ID
// @route   GET /api/villages/:id
// @access  Public
const getVillageById = asyncHandler(async (req, res) => {
  const village = await Village.findById(req.params.id);

  if (village) {
    res.status(200).json(village);
  } else {
    res.status(404);
    throw new Error('Village not found');
  }
});

module.exports = {
  getVillages,
  createVillage,
  getVillageById,
};