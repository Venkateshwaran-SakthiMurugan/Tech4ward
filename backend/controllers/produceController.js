const asyncHandler = require('express-async-handler');
const Produce = require('../models/produceModel');
const Farmer = require('../models/farmerModel');
const Inventory = require('../models/inventoryModel');
const Village = require('../models/villageModel');

// @desc    Get all produce
// @route   GET /api/produce
// @access  Public
const getProduce = asyncHandler(async (req, res) => {
  const produce = await Produce.find()
    .populate({
      path: 'farmer',
      select: 'name',
      populate: {
        path: 'village',
        select: 'name',
      },
    });
  res.status(200).json(produce);
});

// @desc    Create a produce entry
// @route   POST /api/produce
// @access  Private/Farmer
const createProduce = asyncHandler(async (req, res) => {
  const { farmer, crop, quantity_kg, date } = req.body;

  if (!farmer || !crop || !quantity_kg) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // Check if farmer exists
  const farmerExists = await Farmer.findById(farmer).populate('village');

  if (!farmerExists) {
    res.status(400);
    throw new Error('Farmer not found');
  }

  const produce = await Produce.create({
    farmer,
    crop,
    quantity_kg,
    date: date || Date.now(),
  });

  if (produce) {
    // Update inventory
    let inventory = await Inventory.findOne({ crop });

    if (inventory) {
      // Update existing inventory
      inventory.total_quantity_kg += quantity_kg;
      
      // Find if village contribution exists
      const villageContribution = inventory.village_contributions.find(
        (vc) => vc.village.toString() === farmerExists.village._id.toString()
      );

      if (villageContribution) {
        villageContribution.quantity_kg += quantity_kg;
      } else {
        inventory.village_contributions.push({
          village: farmerExists.village._id,
          quantity_kg,
        });
      }

      await inventory.save();
    } else {
      // Create new inventory entry
      inventory = await Inventory.create({
        crop,
        total_quantity_kg: quantity_kg,
        village_contributions: [
          {
            village: farmerExists.village._id,
            quantity_kg,
          },
        ],
      });
    }

    res.status(201).json(produce);
  } else {
    res.status(400);
    throw new Error('Invalid produce data');
  }
});

// @desc    Get produce by farmer
// @route   GET /api/produce/farmer/:farmerId
// @access  Public
const getProduceByFarmer = asyncHandler(async (req, res) => {
  const produce = await Produce.find({ farmer: req.params.farmerId })
    .populate({
      path: 'farmer',
      select: 'name',
      populate: {
        path: 'village',
        select: 'name',
      },
    });

  if (produce) {
    res.status(200).json(produce);
  } else {
    res.status(404);
    throw new Error('No produce found for this farmer');
  }
});

module.exports = {
  getProduce,
  createProduce,
  getProduceByFarmer,
};