const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Add event listeners for connection issues
    mongoose.connection.on('error', (err) => {
      console.error(`Mongoose connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected');
    });

  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Don't exit the process immediately, give it a chance to recover
    if (process.env.NODE_ENV === 'production') {
      console.error('Database connection failed, retrying in 5 seconds...');
      setTimeout(connectDB, 5000); // Try to reconnect after 5 seconds
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;