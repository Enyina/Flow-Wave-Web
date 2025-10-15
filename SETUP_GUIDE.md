# Password Reset Flow - Setup Guide

## 📦 Implementation Summary

### ✅ Successfully Integrated

**Frontend Components:**
- ✅ `ForgotPassword.js` - Email entry screen
- ✅ `EnterOTP.js` - OTP verification screen  
- ✅ `ResetPassword.js` - New password entry screen
- ✅ Routes added to App.js
- ✅ Signin updated to link to forgot password

**Backend Endpoints:**
- ✅ `POST /api/auth/forgot-password` - Generate and send OTP
- ✅ `POST /api/auth/verify-otp` - Verify OTP and issue reset token
- ✅ `POST /api/auth/reset-password` - Reset password with token
- ✅ Routes added to auth.js

**Database Schema:**
- ✅ User model updated with OTP fields
- ✅ PasswordResetToken model added

### ❌ Not Integrated (Reasons)

**Email Verification Flow:**
- ❌ `/verify-email` endpoint - No email service configured
- ❌ `/resend-code` endpoint - No email service configured
- ❌ `/create-password` endpoint - Current flow requires password at signup

These endpoints require:
1. Email service integration (SendGrid, AWS SES, etc.)
2. Email template system
3. Verification token storage
4. Modified signup flow to separate email verification from password creation

## 🚀 Setup Instructions

### Step 1: Database Setup

You need a MongoDB database. Choose one:

**Option A: MongoDB Atlas (Recommended for development)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Copy connection string for Step 2

**Option B: Local MongoDB**
```bash
# Install MongoDB locally
# macOS
brew install mongodb-community

# Ubuntu
sudo apt-get install mongodb

# Start MongoDB
mongod --dbpath=/path/to/data
```

### Step 2: Configure Environment Variables

Create `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your values:
```env
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/flowwave?retryWrites=true&w=majority"

# Server
PORT=4000
NODE_ENV=development

# JWT Secrets (generate strong random strings)
JWT_ACCESS_TOKEN_SECRET=your_super_secret_access_key_here_min_32_chars
JWT_REFRESH_TOKEN_SECRET=your_super_secret_refresh_key_here_min_32_chars
JWT_ACCESS_EXPIRES=15m
REFRESH_TOKEN_EXPIRES_DAYS=30

# Cookies
COOKIE_DOMAIN=localhost
COOKIE_SECURE=false
```

**Generate secure secrets:**
```bash
# Run this to generate random secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 3: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (if not already done)
cd ..
npm install
```

### Step 4: Run Database Migration

This updates your database schema with the new fields:

```bash
cd backend
npx prisma db push
```

Expected output:
```
✔ Generated Prisma Client
✔ Database synchronized
```

### Step 5: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm start
```

## 🧪 Testing the Password Reset Flow

### 1. Create a Test User (if you don't have one)
```bash
# In your app, go to /signup and create an account
# Or use existing credentials
```

### 2. Initiate Password Reset
1. Navigate to `http://localhost:3000/login`
2. Click "Reset Password?"
3. Enter your email: `test@example.com`
4. Click "Get OTP"

### 3. Get the OTP
**Check your backend console**, you'll see:
```
OTP for test@example.com: 1234
```

### 4. Enter OTP
1. You'll be redirected to `/enter-otp`
2. Enter the 4-digit OTP from console
3. Click "Verify"

### 5. Reset Password
1. Enter new password (requirements):
   - Minimum 8 characters
   - At least 1 uppercase letter
   - At least 1 lowercase letter  
   - At least 1 number
2. Confirm password (must match)
3. Click "Reset Password"

### 6. Login with New Password
- You'll be redirected to `/login`
- Login with your new password

## 📁 File Structure

```
src/
├── components/
│   ├── ForgotPassword.js      ← NEW
│   ├── EnterOTP.js            ← NEW
│   ├── ResetPassword.js       ← NEW
│   └── Signin.js              ← UPDATED
├── App.js                     ← UPDATED (routes)
└── contexts/
    └── AuthContext.js

backend/
├── src/
│   ├── controllers/
│   │   └── authController.js  ← UPDATED
│   └── routes/
│       └── auth.js            ← UPDATED
└── prisma/
    └── schema.prisma          ← UPDATED
```

## 🐛 Troubleshooting

### Database Connection Error
```
Error: P1001: Can't reach database server
```
**Solution:** Check your DATABASE_URL in .env

### Prisma Not Found
```
sh: prisma: not found
```
**Solution:** Use `npx prisma` instead of `prisma`

### OTP Not Working
**Check:**
1. Backend console for the OTP (not sent via email yet)
2. OTP expiry (5 minutes)
3. Email matches the one used in forgot password

### CORS Errors
**Solution:** The backend is configured for the frontend proxy. Make sure:
- Frontend runs on port 3000
- Backend runs on port 4000
- Or update proxy in package.json

## 🔐 Security Notes

### Current Implementation (Development)
- ✅ OTP stored securely with expiry
- ✅ Token-based reset after OTP verification
- ✅ Password hashing with bcrypt
- ✅ Generic responses to prevent user enumeration

### Production Requirements
- ⚠️ Email service integration (SendGrid, AWS SES)
- ⚠️ Rate limiting on OTP requests
- ⚠️ Max OTP verification attempts
- ⚠️ IP-based blocking for abuse
- ⚠️ HTTPS/SSL certificates
- ⚠️ Environment-based COOKIE_SECURE=true

## 📚 API Reference

### POST /api/auth/forgot-password
Request:
```json
{
  "email": "user@example.com"
}
```

Response:
```json
{
  "ok": true
}
```

### POST /api/auth/verify-otp
Request:
```json
{
  "email": "user@example.com",
  "otp": "1234"
}
```

Response:
```json
{
  "ok": true,
  "token": "abc123..."
}
```

### POST /api/auth/reset-password
Request:
```json
{
  "token": "abc123...",
  "password": "NewPassword123"
}
```

Response:
```json
{
  "ok": true
}
```

## ✨ Features Implemented

✅ Pixel-perfect Figma design implementation  
✅ Responsive design (mobile, tablet, desktop)  
✅ Dark mode support throughout  
✅ Smooth animations and transitions  
✅ Form validation with error messages  
✅ Auto-focus and keyboard navigation for OTP  
✅ Countdown timer with resend functionality  
✅ Password strength validation  
✅ Professional error handling  
✅ Loading states for all async operations  
✅ Secure OTP generation and storage  
✅ Token-based password reset  
✅ Generic responses to prevent user enumeration  

## 🎯 What's Next?

For production deployment:
1. Set up email service (SendGrid/AWS SES)
2. Configure email templates for OTP
3. Add rate limiting
4. Set up monitoring and logging
5. Configure SSL/HTTPS
6. Update COOKIE_SECURE and other security settings
7. Set up proper error tracking (Sentry)
