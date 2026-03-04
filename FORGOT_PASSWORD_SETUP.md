<<<<<<< HEAD
# Forget Password Feature - Implementation Guide

## Overview
A complete password reset feature has been added to the PocketKash authentication system. Users can request password reset through their email and then set a new password using a time-limited token.

## Features Implemented

### 1. Backend Changes

#### User Model (`backend/models/User.js`)
- Added `passwordResetToken` field to store hashed reset tokens
- Added `passwordResetExpires` field to track token expiration (30 minutes)
- Added `getResetPasswordToken()` method to generate secure reset tokens

#### Email Configuration (`backend/config/email.js`)
- Created email service using Nodemailer
- Supports multiple email providers (SMTP, Gmail, Mailtrap, SendGrid, etc.)
- Sends formatted HTML emails with reset link

#### Authentication Routes (`backend/routes/auth.js`)
- **POST `/api/auth/forgot-password`**: Request password reset
  - Input: `{ email }`
  - Returns: Success message (doesn't reveal if email exists for security)
  
- **POST `/api/auth/reset-password`**: Complete password reset
  - Input: `{ token, newPassword }`
  - Validates token and expiration
  - Hashes new password
  - Returns: Auth token and user data for auto-login

### 2. Frontend Components

#### ForgotPasswordDialog (`src/components/auth/ForgotPasswordDialog.tsx`)
- Modal dialog for requesting password reset
- Email input validation
- Shows success message with confirmation
- Accessible "Cancel" and "Send Reset Link" buttons

#### ResetPassword Page (`src/pages/ResetPassword.tsx`)
- New page for resetting password: `/reset-password/:token`
- Password validation (minimum 6 characters)
- Confirm password matching
- Password visibility toggles
- Auto-login on successful reset
- Profile auto-load if user was onboarded

#### Updated Auth Page (`src/pages/Auth.tsx`)
- "Forgot Password?" link in login form
- Opens ForgotPasswordDialog when clicked
- Integrated with existing authentication

### 3. API Client Updates (`src/lib/api.ts`)
- `forgotPassword(email)`: Request password reset token
- `resetPassword(token, newPassword)`: Complete password reset

### 4. Router Updates (`src/App.tsx`)
- Added route: `/reset-password/:token` → ResetPassword page

## Setup Instructions

### Environment Variables
Add these to your `.env` file in the backend:

```env
# Email Configuration (choose one provider)

# Gmail Example:
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com

# Or Mailtrap Example:
EMAIL_HOST=live.smtp.mailtrap.io
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=your-mailtrap-email
EMAIL_PASSWORD=your-mailtrap-password
EMAIL_FROM=noreply@pocketkash.com

# Frontend URL (for reset link generation)
FRONTEND_URL=http://localhost:5173
```

### Dependencies
Added `nodemailer` to `backend/package.json`. Install it:

```bash
cd backend
npm install
# or
bun install
```

## How It Works

### User Flow

1. **User clicks "Forgot Password?"**
   - Opens forgot password dialog
   - User enters their email

2. **Email is sent**
   - Backend generates 32-byte random token
   - Token is hashed and stored in database with 30-minute expiration
   - User receives email with reset link containing the token

3. **User clicks reset link**
   - Link navigates to `/reset-password/{token}`
   - User enters new password and confirms it

4. **Password is reset**
   - Backend verifies token (hash match + not expired)
   - Password is hashed and saved
   - Token is cleared from database
   - User is automatically logged in
   - Redirects to dashboard

### Security Measures

- **Token Hashing**: Tokens are hashed using SHA256 before storage
- **Token Expiration**: Tokens expire after 30 minutes
- **Email Verification**: For security, endpoint doesn't reveal if email exists
- **Password Validation**: Minimum 6 characters required
- **Auto-Login**: User gets new JWT token after reset
- **Secure Method**: Passwords are hashed with bcryptjs (10 salt rounds)

## Testing

### Manual Testing Steps

1. **Start backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Start frontend**:
   ```bash
   npm run dev
   ```

3. **Test flow**:
   - Go to http://localhost:5173/auth
   - Click "Forgot Password?" link
   - Enter a registered user's email
   - Check console for reset URL (if not configured with real email)
   - Click reset link or navigate to `/reset-password/{token}`
   - Enter new password
   - You should be logged in automatically

4. **Test validation**:
   - Try expired token (older than 30 minutes)
   - Try mismatched passwords
   - Try password less than 6 characters
   - Try invalid token

## Production Deployment

When deploying to production:

1. **Set environment variables** in your hosting platform
2. **Use HTTPS** for all password reset links
3. **Configure email provider** (Gmail, SendGrid, AWS SES, etc.)
4. **Set correct FRONTEND_URL** to your production domain
5. **Monitor email delivery** for failures
6. **Consider rate limiting** on forgot-password endpoint
7. **Add CSRF protection** for production

## Future Enhancements

- Add rate limiting on forgot-password endpoint
- Add email verification for account changes
- Add account recovery options (username reminder)
- Add two-factor authentication
- Add login attempt notifications
- Add password strength requirements

## Files Modified

- ✅ `backend/models/User.js`
- ✅ `backend/routes/auth.js`
- ✅ `backend/package.json`
- ✅ `backend/config/email.js` (new)
- ✅ `src/lib/api.ts`
- ✅ `src/pages/Auth.tsx`
- ✅ `src/pages/ResetPassword.tsx` (new)
- ✅ `src/components/auth/ForgotPasswordDialog.tsx` (new)
- ✅ `src/App.tsx`

## Troubleshooting

**Email not sending?**
- Check EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD
- For Gmail, use App Password (not regular password)
- Check email provider restrictions

**Reset link not working?**
- Verify FRONTEND_URL environment variable
- Check token hasn't expired (30 minute window)
- Ensure token is copied correctly from email

**Auto-login not working after reset?**
- Check JWT_SECRET environment variable is set
- Check browser localStorage is enabled
- Check user profile exists if onboarded

## Support

For issues or questions, check:
1. Backend console logs
2. Email provider logs
3. Network tab in browser DevTools
4. Browser console for runtime errors
=======
# Forget Password Feature - Implementation Guide

## Overview
A complete password reset feature has been added to the PocketKash authentication system. Users can request password reset through their email and then set a new password using a time-limited token.

## Features Implemented

### 1. Backend Changes

#### User Model (`backend/models/User.js`)
- Added `passwordResetToken` field to store hashed reset tokens
- Added `passwordResetExpires` field to track token expiration (30 minutes)
- Added `getResetPasswordToken()` method to generate secure reset tokens

#### Email Configuration (`backend/config/email.js`)
- Created email service using Nodemailer
- Supports multiple email providers (SMTP, Gmail, Mailtrap, SendGrid, etc.)
- Sends formatted HTML emails with reset link

#### Authentication Routes (`backend/routes/auth.js`)
- **POST `/api/auth/forgot-password`**: Request password reset
  - Input: `{ email }`
  - Returns: Success message (doesn't reveal if email exists for security)
  
- **POST `/api/auth/reset-password`**: Complete password reset
  - Input: `{ token, newPassword }`
  - Validates token and expiration
  - Hashes new password
  - Returns: Auth token and user data for auto-login

### 2. Frontend Components

#### ForgotPasswordDialog (`src/components/auth/ForgotPasswordDialog.tsx`)
- Modal dialog for requesting password reset
- Email input validation
- Shows success message with confirmation
- Accessible "Cancel" and "Send Reset Link" buttons

#### ResetPassword Page (`src/pages/ResetPassword.tsx`)
- New page for resetting password: `/reset-password/:token`
- Password validation (minimum 6 characters)
- Confirm password matching
- Password visibility toggles
- Auto-login on successful reset
- Profile auto-load if user was onboarded

#### Updated Auth Page (`src/pages/Auth.tsx`)
- "Forgot Password?" link in login form
- Opens ForgotPasswordDialog when clicked
- Integrated with existing authentication

### 3. API Client Updates (`src/lib/api.ts`)
- `forgotPassword(email)`: Request password reset token
- `resetPassword(token, newPassword)`: Complete password reset

### 4. Router Updates (`src/App.tsx`)
- Added route: `/reset-password/:token` → ResetPassword page

## Setup Instructions

### Environment Variables
Add these to your `.env` file in the backend:

```env
# Email Configuration (choose one provider)

# Gmail Example:
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com

# Or Mailtrap Example:
EMAIL_HOST=live.smtp.mailtrap.io
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=your-mailtrap-email
EMAIL_PASSWORD=your-mailtrap-password
EMAIL_FROM=noreply@pocketkash.com

# Frontend URL (for reset link generation)
FRONTEND_URL=http://localhost:5173
```

### Dependencies
Added `nodemailer` to `backend/package.json`. Install it:

```bash
cd backend
npm install
# or
bun install
```

## How It Works

### User Flow

1. **User clicks "Forgot Password?"**
   - Opens forgot password dialog
   - User enters their email

2. **Email is sent**
   - Backend generates 32-byte random token
   - Token is hashed and stored in database with 30-minute expiration
   - User receives email with reset link containing the token

3. **User clicks reset link**
   - Link navigates to `/reset-password/{token}`
   - User enters new password and confirms it

4. **Password is reset**
   - Backend verifies token (hash match + not expired)
   - Password is hashed and saved
   - Token is cleared from database
   - User is automatically logged in
   - Redirects to dashboard

### Security Measures

- **Token Hashing**: Tokens are hashed using SHA256 before storage
- **Token Expiration**: Tokens expire after 30 minutes
- **Email Verification**: For security, endpoint doesn't reveal if email exists
- **Password Validation**: Minimum 6 characters required
- **Auto-Login**: User gets new JWT token after reset
- **Secure Method**: Passwords are hashed with bcryptjs (10 salt rounds)

## Testing

### Manual Testing Steps

1. **Start backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Start frontend**:
   ```bash
   npm run dev
   ```

3. **Test flow**:
   - Go to http://localhost:5173/auth
   - Click "Forgot Password?" link
   - Enter a registered user's email
   - Check console for reset URL (if not configured with real email)
   - Click reset link or navigate to `/reset-password/{token}`
   - Enter new password
   - You should be logged in automatically

4. **Test validation**:
   - Try expired token (older than 30 minutes)
   - Try mismatched passwords
   - Try password less than 6 characters
   - Try invalid token

## Production Deployment

When deploying to production:

1. **Set environment variables** in your hosting platform
2. **Use HTTPS** for all password reset links
3. **Configure email provider** (Gmail, SendGrid, AWS SES, etc.)
4. **Set correct FRONTEND_URL** to your production domain
5. **Monitor email delivery** for failures
6. **Consider rate limiting** on forgot-password endpoint
7. **Add CSRF protection** for production

## Future Enhancements

- Add rate limiting on forgot-password endpoint
- Add email verification for account changes
- Add account recovery options (username reminder)
- Add two-factor authentication
- Add login attempt notifications
- Add password strength requirements

## Files Modified

- ✅ `backend/models/User.js`
- ✅ `backend/routes/auth.js`
- ✅ `backend/package.json`
- ✅ `backend/config/email.js` (new)
- ✅ `src/lib/api.ts`
- ✅ `src/pages/Auth.tsx`
- ✅ `src/pages/ResetPassword.tsx` (new)
- ✅ `src/components/auth/ForgotPasswordDialog.tsx` (new)
- ✅ `src/App.tsx`

## Troubleshooting

**Email not sending?**
- Check EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD
- For Gmail, use App Password (not regular password)
- Check email provider restrictions

**Reset link not working?**
- Verify FRONTEND_URL environment variable
- Check token hasn't expired (30 minute window)
- Ensure token is copied correctly from email

**Auto-login not working after reset?**
- Check JWT_SECRET environment variable is set
- Check browser localStorage is enabled
- Check user profile exists if onboarded

## Support

For issues or questions, check:
1. Backend console logs
2. Email provider logs
3. Network tab in browser DevTools
4. Browser console for runtime errors
>>>>>>> 6c4152248c4d5079220c404b8b26da4b8f8b477f
