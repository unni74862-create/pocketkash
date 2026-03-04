<<<<<<< HEAD
# PocketKash MongoDB Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       POCKETKASH APPLICATION                     │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐     ┌──────────────────────────────┐
│    FRONTEND (React + Vite)   │     │   BACKEND (Node + Express)   │
│  (Port 5173)                 │     │  (Port 5000)                 │
├──────────────────────────────┤     ├──────────────────────────────┤
│ ├─ Auth.tsx                  │     │ ├─ server.js                 │
│ │  (Login/Signup)            │     │ │  (Express app)             │
│ │                            │     │ │                            │
│ ├─ DatabaseTest.tsx          │     │ ├─ routes/auth.js            │
│ │  (Test Component)          │     │ │  (Login, Signup, Users)    │
│ │                            │     │ │                            │
│ └─ api.ts                    │     │ ├─ models/User.js            │
│    (API Client)              │     │ │  (Schema: username, email, │
│                              │     │ │   password)                │
│                              │     │ │                            │
│   HTTP (fetch/axios)         │────→│ └─ config/database.js        │
│   ↑                          │     │    (MongoDB connection)      │
│   │ JSON Response            │     │                              │
│   │ (token + user)           │     │                              │
│   └──────────────────────────│     │                              │
│                              │     │                              │
│  localStorage                │     │                              │
│  ├─ authToken (JWT)          │     │                              │
│  └─ user (object)            │     │                              │
└──────────────────────────────┘     └──────────────────────────────┘
                                                    │
                                                    │
                                    ┌───────────────▼──────────────────┐
                                    │   MONGODB (localhost:27017)      │
                                    ├────────────────────────────────┤
                                    │  Database: pocketkash          │
                                    │  Collection: users             │
                                    │                                │
                                    │  Documents:                    │
                                    │  ├─ { username, email, pass }  │
                                    │  ├─ { username, email, pass }  │
                                    │  ├─ { username, email, pass }  │
                                    │  └─ { username, email, pass }  │
                                    └────────────────────────────────┘
```

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER LOGIN/SIGNUP                         │
└─────────────────────────────────────────────────────────────┘

                         FRONTEND
                            │
                    ┌────────▼────────┐
                    │  Auth Page      │
                    │  (React Form)   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  api.ts         │
                    │  (Client)       │
                    └────────┬────────┘
                             │
                             │ HTTP POST
                             │ (username, password, email)
                             │
                         BACKEND
                             │
                    ┌────────▼────────────┐
                    │  auth.js Routes    │
                    │  - /signup         │
                    │  - /login          │
                    └────────┬───────────┘
                             │
                    ┌────────▼────────────┐
                    │  Validation        │
                    │  - Check format    │
                    │  - Check duplicates│
                    │  - Hash password   │
                    └────────┬───────────┘
                             │
                        MONGODB
                             │
                    ┌────────▼────────────┐
                    │ Save User Document  │
                    │ or Find Existing    │
                    └────────┬───────────┘
                             │
                         BACKEND
                             │
                    ┌────────▼────────────┐
                    │ Generate JWT Token  │
                    │ Create Response     │
                    └────────┬───────────┘
                             │
                             │ HTTP Response
                             │ (token + user data)
                             │
                         FRONTEND
                             │
                    ┌────────▼────────────┐
                    │ Store in localStorage│
                    │ - authToken         │
                    │ - user              │
                    └────────┬───────────┘
                             │
                    ┌────────▼────────────┐
                    │ Redirect to         │
                    │ Dashboard           │
                    └─────────────────────┘
```

## Database Schema

