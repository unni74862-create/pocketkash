<<<<<<< HEAD
# Supabase Setup Guide for PocketKash

## Installation Complete ✅

The Supabase client library has been installed and configured for your project.

## Configuration Steps

### 1. Get Your Supabase Credentials

1. Go to your Supabase project dashboard: https://app.supabase.com/projects
2. Select your project (ID: `yybtpphxdmqvjihtaxzp`)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL**: https://yybtpphxdmqvjihtaxzp.supabase.co
   - **Anon Public Key**: (starts with `eyJ...`)

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```
VITE_SUPABASE_URL=https://yybtpphxdmqvjihtaxzp.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_anon_key_here` with your actual Anon Public Key from Supabase.

### 3. Create Database Tables

In your Supabase dashboard, go to the SQL Editor and run:

```sql
-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  age INTEGER,
  role VARCHAR(50),
  has_income BOOLEAN DEFAULT false,
  monthly_allowance INTEGER DEFAULT 0,
  salary INTEGER DEFAULT 0,
  side_income INTEGER DEFAULT 0,
  spending_frequency VARCHAR(50),
  plans_before_spending BOOLEAN DEFAULT false,
  top_spending_category VARCHAR(50),
  daily_limit INTEGER DEFAULT 0,
  weekly_limit INTEGER DEFAULT 0,
  monthly_limit INTEGER DEFAULT 0,
  is_onboarded BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50),
  description TEXT,
  emotion_tag VARCHAR(50),
  date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create RLS (Row Level Security) policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Allow users to read/write their own profile
CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow users to read/write their own transactions
CREATE POLICY "Users can read own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can create transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update own transactions" ON transactions
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete own transactions" ON transactions
  FOR DELETE USING (auth.uid() = user_id);
```

### 4. Update Auth Pages

The Supabase authentication functions are available in `src/lib/supabaseAuth.ts`:

```typescript
import { signUp, signIn, signOut } from '@/lib/supabaseAuth';

// Sign up
const { success, user } = await signUp(email, password);

// Sign in
const { success, user } = await signIn(email, password);

// Sign out
await signOut();
```

### 5. Update UserContext (Optional)

To sync user data with Supabase instead of localStorage:

```typescript
import { getUserProfile, upsertUserProfile } from '@/lib/supabaseAuth';
import { supabase } from '@/lib/supabase';

// Listen to auth changes
supabase.auth.onAuthStateChange(async (event, session) => {
  if (session?.user) {
    // Load user profile
    const { profile } = await getUserProfile(session.user.id);
    // Update state
  }
});
```

## File Structure

```
src/
├── lib/
│   ├── supabase.ts          # Supabase client initialization
│   └── supabaseAuth.ts      # Authentication & DB functions
└── ...
```

## API Documentation

See `src/lib/supabaseAuth.ts` for available functions:
- `signUp(email, password)` - Create new account
- `signIn(email, password)` - Login
- `signOut()` - Logout
- `getCurrentUser()` - Get current auth user
- `getUserProfile(userId)` - Fetch user profile
- `upsertUserProfile(userId, profile)` - Save user profile

## Troubleshooting

**"Missing Supabase environment variables"**
- Ensure `.env.local` file exists with correct keys
- Restart the dev server after updating env vars

**"401 Unauthorized"**
- Check if your Anon Key is correct
- Verify CORS settings in Supabase dashboard

**"403 Forbidden on database operations"**
- Ensure RLS policies are correctly set up
- Check user authentication status

## Support

For more info: https://supabase.com/docs
=======
# Supabase Setup Guide for PocketKash

## Installation Complete ✅

The Supabase client library has been installed and configured for your project.

## Configuration Steps

### 1. Get Your Supabase Credentials

1. Go to your Supabase project dashboard: https://app.supabase.com/projects
2. Select your project (ID: `yybtpphxdmqvjihtaxzp`)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL**: https://yybtpphxdmqvjihtaxzp.supabase.co
   - **Anon Public Key**: (starts with `eyJ...`)

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```
VITE_SUPABASE_URL=https://yybtpphxdmqvjihtaxzp.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_anon_key_here` with your actual Anon Public Key from Supabase.

### 3. Create Database Tables

In your Supabase dashboard, go to the SQL Editor and run:

```sql
-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  age INTEGER,
  role VARCHAR(50),
  has_income BOOLEAN DEFAULT false,
  monthly_allowance INTEGER DEFAULT 0,
  salary INTEGER DEFAULT 0,
  side_income INTEGER DEFAULT 0,
  spending_frequency VARCHAR(50),
  plans_before_spending BOOLEAN DEFAULT false,
  top_spending_category VARCHAR(50),
  daily_limit INTEGER DEFAULT 0,
  weekly_limit INTEGER DEFAULT 0,
  monthly_limit INTEGER DEFAULT 0,
  is_onboarded BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50),
  description TEXT,
  emotion_tag VARCHAR(50),
  date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create RLS (Row Level Security) policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Allow users to read/write their own profile
CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow users to read/write their own transactions
CREATE POLICY "Users can read own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can create transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update own transactions" ON transactions
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete own transactions" ON transactions
  FOR DELETE USING (auth.uid() = user_id);
```

### 4. Update Auth Pages

The Supabase authentication functions are available in `src/lib/supabaseAuth.ts`:

```typescript
import { signUp, signIn, signOut } from '@/lib/supabaseAuth';

// Sign up
const { success, user } = await signUp(email, password);

// Sign in
const { success, user } = await signIn(email, password);

// Sign out
await signOut();
```

### 5. Update UserContext (Optional)

To sync user data with Supabase instead of localStorage:

```typescript
import { getUserProfile, upsertUserProfile } from '@/lib/supabaseAuth';
import { supabase } from '@/lib/supabase';

// Listen to auth changes
supabase.auth.onAuthStateChange(async (event, session) => {
  if (session?.user) {
    // Load user profile
    const { profile } = await getUserProfile(session.user.id);
    // Update state
  }
});
```

## File Structure

```
src/
├── lib/
│   ├── supabase.ts          # Supabase client initialization
│   └── supabaseAuth.ts      # Authentication & DB functions
└── ...
```

## API Documentation

See `src/lib/supabaseAuth.ts` for available functions:
- `signUp(email, password)` - Create new account
- `signIn(email, password)` - Login
- `signOut()` - Logout
- `getCurrentUser()` - Get current auth user
- `getUserProfile(userId)` - Fetch user profile
- `upsertUserProfile(userId, profile)` - Save user profile

## Troubleshooting

**"Missing Supabase environment variables"**
- Ensure `.env.local` file exists with correct keys
- Restart the dev server after updating env vars

**"401 Unauthorized"**
- Check if your Anon Key is correct
- Verify CORS settings in Supabase dashboard

**"403 Forbidden on database operations"**
- Ensure RLS policies are correctly set up
- Check user authentication status

## Support

For more info: https://supabase.com/docs
>>>>>>> 6c4152248c4d5079220c404b8b26da4b8f8b477f
