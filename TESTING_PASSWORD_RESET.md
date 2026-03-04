<<<<<<< HEAD
# Password Reset Feature - Testing Guide

## Quick Start (5 Minutes)

### 1. Install & Configure Backend

```bash
cd backend
npm install  # Already done if you used "do the email and all"
```

### 2. Configure Email in backend/.env

Choose one method:

**Option A: Gmail (Recommended)**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
```

**Option B: Mailtrap (For Testing)**
```env
EMAIL_HOST=live.smtp.mailtrap.io
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=your-mailtrap-email
EMAIL_PASSWORD=your-mailtrap-password
EMAIL_FROM=noreply@pocketkash.com
```

**Option C: Console Only (Quick Testing)**
```
Leave EMAIL_HOST empty
Reset URL will print to console
```

### 3. Update Other Environment Variables

**backend/.env:**
```env
MONGODB_URI=mongodb://localhost:27017/pocketkash
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:5173
```

**root/.env:**
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Start Services

Terminal 1 - Backend:
```bash
cd backend
npm run dev
# Should see: Backend server is running on http://localhost:5000
```

Terminal 2 - Frontend:
```bash
npm run dev
# Should see: Local: http://localhost:5173
```

### 5. Test the Feature

1. Open http://localhost:5173/auth
2. Look for "Forgot Password?" link under password field
3. Click it → Dialog opens
4. Enter a registered user's email
5. Check:
   - **If using Mailtrap:** Check inbox at mailtrap.io
   - **If using Gmail:** Check Gmail inbox
   - **If console only:** Check terminal for reset URL
6. Copy reset link and navigate to it
7. Enter new password (min 6 characters)
8. Confirm password matches
9. Click "Reset Password"
10. Should be logged in automatically → Dashboard appears

---

## Detailed Testing Steps

### Test 1: Forgot Password Flow

**Step 1: Request Password Reset**
```
URL: http://localhost:5173/auth
Action: Click "Forgot Password?" link
Expected: Modal dialog appears
```

**Step 2: Enter Email**
```
Input: testuser@example.com (must be registered)
Click: "Send Reset Link" button
Expected: Success message "Check your email for password reset instructions"
```

**Step 3: Verify Email**
- **Mailtrap:** Check your inbox on mailtrap.io
- **Gmail:** Check email receives in a few seconds
- **Console:** Check backend terminal for reset URL

**Expected email content:**
- Subject: "Password Reset Request for PocketKash"
- Contains: "Reset Your Password" button with link
- Link format: `http://localhost:5173/reset-password/[token]`

### Test 2: Password Reset Page

**Step 1: Click Reset Link or Manually Navigate**
```
URL: http://localhost:5173/reset-password/[token-from-email]
Expected: Reset password form appears
```

**Step 2: Form Fields**
- New Password field (with show/hide toggle)
- Confirm Password field (with show/hide toggle)
- "Reset Password" button
- "Sign in" link (if remember password)

**Step 3: Enter Passwords**
```
New Password: mynewpassword123
Confirm Password: mynewpassword123
Click: "Reset Password"
Expected: "Password reset successfully!" toast
         Auto-redirects to /dashboard
```

### Test 3: Login With New Password

**Step 1: Use New Password to Login**
```
URL: http://localhost:5173/auth
Username: testuser (or your username)
Password: mynewpassword123 (your new password)
Click: Sign In
Expected: Successfully logged in
         Welcome toast appears
         Redirected to dashboard
```

---

## Test Cases & Expected Results

### Test Case 1: Valid Email
```
Input: registered@email.com
Expected: ✅ "Email sent" message
          ✅ Email received with reset link
```

### Test Case 2: Unregistered Email
```
Input: nonexistent@email.com
Expected: ✅ "Email sent" message (for security)
          ❌ No email actually sent
```

### Test Case 3: Invalid Email Format
```
Input: not-an-email
Expected: ❌ Browser validation error (HTML5)
```

### Test Case 4: Expired Token
```
Wait: 30+ minutes after email sent
Click: Original reset link
Expected: ❌ "Invalid or expired reset token" error
```

### Test Case 5: Modified Token
```
Copy: Reset link from email
Change: Last few characters of token
Result: Invalid token error
Expected: ❌ "Invalid or expired reset token" error
```

### Test Case 6: Password Too Short
```
New Password: 12345 (less than 6 chars)
Expected: ❌ Validation error
```

### Test Case 7: Passwords Don't Match
```
New Password: password123
Confirm Password: password456
Expected: ❌ "Passwords do not match" error
```

### Test Case 8: Valid Reset
```
New Password: newpassword123
Confirm Password: newpassword123
Expected: ✅ Success message
          ✅ Auto-login
          ✅ Redirected to dashboard
```