```
Collection: users

{
  _id: ObjectId
  
  username: String
    ├─ Required: true
    ├─ Unique: true
    ├─ Min: 3 characters
    ├─ Max: 30 characters
    └─ Trim: true
  
  email: String
    ├─ Required: true
    ├─ Unique: true
    ├─ Lowercase: true
    └─ Validation: valid email format
  
  password: String
    ├─ Required: true
    ├─ Min: 6 characters
    ├─ Hashed: bcrypt (10 salt rounds)
    └─ Select: false (never returned in queries)
  
  createdAt: Date
    └─ Default: now()
  
  updatedAt: Date
    └─ Auto-updated by Mongoose
}
```

## File Structure

```
pocketkash_-main/
│
├── backend/                    [NEW] Node.js Backend
│   ├── models/
│   │   └── User.js            [User schema]
│   ├── routes/
│   │   └── auth.js            [Auth endpoints]
│   ├── config/
│   │   └── database.js        [MongoDB connection]
│   ├── server.js              [Express app]
│   ├── seed.js                [Database seeding]
│   ├── test-connection.js     [Connection test]
│   ├── package.json           [Dependencies]
│   ├── .env                   [Configuration]
│   └── README.md              [Backend docs]
│
├── src/
│   ├── lib/
│   │   └── api.ts             [UPDATED] API client
│   ├── pages/
│   │   ├── Auth.tsx           [UPDATED] Login/Signup
│   │   └── DatabaseTest.tsx   [NEW] Test page
│   └── components/
│       └── DatabaseTest.tsx   [NEW] Test component
│
├── MONGODB_SETUP.md           [NEW] Setup guide
├── SETUP_COMPLETE.md          [NEW] Summary
└── package.json               [Root config]
```

## API Endpoints

```
BASE URL: http://localhost:5000/api

┌─────────────────────────────────────────────────────┐
│              AUTHENTICATION ENDPOINTS                │
└─────────────────────────────────────────────────────┘

POST /auth/signup
├─ Request: { username, email, password }
├─ Response: { success, token, user }
└─ Status: 201 (Created) | 409 (Duplicate) | 400 (Invalid)

POST /auth/login
├─ Request: { username, password }
├─ Response: { success, token, user }
└─ Status: 200 (OK) | 401 (Unauthorized) | 400 (Invalid)

GET /auth/users
├─ Response: { success, count, users[] }
└─ Status: 200 (OK) | 500 (Error)

GET /health
├─ Response: { success, message, timestamp }
└─ Status: 200 (OK)
```

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                     USER INTERACTION                          │
└──────────────────────────────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  Auth Page      │
                    │  Form Input     │
                    │  (username/pwd) │
                    └────────┬────────┘
                             │
                    ┌────────▼──────────────┐
                    │  Validation           │
                    │  - Non-empty          │
                    │  - Password 6+ chars  │
                    └────────┬──────────────┘
                             │
                    ┌────────▼──────────────┐
                    │  API Call             │
                    │  authApi.login()      │
                    │  authApi.signup()     │
                    └────────┬──────────────┘
                             │
             ┌───────────────┴──────────────┐
             │                              │
             ▼                              ▼
    ┌─────────────────┐        ┌──────────────────┐
    │  Login Endpoint │        │ Signup Endpoint  │
    │  Find user      │        │ Create user      │
    │  Verify pass    │        │ Hash password    │
    └────────┬────────┘        └────────┬─────────┘
             │                          │
             └──────────────┬───────────┘
                            │
                   ┌────────▼──────────┐
                   │  MongoDB Query    │
                   │  Save/Find doc    │
                   └────────┬──────────┘
                            │
                   ┌────────▼──────────┐
                   │  Generate JWT     │
                   │  Create response  │
                   └────────┬──────────┘
                            │
                   ┌────────▼──────────┐
                   │  Return Response  │
                   │  (token + user)   │
                   └────────┬──────────┘
                            │
                   ┌────────▼──────────┐
                   │  Store Token      │
                   │  localStorage     │
                   └────────┬──────────┘
                            │
                   ┌────────▼──────────┐
                   │  Redirect         │
                   │  Dashboard        │
                   └───────────────────┘
