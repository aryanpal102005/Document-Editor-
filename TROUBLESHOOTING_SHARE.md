# 🔧 Shareable Link Troubleshooting Guide

## Quick Fix Steps

### Step 1: Restart Backend Server
```bash
# Stop the backend server (Ctrl+C)
cd backend
npm start
```

### Step 2: Check Backend Console
When you click "Generate Link", you should see:
```
Share link request: { roomId: 'default', expiresIn: 0 }
User: { _id: '...', name: '...', email: '...' }
Generated linkId: a1b2c3d4e5f6g7h8
Link saved successfully: a1b2c3d4e5f6g7h8
```

### Step 3: Check Browser Console
Open browser DevTools (F12) and check Console tab:
```
Generating link for room: default
Token exists: true
Response status: 200
Response data: { success: true, linkId: '...', shareUrl: '...' }
```

## Common Issues & Solutions

### Issue 1: "Failed to generate shareable link"

**Cause**: Backend server not running or crashed

**Solution**:
```bash
# Restart backend
cd backend
npm start

# Check if server is running
# You should see: "🚀 Server running on http://localhost:5000"
```

### Issue 2: Network Error

**Cause**: CORS or connection issue

**Solution**:
1. Check backend is running on port 5000
2. Check frontend is running on port 3000
3. Verify CORS settings in server.js:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Issue 3: MongoDB Error

**Cause**: MongoDB not running or connection failed

**Solution**:
```bash
# Start MongoDB
mongod

# Or on Windows:
mongod --dbpath="C:\data\db"
```

### Issue 4: Model Not Found

**Cause**: ShareableLink model not imported

**Solution**: Already fixed! The model is imported in server.js:
```javascript
const ShareableLink = require('./models/ShareableLink');
```

## Testing the Feature

### Test 1: Generate Link
1. Open http://localhost:3000
2. Login with your account
3. Click "🔗 Share" button
4. Select expiration time
5. Click "✨ Generate Link"
6. You should see a URL like: `http://localhost:3000/share/a1b2c3d4e5f6g7h8`

### Test 2: Copy Link
1. Click "📋 Copy" button
2. You should see "✓ Copied"
3. Paste in notepad to verify

### Test 3: Access Link
1. Copy the generated link
2. Open in new browser tab/incognito window
3. You should automatically join the room
4. See alert: "Joined shared room: default"

### Test 4: Real-time Collaboration
1. Keep both windows open
2. Type in one window
3. Changes should appear in other window instantly

## Debug Commands

### Check MongoDB Connection
```bash
# In MongoDB shell
mongo
use collab-editor
db.shareablelinks.find()
```

### Check Backend Logs
Look for these messages:
- ✅ MongoDB connected
- 🚀 Server running on http://localhost:5000
- Share link request: {...}
- Link saved successfully: ...

### Check Network Tab (Browser DevTools)
1. Open DevTools (F12)
2. Go to Network tab
3. Click "Generate Link"
4. Look for POST request to `/api/share/create`
5. Check Status: should be 200
6. Check Response: should have `success: true`

## Manual API Test

### Using curl (Command Line)
```bash
# Test create link
curl -X POST http://localhost:5000/api/share/create \
  -H "Content-Type: application/json" \
  -d "{\"roomId\":\"default\",\"expiresIn\":0}"

# Expected response:
# {"success":true,"linkId":"...","shareUrl":"...","roomId":"default"}
```

### Using Browser Console
```javascript
// Test in browser console
fetch('http://localhost:5000/api/share/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ roomId: 'default', expiresIn: 0 })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

## Error Messages Explained

### "Room ID is required"
- Missing roomId in request
- Check if roomId prop is passed to ShareLink component

### "Failed to generate link"
- Generic error from backend
- Check backend console for detailed error
- Check MongoDB connection

### "Link not found or expired"
- Link doesn't exist in database
- Link was deactivated
- Link expired (past expiresAt date)

### "Authentication required"
- Token missing or invalid
- Re-login to get new token

## Files to Check

### Backend Files
- ✅ `backend/models/ShareableLink.js` - Model definition
- ✅ `backend/server.js` - API routes (lines with `/api/share/`)
- ✅ `backend/middleware/auth.js` - Authentication

### Frontend Files
- ✅ `frontend/src/components/ShareLink.js` - Share button component
- ✅ `frontend/src/components/ShareLink.css` - Styles
- ✅ `frontend/src/App.js` - Integration (ShareLink component + URL routing)

## Still Not Working?

### Check These:
1. ✅ MongoDB is running
2. ✅ Backend server is running (port 5000)
3. ✅ Frontend is running (port 3000)
4. ✅ No errors in backend console
5. ✅ No errors in browser console
6. ✅ You are logged in
7. ✅ Room ID is not empty

### Get Detailed Logs:
1. Open backend console - see server logs
2. Open browser DevTools (F12) - see client logs
3. Check Network tab - see API requests/responses
4. Check Console tab - see JavaScript errors

### Contact Info:
If still having issues, provide:
- Backend console output
- Browser console output
- Network tab screenshot
- Error message screenshot

---

**Most Common Fix**: Just restart the backend server! 🔄
