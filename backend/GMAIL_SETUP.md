# Gmail Setup for Password Reset Feature

## Quick Setup (3 Steps)

### Step 1: Get Your Gmail App Password

1. **Enable 2-Step Verification** (required for App Password):
   - Go to: https://myaccount.google.com/security
   - Click "2-Step Verification" 
   - Follow Google's instructions

2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select: **Mail** and **Windows Computer**
   - Click **Generate**
   - Google will show a **16-character password with spaces**
   - ⚠️ **Copy this immediately** (you'll need it next)

### Step 2: Update Your Configuration

Run the setup helper in terminal:

```bash
cd backend
npm run setup-gmail
```

Follow the prompts:
- Enter your Gmail address (e.g., yourname@gmail.com)
- Paste the 16-character App Password you copied

This will automatically update your `backend/.env` file.

### Step 3: Verify It Works

Test your Gmail configuration:

```bash
npm run test-gmail
```

This will:
- ✅ Check all environment variables are set
- ✅ Connect to Gmail SMTP server
- ✅ Send a test email to your Gmail address
- ✅ Show you detailed results

If successful, you'll see: **✨ Gmail is now configured!**

---

## Manual Setup (If Scripts Don't Work)

If the npm scripts don't work, manually edit `backend/.env`:

```bash
cd backend
cat .env  # View current file
```

Replace these lines:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_FROM=your-gmail@gmail.com
```

Replace:
- `your-gmail@gmail.com` with your actual Gmail address
- `xxxx xxxx xxxx xxxx` with your 16-character App Password

---

## Using Password Reset Feature

Once Gmail is configured:

1. **Start Backend**:
   ```bash
   npm run dev
   ```

2. **Start Frontend** (in another terminal):
   ```bash
   npm run dev
   ```

3. **Test the Feature**:
   - Go to http://localhost:5173/auth
   - Click **"Forgot Password?"** link
   - Enter a registered user's email
   - Click **"Send Reset Link"** button
   - Check your Gmail inbox for password reset email
   - Click the link in the email to reset password

---

## Troubleshooting

### "Invalid login" Error

**Problem**: Gmail says credentials are invalid

**Solution**:
```
❌ NOT THIS: Your regular Gmail password
✅ USE THIS: App Password (16 characters with spaces)

Steps:
1. Go to https://myaccount.google.com/apppasswords
2. Delete the old App Password
3. Generate a NEW one
4. Copy the exact 16 characters (with spaces)
5. Update EMAIL_PASSWORD in .env
6. Restart backend: npm run dev
```

### "2-Step Verification" Required

**Problem**: Google won't let you create an App Password

**Solution**:
1. Go to: https://myaccount.google.com/security
2. Click **"2-Step Verification"**
3. Select **"Authenticator app"** or **"Phone"**
4. Follow Google's setup steps
5. Once enabled, create your App Password

### Email Not Arriving

**Problem**: Email doesn't appear in inbox

**Solutions**:
1. Check **Spam/Promotions folder** in Gmail
2. Check **backend console** for error messages
3. Run: `npm run test-gmail` to verify connection
4. Check email is spelled correctly in reset form

### Connection Timeout

**Problem**: "Connection timeout" or "ECONNREFUSED" error

**Solution**:
```
Verify your .env has:
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false

If still failing:
- Restart backend server
- Check your internet connection
- Try: npm run test-gmail
```

### "Less secure app" Error

**Problem**: Gmail says you're using a less secure app

**Solution**:
Gmail no longer accepts regular passwords for security reasons:
1. You MUST use **App Password**, not regular Gmail password
2. Go to: https://myaccount.google.com/apppasswords
3. Generate and use the 16-character password
4. Gmail will accept it with 2FA enabled

---

## Debugging Commands

### View Current Configuration

```bash
cd backend
cat .env
# Shows: EMAIL_USER, EMAIL_PASSWORD, etc.
```

### Test Gmail Connection

```bash
npm run test-gmail
```

This shows:
- ✅/❌ Environment variables
- ✅/❌ SMTP connection
- ✅/❌ Test email send
- 💡 Helpful hints if there's an error

### View Backend Logs

Keep this terminal open while testing:

```bash
npm run dev
```

Watch for messages:
- `📧 Email Configuration:` - Shows your settings
- `🔄 Attempting to send...` - Sending reset email
- `✅ Email sent successfully!` - Success!
- `❌ Error sending email:` - Failed (see error details)

---

## How It Works

```
1. User clicks "Forgot Password?" on login page
   ↓
2. User enters email address
   ↓
3. Backend generates random reset token
   ↓
4. Token is hashed and stored in database (30 min expiration)
   ↓
5. Nodemailer connects to Gmail SMTP
   ↓
6. Email sent with reset link
   ↓
7. User receives email in Gmail inbox
   ↓
8. User clicks link → Reset password page
   ↓
9. User enters new password
   ↓
10. Backend verifies token and updates password
   ↓
11. User auto-logged in → Dashboard
```

---

## Environment Variables Reference

| Variable | Example | Required |
|----------|---------|----------|
| `EMAIL_HOST` | `smtp.gmail.com` | ✅ Yes |
| `EMAIL_PORT` | `587` | ✅ Yes |
| `EMAIL_SECURE` | `false` | ✅ Yes |
| `EMAIL_USER` | `yourname@gmail.com` | ✅ Yes |
| `EMAIL_PASSWORD` | `xxxx xxxx xxxx xxxx` | ✅ Yes |
| `EMAIL_FROM` | `yourname@gmail.com` | ✅ Yes |
| `FRONTEND_URL` | `http://localhost:5173` | ✅ Yes |

---

## Important Notes

⚠️ **App Password vs Regular Password**:
- 🚫 Regular Gmail password = WON'T WORK
- ✅ 16-character App Password = WORKS
- Required: 2-Step Verification enabled

⚠️ **Spaces Matter**:
- App Password looks like: `xxxx xxxx xxxx xxxx`
- Keep the spaces when copying/pasting
- Do NOT remove the spaces

⚠️ **Token Expiration**:
- Reset links valid for **30 minutes only**
- After 30 mins, user must request new link
- Token is one-time use only

⚠️ **Security**:
- App Password only for Gmail service
- Never commit `.env` to version control
- Use different passwords for each App Password
- Consider rotating App Passwords periodically

---

## Testing Checklist

- [ ] Gmail 2-Step Verification enabled
- [ ] App Password generated and copied
- [ ] `backend/.env` updated with credentials
- [ ] `npm run test-gmail` shows success
- [ ] Backend started: `npm run dev`
- [ ] Frontend started: `npm run dev`
- [ ] Can click "Forgot Password?" link
- [ ] Can enter email in dialog
- [ ] Email received in Gmail 5-10 seconds
- [ ] Can click reset link from email
- [ ] Can reset password successfully
- [ ] Auto-logged in after reset
- [ ] New password works on next login

---

## Still Having Issues?

1. **Run the test**:
   ```bash
   npm run test-gmail
   ```

2. **Check backend logs**:
   - What does `npm run dev` show?
   - Any error messages?

3. **Verify credentials**:
   ```bash
   cat .env | grep EMAIL
   ```

4. **Common mistakes**:
   - Using regular Gmail password instead of App Password
   - 2-Step Verification not enabled
   - Spaces removed from App Password
   - Wrong email address
   - Port 465 instead of 587

5. **Get help**:
   - Check the error message in backend console
   - `npm run test-gmail` provides detailed debugging
   - Review Gmail App Password requirements: https://myaccount.google.com/apppasswords

---

## Example: Successful Test Output

```
╔════════════════════════════════════════════════════════════╗
║           Testing Gmail Configuration                      ║
╚════════════════════════════════════════════════════════════╝

📋 Checking environment variables...

✅ EMAIL_HOST: smtp.gmail.com
✅ EMAIL_PORT: 587
✅ EMAIL_SECURE: false
✅ EMAIL_USER: yourname@gmail.com
✅ EMAIL_PASSWORD: ****xxxx
✅ EMAIL_FROM: yourname@gmail.com

🔌 Attempting to connect to Gmail SMTP server...

✅ SMTP connection successful!

📧 Attempting to send test email...

✅ Test email sent successfully!

📨 Details:
   Message ID: xxxxx@gmail.com
   To: yourname@gmail.com
   From: yourname@gmail.com

✨ Gmail is now configured for password reset emails!

🚀 You can now:
   1. Start your backend server: npm run dev
   2. Go to http://localhost:5173/auth
   3. Click "Forgot Password?"
   4. Enter your email to receive password reset link
```

---

## Next: Deploy to Production

When deploying your app:

1. **Use production email service**:
   - ✅ Gmail (personal projects)
   - ✅ SendGrid (recommended for production)
   - ✅ AWS SES
   - ✅ Mailtrap (testing only)

2. **Update environment variables**:
   - Set in hosting platform (Vercel, Heroku, etc.)
   - Do NOT commit `.env` to git

3. **Use HTTPS**: 
   - All password reset links must use HTTPS
   - Update `FRONTEND_URL` to your domain

4. **Monitor**: 
   - Watch email delivery rates
   - Set up alerts for email failures

See `EMAIL_PROVIDERS.md` for production setup options.