### Test Case 9: Auto-Login After Reset
```
After resetting password:
Expected: ✅ Auth token saved to localStorage
          ✅ User data saved to localStorage
          ✅ Redirected to dashboard immediately
```

### Test Case 10: Profile Auto-Load
```
For onboarded users:
After reset password
Expected: ✅ User profile loads automatically
          ✅ Dashboard shows user preferences
```

---

## Debugging

### Check Backend Logs

```bash
cd backend
npm run dev
```

Look for:
- `Forgot password error:` - Issues with forgot password endpoint
- `Reset password error:` - Issues with reset password endpoint
- Email sending logs (if configured)

### Check Frontend Console

```
F12 → Console Tab
```

Look for:
- `Signup error:` or `Login error:` - Auth issues
- Network errors (XHR/Fetch failures)
- Missing component errors

### Check Network Requests

```
F12 → Network Tab
```

Monitor requests:
- `POST /api/auth/forgot-password` - Should return 200
- `POST /api/auth/reset-password` - Should return 200 with token
- Check response in `Response` tab

### Email Not Sending?

**Check backend/.env:**
```bash
echo $EMAIL_HOST
echo $EMAIL_USER
```

**Check Nodemailer logs:**
```
Add to backend/config/email.js:
console.log('Attempting to send email to:', email);
```

### Reset Link Not Working?

1. Check token in URL matches email
2. Verify less than 30 minutes have passed
3. Check token wasn't modified
4. Check FRONTEND_URL in .env is correct

---

## Environment Variables Checklist

### Backend (.env)

- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `PORT` - Backend port (default: 5000)
- [ ] `JWT_SECRET` - Secret for JWT tokens
- [ ] `NODE_ENV` - development/production
- [ ] `EMAIL_HOST` - SMTP server
- [ ] `EMAIL_PORT` - SMTP port (587 or 465)
- [ ] `EMAIL_SECURE` - true/false
- [ ] `EMAIL_USER` - Email account username
- [ ] `EMAIL_PASSWORD` - Email account password
- [ ] `EMAIL_FROM` - From address
- [ ] `FRONTEND_URL` - Frontend domain

### Frontend (.env)

- [ ] `VITE_API_BASE_URL` - API endpoint

---

## Common Issues & Solutions

### Issue: Modal doesn't appear after clicking "Forgot Password?"

**Solution:**
1. Check browser console for errors (F12)
2. Verify ForgotPasswordDialog component imported in Auth.tsx
3. Clear browser cache and reload

### Issue: Email sending fails silently

**Solution:**
1. Check EMAIL_HOST and EMAIL_PORT in .env
2. For Gmail: Verify App Password is used (not regular password)
3. Check nodemailer error logs in backend console
4. Test with Mailtrap instead (always works)

### Issue: Reset link gives "Invalid token" error

**Solution:**
1. Verify token is copied correctly (no spaces)
2. Check token hasn't expired (30 minutes)
3. Confirm email was from same backend instance
4. Check database connection

### Issue: Auto-login after reset doesn't work

**Solution:**
1. Check JWT_SECRET is set in backend
2. Verify localStorage is enabled in browser
3. Check browser console for auth errors
4. Try logging in manually with new password

### Issue: User profile not loading after reset

**Solution:**
1. Manually refresh page (F5)
2. Check user was onboarded before password reset
3. Verify profile exists in database
4. Check onboarding context logic

---

## Performance Testing

### Load Test Reset Endpoint

```bash
# Test: Send 10 password reset requests
for i in {1..10}; do
  curl -X POST http://localhost:5000/api/auth/forgot-password \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"test$i@example.com\"}"
done
```

### Monitor Backend Performance

- Backend console should show no errors
- Response time should be < 500ms
- No memory leaks (check RAM usage)

---

## Next Steps After Successful Test

1. ✅ Test completed successfully? 
2. Deploy to staging environment
3. Test with real email provider (SendGrid/AWS SES)
4. Add rate limiting to prevent abuse
5. Monitor email delivery rates
6. Add user notification for suspicious activity
7. Consider adding 2FA for additional security

---

## Support

**Testing Issues?** Check:
- Backend logs: `npm run dev` output
- Frontend console: F12 → Console
- Network requests: F12 → Network
- Email provider dashboard (Mailtrap/Gmail/SendGrid)

**File Issues:**
- Verify all files exist (check FORGOT_PASSWORD_SETUP.md)
- Check imports match file paths
- Ensure no typos in component names

**Need Help?**
- Check EMAIL_PROVIDERS.md for your email service
- Review FORGOT_PASSWORD_SETUP.md for setup details
- Check this file for testing steps
=======
# Password Reset Feature - Testing Guide

