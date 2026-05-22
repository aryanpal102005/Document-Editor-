# Advanced Features & Configuration

## 🔧 Advanced Configuration

### Environment Variables

Create `.env` file in `backend/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/collab-editor
NODE_ENV=production
FRONTEND_URL=http://localhost:3000
SAVE_INTERVAL=5000
MAX_HISTORY_VERSIONS=50
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=1000
```

### Custom MongoDB Configuration

```javascript
// backend/server.js
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

## 🎨 Customization Guide

### 1. Change User Colors

Edit `backend/server.js`:
```javascript
const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#FF8C94', '#74B9FF', '#A29BFE', '#FD79A8'
];
```

### 2. Adjust Auto-save Interval

```javascript
const SAVE_INTERVAL = 3000; // Save every 3 seconds
```

### 3. Change Editor Font

Edit `frontend/src/components/Editor.css`:
```css
.editor-textarea {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 18px;
  line-height: 28px;
}
```

### 4. Custom Theme Colors

Edit `frontend/src/App.css`:
```css
.app.dark {
  background: #0d1117;
  color: #c9d1d9;
}

.app.light {
  background: #f6f8fa;
  color: #24292f;
}
```

## 🚀 Performance Optimization

### 1. Enable Compression

```bash
npm install compression
```

```javascript
// backend/server.js
const compression = require('compression');
app.use(compression());
```

### 2. Add Redis Caching

```bash
npm install redis
```

```javascript
const redis = require('redis');
const client = redis.createClient();

// Cache frequently accessed rooms
async function getCachedRoom(roomId) {
  const cached = await client.get(`room:${roomId}`);
  if (cached) return JSON.parse(cached);
  
  const room = await Document.findOne({ roomId });
  await client.setEx(`room:${roomId}`, 300, JSON.stringify(room));
  return room;
}
```

### 3. Database Indexing

```javascript
// Add indexes for better query performance
documentSchema.index({ roomId: 1 });
documentSchema.index({ lastModified: -1 });
documentSchema.index({ version: -1 });
```

## 🔐 Security Enhancements

### 1. Add Authentication

```bash
npm install jsonwebtoken bcryptjs
```

```javascript
const jwt = require('jsonwebtoken');

// Middleware
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
```

### 2. Add Room Passwords

```javascript
const roomPasswords = new Map();

socket.on('join-room', async ({ roomId, userName, password }) => {
  if (roomPasswords.has(roomId)) {
    if (roomPasswords.get(roomId) !== password) {
      socket.emit('error', { message: 'Invalid password' });
      return;
    }
  }
  // Continue with join logic...
});
```

### 3. Input Sanitization

```bash
npm install validator
```

```javascript
const validator = require('validator');

socket.on('send-changes', ({ content }) => {
  if (!validator.isLength(content, { max: 1000000 })) {
    socket.emit('error', { message: 'Content too large' });
    return;
  }
  // Continue...
});
```

## 📊 Monitoring & Analytics

### 1. Add Logging

```bash
npm install winston
```

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

logger.info('User joined', { roomId, userName, socketId });
```

### 2. Add Metrics

```javascript
const metrics = {
  totalConnections: 0,
  activeRooms: 0,
  messagesPerSecond: 0,
  avgLatency: 0
};

app.get('/api/metrics', (req, res) => {
  res.json({
    ...metrics,
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});
```

## 🎯 Advanced Features

### 1. Operational Transformation (OT)

```javascript
// Simple OT implementation
function transform(op1, op2) {
  if (op1.position < op2.position) {
    return op1;
  } else if (op1.position > op2.position) {
    op1.position += op2.text.length;
    return op1;
  }
  // Handle conflicts...
}
```

### 2. Presence Awareness

```javascript
socket.on('user-activity', ({ roomId, activity }) => {
  socket.to(roomId).emit('user-status', {
    userId: socket.id,
    activity, // 'typing', 'idle', 'away'
    timestamp: Date.now()
  });
});
```

### 3. Document Locking

```javascript
const locks = new Map();

socket.on('request-lock', ({ roomId, section }) => {
  if (!locks.has(`${roomId}:${section}`)) {
    locks.set(`${roomId}:${section}`, socket.id);
    socket.emit('lock-granted', { section });
  } else {
    socket.emit('lock-denied', { section });
  }
});
```

### 4. Rich Text Support

```bash
npm install quill
```

```javascript
import Quill from 'quill';

const quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['link', 'image', 'code-block']
    ]
  }
});
```

### 5. File Upload Support

```bash
npm install multer
```

```javascript
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/api/upload', upload.single('file'), (req, res) => {
  res.json({ filename: req.file.filename });
});
```

## 🌐 Deployment

### Deploy to Heroku

```bash
# Install Heroku CLI
heroku login
heroku create collab-editor-pro

# Add MongoDB Atlas
heroku addons:create mongolab:sandbox

# Deploy
git push heroku main
```

### Deploy to AWS

```bash
# Use Elastic Beanstalk
eb init
eb create collab-editor-env
eb deploy
```

### Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
  
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/collab-editor
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  mongo-data:
```

## 🧪 Testing

### Unit Tests

```bash
npm install --save-dev jest supertest
```

```javascript
// backend/tests/server.test.js
const request = require('supertest');
const app = require('../server');

describe('API Endpoints', () => {
  test('GET /health returns 200', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});
```

### Integration Tests

```javascript
// frontend/src/App.test.js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders CollabEdit Pro title', () => {
  render(<App />);
  const titleElement = screen.getByText(/CollabEdit Pro/i);
  expect(titleElement).toBeInTheDocument();
});
```

## 📈 Scaling

### Horizontal Scaling with Redis

```javascript
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');

const pubClient = createClient({ host: 'localhost', port: 6379 });
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));
```

### Load Balancing

```nginx
upstream backend {
    server localhost:5000;
    server localhost:5001;
    server localhost:5002;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## 🎓 Best Practices

1. **Always validate input** on both client and server
2. **Use environment variables** for configuration
3. **Implement proper error handling** everywhere
4. **Add comprehensive logging** for debugging
5. **Monitor performance metrics** in production
6. **Regular database backups** for data safety
7. **Use HTTPS** in production
8. **Implement rate limiting** to prevent abuse
9. **Keep dependencies updated** for security
10. **Write tests** for critical functionality

---

For more information, visit the [GitHub repository](https://github.com/your-repo/collab-editor)
