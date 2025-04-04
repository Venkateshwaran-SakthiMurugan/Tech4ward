const express = require('express');
const router = express.Router();
const {
  getInventory,
  getInventoryByCrop,
  getInventoryByVillage,
  getTopContributingVillage,
} = require('../controllers/inventoryController');

// Order matters! More specific routes should come before generic ones
router.route('/stats/top-village').get(getTopContributingVillage);
router.route('/village/:villageId').get(getInventoryByVillage);
router.route('/:crop').get(getInventoryByCrop);
router.route('/').get(getInventory);

module.exports = router;