## Quick Start (5 Minutes)

### 1. Install & Configure Backend

```bash
cd backend
npm install  # Already done if you used "do the email and all"
```

### 2. Configure Email in backend/.env

Choose one method:

**Option A: Gmail (Recommended)**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
```

**Option B: Mailtrap (For Testing)**
```env
EMAIL_HOST=live.smtp.mailtrap.io
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=your-mailtrap-email
EMAIL_PASSWORD=your-mailtrap-password
EMAIL_FROM=noreply@pocketkash.com
```

**Option C: Console Only (Quick Testing)**
```
Leave EMAIL_HOST empty
Reset URL will print to console
```

### 3. Update Other Environment Variables

**backend/.env:**
```env
MONGODB_URI=mongodb://localhost:27017/pocketkash
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:5173
```

**root/.env:**
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Start Services

Terminal 1 - Backend:
```bash
cd backend
npm run dev
# Should see: Backend server is running on http://localhost:5000
```

Terminal 2 - Frontend:
```bash
npm run dev
# Should see: Local: http://localhost:5173
```

### 5. Test the Feature

1. Open http://localhost:5173/auth
2. Look for "Forgot Password?" link under password field
3. Click it → Dialog opens
4. Enter a registered user's email
5. Check:
   - **If using Mailtrap:** Check inbox at mailtrap.io
   - **If using Gmail:** Check Gmail inbox
   - **If console only:** Check terminal for reset URL
6. Copy reset link and navigate to it
7. Enter new password (min 6 characters)
8. Confirm password matches
9. Click "Reset Password"
10. Should be logged in automatically → Dashboard appears

---

## Detailed Testing Steps

### Test 1: Forgot Password Flow

**Step 1: Request Password Reset**
```
URL: http://localhost:5173/auth
Action: Click "Forgot Password?" link
Expected: Modal dialog appears
```

**Step 2: Enter Email**
```
Input: testuser@example.com (must be registered)
Click: "Send Reset Link" button
Expected: Success message "Check your email for password reset instructions"
```

**Step 3: Verify Email**
- **Mailtrap:** Check your inbox on mailtrap.io
- **Gmail:** Check email receives in a few seconds
- **Console:** Check backend terminal for reset URL

**Expected email content:**
- Subject: "Password Reset Request for PocketKash"
- Contains: "Reset Your Password" button with link
- Link format: `http://localhost:5173/reset-password/[token]`

### Test 2: Password Reset Page

**Step 1: Click Reset Link or Manually Navigate**
```
URL: http://localhost:5173/reset-password/[token-from-email]
Expected: Reset password form appears
```

**Step 2: Form Fields**
- New Password field (with show/hide toggle)
- Confirm Password field (with show/hide toggle)
- "Reset Password" button
- "Sign in" link (if remember password)

**Step 3: Enter Passwords**
```
New Password: mynewpassword123
Confirm Password: mynewpassword123
Click: "Reset Password"
Expected: "Password reset successfully!" toast
         Auto-redirects to /dashboard
```

### Test 3: Login With New Password

**Step 1: Use New Password to Login**
```
URL: http://localhost:5173/auth
Username: testuser (or your username)
Password: mynewpassword123 (your new password)
Click: Sign In
Expected: Successfully logged in
         Welcome toast appears
         Redirected to dashboard
```

---

## Test Cases & Expected Results

### Test Case 1: Valid Email
```
Input: registered@email.com
Expected: ✅ "Email sent" message
          ✅ Email received with reset link
```

### Test Case 2: Unregistered Email
```
Input: nonexistent@email.com
Expected: ✅ "Email sent" message (for security)
          ❌ No email actually sent
```

### Test Case 3: Invalid Email Format
```
Input: not-an-email
Expected: ❌ Browser validation error (HTML5)
```

### Test Case 4: Expired Token
```
Wait: 30+ minutes after email sent
Click: Original reset link
Expected: ❌ "Invalid or expired reset token" error
```

### Test Case 5: Modified Token
```
Copy: Reset link from email
Change: Last few characters of token
Result: Invalid token error
Expected: ❌ "Invalid or expired reset token" error
```

### Test Case 6: Password Too Short
```
New Password: 12345 (less than 6 chars)
Expected: ❌ Validation error
```

### Test Case 7: Passwords Don't Match
```
New Password: password123
Confirm Password: password456
Expected: ❌ "Passwords do not match" error
```

### Test Case 8: Valid Reset
```
New Password: newpassword123
Confirm Password: newpassword123
Expected: ✅ Success message
          ✅ Auto-login
          ✅ Redirected to dashboard
```