```

## Environment Setup

```
┌─────────────────────────────────────────────────────┐
│              ENVIRONMENT CONFIGURATION              │
└─────────────────────────────────────────────────────┘

Backend (.env):
├─ MONGODB_URI     → Connection string
├─ PORT            → Server port (5000)
├─ JWT_SECRET      → Token signing key
└─ NODE_ENV        → Environment (development/production)

Frontend (vite.config.ts):
├─ PORT            → Frontend port (5173)
└─ API_BASE_URL    → Backend URL (http://localhost:5000)

Development:
├─ Frontend:  http://localhost:5173
├─ Backend:   http://localhost:5000
└─ MongoDB:   mongodb://localhost:27017

Production:
├─ Frontend:  https://yourdomain.com
├─ Backend:   https://api.yourdomain.com
└─ MongoDB:   mongodb+srv://username:password@cluster.mongodb.net
```

## Feature Matrix

```
┌──────────────────────────────────────────────────────────┐
│                   FEATURE STATUS                         │
├──────────────────────────────────────────────────────────┤
│ Feature                │ Backend  │ Frontend │ Database  │
├──────────────────────────────────────────────────────────┤
│ User Registration      │    ✅    │    ✅    │     ✅    │
│ User Login             │    ✅    │    ✅    │     ✅    │
│ Password Hashing       │    ✅    │    N/A   │     ✅    │
│ JWT Authentication     │    ✅    │    ✅    │     N/A   │
│ Input Validation       │    ✅    │    ✅    │     ✅    │
│ Duplicate Prevention   │    ✅    │    N/A   │     ✅    │
│ CORS Support           │    ✅    │    ✅    │     N/A   │
│ Error Handling         │    ✅    │    ✅    │     ✅    │
│ Database Seeding       │    ✅    │    N/A   │     ✅    │
│ Connection Testing     │    ✅    │    ✅    │     ✅    │
│ API Documentation      │    ✅    │    ✅    │     ✅    │
└──────────────────────────────────────────────────────────┘
```

=======
# PocketKash MongoDB Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       POCKETKASH APPLICATION                     │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐     ┌──────────────────────────────┐
│    FRONTEND (React + Vite)   │     │   BACKEND (Node + Express)   │
│  (Port 5173)                 │     │  (Port 5000)                 │
├──────────────────────────────┤     ├──────────────────────────────┤
│ ├─ Auth.tsx                  │     │ ├─ server.js                 │
│ │  (Login/Signup)            │     │ │  (Express app)             │
│ │                            │     │ │                            │
│ ├─ DatabaseTest.tsx          │     │ ├─ routes/auth.js            │
│ │  (Test Component)          │     │ │  (Login, Signup, Users)    │
│ │                            │     │ │                            │
│ └─ api.ts                    │     │ ├─ models/User.js            │
│    (API Client)              │     │ │  (Schema: username, email, │
│                              │     │ │   password)                │
│                              │     │ │                            │
│   HTTP (fetch/axios)         │────→│ └─ config/database.js        │
│   ↑                          │     │    (MongoDB connection)      │
│   │ JSON Response            │     │                              │
│   │ (token + user)           │     │                              │
│   └──────────────────────────│     │                              │
│                              │     │                              │
│  localStorage                │     │                              │
│  ├─ authToken (JWT)          │     │                              │
│  └─ user (object)            │     │                              │
└──────────────────────────────┘     └──────────────────────────────┘
                                                    │
                                                    │
                                    ┌───────────────▼──────────────────┐
                                    │   MONGODB (localhost:27017)      │
                                    ├────────────────────────────────┤
                                    │  Database: pocketkash          │
                                    │  Collection: users             │
                                    │                                │
                                    │  Documents:                    │
                                    │  ├─ { username, email, pass }  │
                                    │  ├─ { username, email, pass }  │
                                    │  ├─ { username, email, pass }  │
                                    │  └─ { username, email, pass }  │
                                    └────────────────────────────────┘
```

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER LOGIN/SIGNUP                         │
└─────────────────────────────────────────────────────────────┘

                         FRONTEND
                            │
                    ┌────────▼────────┐
                    │  Auth Page      │
                    │  (React Form)   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  api.ts         │
                    │  (Client)       │
                    └────────┬────────┘
                             │
                             │ HTTP POST
                             │ (username, password, email)
                             │
                         BACKEND
                             │
                    ┌────────▼────────────┐
                    │  auth.js Routes    │
                    │  - /signup         │
                    │  - /login          │
                    └────────┬───────────┘
                             │
                    ┌────────▼────────────┐
                    │  Validation        │
                    │  - Check format    │
                    │  - Check duplicates│
                    │  - Hash password   │
                    └────────┬───────────┘
                             │
                        MONGODB
                             │
                    ┌────────▼────────────┐
                    │ Save User Document  │
                    │ or Find Existing    │
                    └────────┬───────────┘
                             │
                         BACKEND
                             │
                    ┌────────▼────────────┐
                    │ Generate JWT Token  │
                    │ Create Response     │
                    └────────┬───────────┘
                             │
                             │ HTTP Response
                             │ (token + user data)
                             │
                         FRONTEND
                             │
                    ┌────────▼────────────┐
                    │ Store in localStorage│
                    │ - authToken         │
                    │ - user              │
                    └────────┬───────────┘
                             │
                    ┌────────▼────────────┐
                    │ Redirect to         │
                    │ Dashboard           │
                    └─────────────────────┘
```

## Database Schema

```
Collection: users

{
  _id: ObjectId
  
  username: String
    ├─ Required: true
    ├─ Unique: true
    ├─ Min: 3 characters
    ├─ Max: 30 characters
    └─ Trim: true
  
  email: String
    ├─ Required: true
    ├─ Unique: true
    ├─ Lowercase: true
    └─ Validation: valid email format
  
  password: String
    ├─ Required: true
    ├─ Min: 6 characters
    ├─ Hashed: bcrypt (10 salt rounds)
    └─ Select: false (never returned in queries)
  
  createdAt: Date
    └─ Default: now()
  
  updatedAt: Date
    └─ Auto-updated by Mongoose
}
```

## File Structure

```
pocketkash_-main/
│
├── backend/                    [NEW] Node.js Backend
│   ├── models/
│   │   └── User.js            [User schema]
│   ├── routes/
│   │   └── auth.js            [Auth endpoints]
│   ├── config/
│   │   └── database.js        [MongoDB connection]
│   ├── server.js              [Express app]
│   ├── seed.js                [Database seeding]
│   ├── test-connection.js     [Connection test]
│   ├── package.json           [Dependencies]
│   ├── .env                   [Configuration]
│   └── README.md              [Backend docs]
│
├── src/
│   ├── lib/
│   │   └── api.ts             [UPDATED] API client
│   ├── pages/
│   │   ├── Auth.tsx           [UPDATED] Login/Signup
│   │   └── DatabaseTest.tsx   [NEW] Test page
│   └── components/
│       └── DatabaseTest.tsx   [NEW] Test component
│
├── MONGODB_SETUP.md           [NEW] Setup guide
├── SETUP_COMPLETE.md          [NEW] Summary
└── package.json               [Root config]
```

## API Endpoints

```
BASE URL: http://localhost:5000/api

┌─────────────────────────────────────────────────────┐
│              AUTHENTICATION ENDPOINTS                │
└─────────────────────────────────────────────────────┘

POST /auth/signup
├─ Request: { username, email, password }
├─ Response: { success, token, user }
└─ Status: 201 (Created) | 409 (Duplicate) | 400 (Invalid)

POST /auth/login
├─ Request: { username, password }
├─ Response: { success, token, user }
└─ Status: 200 (OK) | 401 (Unauthorized) | 400 (Invalid)

GET /auth/users
├─ Response: { success, count, users[] }
└─ Status: 200 (OK) | 500 (Error)

GET /health
├─ Response: { success, message, timestamp }
└─ Status: 200 (OK)
```

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                     USER INTERACTION                          │
└──────────────────────────────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  Auth Page      │
                    │  Form Input     │
                    │  (username/pwd) │
                    └────────┬────────┘
                             │
                    ┌────────▼──────────────┐
                    │  Validation           │
                    │  - Non-empty          │
                    │  - Password 6+ chars  │
                    └────────┬──────────────┘
                             │
                    ┌────────▼──────────────┐
                    │  API Call             │
                    │  authApi.login()      │
                    │  authApi.signup()     │
                    └────────┬──────────────┘
                             │
             ┌───────────────┴──────────────┐
             │                              │
             ▼                              ▼
    ┌─────────────────┐        ┌──────────────────┐
    │  Login Endpoint │        │ Signup Endpoint  │
    │  Find user      │        │ Create user      │
    │  Verify pass    │        │ Hash password    │
    └────────┬────────┘        └────────┬─────────┘
             │                          │
             └──────────────┬───────────┘
                            │
                   ┌────────▼──────────┐
                   │  MongoDB Query    │
                   │  Save/Find doc    │
                   └────────┬──────────┘
                            │
                   ┌────────▼──────────┐
                   │  Generate JWT     │
                   │  Create response  │
                   └────────┬──────────┘
                            │
                   ┌────────▼──────────┐
                   │  Return Response  │
                   │  (token + user)   │
                   └────────┬──────────┘
                            │
                   ┌────────▼──────────┐
                   │  Store Token      │
                   │  localStorage     │
                   └────────┬──────────┘
                            │
                   ┌────────▼──────────┐
                   │  Redirect         │
                   │  Dashboard        │
                   └───────────────────┘
```

## Environment Setup

```
┌─────────────────────────────────────────────────────┐
│              ENVIRONMENT CONFIGURATION              │
└─────────────────────────────────────────────────────┘

Backend (.env):
├─ MONGODB_URI     → Connection string
├─ PORT            → Server port (5000)
├─ JWT_SECRET      → Token signing key
└─ NODE_ENV        → Environment (development/production)

Frontend (vite.config.ts):
├─ PORT            → Frontend port (5173)
└─ API_BASE_URL    → Backend URL (http://localhost:5000)

Development:
├─ Frontend:  http://localhost:5173
├─ Backend:   http://localhost:5000
└─ MongoDB:   mongodb://localhost:27017

Production:
├─ Frontend:  https://yourdomain.com
├─ Backend:   https://api.yourdomain.com
└─ MongoDB:   mongodb+srv://username:password@cluster.mongodb.net
```

## Feature Matrix

```
┌──────────────────────────────────────────────────────────┐
│                   FEATURE STATUS                         │
├──────────────────────────────────────────────────────────┤
│ Feature                │ Backend  │ Frontend │ Database  │
├──────────────────────────────────────────────────────────┤
│ User Registration      │    ✅    │    ✅    │     ✅    │
│ User Login             │    ✅    │    ✅    │     ✅    │
│ Password Hashing       │    ✅    │    N/A   │     ✅    │
│ JWT Authentication     │    ✅    │    ✅    │     N/A   │
│ Input Validation       │    ✅    │    ✅    │     ✅    │
│ Duplicate Prevention   │    ✅    │    N/A   │     ✅    │
│ CORS Support           │    ✅    │    ✅    │     N/A   │
│ Error Handling         │    ✅    │    ✅    │     ✅    │
│ Database Seeding       │    ✅    │    N/A   │     ✅    │
│ Connection Testing     │    ✅    │    ✅    │     ✅    │
│ API Documentation      │    ✅    │    ✅    │     ✅    │
└──────────────────────────────────────────────────────────┘
```

>>>>>>> 6c4152248c4d5079220c404b8b26da4b8f8b477f
