const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Inventory = require('../models/inventoryModel');
const Produce = require('../models/produceModel');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, deliveryAddress } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Calculate total quantity
  let totalQuantity = 0;
  for (const item of orderItems) {
    totalQuantity += item.quantity_kg;
  }

  // Check inventory availability
  for (const item of orderItems) {
    const inventory = await Inventory.findOne({ crop: item.crop });
    
    if (!inventory || inventory.total_quantity_kg < item.quantity_kg) {
      res.status(400);
      throw new Error(`Not enough ${item.crop} in inventory`);
    }
  }

  // Find farmers for each crop
  for (const item of orderItems) {
    // Find the most recent produce entry for this crop to associate with the farmer
    const produceEntry = await Produce.findOne({ crop: item.crop })
      .sort({ createdAt: -1 })
      .populate('farmer');

    if (produceEntry) {
      item.farmer = produceEntry.farmer;
    }
  }

  // Create order
  const order = await Order.create({
    user: req.user._id,
    orderItems,
    totalQuantity,
    deliveryAddress,
  });

  // Update inventory
  for (const item of orderItems) {
    const inventory = await Inventory.findOne({ crop: item.crop });
    inventory.total_quantity_kg -= item.quantity_kg;
    await inventory.save();
  }

  if (order) {
    res.status(201).json(order);
  } else {
    res.status(400);
    throw new Error('Invalid order data');
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email');
  res.status(200).json(orders);
});

// @desc    Get user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = status;
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get orders by farmer ID
// @route   GET /api/orders/farmer/:farmerId
// @access  Private/Farmer
const getOrdersByFarmer = asyncHandler(async (req, res) => {
  const farmerId = req.params.farmerId;

  // Find orders where any orderItem has the specified farmer
  const orders = await Order.find({
    'orderItems.farmer': farmerId
  }).populate('user', 'name email');

  res.status(200).json(orders);
});

module.exports = {
  createOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getOrdersByFarmer,
};