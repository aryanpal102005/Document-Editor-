# Deployment Guide

## 🚀 Production Deployment Options

### Option 1: Heroku (Easiest)

#### Prerequisites
- Heroku account
- Heroku CLI installed

#### Steps

1. **Prepare the project**
```bash
# Create Procfile in root
echo "web: cd backend && npm start" > Procfile
```

2. **Initialize Heroku**
```bash
heroku login
heroku create your-app-name
```

3. **Add MongoDB**
```bash
heroku addons:create mongolab:sandbox
```

4. **Set environment variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://your-app-name.herokuapp.com
```

5. **Deploy**
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

6. **Open app**
```bash
heroku open
```

---

### Option 2: AWS EC2

#### Prerequisites
- AWS account
- EC2 instance (Ubuntu 20.04 LTS)

#### Steps

1. **Connect to EC2**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

2. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Install MongoDB**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

4. **Clone and setup**
```bash
git clone https://github.com/your-repo/collab-editor.git
cd collab-editor

# Backend
cd backend
npm install
npm install -g pm2

# Frontend
cd ../frontend
npm install
npm run build
```

5. **Configure Nginx**
```bash
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/collab-editor
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /home/ubuntu/collab-editor/frontend/build;
        try_files $uri /index.html;
    }

    location /socket.io/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
    }
}
```

6. **Enable site**
```bash
sudo ln -s /etc/nginx/sites-available/collab-editor /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

7. **Start with PM2**
```bash
cd ~/collab-editor/backend
pm2 start server.js --name collab-editor
pm2 startup
pm2 save
```

---

### Option 3: Docker

#### Prerequisites
- Docker installed
- Docker Compose installed

#### Steps

1. **Create Dockerfile for Backend**
```dockerfile
# backend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

2. **Create Dockerfile for Frontend**
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

3. **Create docker-compose.yml**
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    container_name: collab-mongo
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    environment:
      MONGO_INITDB_DATABASE: collab-editor

  backend:
    build: ./backend
    container_name: collab-backend
    restart: always
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/collab-editor
      - PORT=5000

  frontend:
    build: ./frontend
    container_name: collab-frontend
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongo-data:
```

4. **Deploy**
```bash
docker-compose up -d
```

5. **View logs**
```bash
docker-compose logs -f
```

---

### Option 4: DigitalOcean App Platform

#### Steps

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/collab-editor.git
git push -u origin main
```

2. **Create App on DigitalOcean**
- Go to DigitalOcean App Platform
- Click "Create App"
- Connect GitHub repository
- Select branch: `main`

3. **Configure Components**

**Backend:**
- Type: Web Service
- Source Directory: `/backend`
- Build Command: `npm install`
- Run Command: `npm start`
- HTTP Port: 5000

**Frontend:**
- Type: Static Site
- Source Directory: `/frontend`
- Build Command: `npm install && npm run build`
- Output Directory: `build`

4. **Add Database**
- Add MongoDB database component
- Note the connection string

5. **Set Environment Variables**
```
NODE_ENV=production
MONGODB_URI=${db.DATABASE_URL}
```

6. **Deploy**
- Click "Create Resources"
- Wait for deployment

---

## 🔒 SSL/HTTPS Setup

### Using Let's Encrypt (Free)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
sudo certbot renew --dry-run
```

### Using Cloudflare (Free)

1. Add your domain to Cloudflare
2. Update nameservers
3. Enable "Full (strict)" SSL mode
4. Enable "Always Use HTTPS"

---

## 📊 Monitoring

### PM2 Monitoring

```bash
pm2 monit
pm2 logs
pm2 status
```

### Add Health Checks

```javascript
// backend/server.js
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});
```

### Setup Uptime Monitoring

Use services like:
- UptimeRobot (free)
- Pingdom
- StatusCake

---

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        cd backend && npm ci
        cd ../frontend && npm ci
    
    - name: Run tests
      run: |
        cd backend && npm test
        cd ../frontend && npm test
    
    - name: Build frontend
      run: cd frontend && npm run build
    
    - name: Deploy to server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/collab-editor
          git pull
          cd backend && npm install && pm2 restart collab-editor
          cd ../frontend && npm install && npm run build
```

---

## 🛡️ Security Checklist

- [ ] Enable HTTPS/SSL
- [ ] Set secure environment variables
- [ ] Enable rate limiting
- [ ] Add authentication
- [ ] Sanitize user input
- [ ] Use helmet.js for security headers
- [ ] Enable CORS properly
- [ ] Regular security updates
- [ ] Database backups
- [ ] Monitor logs

---

## 📈 Performance Optimization

### Enable Compression

```javascript
const compression = require('compression');
app.use(compression());
```

### Add Caching Headers

```javascript
app.use(express.static('build', {
  maxAge: '1y',
  etag: false
}));
```

### Use CDN

- Cloudflare
- AWS CloudFront
- Fastly

---

## 🔧 Environment Variables

Create `.env` file:

```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb://localhost:27017/collab-editor

# Frontend
FRONTEND_URL=https://your-domain.com

# Security
JWT_SECRET=your-secret-key
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=1000

# Features
SAVE_INTERVAL=5000
MAX_HISTORY_VERSIONS=50
```

---

## 📞 Support

For deployment issues:
- Check logs: `pm2 logs` or `docker-compose logs`
- Verify MongoDB connection
- Check firewall rules
- Ensure ports are open (80, 443, 5000)

---

**Need help?** Open an issue on GitHub or contact support.
