# Password Reset Feature Setup Guide

## ✅ What's Been Added

1. ✅ **Forgot Password Link** on Login page
2. ✅ **Forgot Password Page** - Users can request reset link
3. ✅ **Reset Password Page** - Users can set new password with token
4. ✅ **Email Service** - Sends password reset emails
5. ✅ **Backend Routes** - `/api/auth/forgot-password` and `/api/auth/reset-password`
6. ✅ **Database Table** - `password_reset_tokens` table

---

## 📋 Setup Steps

### Step 1: Update Database Schema

Run the updated `supabase_schema.sql` in Supabase SQL Editor to create the `password_reset_tokens` table.

Or run this SQL separately:

```sql
-- Password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);
```

### Step 2: Install Nodemailer

```bash
npm install nodemailer
```

### Step 3: Configure Email Settings

Update your `.env` file with email configuration. Choose ONE option:

#### Option A: Gmail (Easiest for Development)

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@synnex.co.th
FRONTEND_URL=http://localhost:3000
```

**Gmail Setup:**
1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account → Security → App Passwords
3. Generate an App Password
4. Use that App Password (not your regular password) in `EMAIL_PASSWORD`

#### Option B: SMTP (Any Email Provider)

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password
EMAIL_FROM=noreply@synnex.co.th
FRONTEND_URL=http://localhost:3000
```

#### Option C: SendGrid

```env
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@synnex.co.th
FRONTEND_URL=http://localhost:3000
```

#### Option D: Development Mode (No Email Setup)

If you don't configure email, the system will log emails to console instead of sending them. This is useful for development/testing.

---

## 🧪 Testing the Feature

### 1. Test Forgot Password Flow

1. Go to: http://localhost:3000/login
2. Click "Forgot Password?" link
3. Enter your email address
4. Click "Send Reset Link"
5. Check your email (or console logs if not configured)
6. Click the reset link in the email
7. Enter new password
8. Login with new password

### 2. Test Reset Token Expiration

- Tokens expire after 1 hour
- Used tokens cannot be reused
- Invalid tokens show error message

---

## 📧 Email Template

The reset email includes:
- Professional HTML template
- Reset button
- Plain text fallback
- Expiration warning (1 hour)
- Security notice

---

## 🔒 Security Features

- ✅ Tokens expire after 1 hour
- ✅ Tokens can only be used once
- ✅ Tokens are cryptographically secure (32 bytes random)
- ✅ Doesn't reveal if email exists (security best practice)
- ✅ Password validation (minimum 6 characters)
- ✅ Old tokens are invalidated when new one is requested

---

## 🐛 Troubleshooting

### Emails Not Sending

**Check:**
1. Email configuration in `.env` is correct
2. Nodemailer is installed: `npm install nodemailer`
3. Check console logs for email errors
4. For Gmail: Use App Password, not regular password
5. Check spam folder

### "Invalid or expired reset token"

**Causes:**
- Token already used
- Token expired (>1 hour old)
- Invalid token format
- Token not found in database

**Solution:** Request a new reset link

### Database Errors

**Error:** "relation 'password_reset_tokens' does not exist"
**Solution:** Run the SQL schema update in Supabase

---

## 📝 API Endpoints

### POST `/api/auth/forgot-password`
Request password reset email.

**Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "If that email exists, a password reset link has been sent."
}
```

### POST `/api/auth/reset-password`
Reset password with token.

**Body:**
```json
{
  "token": "reset-token-from-email",
  "password": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Password has been reset successfully."
}
```

---

## 🎯 User Flow

1. User clicks "Forgot Password?" on login page
2. User enters email address
3. System generates secure token and sends email
4. User clicks link in email
5. User enters new password
6. Password is updated
7. User can login with new password

---

## ✅ Checklist

- [ ] Database schema updated (password_reset_tokens table)
- [ ] Nodemailer installed
- [ ] Email configured in `.env`
- [ ] Test forgot password flow
- [ ] Test reset password with token
- [ ] Verify emails are being sent/received

---

## 🚀 Ready to Use!

Once configured, users can reset their passwords by:
1. Clicking "Forgot Password?" on login page
2. Entering their email
3. Following the link in their email
4. Setting a new password

The feature is fully functional and ready to use!

