const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/userModel');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    
    try {
      // Check if admin already exists
      const adminExists = await User.findOne({ email: 'admin@nammavivasayi.com' });

      if (adminExists) {
        console.log('Admin user already exists');
      } else {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        // Create admin user
        const admin = await User.create({
          name: 'Admin User',
          email: 'admin@nammavivasayi.com',
          password: hashedPassword,
          role: 'admin'
        });
        
        console.log('Admin user created:', admin);
      }
      
      // Disconnect from MongoDB
      mongoose.disconnect();
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  });