<<<<<<< HEAD
# PocketKash Database Schema

## Database Information
- **Database Name**: `pocketkash`
- **Database Type**: MongoDB
- **Connection**: Local (mongodb://localhost:27017/pocketkash) or Cloud

---

## Collections

### 1. Users Collection

#### Collection Name: `users`

```javascript
{
  _id: ObjectId,
  
  // ==================== AUTHENTICATION ====================
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
    // Description: Unique username for login
  },
  
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    // Description: Valid unique email address
  },
  
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
    // Description: Bcrypt hashed password (not returned by default)
  },
  
  // ==================== ONBOARDING STATUS ====================
  isOnboarded: {
    type: Boolean,
    default: false
    // Description: Track if user completed profile setup
  },
  
  // ==================== USER PROFILE ====================
  profile: {
    // Personal Information
    name: String,
    age: Number,
    role: {
      type: String,
      enum: ['studying', 'working', 'both'],
      default: 'studying'
    },
    
    // ==================== INCOME INFORMATION ====================
    hasIncome: {
      type: Boolean,
      default: false
    },
    monthlyAllowance: {
      type: Number,
      default: 0
      // Description: Monthly allowance (in rupees)
    },
    salary: {
      type: Number,
      default: 0
      // Description: Monthly salary (in rupees)
    },
    sideIncome: {
      type: Number,
      default: 0
      // Description: Side income/freelance earnings (in rupees)
    },
    
    // ==================== SPENDING HABITS ====================
    spendingFrequency: {
      type: String,
      enum: ['rarely', 'sometimes', 'often', 'always'],
      default: 'sometimes'
      // Description: How often user spends money
    },
    plansBeforeSpending: {
      type: Boolean,
      default: false
      // Description: Whether user plans before spending
    },
    topSpendingCategory: {
      type: String,
      default: 'food'
      // Description: Primary spending category
    },
    
    // ==================== BUDGET LIMITS ====================
    dailyLimit: {
      type: Number,
      default: 0
      // Description: Daily spending limit (in rupees)
    },
    weeklyLimit: {
      type: Number,
      default: 0
      // Description: Weekly spending limit (in rupees)
    },
    monthlyLimit: {
      type: Number,
      default: 0
      // Description: Monthly spending limit (in rupees)
    },
    
    // ==================== ROUTINE EXPENSES ====================
    routineExpenses: [
      {
        id: String,
        name: String,
        amount: Number,
        category: String
        // Description: Fixed recurring expenses
      }
    ]
  },
  
  // ==================== TIMESTAMPS ====================
  createdAt: Date,
  updatedAt: Date
}
```

---

## Data Types Reference

| Type | Description | Examples |
|------|-------------|----------|
| String | Text data | "John Doe", "john@example.com" |
| Number | Numeric values | 25, 500.50, 2000 |
| Boolean | True/False | true, false |
| Date | Date and time | 2026-02-25T10:30:00Z |
| ObjectId | MongoDB ID | 507f1f77bcf86cd799439011 |
| Array | List of items | [...] |

---

## Field Constraints

| Field | Min | Max | Unique | Required |
|-------|-----|-----|--------|----------|
| username | 3 | 30 | ✓ | ✓ |
| email | - | - | ✓ | ✓ |
| password | 6 | - | - | ✓ |
| age | - | - | - | - |
| dailyLimit | 0 | - | - | - |
| monthlyAllowance | 0 | - | - | - |

---

## Enums (Fixed Values)

### Role Options
```
'studying'  - User is a student
'working'   - User is working
'both'      - User is both studying and working
```

### Spending Frequency Options
```
'rarely'    - Spends rarely
'sometimes' - Spends sometimes
'often'     - Spends often
'always'    - Always spending
```

---

## API Endpoints

### Authentication Endpoints

#### 1. Signup (Register)
```
POST /api/auth/signup
Content-Type: application/json

Request Body:
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "isOnboarded": false
  }
}
```

#### 2. Login
```
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "username": "johndoe",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "isOnboarded": true,
    "profile": { ... }
  }
}
```

#### 3. Get All Users (Testing)
```
GET /api/auth/users

Response:
{
  "success": true,
  "count": 5,
  "users": [ ... ]
}
```

### Profile Endpoints

#### 4. Save/Update Profile (Onboarding)
```
PUT /api/auth/profile
Content-Type: application/json

Request Body:
{
  "userId": "user_id",
  "name": "John Doe",
  "age": 25,
  "role": "working",
  "hasIncome": true,
  "salary": 50000,
  "monthlyAllowance": 0,
  "sideIncome": 5000,
  "spendingFrequency": "sometimes",
  "plansBeforeSpending": true,
  "topSpendingCategory": "food",
  "dailyLimit": 500,
  "weeklyLimit": 3000,
  "monthlyLimit": 10000,
  "routineExpenses": [
    {
      "id": "1",
      "name": "Gym",
      "amount": 500,
      "category": "fitness"
    }
  ]
}

Response:
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { ... }
}
```

#### 5. Get User Profile
```
GET /api/auth/profile/:userId

Response:
{
  "success": true,
  "user": { ... }
}
```

---

## Sample User Document

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "unnikri",
  "email": "unni@example.com",
  "password": "$2a$10$hashed_password_here",
  "isOnboarded": true,
  "profile": {
    "name": "John Doe",
    "age": 25,
    "role": "working",
    "hasIncome": true,
    "monthlyAllowance": 0,
    "salary": 50000,
    "sideIncome": 5000,
    "spendingFrequency": "sometimes",
    "plansBeforeSpending": true,
    "topSpendingCategory": "food",
    "dailyLimit": 500,
    "weeklyLimit": 3000,
    "monthlyLimit": 10000,
    "routineExpenses": [
      {
        "id": "1",
        "name": "Gym Membership",
        "amount": 500,
        "category": "fitness"
      },
      {
        "id": "2",
        "name": "Internet Bill",
        "amount": 800,
        "category": "utilities"
      }
    ]
  },
  "createdAt": "2026-02-25T10:30:00Z",
  "updatedAt": "2026-02-25T12:45:00Z"
}
```

---

## Security Features

1. **Password Hashing**: Bcrypt with 10 salt rounds
2. **JWT Authentication**: 24-hour token expiration
3. **Email Validation**: Regex pattern matching
4. **Input Sanitization**: Trim and lowercase where needed
5. **Unique Constraints**: Username and email must be unique
6. **Password Select**: Password not returned by default in queries

---

## User Flow

```
1. SIGNUP
   ├─ User provides: username, email, password
   ├─ System validates input
   ├─ System checks for duplicates
   ├─ Password hashed with bcrypt
   ├─ User created with isOnboarded = false
   └─ JWT token returned

