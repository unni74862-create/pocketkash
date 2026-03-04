# PocketKash - MongoDB Database Integration Setup Guide

## Overview
This document provides complete instructions for setting up and testing the MongoDB database integration with the PocketKash UI.

---

## 📋 Prerequisites

- **MongoDB** running on `localhost:27017` (default)
- **Node.js** and **npm** installed
- **Bun** (for frontend) or **npm** for running the UI

---

## 🚀 Step-by-Step Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Backend Dependencies

```bash
npm install
```

This will install:
- `express` - Web framework
- `mongoose` - MongoDB ORM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables

### Step 3: Verify MongoDB Connection

Check that MongoDB is running. In a new terminal:

```bash
# On Windows (using MongoDB command line)
mongo
# or if using mongosh
mongosh
```

If MongoDB isn't installed, download from: https://www.mongodb.com/try/download/community

### Step 4: Seed the Database

```bash
npm run seed
```

**Expected Output:**
```
Connected to MongoDB
Cleared existing users
Successfully seeded 4 users

Seeded Users:
- Username: johndoe, Email: john@example.com, ID: 507f1f77bcf86cd799439011
- Username: janedoe, Email: jane@example.com, ID: 507f1f77bcf86cd799439012
- Username: testuser, Email: test@example.com, ID: 507f1f77bcf86cd799439013
- Username: demouser, Email: demo@example.com, ID: 507f1f77bcf86cd799439014

Database connection closed
```

### Step 5: Test Database Connection

```bash
npm run test-connection
```

**Expected Output:**
```
========================================
   PocketKash MongoDB Connection Test
========================================

TEST 1: Connecting to MongoDB...
✓ MongoDB connection successful
  Database: pocketkash
  Host: localhost

TEST 2: Checking users collection...
✓ Users collection found with 4 documents

TEST 3: Fetching all users (without passwords)...
✓ Found 4 users:
  1. Username: johndoe, Email: john@example.com, ID: ...
  ...

TEST 4: Testing password verification...
✓ Password verification working correctly

TEST 5: Validating schema and indexes...
✓ Schema validation:
  - Username field: String
  - Email field: String
  - Password field: String

========================================
  ✓ All tests passed successfully!
========================================
```

### Step 6: Start the Backend Server

```bash
npm start
```

**Expected Output:**
```
Backend server is running on http://localhost:5000
```

Keep this terminal running. The backend is now ready to receive requests.

---

## 🎨 Step 7: Start the Frontend (New Terminal)

Navigate back to the root directory:

```bash
cd ..
npm install  # if not already done
npm run dev
```

The frontend will typically run on `http://localhost:5173` or similar.

---

## ✅ Testing the Connection

### Test 1: Check Backend Health

**Terminal Command:**
```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Backend server is running",
  "timestamp": "2024-02-18T..."
}
```

### Test 2: View All Users

**Terminal Command:**
```bash
curl http://localhost:5000/api/auth/users
```

**Expected Response:**
```json
{
  "success": true,
  "count": 4,
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "createdAt": "2024-02-18T...",
      "updatedAt": "2024-02-18T..."
    },
    ...
  ]
}
```

### Test 3: Test Login via Terminal

**Terminal Command:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","password":"password123"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### Test 4: Test via Frontend UI

1. Open the PocketKash UI in your browser (http://localhost:5173)
2. Navigate to the **Auth** page
3. Try logging in with:
   - **Username:** `johndoe`
   - **Password:** `password123`
4. Expected: You should see a success toast and redirect to dashboard
5. Check browser **Console** (F12) for any errors

---

## 🧪 Database Test Page

A comprehensive test page is available in the frontend:

1. Access it via: `http://localhost:5173/database-test`
2. Click **Run All Tests** to verify:
   - Backend health
   - User database retrieval
   - Login functionality
   - Current user storage

---

## 📊 Test Credentials

Use these credentials to test login/signup:

| Username | Email | Password |
|----------|-------|----------|
| johndoe | john@example.com | password123 |
| janedoe | jane@example.com | password456 |
| testuser | test@example.com | testpass789 |
| demouser | demo@example.com | demo12345 |

To create a new user, use the **Sign Up** tab on the Auth page.

---

## 🗂️ File Structure

```
pocketkash_-main/
├── backend/
│   ├── models/
│   │   └── User.js          (Mongoose schema with validation)
│   ├── routes/
│   │   └── auth.js          (API endpoints)
│   ├── config/
│   │   └── database.js      (MongoDB connection)
│   ├── server.js            (Express server)
│   ├── seed.js              (Database seeding script)
│   ├── test-connection.js   (Connection test script)
│   ├── package.json
│   ├── .env                 (Configuration)
│   └── README.md
│
├── src/
│   ├── lib/
│   │   └── api.ts           (API client for frontend)
│   ├── pages/
│   │   ├── Auth.tsx         (Updated to use MongoDB)
│   │   └── DatabaseTest.tsx (Test page)
│   └── components/
│       └── DatabaseTest.tsx (Test component)
```

---

## 🔐 Security Notes

⚠️ **Important for Production:**

1. **Change JWT_SECRET** in `.env`:
   ```
   JWT_SECRET=generate_a_strong_random_secret_here
   ```

2. **Use environment-specific configurations:**
   - Development: localhost MongoDB
   - Production: Cloud MongoDB (Atlas, Render, etc.)

3. **Passwords are hashed** with bcrypt before storage
   - Never exposed in API responses
   - Verified using bcrypt comparison

4. **CORS enabled** for frontend integration
   - Restrict to specific origins in production

---

## 🐛 Troubleshooting

### MongoDB Connection Refused

**Problem:** `Error: connect ECONNREFUSED 127.0.0.1:27017`

**Solution:**
```bash
# Ensure MongoDB is running
mongod
# or use MongoDB Compass to verify connection
```

### Port 5000 Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change port in .env
PORT=5001
```

### CORS Error in Browser Console

**Problem:** `Cross-Origin Request Blocked`

**Solution:**
- Ensure backend is running
- Verify API_BASE_URL in `src/lib/api.ts` is correct
- Check CORS is enabled in `backend/server.js`

### "No users found" After Seeding

**Problem:** Seed script ran but no users in database

**Solution:**
```bash
# Delete and re-seed
npm run seed

# Verify:
npm run test-connection
```

### Login Always Fails

**Problem:** Credentials correct but login fails

**Solution:**
1. Verify user exists: `npm run test-connection`
2. Check password format (6+ characters)
3. Clear browser localStorage: F12 → Application → Clear Storage
4. Check server logs for errors

---

## 📝 API Reference

### POST /api/auth/signup

Register a new user.

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "password123"
  }'
```

**Response:** User object + JWT token

### POST /api/auth/login

Login existing user.

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "password123"
  }'
```

**Response:** User object + JWT token

### GET /api/auth/users

Fetch all users (no passwords).

```bash
curl http://localhost:5000/api/auth/users
```

**Response:** Array of user objects

---

## ✨ Next Steps

1. **Customize User Schema** in `backend/models/User.js`
   - Add additional fields (phone, preferences, etc.)
   - Add validation rules

2. **Implement Protected Routes**
   - Add JWT middleware
   - Protect user-specific endpoints

3. **Add More Features**
   - Profile update endpoint
   - Password reset functionality
   - Email verification

4. **Deploy**
   - Backend: Render, Railway, Heroku
   - Database: MongoDB Atlas
   - Frontend: Vercel, Netlify

---

## 📞 Support

For issues or questions:
1. Check console logs (frontend and backend)
2. Review error messages carefully
3. Test API endpoints with curl
4. Verify MongoDB is running and accessible

