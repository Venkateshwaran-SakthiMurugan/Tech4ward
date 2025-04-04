const asyncHandler = require('express-async-handler');
const Inventory = require('../models/inventoryModel');

// @desc    Get all inventory
// @route   GET /api/inventory
// @access  Public
const getInventory = asyncHandler(async (req, res) => {
  try {
    const inventory = await Inventory.find().populate('village_contributions.village', 'name').lean().exec();
    res.status(200).json(inventory);
  } catch (error) {
    console.error(`Error fetching inventory: ${error.message}`);
    res.status(500);
    throw new Error('Failed to fetch inventory data. Please try again later.');
  }
});

// @desc    Get inventory by crop
// @route   GET /api/inventory/:crop
// @access  Public
const getInventoryByCrop = asyncHandler(async (req, res) => {
  const inventory = await Inventory.findOne({ crop: req.params.crop }).populate(
    'village_contributions.village',
    'name'
  );

  if (inventory) {
    res.status(200).json(inventory);
  } else {
    res.status(404);
    throw new Error('Inventory not found for this crop');
  }
});

// @desc    Get inventory by village
// @route   GET /api/inventory/village/:villageId
// @access  Public
const getInventoryByVillage = asyncHandler(async (req, res) => {
  const inventory = await Inventory.find({
    'village_contributions.village': req.params.villageId,
  }).populate('village_contributions.village', 'name');

  if (inventory && inventory.length > 0) {
    res.status(200).json(inventory);
  } else {
    res.status(404);
    throw new Error('No inventory found for this village');
  }
});

// @desc    Get top contributing village
// @route   GET /api/inventory/top-village
// @access  Public
const getTopContributingVillage = asyncHandler(async (req, res) => {
  const inventory = await Inventory.find().populate('village_contributions.village', 'name');
  
  // Calculate total contribution by village
  const villageContributions = {};
  
  inventory.forEach(item => {
    item.village_contributions.forEach(vc => {
      const villageId = vc.village._id.toString();
      const villageName = vc.village.name;
      
      if (!villageContributions[villageId]) {
        villageContributions[villageId] = {
          id: villageId,
          name: villageName,
          total: 0
        };
      }
      
      villageContributions[villageId].total += vc.quantity_kg;
    });
  });
  
  // Convert to array and sort
  const sortedContributions = Object.values(villageContributions).sort((a, b) => b.total - a.total);
  
  res.status(200).json(sortedContributions);
});

module.exports = {
  getInventory,
  getInventoryByCrop,
  getInventoryByVillage,
  getTopContributingVillage,
};