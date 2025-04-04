const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const User = require('../models/userModel');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'.cyan.underline))
  .catch(err => {
    console.error(`Error: ${err.message}`.red.underline.bold);
    process.exit(1);
  });

// Check if a user exists by email
const verifyUserRegistration = async (email) => {
  try {
    if (!email) {
      console.error('Please provide an email to check'.red);
      process.exit(1);
    }

    console.log(`Checking if user with email ${email} exists...`.yellow);
    
    const user = await User.findOne({ email }).select('-password');
    
    if (user) {
      console.log('\n===== USER FOUND ====='.green.bold);
      console.log(`ID: ${user._id}`.yellow);
      console.log(`Name: ${user.name}`.yellow);
      console.log(`Email: ${user.email}`.yellow);
      console.log(`Role: ${user.role}`.yellow);
      if (user.farmer) {
        console.log(`Farmer ID: ${user.farmer}`.yellow);
      }
      console.log(`Created At: ${user.createdAt}`.yellow);
      console.log('=====================\n'.green.bold);
      console.log('User registration was successful!'.green.bold);
    } else {
      console.log(`No user found with email ${email}`.red.bold);
      console.log('User registration may have failed or the email is incorrect.'.yellow);
    }
    
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Get email from command line arguments
const email = process.argv[2];
verifyUserRegistration(email);