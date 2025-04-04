const express = require('express');
const router = express.Router();
const {
  getVillages,
  createVillage,
  getVillageById,
} = require('../controllers/villageController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getVillages).post(protect, admin, createVillage);
router.route('/:id').get(getVillageById);

module.exports = router;