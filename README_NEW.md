# DA Admin Backend API

A professional Node.js/Express backend server with proper folder structure, authentication, and RESTful API design.

## 📁 Project Structure

```
da-backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.js  # MongoDB connection setup
│   │   └── cors.js      # CORS configuration
│   ├── controllers/     # Request handlers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── leadController.js
│   ├── middleware/      # Custom middleware
│   │   ├── auth.js      # Authentication middleware
│   │   ├── dbCheck.js   # Database connection checker
│   │   ├── errorHandler.js  # Error handling
│   │   └── validateRequest.js  # Validation middleware
│   ├── models/          # Mongoose models
│   │   ├── User.js
│   │   └── Lead.js
│   ├── routes/          # API routes
│   │   ├── index.js     # Main router
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── leadRoutes.js
│   ├── utils/           # Utility functions
│   │   ├── responseHandler.js
│   │   └── tokenGenerator.js
│   ├── validators/      # Request validators
│   │   ├── authValidators.js
│   │   ├── userValidators.js
│   │   └── leadValidators.js
│   └── app.js           # Express app configuration
├── server.js            # Server entry point
├── package.json
├── .env                 # Environment variables (not in git)
├── .env.example         # Example environment variables
├── .gitignore
├── vercel.json          # Vercel deployment config
└── README.md

```

## 🚀 Features

- ✅ **MVC Architecture** - Separation of concerns with Models, Views (routes), and Controllers
- ✅ **Authentication & Authorization** - JWT-based auth with role-based access control
- ✅ **Input Validation** - Express-validator for request validation
- ✅ **Error Handling** - Centralized error handling middleware
- ✅ **Security** - Helmet.js, CORS, and secure password hashing
- ✅ **Database** - MongoDB with Mongoose ODM
- ✅ **Logging** - Morgan for HTTP request logging
- ✅ **API Documentation** - RESTful API design
- ✅ **Deployment Ready** - Vercel/serverless compatible

## 📦 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd da-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:3000
```

4. **Run the server**

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## 🔑 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `development` or `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/daadmin` |
| `JWT_SECRET` | Secret key for JWT | `your_secret_key` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/auth/logout` | User logout | Yes |

### User Routes (`/api/users`)

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/api/users` | Get all users | Yes | Yes |
| GET | `/api/users/:id` | Get user by ID | Yes | Yes |
| PUT | `/api/users/:id/role` | Update user role | Yes | Yes |
| PUT | `/api/users/:id/status` | Update user status | Yes | Yes |

### Lead Routes (`/api/leads`)

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| POST | `/api/leads` | Submit new lead | No | No |
| GET | `/api/leads` | Get all leads | Yes | Yes |
| PUT | `/api/leads/:id/status` | Update lead status | Yes | Yes |

### Health & Test Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API root |
| GET | `/api/health` | Health check |
| GET | `/api/test` | Test endpoint |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📝 Request/Response Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get All Users (Admin only)
```bash
GET /api/users?page=1&limit=10&role=all&search=john
Authorization: Bearer <admin_token>
```

## 🛠️ Development

### Folder Structure Conventions

- **config/** - Configuration files (database, CORS, etc.)
- **controllers/** - Business logic and request handlers
- **middleware/** - Custom Express middleware
- **models/** - Mongoose schemas and models
- **routes/** - API route definitions
- **utils/** - Helper functions and utilities
- **validators/** - Input validation rules

### Code Style

- Use async/await for asynchronous operations
- Follow RESTful API conventions
- Implement proper error handling
- Use meaningful variable and function names
- Add comments for complex logic

## 🚢 Deployment

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard

### Other Platforms

The server is compatible with:
- Heroku
- AWS (EC2, Lambda)
- Google Cloud Platform
- DigitalOcean
- Railway
- Render

## 🔧 Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with auto-reload |
| `npm run build` | Build for production (placeholder) |

## 📄 License

MIT License

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Bug Reports

If you discover any bugs, please create an issue on GitHub with:
- Bug description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)

## 📞 Support

For support, email support@daorbit.in or create an issue on GitHub.
