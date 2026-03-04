# PocketKash Backend - MongoDB Setup

This backend handles user authentication and stores user credentials (username, password, email) in MongoDB.

## Setup Instructions

### 1. Prerequisites
- MongoDB running on `localhost:27017` (or configure in `.env`)
- Node.js installed

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Environment Configuration

The `.env` file is already configured with:
- `MONGODB_URI=mongodb://localhost:27017/pocketkash`
- `PORT=5000`
- `JWT_SECRET=your_jwt_secret_key_here_change_in_production`

Modify the `.env` file if your MongoDB instance is running on a different host/port.

### 4. Database Structure

#### Users Collection Schema:
```javascript
{
  _id: ObjectId,
  username: String (unique, required, 3-30 chars),
  email: String (unique, required, valid email format),
  password: String (hashed with bcrypt, required, min 6 chars),
  createdAt: Date,
  updatedAt: Date
}
```

### 5. Seed the Database with Test Users

Run the seeding script to populate the database with test users:

```bash
npm run seed
```

This will create the following test users:
- **Username:** johndoe | **Email:** john@example.com | **Password:** password123
- **Username:** janedoe | **Email:** jane@example.com | **Password:** password456
- **Username:** testuser | **Email:** test@example.com | **Password:** testpass789
- **Username:** demouser | **Email:** demo@example.com | **Password:** demo12345

### 6. Start the Backend Server

```bash
npm start
```

Or in development mode with auto-reload:

```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /api/health
Response: { success: true, message: "Backend server is running" }
```

### Signup (Register)
```
POST /api/auth/signup
Body: {
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123"
}
Response: {
  "success": true,
  "message": "User registered successfully",
  "token": "JWT_TOKEN",
  "user": { "id": "...", "username": "...", "email": "..." }
}
```

### Login
```
POST /api/auth/login
Body: {
  "username": "johndoe",
  "password": "password123"
}
Response: {
  "success": true,
  "message": "Login successful",
  "token": "JWT_TOKEN",
  "user": { "id": "...", "username": "...", "email": "..." }
}
```

### Get All Users (for testing)
```
GET /api/auth/users
Response: {
  "success": true,
  "count": 4,
  "users": [
    { "_id": "...", "username": "johndoe", "email": "john@example.com", ... },
    ...
  ]
}
```

## Frontend Integration

The frontend is connected via the API service at `src/lib/api.ts`:

- **authApi.signup()** - Create new account
- **authApi.login()** - User login
- **authApi.getAllUsers()** - Fetch all users (testing)
- **authApi.logout()** - Clear auth token
- **authApi.getCurrentUser()** - Get stored user data
- **authApi.getAuthToken()** - Get JWT token
- **authApi.isAuthenticated()** - Check auth status

## Testing the Connection

### 1. Backend Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. View All Users
```bash
curl http://localhost:5000/api/auth/users
```

### 3. Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","password":"password123"}'
```

### 4. Test Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser","email":"newuser@example.com","password":"password123"}'
```

### 5. Test via Frontend
1. Ensure backend is running on port 5000
2. Start the frontend: `npm run dev` (in the root directory)
3. Go to the Auth page
4. Try logging in with test credentials (e.g., johndoe / password123)
5. Check browser console for any errors
6. Verify the dashboard loads after successful login

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check if the MongoDB URI is correct in `.env`
- Verify the database name: `pocketkash`

### CORS Error
- The backend has CORS enabled by default
- If issues persist, check `server.js` CORS configuration

### JWT Token Issues
- Tokens are stored in `localStorage` with key `authToken`
- Tokens expire after 24 hours
- Clear localStorage if testing multiple accounts

### Port Already in Use
- Change `PORT` in `.env` file
- Or kill the process using port 5000: `lsof -i :5000` and `kill -9 PID`

## Development Notes

- Passwords are hashed with bcrypt (10 salt rounds) before storage
- MongoDB connection uses connection pooling
- Error handling includes validation errors and duplicate checks
- All API responses follow a consistent format with `success` flag

