# 📋 Command Reference - PocketKash MongoDB Setup

## One-Time Setup

### First Time Only
```bash
# Clone/Navigate to project
cd path/to/pocketkash_-main

# Ensure MongoDB is running (in separate terminal)
mongod

# Backend setup
cd backend
npm install

# Seed the database
npm run seed

# Verify connection
npm run test-connection
```

---

## Daily Development

### Start Services

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd ..  # Go to root
npm run dev
```

**Terminal 3 (Optional) - MongoDB (if not already running):**
```bash
mongod
```

### Quick Testing

**Test Backend Health:**
```bash
curl http://localhost:5000/api/health
```

**Get All Users:**
```bash
curl http://localhost:5000/api/auth/users
```

**Test Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","password":"password123"}'
```

**Test Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username":"newuser",
    "email":"newuser@example.com",
    "password":"password123"
  }'
```

---

## Backend Commands

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start server (production)
npm start

# Start server (development with auto-reload)
npm run dev

# Seed database
npm run seed

# Test database connection
npm run test-connection

# Navigate back to root
cd ..
```

---

## Frontend Commands

```bash
# From root directory

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## Database Commands

### MongoDB Shell

```bash
# Start MongoDB
mongod

# Connect to MongoDB (in new terminal)
mongosh
# or older version
mongo

# Inside MongoDB shell:

# Show all databases
show dbs

# Use pocketkash database
use pocketkash

# Show collections
show collections

# View users
db.users.find()

# View specific user
db.users.findOne({ username: "johndoe" })

# Count users
db.users.countDocuments()

# Clear all users
db.users.deleteMany({})

# Drop database
db.dropDatabase()

# Exit
exit
```

---

## Environment Configuration

### View Current Configuration

```bash
# Backend .env file
cat backend/.env

# Or open in editor
code backend/.env
```

### Modify Configuration

```bash
# Edit backend/.env
# Change MONGODB_URI, PORT, JWT_SECRET, NODE_ENV
```

---

## Troubleshooting Commands

### Check if MongoDB is Running

```bash
# On Windows
tasklist | find "mongod"

# On Mac/Linux
ps aux | grep mongod
```

### Check if Port is in Use

```bash
# Port 5000 (backend)
lsof -i :5000

# Port 5173 (frontend)
lsof -i :5173

# Port 27017 (MongoDB)
lsof -i :27017
```

### Kill Process Using Port

```bash
# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux
kill -9 $(lsof -t -i :5000)
```

### Reset Database

```bash
cd backend
npm run seed
```

### Test All Connections

```bash
cd backend
npm run test-connection
```

---

## Development Workflow

### Watch Mode

**Backend with auto-reload:**
```bash
cd backend
npm run dev
```

**Frontend (already has hot reload):**
```bash
npm run dev
```

### Debugging

**Check Backend Logs:**
- Look for output in backend terminal

**Check Frontend Console:**
- Press F12 in browser → Console tab

**Check Network Requests:**
- F12 → Network tab → Try login

---

## File Editing

### Edit Configuration

```bash
# Edit backend environment variables
code backend/.env

# Edit backend authentication routes
code backend/routes/auth.js

# Edit user schema
code backend/models/User.js

# Edit API client
code src/lib/api.ts

# Edit login page
code src/pages/Auth.tsx
```

---

## Git Commands (Optional)

```bash
# Initialize git (if not already done)
git init

# Check status
git status

# Add files
git add .

# Commit changes
git commit -m "Setup MongoDB integration"

# View logs
git log
```

---

## API Testing Tools

### Using curl (Terminal)

```bash
# Test GET request
curl http://localhost:5000/api/health

# Test POST request with data
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","password":"password123"}'
```

### Using Postman

1. Download: https://www.postman.com/downloads/
2. Create requests for each endpoint:
   - POST /api/auth/signup
   - POST /api/auth/login
   - GET /api/auth/users
   - GET /api/health

### Using Browser DevTools

1. Press F12
2. Go to Network tab
3. Try login on auth page
4. See requests and responses

---

## Documentation Commands

```bash
# View quick start
cat QUICK_START.md

# View setup guide
cat MONGODB_SETUP.md

# View architecture
cat ARCHITECTURE.md

# View complete setup
cat SETUP_COMPLETE.md

# View checklist
cat IMPLEMENTATION_CHECKLIST.md
```

---

## Performance Monitoring

### Check MongoDB Connection Performance

```bash
cd backend
npm run test-connection
```

### Monitor Backend Logs

Keep terminal open to see:
- Server startup messages
- Request logs
- Error messages
- Connection status

### Monitor Network in Browser

1. F12 → Network tab
2. Login/signup and watch requests
3. Check response times
4. Look for errors (red responses)

---

## Backup & Restore

### Backup Database

```bash
# Windows
mongodump --db pocketkash --out C:\backup\

# Mac/Linux
mongodump --db pocketkash --out ~/backup/
```

### Restore Database

```bash
# Windows
mongorestore --db pocketkash C:\backup\pocketkash\

# Mac/Linux
mongorestore --db pocketkash ~/backup/pocketkash/
```

---

## Clean Start

### Complete Reset

```bash
# Stop all services (Ctrl+C in terminals)

# Delete backend node_modules
cd backend
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Re-seed database
npm run seed

# Start fresh
npm run test-connection
npm start

# In new terminal, start frontend
cd ..
npm run dev
```

### Clear Only Data

```bash
cd backend
npm run seed
```

---

## Advanced Commands

### View Real-Time Logs

**Backend (already running):**
- Keep terminal open
- See logs in real-time

**Frontend:**
```bash
npm run dev 2>&1 | tee frontend.log
```

### Build Frontend

```bash
npm run build
# Creates dist/ folder with optimized files
```

### Check Dependencies

```bash
# Backend
cd backend
npm list

# Frontend
npm list
```

### Update Dependencies

```bash
# Backend
cd backend
npm update

# Frontend
npm update
```

---

## Service Status Commands

### Check All Services

```bash
# MongoDB
lsof -i :27017

# Backend
lsof -i :5000

# Frontend
lsof -i :5173
```

### Example Status Output

```
MongoDB:  LISTEN (27017) ✅
Backend:  LISTEN (5000) ✅
Frontend: LISTEN (5173) ✅
```

---

## Quick Reference Table

| Task | Command | Location |
|------|---------|----------|
| Install backend | `npm install` | backend/ |
| Seed database | `npm run seed` | backend/ |
| Start backend | `npm start` | backend/ |
| Backend dev | `npm run dev` | backend/ |
| Test connection | `npm run test-connection` | backend/ |
| Start frontend | `npm run dev` | root |
| Build frontend | `npm run build` | root |
| Open MongoDB | `mongosh` | anywhere |
| View all users | `curl http://localhost:5000/api/auth/users` | anywhere |
| Health check | `curl http://localhost:5000/api/health` | anywhere |

---

## Common Issues & Quick Fixes

| Issue | Command |
|-------|---------|
| MongoDB won't connect | `mongod` |
| Port 5000 in use | `kill -9 $(lsof -t -i :5000)` |
| No users found | `cd backend && npm run seed` |
| Dependencies missing | `npm install` (in respective folder) |
| Backend not responding | `npm run test-connection` |

---

**Saved: February 18, 2026**
**Last Updated: February 18, 2026**

