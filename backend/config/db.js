const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_db';
    console.log(`[Database] Attempting MongoDB connection to: ${connStr}...`);
    
    // Set strictQuery option
    mongoose.set('strictQuery', false);
    
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 3000
    });
    
    console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database Notice] MongoDB Server offline or fallback active (${error.message}).`);
    console.log(`[Database] App will utilize pre-seeded memory storage & live authentication models.`);
  }
};

module.exports = connectDB;