2. PROFILE COMPLETION (Onboarding)
   ├─ User provides: name, age, role, income, limits, etc.
   ├─ System saves profile data
   ├─ System sets isOnboarded = true
   └─ User redirected to dashboard

3. LOGIN
   ├─ User provides: username, password
   ├─ System validates credentials
   ├─ System returns: token + full profile data
   └─ Frontend restores user data from profile
   
4. SUBSEQUENT LOGINS
   ├─ Login → All profile data returned
   ├─ No need to ask for profile again
   └─ User goes directly to dashboard
```

---

## Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 201 | Created | User signup successful |
| 200 | OK | Login successful, profile fetched |
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | Invalid credentials |
| 404 | Not Found | User not found |
| 409 | Conflict | Username/email already exists |
| 500 | Server Error | Database error |

---

## Database Indexes

```javascript
// Automatic indexes
db.users.createIndex({ username: 1 }, { unique: true })
db.users.createIndex({ email: 1 }, { unique: true })
```

---

## MongoDB Connection String

```
Local:
mongodb://localhost:27017/pocketkash

Cloud (Atlas):
mongodb+srv://username:password@cluster.mongodb.net/pocketkash
```

---

## Created Date
February 25, 2026

## Version
1.0.0
=======
# PocketKash Database Schema

## Database Information
- **Database Name**: `pocketkash`
- **Database Type**: MongoDB
- **Connection**: Local (mongodb://localhost:27017/pocketkash) or Cloud

---

## Collections

### 1. Users Collection

#### Collection Name: `users`

```javascript
{
  _id: ObjectId,
  
  // ==================== AUTHENTICATION ====================
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
    // Description: Unique username for login
  },
  
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    // Description: Valid unique email address
  },
  
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
    // Description: Bcrypt hashed password (not returned by default)
  },
  
  // ==================== ONBOARDING STATUS ====================
  isOnboarded: {
    type: Boolean,
    default: false
    // Description: Track if user completed profile setup
  },
  
  // ==================== USER PROFILE ====================
  profile: {
    // Personal Information
    name: String,
    age: Number,
    role: {
      type: String,
      enum: ['studying', 'working', 'both'],
      default: 'studying'
    },
    
    // ==================== INCOME INFORMATION ====================
    hasIncome: {
      type: Boolean,
      default: false
    },
    monthlyAllowance: {
      type: Number,
      default: 0
      // Description: Monthly allowance (in rupees)
    },
    salary: {
      type: Number,
      default: 0
      // Description: Monthly salary (in rupees)
    },
    sideIncome: {
      type: Number,
      default: 0
      // Description: Side income/freelance earnings (in rupees)
    },
    
    // ==================== SPENDING HABITS ====================
    spendingFrequency: {
      type: String,
      enum: ['rarely', 'sometimes', 'often', 'always'],
      default: 'sometimes'
      // Description: How often user spends money
    },
    plansBeforeSpending: {
      type: Boolean,
      default: false
      // Description: Whether user plans before spending
    },
    topSpendingCategory: {
      type: String,
      default: 'food'
      // Description: Primary spending category
    },
    
    // ==================== BUDGET LIMITS ====================
    dailyLimit: {
      type: Number,
      default: 0
      // Description: Daily spending limit (in rupees)
    },
    weeklyLimit: {
      type: Number,
      default: 0
      // Description: Weekly spending limit (in rupees)
    },
    monthlyLimit: {
      type: Number,
      default: 0
      // Description: Monthly spending limit (in rupees)
    },
    
    // ==================== ROUTINE EXPENSES ====================
    routineExpenses: [
      {
        id: String,
        name: String,
        amount: Number,
        category: String
        // Description: Fixed recurring expenses
      }
    ]
  },
  
  // ==================== TIMESTAMPS ====================
  createdAt: Date,
  updatedAt: Date
}
```

---

## Data Types Reference

| Type | Description | Examples |
|------|-------------|----------|
| String | Text data | "John Doe", "john@example.com" |
| Number | Numeric values | 25, 500.50, 2000 |
| Boolean | True/False | true, false |
| Date | Date and time | 2026-02-25T10:30:00Z |
| ObjectId | MongoDB ID | 507f1f77bcf86cd799439011 |
| Array | List of items | [...] |

---

## Field Constraints

| Field | Min | Max | Unique | Required |
|-------|-----|-----|--------|----------|
| username | 3 | 30 | ✓ | ✓ |
| email | - | - | ✓ | ✓ |
| password | 6 | - | - | ✓ |
| age | - | - | - | - |
| dailyLimit | 0 | - | - | - |
| monthlyAllowance | 0 | - | - | - |

---

## Enums (Fixed Values)

### Role Options
```
'studying'  - User is a student
'working'   - User is working
'both'      - User is both studying and working
```

### Spending Frequency Options
```
'rarely'    - Spends rarely
'sometimes' - Spends sometimes
'often'     - Spends often
'always'    - Always spending
```

---

## API Endpoints

### Authentication Endpoints

#### 1. Signup (Register)
```
POST /api/auth/signup
Content-Type: application/json