### Test Case 9: Auto-Login After Reset
```
After resetting password:
Expected: ✅ Auth token saved to localStorage
          ✅ User data saved to localStorage
          ✅ Redirected to dashboard immediately
```

### Test Case 10: Profile Auto-Load
```
For onboarded users:
After reset password
Expected: ✅ User profile loads automatically
          ✅ Dashboard shows user preferences
```

---

## Debugging

### Check Backend Logs

```bash
cd backend
npm run dev
```

Look for:
- `Forgot password error:` - Issues with forgot password endpoint
- `Reset password error:` - Issues with reset password endpoint
- Email sending logs (if configured)

### Check Frontend Console

```
F12 → Console Tab
```

Look for:
- `Signup error:` or `Login error:` - Auth issues
- Network errors (XHR/Fetch failures)
- Missing component errors

### Check Network Requests

```
F12 → Network Tab
```

Monitor requests:
- `POST /api/auth/forgot-password` - Should return 200
- `POST /api/auth/reset-password` - Should return 200 with token
- Check response in `Response` tab

### Email Not Sending?

**Check backend/.env:**
```bash
echo $EMAIL_HOST
echo $EMAIL_USER
```

**Check Nodemailer logs:**
```
Add to backend/config/email.js:
console.log('Attempting to send email to:', email);
```

### Reset Link Not Working?

1. Check token in URL matches email
2. Verify less than 30 minutes have passed
3. Check token wasn't modified
4. Check FRONTEND_URL in .env is correct

---

## Environment Variables Checklist

### Backend (.env)

- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `PORT` - Backend port (default: 5000)
- [ ] `JWT_SECRET` - Secret for JWT tokens
- [ ] `NODE_ENV` - development/production
- [ ] `EMAIL_HOST` - SMTP server
- [ ] `EMAIL_PORT` - SMTP port (587 or 465)
- [ ] `EMAIL_SECURE` - true/false
- [ ] `EMAIL_USER` - Email account username
- [ ] `EMAIL_PASSWORD` - Email account password
- [ ] `EMAIL_FROM` - From address
- [ ] `FRONTEND_URL` - Frontend domain

### Frontend (.env)

- [ ] `VITE_API_BASE_URL` - API endpoint

---

## Common Issues & Solutions

### Issue: Modal doesn't appear after clicking "Forgot Password?"

**Solution:**
1. Check browser console for errors (F12)
2. Verify ForgotPasswordDialog component imported in Auth.tsx
3. Clear browser cache and reload

### Issue: Email sending fails silently

**Solution:**
1. Check EMAIL_HOST and EMAIL_PORT in .env
2. For Gmail: Verify App Password is used (not regular password)
3. Check nodemailer error logs in backend console
4. Test with Mailtrap instead (always works)

### Issue: Reset link gives "Invalid token" error

**Solution:**
1. Verify token is copied correctly (no spaces)
2. Check token hasn't expired (30 minutes)
3. Confirm email was from same backend instance
4. Check database connection

### Issue: Auto-login after reset doesn't work

**Solution:**
1. Check JWT_SECRET is set in backend
2. Verify localStorage is enabled in browser
3. Check browser console for auth errors
4. Try logging in manually with new password

### Issue: User profile not loading after reset

**Solution:**
1. Manually refresh page (F5)
2. Check user was onboarded before password reset
3. Verify profile exists in database
4. Check onboarding context logic

---

## Performance Testing

### Load Test Reset Endpoint

```bash
# Test: Send 10 password reset requests
for i in {1..10}; do
  curl -X POST http://localhost:5000/api/auth/forgot-password \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"test$i@example.com\"}"
done
```

### Monitor Backend Performance

- Backend console should show no errors
- Response time should be < 500ms
- No memory leaks (check RAM usage)

---

## Next Steps After Successful Test

1. ✅ Test completed successfully? 
2. Deploy to staging environment
3. Test with real email provider (SendGrid/AWS SES)
4. Add rate limiting to prevent abuse
5. Monitor email delivery rates
6. Add user notification for suspicious activity
7. Consider adding 2FA for additional security

---

## Support

**Testing Issues?** Check:
- Backend logs: `npm run dev` output
- Frontend console: F12 → Console
- Network requests: F12 → Network
- Email provider dashboard (Mailtrap/Gmail/SendGrid)

**File Issues:**
- Verify all files exist (check FORGOT_PASSWORD_SETUP.md)
- Check imports match file paths
- Ensure no typos in component names

**Need Help?**
- Check EMAIL_PROVIDERS.md for your email service
- Review FORGOT_PASSWORD_SETUP.md for setup details
- Check this file for testing steps
>>>>>>> 6c4152248c4d5079220c404b8b26da4b8f8b477f
