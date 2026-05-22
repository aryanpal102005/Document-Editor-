# Troubleshooting Guide

## 🔍 Common Issues and Solutions

### MongoDB Issues

#### Issue: MongoDB Connection Failed

**Error:**
```
MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**

1. **Check if MongoDB is running**
```bash
# Windows
tasklist | findstr mongod

# If not running, start it
mongod --dbpath="C:\data\db"
```

2. **Verify MongoDB service**
```bash
# Windows
net start MongoDB

# Check status
sc query MongoDB
```

3. **Check connection string**
```javascript
// backend/server.js
mongoose.connect('mongodb://localhost:27017/collab-editor')
```

4. **Create data directory**
```bash
mkdir C:\data\db
```

---

#### Issue: MongoDB Authentication Failed

**Error:**
```
MongoError: Authentication failed
```

**Solution:**
```javascript
mongoose.connect('mongodb://username:password@localhost:27017/collab-editor', {
  authSource: 'admin'
});
```

---

### Socket.IO Issues

#### Issue: WebSocket Connection Failed

**Error in browser console:**
```
WebSocket connection to 'ws://localhost:5000/socket.io/' failed
```

**Solutions:**

1. **Check backend is running**
```bash
curl http://localhost:5000/health
```

2. **Verify CORS settings**
```javascript
// backend/server.js
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
```

3. **Check firewall**
```bash
# Windows - Allow port 5000
netsh advfirewall firewall add rule name="Node Server" dir=in action=allow protocol=TCP localport=5000
```

4. **Try polling transport**
```javascript
// frontend/src/App.js
const socket = io('http://localhost:5000', {
  transports: ['polling', 'websocket']
});
```

---

#### Issue: Socket Disconnects Frequently

**Solutions:**

1. **Increase timeout**
```javascript
const io = new Server(server, {
  pingTimeout: 60000,
  pingInterval: 25000
});
```

2. **Enable reconnection**
```javascript
const socket = io('http://localhost:5000', {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 10
});
```

---

### Frontend Issues

#### Issue: Module Not Found

**Error:**
```
Module not found: Can't resolve './components/Editor'
```

**Solutions:**

1. **Check file exists**
```bash
dir frontend\src\components\Editor.js
```

2. **Verify import path**
```javascript
import Editor from './components/Editor';  // Correct
import Editor from './components/editor';  // Wrong (case-sensitive)
```

3. **Reinstall dependencies**
```bash
cd frontend
rmdir /s /q node_modules
del package-lock.json
npm install
```

---

#### Issue: React Hooks Error

**Error:**
```
Invalid hook call. Hooks can only be called inside of the body of a function component
```

**Solutions:**

1. **Check React version**
```bash
npm list react react-dom
```

2. **Ensure single React instance**
```bash
cd frontend
npm dedupe
```

3. **Remove duplicate React**
```bash
npm uninstall react react-dom
npm install react@18.2.0 react-dom@18.2.0
```

---

#### Issue: Port 3000 Already in Use

**Error:**
```
Something is already running on port 3000
```

**Solutions:**

1. **Find and kill process**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

2. **Use different port**
```bash
set PORT=3001 && npm start
```

---

### Backend Issues

#### Issue: Port 5000 Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**

1. **Find and kill process**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

2. **Change port**
```javascript
// backend/server.js
const PORT = process.env.PORT || 5001;
```

---

#### Issue: npm install Fails

**Error:**
```
npm ERR! code ENOENT
```

**Solutions:**

1. **Clear npm cache**
```bash
npm cache clean --force
```

2. **Delete lock file**
```bash
del package-lock.json
npm install
```

3. **Update npm**
```bash
npm install -g npm@latest
```

---

### Performance Issues

#### Issue: Slow Document Loading

**Solutions:**

1. **Add database indexes**
```javascript
documentSchema.index({ roomId: 1 });
documentSchema.index({ lastModified: -1 });
```

2. **Reduce save interval**
```javascript
const SAVE_INTERVAL = 10000; // 10 seconds instead of 5
```

3. **Limit history versions**
```javascript
if (doc.history.length >= 20) {  // Reduce from 50
  doc.history = doc.history.slice(-19);
}
```

---

#### Issue: High Memory Usage

**Solutions:**

1. **Clean up inactive rooms**
```javascript
setInterval(() => {
  for (const [roomId, room] of rooms.entries()) {
    if (room.users.size === 0) {
      rooms.delete(roomId);
    }
  }
}, 300000); // Every 5 minutes
```

2. **Limit concurrent connections**
```javascript
io.on('connection', (socket) => {
  if (io.engine.clientsCount > 1000) {
    socket.disconnect();
    return;
  }
  // Continue...
});
```

---

#### Issue: Cursor Lag

**Solutions:**

1. **Throttle cursor updates**
```javascript
let cursorTimeout;
const handleCursorMove = (cursor) => {
  clearTimeout(cursorTimeout);
  cursorTimeout = setTimeout(() => {
    socket.emit('cursor-move', { roomId, cursor });
  }, 100); // Throttle to 100ms
};
```

2. **Reduce cursor update frequency**
```javascript
socket.on('cursor-move', throttle(({ roomId, cursor }) => {
  // Handle cursor
}, 200)); // 200ms throttle
```

---

### Deployment Issues

#### Issue: Build Fails

**Error:**
```
npm ERR! Failed at the build script
```

**Solutions:**

1. **Increase memory**
```bash
set NODE_OPTIONS=--max_old_space_size=4096
npm run build
```

2. **Check for syntax errors**
```bash
npm run lint
```

3. **Clear build cache**
```bash
rmdir /s /q build
npm run build
```

---

#### Issue: Environment Variables Not Working

**Solutions:**

1. **Check .env file location**
```
backend/.env  ✓ Correct
.env          ✗ Wrong
```

2. **Load dotenv**
```javascript
require('dotenv').config();
console.log(process.env.MONGODB_URI);
```

3. **Restart server after changes**

---

### Browser Issues

#### Issue: Changes Not Syncing

**Solutions:**

1. **Check browser console**
```
F12 → Console tab
```

2. **Verify WebSocket connection**
```
F12 → Network tab → WS filter
```

3. **Clear browser cache**
```
Ctrl + Shift + Delete
```

4. **Try incognito mode**

---

#### Issue: Cursor Not Visible

**Solutions:**

1. **Check CSS**
```css
.remote-cursor {
  z-index: 10;
  pointer-events: none;
}
```

2. **Verify cursor data**
```javascript
console.log('Cursors:', cursors);
```

---

### Database Issues

#### Issue: Document Not Saving

**Solutions:**

1. **Check MongoDB logs**
```bash
# Windows
type "C:\Program Files\MongoDB\Server\6.0\log\mongod.log"
```

2. **Verify schema**
```javascript
const doc = new Document({ roomId, content });
await doc.save();
console.log('Saved:', doc._id);
```

3. **Check disk space**
```bash
wmic logicaldisk get size,freespace,caption
```

---

#### Issue: Version Conflicts

**Error:**
```
sync-required event triggered
```

**Solutions:**

1. **Implement proper OT**
```javascript
// Use operational transformation library
npm install ot
```

2. **Add version checking**
```javascript
if (clientVersion < serverVersion - 1) {
  socket.emit('sync-required', { content, version });
}
```

---

## 🔧 Debugging Tools

### Enable Debug Logging

**Backend:**
```javascript
const DEBUG = process.env.DEBUG === 'true';

