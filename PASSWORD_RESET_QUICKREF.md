# Password Reset - Quick Reference

## ✅ What's Been Implemented

| Component | Status | Location |
|-----------|--------|----------|
| Forgot Password Dialog | ✅ Done | `src/components/auth/ForgotPasswordDialog.tsx` |
| Reset Password Page | ✅ Done | `src/pages/ResetPassword.tsx` |
| Backend Forgot Endpoint | ✅ Done | `/api/auth/forgot-password` |
| Backend Reset Endpoint | ✅ Done | `/api/auth/reset-password` |
| Email Service | ✅ Done | `backend/config/email.js` |
| User Model Updates | ✅ Done | Reset token fields added |
| API Client | ✅ Done | `src/lib/api.ts` methods added |
| App Routes | ✅ Done | Reset password route added |
| Dependencies | ✅ Done | Nodemailer installed |
| Env Files | ✅ Done | backend/.env & root/.env configured |

---

## 🚀 Quick Start (Choose One)

### Option 1: Gmail (5 mins setup)
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```
📝 Get App Password: https://myaccount.google.com/apppasswords

### Option 2: Mailtrap (2 mins setup)
```env
EMAIL_HOST=live.smtp.mailtrap.io
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=your-mailtrap-email
EMAIL_PASSWORD=your-mailtrap-password
```
📝 Setup: https://mailtrap.io (free)

### Option 3: Console Only (No setup, instant test)
```
Leave EMAIL_HOST empty
Reset URL prints to console
Test using console URL
```

---

## 📝 Configuration Steps

1. **Edit `backend/.env`** - Add email credentials
2. **Edit `root/.env`** - Already configured
3. **Start Backend** - `cd backend && npm run dev`
4. **Start Frontend** - `npm run dev`
5. **Test** - Visit http://localhost:5173/auth

---

## 🧪 Testing Steps

### 1. Request Password Reset
- Go to http://localhost:5173/auth
- Click "Forgot Password?" link
- Enter registered user's email
- Click "Send Reset Link"

### 2. Check Email
- **Gmail:** Check inbox
- **Mailtrap:** Check mailtrap.io inbox
- **Console:** Check backend terminal

### 3. Click Reset Link
- Copy link from email or console
- Click link or navigate to it

### 4. Reset Password
- Enter new password (min 6 chars)
- Confirm password (must match)
- Click "Reset Password"

### 5. Verify Success
- See "Password reset successfully!" message
- Auto-redirected to dashboard
- Should be logged in

---

## 🔍 API Endpoints

### Forgot Password
```
POST /api/auth/forgot-password
Body: { "email": "user@example.com" }
Response: { "success": true, "message": "Email sent" }
```

### Reset Password
```
POST /api/auth/reset-password
Body: { "token": "reset-token", "newPassword": "password123" }
Response: { "success": true, "token": "jwt-token", "user": {...} }
```

---

## 📂 Files Added/Modified

**New Files:**
- ✅ `src/components/auth/ForgotPasswordDialog.tsx`
- ✅ `src/pages/ResetPassword.tsx`
- ✅ `backend/config/email.js`
- ✅ `FORGOT_PASSWORD_SETUP.md` (detailed guide)
- ✅ `EMAIL_PROVIDERS.md` (provider setup)
- ✅ `TESTING_PASSWORD_RESET.md` (test guide)

**Modified Files:**
- ✅ `backend/models/User.js` (+ password reset fields)
- ✅ `backend/routes/auth.js` (+ 2 new endpoints)
- ✅ `backend/package.json` (+ nodemailer)
- ✅ `src/lib/api.ts` (+ 2 new methods)
- ✅ `src/pages/Auth.tsx` (+ forgot password dialog)
- ✅ `src/App.tsx` (+ reset password route)
- ✅ `backend/.env` (+ email config)
- ✅ `root/.env` (created)

---

## 🛠️ Environment Variables

**backend/.env** (Add/Update these):
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
FRONTEND_URL=http://localhost:5173
```

**root/.env** (Already configured):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## ⚙️ How It Works

1. **User clicks "Forgot Password?"** → Dialog opens
2. **User enters email** → Backend generates 32-byte token
3. **Token hashed & stored** → 30-minute expiration set
4. **Email sent** → Link includes unhashed token
5. **User clicks link** → Navigates to reset page
6. **User enters new password** → Submitted to backend
7. **Backend verifies token** → Hash matches, not expired
8. **Password hashed & saved** → Token cleared
9. **JWT token returned** → User auto-logged in
10. **Redirects to dashboard** → With user profile loaded

---

## 🔐 Security Features

- ✅ Tokens hashed with SHA256
- ✅ Tokens expire after 30 minutes
- ✅ Passwords hashed with bcryptjs
- ✅ Email verification (doesn't reveal if exists)
- ✅ One-time use tokens
- ✅ HTTPS recommended in production
- ✅ Auto-login after reset

---

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| Modal doesn't open | Check console errors, clear cache |
| Email not sending | Verify EMAIL_HOST/USER/PASSWORD in .env |
| Gmail auth fails | Use App Password, enable 2FA |
| Reset link empty | Check FRONTEND_URL in .env |
| Token expired | Reset link valid for 30 mins only |
| Password too short | Minimum 6 characters required |
| Can't login with new password | Verify password was saved correctly |

---

## 📚 Documentation Files

1. **FORGOT_PASSWORD_SETUP.md** - Complete setup guide
2. **EMAIL_PROVIDERS.md** - Email provider configurations
3. **TESTING_PASSWORD_RESET.md** - Detailed testing guide
4. **This file** - Quick reference

---

## 🎯 Next Steps

- [ ] Update backend/.env with email credentials
- [ ] Start backend: `cd backend && npm run dev`
- [ ] Start frontend: `npm run dev`
- [ ] Test forgot password flow
- [ ] Deploy to staging
- [ ] Configure production email service
- [ ] Add rate limiting (recommended)
- [ ] Monitor email delivery

---

## 📞 Quick Links

- Backend API: http://localhost:5000/api
- Frontend App: http://localhost:5173
- Gmail App Passwords: https://myaccount.google.com/apppasswords
- Mailtrap: https://mailtrap.io
- SendGrid: https://sendgrid.com
- AWS SES: https://aws.amazon.com/ses/

---

## ✨ All Done!

Everything is installed and configured. Now:
1. Add your email credentials to backend/.env
2. Start the servers
3. Test the password reset feature
4. Enjoy! 🎉
