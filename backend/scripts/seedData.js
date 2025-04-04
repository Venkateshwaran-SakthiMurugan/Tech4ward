const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const User = require('../models/userModel');
const Farmer = require('../models/farmerModel');
const Village = require('../models/villageModel');
const Produce = require('../models/produceModel');
const Inventory = require('../models/inventoryModel');
const Order = require('../models/orderModel');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'.cyan.underline))
  .catch(err => {
    console.error(`Error: ${err.message}`.red.underline.bold);
    process.exit(1);
  });

// Sample data
const villages = [
  { name: 'Madurai' },
  { name: 'Coimbatore' },
  { name: 'Tirunelveli' },
  { name: 'Salem' },
  { name: 'Erode' }
];

const farmers = [
  { name: 'Rajesh Kumar' },
  { name: 'Anand Patel' },
  { name: 'Vijay Singh' },
  { name: 'Suresh Reddy' },
  { name: 'Manoj Sharma' },
  { name: 'Karthik Rajan' },
  { name: 'Prakash Nair' },
  { name: 'Dinesh Gopal' }
];

const users = [
  {
    name: 'Admin User',
    email: 'admin@nammavivasayi.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Farmer User 1',
    email: 'farmer1@example.com',
    password: 'farmer123',
    role: 'farmer'
  },
  {
    name: 'Farmer User 2',
    email: 'farmer2@example.com',
    password: 'farmer123',
    role: 'farmer'
  },
  {
    name: 'Customer 1',
    email: 'customer1@example.com',
    password: 'customer123',
    role: 'customer'
  },
  {
    name: 'Customer 2',
    email: 'customer2@example.com',
    password: 'customer123',
    role: 'customer'
  }
];

const crops = ['Rice', 'Wheat', 'Corn', 'Tomatoes', 'Potatoes', 'Onions', 'Carrots', 'Spinach'];

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Farmer.deleteMany();
    await Village.deleteMany();
    await Produce.deleteMany();
    await Inventory.deleteMany();
    await Order.deleteMany();

    console.log('Data cleared from database'.yellow);

    // Create villages
    const createdVillages = await Village.insertMany(villages);
    console.log(`${createdVillages.length} villages created`.green);

    // Create farmers with random village assignments
    const farmerData = farmers.map(farmer => {
      const randomVillage = createdVillages[Math.floor(Math.random() * createdVillages.length)];
      return {
        name: farmer.name,
        village: randomVillage._id
      };
    });

    const createdFarmers = await Farmer.insertMany(farmerData);
    console.log(`${createdFarmers.length} farmers created`.green);

    // Create users
    const adminUser = users[0];
    const farmerUsers = [users[1], users[2]];
    const customerUsers = [users[3], users[4]];

    // Create admin
    const hashedAdminPassword = await bcrypt.hash(adminUser.password, 10);
    await User.create({
      name: adminUser.name,
      email: adminUser.email,
      password: hashedAdminPassword,
      role: adminUser.role
    });

    // Create farmer users
    for (let i = 0; i < farmerUsers.length; i++) {
      const hashedPassword = await bcrypt.hash(farmerUsers[i].password, 10);
      await User.create({
        name: farmerUsers[i].name,
        email: farmerUsers[i].email,
        password: hashedPassword,
        role: farmerUsers[i].role,
        farmer: createdFarmers[i]._id
      });
    }

    // Create customer users
    for (const customer of customerUsers) {
      const hashedPassword = await bcrypt.hash(customer.password, 10);
      await User.create({
        name: customer.name,
        email: customer.email,
        password: hashedPassword,
        role: customer.role
      });
    }

    console.log(`${users.length} users created`.green);

    // Create produce entries
    const produceEntries = [];
    
    for (const farmer of createdFarmers) {
      // Each farmer produces 2-4 different crops
      const numCrops = 2 + Math.floor(Math.random() * 3);
      const farmerCrops = [...crops].sort(() => 0.5 - Math.random()).slice(0, numCrops);
      
      for (const crop of farmerCrops) {
        // Create 1-3 produce entries per crop
        const numEntries = 1 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < numEntries; i++) {
          const quantity = 50 + Math.floor(Math.random() * 200);
          const date = new Date();
          date.setDate(date.getDate() - Math.floor(Math.random() * 30)); // Random date in the last 30 days
          
          produceEntries.push({
            farmer: farmer._id,
            crop,
            quantity_kg: quantity,
            date
          });
        }
      }
    }
    
    const createdProduce = await Produce.insertMany(produceEntries);
    console.log(`${createdProduce.length} produce entries created`.green);

    // Update inventory based on produce
    const inventoryMap = {};
    
    for (const produce of createdProduce) {
      if (!inventoryMap[produce.crop]) {
        inventoryMap[produce.crop] = {
          crop: produce.crop,
          total_quantity_kg: 0,
          village_contributions: {}
        };
      }
      
      inventoryMap[produce.crop].total_quantity_kg += produce.quantity_kg;
      
      // Get farmer's village
      const farmer = createdFarmers.find(f => f._id.toString() === produce.farmer.toString());
      const villageId = farmer.village.toString();
      
      if (!inventoryMap[produce.crop].village_contributions[villageId]) {
        inventoryMap[produce.crop].village_contributions[villageId] = {
          village: villageId,
          quantity_kg: 0
        };
      }
      
      inventoryMap[produce.crop].village_contributions[villageId].quantity_kg += produce.quantity_kg;
    }
    
    // Convert to array format for MongoDB
    const inventoryEntries = Object.values(inventoryMap).map(item => {
      return {
        crop: item.crop,
        total_quantity_kg: item.total_quantity_kg,
        village_contributions: Object.values(item.village_contributions)
      };
    });
    
    const createdInventory = await Inventory.insertMany(inventoryEntries);
    console.log(`${createdInventory.length} inventory entries created`.green);

    // Get customer users for orders
    const customerUserDocs = await User.find({ role: 'customer' });
    
    // Create orders
    const orders = [];
    
    for (const customer of customerUserDocs) {
      // Each customer places 1-3 orders
      const numOrders = 1 + Math.floor(Math.random() * 3);
      
      for (let i = 0; i < numOrders; i++) {
        // Each order has 1-4 items
        const numItems = 1 + Math.floor(Math.random() * 4);
        const orderItems = [];
        let totalQuantity = 0;
        
        // Get random crops from inventory
        const availableCrops = [...createdInventory].sort(() => 0.5 - Math.random()).slice(0, numItems);
        
        for (const inventoryItem of availableCrops) {
          const quantity = 5 + Math.floor(Math.random() * 20);
          
          // Find a farmer who produces this crop
          const produceEntry = createdProduce.find(p => p.crop === inventoryItem.crop);
          
          if (produceEntry) {
            orderItems.push({
              crop: inventoryItem.crop,
              quantity_kg: quantity,
              farmer: produceEntry.farmer
            });
            
            totalQuantity += quantity;
          }
        }
        
        if (orderItems.length > 0) {
          const statuses = ['pending', 'processing', 'shipped', 'delivered'];
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          
          orders.push({
            user: customer._id,
            orderItems,
            totalQuantity,
            status: randomStatus,
            deliveryAddress: {
              address: `${Math.floor(Math.random() * 1000) + 1} Main St`,
              city: 'Chennai',
              postalCode: `6000${Math.floor(Math.random() * 100)}`,
              country: 'India'
            },
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) // Random date in the last 30 days
          });
        }
      }
    }
    
    const createdOrders = await Order.insertMany(orders);
    console.log(`${createdOrders.length} orders created`.green);

    console.log('Sample data imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Execute the import
importData();