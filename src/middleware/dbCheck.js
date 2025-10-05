const mongoose = require('mongoose');

/**
 * Middleware to check database connection before processing request
 */
const checkDatabaseConnection = async (req, res, next) => {
  try {
    // Check if database is connected (allow connecting state)
    if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
      console.error('🔥 Database connection state:', mongoose.connection.readyState);
      return res.status(503).json({
        success: false,
        message: 'Database connection not available',
        debug: {
          connectionState: mongoose.connection.readyState,
          hasMongoUri: !!(process.env.MONGODB_URI || process.env.DA_DATABASE_URL_MONGODB_URI)
        }
      });
    }
    
    // If connecting (state 2), wait a moment for connection to complete
    if (mongoose.connection.readyState === 2) {
      console.log('⏳ Database is connecting, waiting...');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      
      if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
          success: false,
          message: 'Database connection timeout',
          debug: {
            connectionState: mongoose.connection.readyState
          }
        });
      }
    }
    
    next();
  } catch (error) {
    console.error('Database check error:', error);
    res.status(503).json({
      success: false,
      message: 'Database connection error'
    });
  }
};

module.exports = checkDatabaseConnection;
