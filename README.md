# DA Admin Backend

A Node.js Express backend server designed for deployment on Vercel.

## Features

- 🚀 Express.js server with modern middleware
- 🔒 Security with Helmet and CORS
- 📝 Request logging with Morgan
- 🌍 Environment variable support
- ⚡ Optimized for Vercel serverless deployment
- 🛣️ Organized API routes structure
- 🔧 Development and production configurations

## Quick Start

### Development

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Start development server:
```bash
npm run dev
```

The server will start on `http://localhost:3001`

### Production

```bash
npm start
```

## API Endpoints

### Base Routes
- `GET /` - API information
- `GET /api/health` - Health check

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user

### Data
- `GET /api/data/dashboard` - Dashboard analytics
- `GET /api/data/analytics` - Analytics data

### Test
- `GET /api/test` - Test endpoint

## Deployment on Vercel

### Prerequisites
- Vercel CLI installed: `npm i -g vercel`
- Vercel account

### Deploy Steps

1. **Initial Setup**:
```bash
vercel login
```

2. **Deploy**:
```bash
vercel --prod
```

3. **Set Environment Variables** (in Vercel dashboard):
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://your-frontend-domain.vercel.app`
   - Add other environment variables as needed

### Vercel Configuration

The project includes a `vercel.json` file with:
- Node.js runtime configuration
- Route handling for all requests
- Function timeout settings
- Environment variables

## Project Structure

```
da-backend/
├── index.js              # Main server file
├── package.json           # Dependencies and scripts
├── vercel.json           # Vercel deployment config
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules
├── routes/
│   └── api.js           # API routes
└── README.md            # This file
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS
- Add database, JWT, and other service configurations as needed

## Development Scripts

- `npm run dev` - Start with nodemon (auto-reload)
- `npm start` - Start production server
- `npm run build` - Build command (placeholder)
- `npm run vercel-build` - Vercel build command

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate limiting**: Ready for implementation
- **Input validation**: Ready for implementation

## Next Steps

1. **Database Integration**:
   - Add MongoDB/PostgreSQL
   - Configure connection strings
   - Create data models

2. **Authentication**:
   - Implement JWT tokens
   - Add password hashing
   - Create middleware for protected routes

3. **Validation**:
   - Add input validation (joi/express-validator)
   - Error handling improvements

4. **Testing**:
   - Add Jest for unit tests
   - Integration tests
   - API documentation with Swagger

## Support

For issues and questions, please check the documentation or create an issue in the repository.