Request Body:
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "isOnboarded": false
  }
}
```

#### 2. Login
```
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "username": "johndoe",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "isOnboarded": true,
    "profile": { ... }
  }
}
```

#### 3. Get All Users (Testing)
```
GET /api/auth/users

Response:
{
  "success": true,
  "count": 5,
  "users": [ ... ]
}
```

### Profile Endpoints

#### 4. Save/Update Profile (Onboarding)
```
PUT /api/auth/profile
Content-Type: application/json

Request Body:
{
  "userId": "user_id",
  "name": "John Doe",
  "age": 25,
  "role": "working",
  "hasIncome": true,
  "salary": 50000,
  "monthlyAllowance": 0,
  "sideIncome": 5000,
  "spendingFrequency": "sometimes",
  "plansBeforeSpending": true,
  "topSpendingCategory": "food",
  "dailyLimit": 500,
  "weeklyLimit": 3000,
  "monthlyLimit": 10000,
  "routineExpenses": [
    {
      "id": "1",
      "name": "Gym",
      "amount": 500,
      "category": "fitness"
    }
  ]
}

Response:
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { ... }
}
```

#### 5. Get User Profile
```
GET /api/auth/profile/:userId

Response:
{
  "success": true,
  "user": { ... }
}
```

---

## Sample User Document

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "unnikri",
  "email": "unni@example.com",
  "password": "$2a$10$hashed_password_here",
  "isOnboarded": true,
  "profile": {
    "name": "John Doe",
    "age": 25,
    "role": "working",
    "hasIncome": true,
    "monthlyAllowance": 0,
    "salary": 50000,
    "sideIncome": 5000,
    "spendingFrequency": "sometimes",
    "plansBeforeSpending": true,
    "topSpendingCategory": "food",
    "dailyLimit": 500,
    "weeklyLimit": 3000,
    "monthlyLimit": 10000,
    "routineExpenses": [
      {
        "id": "1",
        "name": "Gym Membership",
        "amount": 500,
        "category": "fitness"
      },
      {
        "id": "2",
        "name": "Internet Bill",
        "amount": 800,
        "category": "utilities"
      }
    ]
  },
  "createdAt": "2026-02-25T10:30:00Z",
  "updatedAt": "2026-02-25T12:45:00Z"
}
```

