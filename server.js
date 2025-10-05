require('dotenv').config();
const app = require('./src/app');
const { connectDB, setupConnectionHandlers } = require('./src/config/database');

const PORT = process.env.PORT || 3001;

// Setup database connection handlers
setupConnectionHandlers();

// Connect to database
connectDB();

// Start server (only if not in Vercel environment)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 API URL: http://localhost:${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