if (DEBUG) {
  console.log('Room state:', rooms);
  console.log('Active connections:', io.engine.clientsCount);
}
```

**Frontend:**
```javascript
socket.on('*', (event, data) => {
  console.log('Socket event:', event, data);
});
```

---

### Monitor Network Traffic

**Chrome DevTools:**
1. F12 → Network tab
2. Filter: WS (WebSocket)
3. Click connection
4. View Messages tab

---

### Check Server Health

```bash
curl http://localhost:5000/health
```

**Expected response:**
```json
{
  "status": "ok",
  "rooms": 3,
  "connections": 5,
  "uptime": 3600.5
}
```

---

## 📞 Getting Help

### Before Asking for Help

1. Check this troubleshooting guide
2. Search existing GitHub issues
3. Check browser console for errors
4. Check server logs
5. Try with a fresh install

### When Reporting Issues

Include:
- Operating system
- Node.js version (`node --version`)
- npm version (`npm --version`)
- Error messages (full stack trace)
- Steps to reproduce
- Screenshots if applicable

### Useful Commands

```bash
# Check versions
node --version
npm --version
mongod --version

# Check running processes
tasklist | findstr node
tasklist | findstr mongod

# Check ports
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# View logs
type backend\error.log
```

---

## 🆘 Emergency Reset

If nothing works, try a complete reset:

```bash
# Stop all processes
taskkill /F /IM node.exe
taskkill /F /IM mongod.exe

# Clean everything
cd backend
rmdir /s /q node_modules
del package-lock.json

cd ..\frontend
rmdir /s /q node_modules
del package-lock.json

# Reinstall
cd ..\backend
npm install

cd ..\frontend
npm install

# Restart MongoDB
mongod --dbpath="C:\data\db"

# Start servers
cd ..\backend
npm start

# In new terminal
cd frontend
npm start
```

---

**Still having issues?** Open a GitHub issue with detailed information.