---

## Security Features

1. **Password Hashing**: Bcrypt with 10 salt rounds
2. **JWT Authentication**: 24-hour token expiration
3. **Email Validation**: Regex pattern matching
4. **Input Sanitization**: Trim and lowercase where needed
5. **Unique Constraints**: Username and email must be unique
6. **Password Select**: Password not returned by default in queries

---

## User Flow

```
1. SIGNUP
   ├─ User provides: username, email, password
   ├─ System validates input
   ├─ System checks for duplicates
   ├─ Password hashed with bcrypt
   ├─ User created with isOnboarded = false
   └─ JWT token returned

2. PROFILE COMPLETION (Onboarding)
   ├─ User provides: name, age, role, income, limits, etc.
   ├─ System saves profile data
   ├─ System sets isOnboarded = true
   └─ User redirected to dashboard

3. LOGIN
   ├─ User provides: username, password
   ├─ System validates credentials
   ├─ System returns: token + full profile data
   └─ Frontend restores user data from profile
   
4. SUBSEQUENT LOGINS
   ├─ Login → All profile data returned
   ├─ No need to ask for profile again
   └─ User goes directly to dashboard
```

---

## Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 201 | Created | User signup successful |
| 200 | OK | Login successful, profile fetched |
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | Invalid credentials |
| 404 | Not Found | User not found |
| 409 | Conflict | Username/email already exists |
| 500 | Server Error | Database error |

---

## Database Indexes

```javascript
// Automatic indexes
db.users.createIndex({ username: 1 }, { unique: true })
db.users.createIndex({ email: 1 }, { unique: true })
```

---

## MongoDB Connection String

```
Local:
mongodb://localhost:27017/pocketkash

Cloud (Atlas):
mongodb+srv://username:password@cluster.mongodb.net/pocketkash
```

---

## Created Date
February 25, 2026

## Version
1.0.0
>>>>>>> 6c4152248c4d5079220c404b8b26da4b8f8b477f
