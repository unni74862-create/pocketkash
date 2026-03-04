# Email Provider Configuration Guide

## Quick Setup for Different Providers

### 1. Gmail (Recommended for Development)

1. **Enable 2-Factor Authentication on your Gmail account**
2. **Create an App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Generate password
   - Copy the 16-character password

3. **Update backend/.env:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_FROM=your-email@gmail.com
```

---

### 2. Mailtrap (Best for Testing - Free)

1. **Sign up at:** https://mailtrap.io
2. **Create a new inbox**
3. **Get SMTP credentials from inbox settings**

3. **Update backend/.env:**
```env
EMAIL_HOST=live.smtp.mailtrap.io
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=your-mailtrap-email@mailtrap.io
EMAIL_PASSWORD=your-mailtrap-password
EMAIL_FROM=noreply@pocketkash.com
```

---

### 3. SendGrid (Production Ready - Free tier available)

1. **Sign up at:** https://sendgrid.com
2. **Create API Key:**
   - Go to: Settings > API Keys
   - Create new API Key
   - Copy the API Key

3. **Update backend/.env:**
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.your-api-key-here
EMAIL_FROM=noreply@yourdomain.com
```

---

### 4. AWS SES (Production Ready - Pay per use)

1. **Set up AWS SES:**
   - Go to: https://console.aws.amazon.com/ses/
   - Request production access (may need manual approval)
   - Verify sending email address or domain

2. **Create SMTP credentials:**
   - Go to: Account Dashboard > SMTP Settings
   - Generate SMTP credentials

3. **Update backend/.env:**
```env
EMAIL_HOST=email-smtp.region.amazonaws.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=your-ses-username
EMAIL_PASSWORD=your-ses-password
EMAIL_FROM=noreply@yourdomain.com
```

---

### 5. Resend (Modern, Development Focused)

1. **Sign up at:** https://resend.com
2. **Get API Key from dashboard**

3. Note: For Resend, you'll need to modify the email.js file to use their API instead of Nodemailer. Alternative libraries needed.

---

## Testing Email Configuration

### Method 1: Using Mailtrap Console
1. Send an email via forgot password
2. Check Mailtrap inbox immediately
3. View full email headers and content

### Method 2: Using Gmail
1. Go to Gmail account
2. Check "Forwarding and POP/IMAP" settings
3. Email should appear in inbox within seconds

### Method 3: Console Logging
If `EMAIL_HOST` is not configured, the reset URL will log to console:
```
Email configuration not set. Password reset emails will not be sent.
Password reset for user@example.com: http://localhost:5173/reset-password/abc123...
```

---

## Environment Variables Reference

| Variable | Required | Example |
|----------|----------|---------|
| `EMAIL_HOST` | Yes | smtp.gmail.com |
| `EMAIL_PORT` | Yes | 587 or 465 |
| `EMAIL_SECURE` | Yes | true or false |
| `EMAIL_USER` | Yes | your-email@gmail.com |
| `EMAIL_PASSWORD` | Yes | xxxx xxxx xxxx xxxx |
| `EMAIL_FROM` | Yes | noreply@pocketkash.com |
| `FRONTEND_URL` | Yes | http://localhost:5173 |

---

## Troubleshooting

### "Email not sending"
- Check credentials are correct
- Verify `EMAIL_HOST` and `EMAIL_PORT` are correct
- For Gmail: Ensure App Password (not regular password)
- Check firewall isn't blocking SMTP port

### "Invalid email format"
- Verify `EMAIL_FROM` is a valid email address
- Check `EMAIL_USER` matches the account

### "Connection timeout"
- Verify `EMAIL_PORT` is correct (587 for TLS, 465 for SSL)
- Check `EMAIL_SECURE` setting (true for 465, false for 587)

### "Authentication failed"
- Re-check `EMAIL_USER` and `EMAIL_PASSWORD`
- For Gmail, ensure 2FA is enabled and using App Password
- For Mailtrap, verify credentials from dashboard

---

## Testing Locally Without Email

If you want to test without actually sending emails:

1. **Keep EMAIL variables empty** in .env
2. The app will log reset URLs to console:
```
Password reset for user@example.com: http://localhost:5173/reset-password/token123
```
3. Copy the URL and test the reset flow manually

---

## Production Deployment

When going to production:

1. **Use Mailtrap/SendGrid/AWS SES** instead of Gmail
2. **Set FRONTEND_URL to your domain:**
   ```env
   FRONTEND_URL=https://yourdomain.com
   ```
3. **Security headers:** Add DMARC, SPF, DKIM records to your domain
4. **Rate limiting:** Consider adding rate limiting to prevent abuse
5. **Monitor:** Track email delivery rates and failures

---

## Common Issues & Solutions

**Gmail "Less secure app" error:**
- Gmail no longer supports "Less secure apps"
- Must use App Password with 2FA enabled

**Port 587 vs 465:**
- 587: TLS (STARTTLS) - Set SECURE to false
- 465: SSL - Set SECURE to true

**Email appears but in wrong sender:**
- Some providers require verified From address
- Check your email service provider's restrictions

**Reset link looks wrong:**
- Verify `FRONTEND_URL` is set correctly
- Link should be: `{FRONTEND_URL}/reset-password/{token}`
