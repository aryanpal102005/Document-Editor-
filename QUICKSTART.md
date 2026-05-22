# Quick Start Guide

Get CollabEdit Pro running in 5 minutes!

## ⚡ Prerequisites

Before you begin, make sure you have:
- ✅ Node.js 14+ installed ([Download](https://nodejs.org/))
- ✅ MongoDB 4.4+ installed ([Download](https://www.mongodb.com/try/download/community))
- ✅ Git installed ([Download](https://git-scm.com/))

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/collab-editor.git
cd collab-editor
```

### Step 2: Install Dependencies

```bash
# Install all dependencies at once
npm run install:all

# Or install separately
cd backend
npm install

cd ../frontend
npm install
```

### Step 3: Start MongoDB

**Windows:**
```bash
# Create data directory (first time only)
mkdir C:\data\db

# Start MongoDB
mongod --dbpath="C:\data\db"
```

**macOS/Linux:**
```bash
# Create data directory (first time only)
sudo mkdir -p /data/db
sudo chown -R `id -un` /data/db

# Start MongoDB
mongod
```

### Step 4: Start the Application

**Option A: Use the startup script (Windows)**
```bash
start.bat
```

**Option B: Manual start**

Open 2 terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Step 5: Open in Browser

The app will automatically open at:
```
http://localhost:3000
```

If not, manually open the URL in your browser.

---

## 🎯 First Steps

### 1. Enter Your Name

When you first open the app, you'll be prompted to enter your name.

### 2. Start Typing

Just start typing in the editor! Your changes are automatically saved.

### 3. Test Collaboration

Open the same URL in another browser tab or window:
```
http://localhost:3000
```

Enter a different name and start typing. You'll see:
- ✨ Real-time text synchronization
- 👁️ Live cursor positions
- 👥 Active user list
- 🎨 Color-coded user avatars

### 4. Switch Rooms

Click "Change Room" in the header to create or join different rooms.

### 5. Toggle Theme

Click the 🌙/☀️ button to switch between dark and light themes.

---

## 📱 Testing on Mobile

1. Find your computer's IP address:
   ```bash
   # Windows
   ipconfig
   
   # macOS/Linux
   ifconfig
   ```

2. Open on mobile:
   ```
   http://YOUR_IP_ADDRESS:3000
   ```

---

## 🔧 Configuration

### Change Ports

**Backend (default: 5000):**
```javascript
// backend/server.js
const PORT = 5001; // Change to any port
```

**Frontend (default: 3000):**
```bash
# Windows
set PORT=3001 && npm start

# macOS/Linux
PORT=3001 npm start
```

### Change MongoDB Connection

```javascript
// backend/server.js
mongoose.connect('mongodb://localhost:27017/my-custom-db');
```

---

## 🎨 Customization

### Change User Colors

```javascript
// backend/server.js
const COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  // Add more colors...
];
```

### Change Auto-save Interval

```javascript
// backend/server.js
const SAVE_INTERVAL = 3000; // 3 seconds (default: 5000)
```

---

## 🐛 Troubleshooting

### MongoDB Won't Start

**Error:** `Data directory not found`

**Solution:**
```bash
mkdir C:\data\db
mongod --dbpath="C:\data\db"
```

### Port Already in Use

**Error:** `EADDRINUSE: address already in use`

**Solution:**
```bash
# Find process using port
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F
```

### Changes Not Syncing

**Solution:**
1. Check browser console (F12)
2. Verify backend is running
3. Check WebSocket connection in Network tab
4. Try refreshing the page

### Can't Connect to MongoDB

**Solution:**
1. Ensure MongoDB is running: `mongod`
2. Check connection string in `server.js`
3. Verify port 27017 is not blocked

---

## 📚 Next Steps

Now that you're up and running:

1. **Read the docs:**
   - [README.md](README.md) - Full documentation
   - [API.md](API.md) - API reference
   - [FEATURES.md](FEATURES.md) - Feature list

2. **Explore features:**
   - Try multiple rooms
   - Test with multiple users
   - Check the user list
   - View connection status

3. **Customize:**
   - Change colors
   - Modify themes
   - Add your own features

4. **Deploy:**
   - See [DEPLOYMENT.md](DEPLOYMENT.md)
   - Deploy to Heroku, AWS, or DigitalOcean

5. **Contribute:**
   - See [CONTRIBUTING.md](CONTRIBUTING.md)
   - Report bugs or request features
   - Submit pull requests

---

## 💡 Tips & Tricks

### Keyboard Shortcuts

- `Ctrl + A` - Select all
- `Ctrl + Z` - Undo
- `Ctrl + Y` - Redo
- `Tab` - Insert tab (2 spaces)

### Best Practices

1. **Use descriptive room names** - e.g., "project-alpha", "meeting-notes"
2. **Keep documents under 1MB** - For best performance
3. **Use dark theme** - Easier on the eyes for long sessions
4. **Check connection status** - Green = connected, Red = disconnected

### Performance Tips

1. **Close unused tabs** - Reduces server load
2. **Use latest browser** - Chrome, Firefox, or Edge
3. **Stable internet** - For best real-time experience
4. **Clear browser cache** - If experiencing issues

---

## 🆘 Need Help?

- **Documentation**: Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Issues**: [GitHub Issues](https://github.com/your-repo/collab-editor/issues)
- **Questions**: [GitHub Discussions](https://github.com/your-repo/collab-editor/discussions)

---

## 🎉 You're All Set!

Enjoy using CollabEdit Pro! Happy collaborating! 🚀

**Star the repo** ⭐ if you find it useful!
