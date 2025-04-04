const express = require('express');
const router = express.Router();
const {
  getProduce,
  createProduce,
  getProduceByFarmer,
} = require('../controllers/produceController');
const { protect, farmer } = require('../middleware/authMiddleware');

router.route('/').get(getProduce).post(protect, farmer, createProduce);
router.route('/farmer/:farmerId').get(getProduceByFarmer);

module.exports = router;