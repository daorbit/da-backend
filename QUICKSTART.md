# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file in the root directory:
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/daadmin
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:3000
```

### 3. Start the Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

### 4. Test the API
Open your browser or use curl:
```bash
# Health check
curl http://localhost:3001/api/health

# API root
curl http://localhost:3001/
```

## 📍 Quick Reference

### Project Structure
```
src/
├── config/          → Configuration (database, CORS)
├── controllers/     → Business logic
├── middleware/      → Custom middleware
├── models/          → Database models
├── routes/          → API routes
├── utils/           → Helper functions
└── validators/      → Input validation
```

### Main Files
- `server.js` - Application entry point
- `src/app.js` - Express app configuration
- `src/routes/index.js` - Main API router

### Key Directories
- **Controllers**: Handle request/response logic
- **Routes**: Define API endpoints
- **Models**: Database schemas
- **Middleware**: Request processing
- **Validators**: Input validation rules

## 🔑 Common Tasks

### Add a New Endpoint

1. **Create controller function** (`src/controllers/yourController.js`):
```javascript
const yourFunction = async (req, res) => {
  // Your logic here
};
module.exports = { yourFunction };
```

2. **Add route** (`src/routes/yourRoutes.js`):
```javascript
const router = require('express').Router();
const controller = require('../controllers/yourController');
router.get('/your-path', controller.yourFunction);
module.exports = router;
```

3. **Register route** (`src/routes/index.js`):
```javascript
const yourRoutes = require('./yourRoutes');
router.use('/your-base-path', yourRoutes);
```

### Add Validation

Create validator in `src/validators/yourValidators.js`:
```javascript
const { body } = require('express-validator');

const yourValidation = [
  body('field').notEmpty().withMessage('Field is required')
];

module.exports = { yourValidation };
```

### Add Middleware

Create middleware in `src/middleware/yourMiddleware.js`:
```javascript
const yourMiddleware = (req, res, next) => {
  // Your logic
  next();
};

module.exports = yourMiddleware;
```

## 🔍 API Endpoints

### Public Endpoints
- `GET /` - API information
- `GET /api/health` - Health check
- `GET /api/test` - Test endpoint
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/leads` - Submit lead

### Protected Endpoints (Require Auth Token)
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Admin Only Endpoints
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id/role` - Update user role
- `PUT /api/users/:id/status` - Update user status
- `GET /api/leads` - List all leads
- `PUT /api/leads/:id/status` - Update lead status

## 🧪 Testing Examples

### Register a User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Current User (Protected)
```bash
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Submit Lead
```bash
curl -X POST http://localhost:3001/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "company": "Tech Corp",
    "message": "Interested in your services"
  }'
```

## 📦 npm Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server (auto-reload) |
| `npm run build` | Build for production |

## 🐛 Troubleshooting

### Port already in use
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3001 | xargs kill
```

### MongoDB connection error
- Check if MongoDB is running
- Verify MONGODB_URI in .env
- Check network connectivity

### JWT errors
- Verify JWT_SECRET is set in .env
- Check token format: `Bearer <token>`

## 📚 Next Steps

1. Read `STRUCTURE.md` for detailed architecture
2. Check `README_NEW.md` for full documentation
3. Review `MIGRATION.md` if coming from old structure
4. Explore individual files in `src/` directories

## 💡 Tips

- Use `npm run dev` during development for auto-reload
- Check console output for detailed error messages
- Use tools like Postman or Thunder Client for testing
- Keep `.env` file secure and never commit it
- Follow the existing code structure when adding features

## 🎓 Learning Path

1. ✅ Get server running
2. ✅ Test basic endpoints
3. ✅ Understand folder structure
4. 📖 Read through controller files
5. 📖 Study route definitions
6. 📖 Review middleware functions
7. 🛠️ Add your first feature
8. 🚀 Deploy to production

Happy coding! 🎉
