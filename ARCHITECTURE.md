# DA Backend Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                            CLIENT LAYER                              │
│  (Web Browser, Mobile App, Postman, etc.)                           │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                │ HTTP/HTTPS Request
                                │
┌───────────────────────────────▼─────────────────────────────────────┐
│                         EXPRESS SERVER                               │
│                          (server.js)                                 │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                    MIDDLEWARE STACK                         │   │
│  │  1. Helmet (Security Headers)                              │   │
│  │  2. CORS (Cross-Origin Resource Sharing)                   │   │
│  │  3. Morgan (Request Logging)                               │   │
│  │  4. Express JSON Parser                                    │   │
│  │  5. Custom Middleware (auth, validation, etc.)            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                     ROUTING LAYER                           │   │
│  │                  (src/routes/index.js)                      │   │
│  │                                                             │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │   │
│  │  │ Auth Routes  │  │ User Routes  │  │ Lead Routes  │    │   │
│  │  │ /api/auth    │  │ /api/users   │  │ /api/leads   │    │   │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │   │
│  └─────────┼──────────────────┼──────────────────┼────────────┘   │
│            │                  │                  │                  │
└────────────┼──────────────────┼──────────────────┼──────────────────┘
             │                  │                  │
             │                  │                  │
┌────────────▼──────────────────▼──────────────────▼──────────────────┐
│                      CONTROLLER LAYER                                │
│                   (src/controllers/*.js)                             │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │    Auth      │  │    User      │  │    Lead      │             │
│  │ Controller   │  │ Controller   │  │ Controller   │             │
│  │              │  │              │  │              │             │
│  │ - register   │  │ - getAll     │  │ - create     │             │
│  │ - login      │  │ - getById    │  │ - getAll     │             │
│  │ - getMe      │  │ - updateRole │  │ - updateStatus│            │
│  │ - logout     │  │ - updateStatus│  │              │             │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘             │
└─────────┼──────────────────┼──────────────────┼─────────────────────┘
          │                  │                  │
          │                  │                  │
┌─────────▼──────────────────▼──────────────────▼─────────────────────┐
│                        MODEL LAYER                                   │
│                     (src/models/*.js)                                │
│                                                                      │
│  ┌──────────────────────┐         ┌──────────────────────┐         │
│  │     User Model       │         │     Lead Model       │         │
│  │                      │         │                      │         │
│  │ Schema:              │         │ Schema:              │         │
│  │ - name               │         │ - name               │         │
│  │ - email              │         │ - email              │         │
│  │ - password (hashed)  │         │ - company            │         │
│  │ - role               │         │ - message            │         │
│  │ - isActive           │         │ - status             │         │
│  │ - lastLogin          │         │ - ipAddress          │         │
│  │                      │         │ - userAgent          │         │
│  │ Methods:             │         │                      │         │
│  │ - comparePassword()  │         │ Virtuals:            │         │
│  │ - findByEmail()      │         │ - formattedDate      │         │
│  └──────────┬───────────┘         └──────────┬───────────┘         │
└─────────────┼──────────────────────────────────┼─────────────────────┘
              │                                  │
              │                                  │
              └──────────────┬───────────────────┘
                             │
┌────────────────────────────▼──────────────────────────────────────┐
│                      DATABASE LAYER                                │
│                   (MongoDB with Mongoose)                          │
│                                                                    │
│  Collections:                                                      │
│  - users                                                           │
│  - leads                                                           │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

## 📦 Component Breakdown

### 1. Configuration Layer (`src/config/`)
```
┌─────────────────────┐
│   Configuration     │
├─────────────────────┤
│ • database.js       │ → MongoDB connection setup
│ • cors.js           │ → CORS policies
└─────────────────────┘
```

### 2. Middleware Layer (`src/middleware/`)
```
┌──────────────────────────────────────────┐
│            Middleware                    │
├──────────────────────────────────────────┤
│ • auth.js            → JWT validation    │
│ • dbCheck.js         → DB health check   │
│ • errorHandler.js    → Global errors     │
│ • validateRequest.js → Input validation  │
└──────────────────────────────────────────┘
```

### 3. Validation Layer (`src/validators/`)
```
┌──────────────────────────────────────────┐
│           Validators                     │
├──────────────────────────────────────────┤
│ • authValidators.js   → Auth rules       │
│ • userValidators.js   → User rules       │
│ • leadValidators.js   → Lead rules       │
└──────────────────────────────────────────┘
```

### 4. Utility Layer (`src/utils/`)
```
┌──────────────────────────────────────────┐
│            Utilities                     │
├──────────────────────────────────────────┤
│ • responseHandler.js → Format responses  │
│ • tokenGenerator.js  → JWT generation    │
└──────────────────────────────────────────┘
```

## 🔄 Request Flow Diagram

```
1. Request Arrives
   │
   ├──→ [Helmet] Security headers
   │
   ├──→ [CORS] Origin validation
   │
   ├──→ [Morgan] Log request
   │
   ├──→ [Body Parser] Parse JSON
   │
   ├──→ [Router] Match route
   │
   ├──→ [DB Check] Verify connection
   │
   ├──→ [Auth Middleware] Validate token (if protected)
   │
   ├──→ [Validator] Check input
   │
   ├──→ [Controller] Business logic
   │
   ├──→ [Model] Database operations
   │
   ├──→ [Response Handler] Format response
   │
   └──→ Response Sent
```

## 🔐 Authentication Flow

```
┌─────────┐
│ Client  │
└────┬────┘
     │
     │ 1. POST /api/auth/register or /api/auth/login
     │    { email, password }
     │
     ▼
┌─────────────────────┐
│  Auth Controller    │
│  - Validate input   │
│  - Check DB         │
│  - Hash password    │  (register only)
│  - Compare password │  (login only)
└────┬────────────────┘
     │
     │ 2. Generate JWT Token
     │
     ▼
┌─────────────────────┐
│  Token Generator    │
│  jwt.sign()         │
└────┬────────────────┘
     │
     │ 3. Return token to client
     │
     ▼
┌─────────┐
│ Client  │ Stores token
└────┬────┘
     │
     │ 4. Subsequent requests with token
     │    Authorization: Bearer <token>
     │
     ▼
┌─────────────────────┐
│  Auth Middleware    │
│  - Extract token    │
│  - Verify token     │
│  - Load user        │
│  - Attach to req    │
└────┬────────────────┘
     │
     │ 5. Access granted
     │
     ▼
┌─────────────────────┐
│   Controller        │
│   (Protected route) │
└─────────────────────┘
```

## 🗄️ Database Schema

```
┌─────────────────────────────────────────────┐
│              Users Collection                │
├─────────────────────────────────────────────┤
│ _id: ObjectId                               │
│ name: String (2-50 chars)                   │
│ email: String (unique, indexed)             │
│ password: String (bcrypt hashed)            │
│ role: String (enum: user, admin)            │
│ avatar: String (nullable)                   │
│ isActive: Boolean                           │
│ lastLogin: Date                             │
│ createdAt: Date                             │
│ updatedAt: Date                             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│              Leads Collection                │
├─────────────────────────────────────────────┤
│ _id: ObjectId                               │
│ name: String (2-100 chars)                  │
│ email: String                               │
│ company: String (optional)                  │
│ message: String (10-1000 chars)             │
│ status: String (enum: new, contacted, ...)  │
│ source: String (default: landing-page)      │
│ ipAddress: String                           │
│ userAgent: String                           │
│ createdAt: Date (auto)                      │
│ updatedAt: Date (auto)                      │
└─────────────────────────────────────────────┘
```

## 🛡️ Security Layers

```
┌────────────────────────────────────────────────┐
│              Security Stack                    │
├────────────────────────────────────────────────┤
│ 1. HTTPS (Transport Layer)                     │
├────────────────────────────────────────────────┤
│ 2. Helmet (HTTP Headers)                       │
│    - XSS Protection                            │
│    - Content Security Policy                   │
│    - HSTS                                      │
├────────────────────────────────────────────────┤
│ 3. CORS (Cross-Origin Protection)              │
│    - Whitelisted origins                       │
│    - Credential handling                       │
├────────────────────────────────────────────────┤
│ 4. JWT (Authentication)                        │
│    - Token-based auth                          │
│    - 7-day expiration                          │
├────────────────────────────────────────────────┤
│ 5. Bcrypt (Password Hashing)                   │
│    - Cost factor: 12                           │
│    - Salt included                             │
├────────────────────────────────────────────────┤
│ 6. Express Validator (Input Sanitization)      │
│    - SQL injection prevention                  │
│    - XSS prevention                            │
├────────────────────────────────────────────────┤
│ 7. Rate Limiting (Future enhancement)          │
│    - Prevent brute force                       │
└────────────────────────────────────────────────┘
```

## 📊 Error Handling Flow

```
Error Occurs
    │
    ├─→ Mongoose Validation Error
    │   └─→ 400 Bad Request (validation details)
    │
    ├─→ Duplicate Key Error (11000)
    │   └─→ 400 Bad Request (field already exists)
    │
    ├─→ JWT Error
    │   └─→ 401 Unauthorized (invalid/expired token)
    │
    ├─→ Custom Error
    │   └─→ Custom status code and message
    │
    └─→ Unknown Error
        └─→ 500 Internal Server Error
            ├─→ Development: Full stack trace
            └─→ Production: Generic message
```

## 🔌 API Endpoint Map

```
/
├── /api
│   ├── /health             [GET]    (Public)
│   ├── /test               [GET]    (Public)
│   │
│   ├── /auth
│   │   ├── /register       [POST]   (Public)
│   │   ├── /login          [POST]   (Public)
│   │   ├── /me             [GET]    (Protected)
│   │   └── /logout         [POST]   (Protected)
│   │
│   ├── /users
│   │   ├── /               [GET]    (Admin only)
│   │   ├── /:id            [GET]    (Admin only)
│   │   ├── /:id/role       [PUT]    (Admin only)
│   │   └── /:id/status     [PUT]    (Admin only)
│   │
│   ├── /leads
│   │   ├── /               [POST]   (Public)
│   │   ├── /               [GET]    (Admin only)
│   │   └── /:id/status     [PUT]    (Admin only)
│   │
│   └── /data (Legacy)
│       ├── /dashboard      [GET]    (Public)
│       └── /analytics      [GET]    (Public)
```

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────┐
│           Production Environment             │
├─────────────────────────────────────────────┤
│                                              │
│  ┌────────────────────────────────────┐     │
│  │        Vercel Platform             │     │
│  │  ┌──────────────────────────────┐  │     │
│  │  │    Serverless Functions      │  │     │
│  │  │    (Node.js Runtime)         │  │     │
│  │  └──────────┬───────────────────┘  │     │
│  └─────────────┼──────────────────────┘     │
│                │                             │
│                │ Environment Variables       │
│                │ - MONGODB_URI              │
│                │ - JWT_SECRET               │
│                │ - NODE_ENV                 │
│                │                             │
└────────────────┼─────────────────────────────┘
                 │
                 │
┌────────────────▼─────────────────────────────┐
│          MongoDB Atlas (Cloud)               │
│  - Replica Set                               │
│  - Automatic Backups                         │
│  - Connection Pooling                        │
└──────────────────────────────────────────────┘
```

## 📈 Scalability Considerations

```
Current Architecture:
- Single server instance
- MongoDB connection pooling
- Stateless design (JWT)

Future Enhancements:
- Load balancer
- Multiple server instances
- Redis caching
- Message queue (Bull/RabbitMQ)
- Microservices architecture
```

---

This architecture provides:
✅ Separation of concerns
✅ Easy to test and maintain
✅ Scalable and extensible
✅ Follows industry best practices
✅ Secure by design
