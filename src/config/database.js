const mongoose = require('mongoose');

let isConnecting = false;

/**
 * Connect to MongoDB database
 */
const connectDB = async () => {
  try {
    // Support both environment variable names for backward compatibility
    const mongoUri = process.env.MONGODB_URI || process.env.DA_DATABASE_URL_MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
    
    console.log('🔗 Attempting to connect to MongoDB...');
    
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // Increase timeout to 10s
      socketTimeoutMS: 45000,
      maxPoolSize: 10, // Maintain up to 10 socket connections
    });

    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Connection state: ${mongoose.connection.readyState}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('🔍 MongoDB URI exists:', !!mongoUri);
    console.error('🌍 Environment:', process.env.NODE_ENV);
    
    // In production, don't exit but still log the error
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    } else {
      console.log('⚠️  Continuing without database connection in production mode');
    }
  }
};

/**
 * Ensure database connection for serverless environments
 */
const ensureConnection = async () => {
  if (mongoose.connection.readyState === 1) {
    return; // Already connected
  }
  
  if (isConnecting) {
    return; // Connection in progress
  }
  
  isConnecting = true;
  try {
    await connectDB();
  } finally {
    isConnecting = false;
  }
};

/**
 * Setup MongoDB connection event handlers
 */
const setupConnectionHandlers = () => {
  mongoose.connection.on('connected', () => {
    console.log('🔗 Mongoose connected to MongoDB');
  });

  mongoose.connection.on('error', (err) => {
    console.error('🔥 Mongoose connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('🔌 Mongoose disconnected from MongoDB');
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('🔒 MongoDB connection closed through app termination');
    process.exit(0);
  });
};

module.exports = {
  connectDB,
  ensureConnection,
  setupConnectionHandlers
};
