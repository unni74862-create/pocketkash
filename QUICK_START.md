# 🚀 PocketKash MongoDB - Quick Start (5 Minutes)

## Prerequisites
- MongoDB running: `mongod`
- Node.js installed

---

## ⚡ Quick Start (Terminal Commands)

### Terminal 1: Backend Setup
```bash
cd backend
npm install
npm run seed
npm start
```

Expected: `Backend server is running on http://localhost:5000`

### Terminal 2: Frontend Setup
```bash
# From root directory
npm install
npm run dev
```

Expected: `VITE v... ready in ... ms`

---

## ✅ Verify Setup (5 Tests)

### 1. Backend Health
```bash
curl http://localhost:5000/api/health
```
✅ Should return: `{"success":true,"message":"Backend server is running"}`

### 2. View Users
```bash
curl http://localhost:5000/api/auth/users
```
✅ Should show 4 seeded users

### 3. Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","password":"password123"}'
```
✅ Should return JWT token

### 4. Login via Browser
- Go to: http://localhost:5173/auth
- Username: `johndoe`
- Password: `password123`
- Click Sign In
✅ Should redirect to dashboard

### 5. Test Page
- Go to: http://localhost:5173/database-test
- Click "Run All Tests"
✅ All tests should pass

---

## 📝 Test Credentials

```
username: johndoe        | email: john@example.com      | password: password123
username: janedoe        | email: jane@example.com      | password: password456
username: testuser       | email: test@example.com      | password: testpass789
username: demouser       | email: demo@example.com      | password: demo12345
```

---

## 🗂️ What Was Created

### Backend (in `backend/` folder)
```
✅ server.js              - Express app
✅ models/User.js         - MongoDB schema
✅ routes/auth.js         - API endpoints
✅ config/database.js     - MongoDB connection
✅ seed.js                - Test data
✅ test-connection.js     - Connection test
✅ package.json           - Dependencies
✅ .env                   - Configuration
```

### Frontend Updates (in `src/` folder)
```
✅ lib/api.ts             - API client
✅ pages/Auth.tsx         - Updated to use MongoDB
✅ pages/DatabaseTest.tsx - Test page
✅ components/DatabaseTest.tsx - Test component
```

### Documentation
```
✅ MONGODB_SETUP.md       - Complete guide
✅ SETUP_COMPLETE.md      - Summary
✅ ARCHITECTURE.md        - Diagrams
✅ QUICK_START.md         - This file
```

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| MongoDB won't connect | `mongod` in another terminal |
| Port 5000 in use | Kill process: `lsof -i :5000 \| kill -9 <PID>` |
| No users in DB | `npm run seed` in backend folder |
| CORS error | Ensure backend is running |
| Login fails | Use credentials from Test Credentials table |

---

## 📊 Database Structure

```json
{
  "username": "johndoe",      // unique, 3-30 chars
  "email": "john@example.com", // unique, valid email
  "password": "hashed...",     // bcrypt hashed
  "createdAt": "2024-02-18T...",
  "updatedAt": "2024-02-18T..."
}
```

---

## 🎯 Next Steps

1. ✅ Backend running
2. ✅ Database seeded
3. ✅ Frontend connected
4. ⏭️ **Add more features:**
   - Profile updates
   - Password reset
   - Email verification

---

## 📞 API Endpoints

```
POST   /api/auth/signup       - Register user
POST   /api/auth/login        - Login user
GET    /api/auth/users        - Get all users
GET    /api/health            - Health check
```

---

## ✨ Features Implemented

- ✅ User registration with validation
- ✅ User login with password verification
- ✅ JWT token authentication
- ✅ Password hashing (bcrypt)
- ✅ CORS enabled
- ✅ Database seeding
- ✅ Connection testing
- ✅ Frontend integration
- ✅ Error handling
- ✅ Complete documentation

---

## 🎉 You're All Set!

Your PocketKash application now has:
- ✅ Full MongoDB database setup
- ✅ Express backend API
- ✅ User authentication
- ✅ Frontend integration
- ✅ Complete documentation

**Happy Coding! 🚀**

