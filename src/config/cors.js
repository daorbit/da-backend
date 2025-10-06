/**
 * CORS configuration
 */

const isDevelopment = process.env.NODE_ENV !== 'production';

const getAllowedOrigins = () => {
  const allowedOrigins = [
    'https://da-admin-five.vercel.app', // Production frontend
    'https://da-admin.vercel.app', // Alternative production URL
    'http://localhost:3000', // Local development
    'http://localhost:5173', // Vite dev server
    'http://localhost:3001', // Alternative local port
    'https://www.daorbit.in/',
    'https://www.daorbit.in',
    'https://admin.daorbit.in',
    'https://admin.daorbit.in/',
    process.env.FRONTEND_URL // Environment variable override
  ].filter(Boolean);

  return allowedOrigins;
};

const getCorsOptions = () => {
  if (isDevelopment) {
    // More permissive CORS for development
    return {
      origin: true, // Allow all origins in development
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
      optionsSuccessStatus: 200
    };
  } else {
    // Restrictive CORS for production
    const allowedOrigins = getAllowedOrigins();

    return {
      origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          console.log('CORS blocked origin:', origin);
          callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'X-Requested-With', 
        'Accept', 
        'sec-ch-ua', 
        'sec-ch-ua-mobile', 
        'sec-ch-ua-platform'
      ],
      optionsSuccessStatus: 200
    };
  }
};

module.exports = {
  getCorsOptions,
  getAllowedOrigins
};
