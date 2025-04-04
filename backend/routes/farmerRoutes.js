const express = require('express');
const router = express.Router();
const {
  getFarmers,
  createFarmer,
  getFarmersByVillage,
  getFarmerById,
} = require('../controllers/farmerController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getFarmers).post(protect, admin, createFarmer);
router.route('/village/:villageId').get(getFarmersByVillage);
router.route('/:id').get(getFarmerById);

module.exports = router;