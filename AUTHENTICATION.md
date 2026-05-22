# 🔐 Authentication System Guide

## Features Added

### ✅ Complete Authentication System

1. **User Registration (Signup)**
   - Name, Email, Password
   - Password validation (min 6 characters)
   - Email uniqueness check
   - Secure password hashing (bcrypt)

2. **User Login**
   - Email & Password authentication
   - JWT token generation
   - Secure cookie storage
   - 7-day session

3. **User Profile**
   - View profile information
   - Edit name, bio, avatar
   - Change password
   - Logout functionality

4. **JWT Authentication**
   - Secure token-based auth
   - HTTP-only cookies
   - 7-day expiration
   - Auto-login on refresh

## 🚀 How to Use

### First Time Setup

1. **Start Servers**
```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm start
```

2. **Open App**
```
http://localhost:3000
```

3. **Create Account**
```
Click "Sign up"
Enter:
- Name: John Doe
- Email: john@example.com
- Password: password123
- Confirm Password: password123

Click "✨ Sign Up"
```

4. **Start Collaborating**
```
✅ Logged in automatically
✅ Can now use all features
✅ Profile saved
```

### Login Flow

```
1. Open http://localhost:3000
2. See Login screen
3. Enter email & password
4. Click "🔐 Login"
5. Redirected to editor
```

### Signup Flow

```
1. Open http://localhost:3000
2. Click "Sign up"
3. Fill registration form
4. Click "✨ Sign Up"
5. Account created & logged in
```

### Profile Management

```
1. Click profile avatar (top right)
2. View profile information
3. Click "✏️ Edit Profile"
4. Update name, bio, avatar
5. Click "💾 Save Changes"
```

### Logout

```
1. Click profile avatar
2. Click "🚪 Logout"
3. Redirected to login screen
```

## 🎯 Features

### User Registration
```javascript
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "",
    "bio": ""
  },
  "token": "jwt-token..."
}
```

### User Login
```javascript
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "user": {...},
  "token": "jwt-token..."
}
```

### Get Current User
```javascript
GET /api/auth/me
Headers: Authorization: Bearer <token>

Response:
{
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "",
    "bio": "",
    "role": "user",
    "createdAt": "2024-01-17T..."
  }
}
```

### Update Profile
```javascript
PUT /api/auth/profile
Headers: Authorization: Bearer <token>
{
  "name": "John Smith",
  "bio": "Software Developer",
  "avatar": "https://example.com/avatar.jpg"
}

Response:
{
  "success": true,
  "user": {...}
}
```

### Change Password
```javascript
PUT /api/auth/change-password
Headers: Authorization: Bearer <token>
{
  "currentPassword": "oldpass123",
  "newPassword": "newpass123"
}

Response:
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Logout
```javascript
POST /api/auth/logout

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

## 🔒 Security Features

### Password Security
- **Bcrypt hashing** - Passwords never stored in plain text
- **Salt rounds: 10** - Strong hashing
- **Min length: 6** - Password validation

### JWT Security
- **HTTP-only cookies** - XSS protection
- **7-day expiration** - Auto logout
- **Secure secret key** - Token signing
- **Bearer token support** - API authentication

### Data Protection
- **Email validation** - Valid email format
- **Unique emails** - No duplicate accounts
- **Input sanitization** - SQL injection protection
- **CORS enabled** - Cross-origin security

## 📊 User Model

```javascript
{
  name: String,           // User's full name
  email: String,          // Unique email
  password: String,       // Hashed password
  googleId: String,       // Google OAuth ID (optional)
  avatar: String,         // Profile picture URL
  bio: String,            // User bio
  role: String,           // 'user' or 'admin'
  createdAt: Date,        // Registration date
  lastLogin: Date         // Last login time
}
```

## 🎨 UI Components

### Login Screen
```
┌─────────────────────────────┐
│   ⚡ CollabEdit Pro         │
│   Welcome Back              │
│   Login to continue...      │
│                             │
│   Email                     │
│   [________________]        │
│                             │
│   Password                  │
│   [________________]        │
│                             │
│   [🔐 Login]                │
│                             │
│   Don't have an account?    │
│   Sign up                   │
└─────────────────────────────┘
```

### Signup Screen
```
┌─────────────────────────────┐
│   ⚡ CollabEdit Pro         │
│   Create Account            │
│   Join the platform...      │
│                             │
│   Name                      │
│   [________________]        │
│                             │
│   Email                     │
│   [________________]        │
│                             │
│   Password                  │
│   [________________]        │
│                             │
│   Confirm Password          │
│   [________________]        │
│                             │
│   [✨ Sign Up]              │
│                             │
│   Already have account?     │
│   Login                     │
└─────────────────────────────┘
```

### Profile Modal
```
┌─────────────────────────────┐
│   👤 User Profile      ✕   │
├─────────────────────────────┤
│         [Avatar]            │
│                             │
│      John Doe               │
│   📧 john@example.com       │
│                             │
│   Software Developer        │
│                             │
│   Member since: Jan 2024    │
│                             │
│   [✏️ Edit Profile]         │
│   [🚪 Logout]               │
└─────────────────────────────┘
```

## 🧪 Testing

### Test User Registration
```
1. Open http://localhost:3000
2. Click "Sign up"
3. Enter:
   - Name: Test User
   - Email: test@test.com
   - Password: test123
   - Confirm: test123
4. Click "Sign Up"
5. ✅ Should be logged in
```

### Test Login
```
1. Logout if logged in
2. Enter:
   - Email: test@test.com
   - Password: test123
3. Click "Login"
4. ✅ Should be logged in
```

### Test Profile Update
```
1. Click profile avatar
2. Click "Edit Profile"
3. Change name to "Updated Name"
4. Add bio: "Test bio"
5. Click "Save Changes"
6. ✅ Profile should update
```

### Test Auto-Login
```
1. Login to app
2. Close browser
3. Open browser again
4. Go to http://localhost:3000
5. ✅ Should be logged in automatically
```

## 🐛 Troubleshooting

### Issue: Can't Register

**Error:** "Email already registered"

**Solution:**
- Use different email
- Or delete user from MongoDB:
```bash
mongosh
use collab-editor
db.users.deleteOne({email: "test@test.com"})
```

### Issue: Can't Login

**Error:** "Invalid email or password"

**Solution:**
- Check email spelling
- Check password
- Reset password (future feature)

### Issue: Token Expired

**Error:** "Invalid token"

**Solution:**
- Logout and login again
- Token expires after 7 days

### Issue: Profile Not Updating

**Solution:**
- Check backend is running
- Check token is valid
- Check browser console for errors

## 📈 Future Enhancements

- [ ] Google OAuth Login
- [ ] Facebook Login
- [ ] Password reset via email
- [ ] Email verification
- [ ] Two-factor authentication
- [ ] Profile picture upload
- [ ] User roles & permissions
- [ ] Admin dashboard

## 🔧 Environment Variables

Create `.env` in backend:
```env
JWT_SECRET=your-super-secret-key-change-this
MONGODB_URI=mongodb://localhost:27017/collab-editor
PORT=5000
```

## 📝 Summary

Your project now has:

✅ **Complete Authentication**
- User registration
- User login
- JWT tokens
- Secure cookies

✅ **User Profiles**
- View profile
- Edit profile
- Change password
- Logout

✅ **Security**
- Password hashing
- JWT authentication
- HTTP-only cookies
- Input validation

✅ **UI Components**
- Login screen
- Signup screen
- Profile modal
- Beautiful design

**Ready for production!** 🚀
