const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  try {
    console.log('Registration attempt:', { ...req.body, password: '[REDACTED]' });

    const { name, email, password, role, farmer } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please add all fields');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Prepare user data
    const userData = {
      name,
      email,
      password: hashedPassword,
      role: role || 'customer',
    };

    // Add farmer reference if role is farmer
    if (role === 'farmer' && farmer) {
      userData.farmer = farmer;
    }

    // Create user with explicit promise handling
    const user = await User.create(userData);

    if (user) {
      console.log(`User registered successfully: ${user._id} (${user.email})`);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        farmer: user.farmer,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    console.error(`Registration error: ${error.message}`);

    // If it's not already a handled error with status code
    if (!res.statusCode || res.statusCode === 200) {
      res.status(500);
    }

    throw error;
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  try {
    console.log('Login attempt with body:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing email or password');
      res.status(400);
      throw new Error('Please provide email and password');
    }

    // Check for user email
    console.log('Looking for user with email:', email);
    const user = await User.findOne({ email }).exec();

    if (!user) {
      console.log('User not found with email:', email);
      res.status(401);
      throw new Error('Invalid credentials');
    }

    console.log('User found, comparing passwords');
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      console.log('Password match, login successful');
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        farmer: user.farmer,
        token: generateToken(user._id),
      });
    } else {
      console.log('Password mismatch');
      res.status(401);
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    if (error.message === 'Invalid credentials' || error.message === 'Please provide email and password') {
      console.log('Throwing validation error:', error.message);
      throw error; // Re-throw validation errors with their status codes
    }
    console.error(`Login error: ${error.message}`);
    res.status(500);
    throw new Error('Login failed. Please try again later.');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      farmer: user.farmer,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getUsers,
};