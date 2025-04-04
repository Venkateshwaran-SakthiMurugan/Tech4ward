const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Village = require('../models/villageModel');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    
    try {
      // Village names
      const villageNames = [
        'Madurai',
        'Coimbatore',
        'Tirunelveli',
        'Salem',
        'Erode',
        'Thanjavur'
      ];
      
      // Check if villages already exist
      const existingVillages = await Village.find();
      
      if (existingVillages.length >= villageNames.length) {
        console.log('Villages already exist');
      } else {
        // Create villages
        for (const name of villageNames) {
          const villageExists = await Village.findOne({ name });
          
          if (!villageExists) {
            await Village.create({ name });
            console.log(`Village created: ${name}`);
          } else {
            console.log(`Village already exists: ${name}`);
          }
        }
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