const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const PDFDocument = require('pdfkit');
const { Document: DocxDocument, Packer, Paragraph, TextRun } = require('docx');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');

const Document = require('./models/Document');
const File = require('./models/File');
const User = require('./models/User');
const ShareableLink = require('./models/ShareableLink');
const { generateToken, authenticate, optionalAuth } = require('./middleware/auth');
const crypto = require('crypto');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000
});
app.use(limiter);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExts = ['.txt', '.doc', '.docx', '.pdf', '.md', '.json', '.xml', '.csv'];
    
    if (allowedExts.includes(ext)) {
      return cb(null, true);
    }
    
    cb(new Error('Only documents are allowed (TXT, DOC, DOCX, PDF, MD, JSON, XML, CSV)'));
  }
});

// File parsing functions
async function parseFile(filePath, mimeType, originalName) {
  try {
    console.log('Parsing file:', originalName, 'Type:', mimeType);
    
    // PDF files
    if (mimeType === 'application/pdf' || originalName.toLowerCase().endsWith('.pdf')) {
      console.log('Parsing PDF...');
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      console.log('PDF parsed, text length:', data.text.length);
      return data.text || 'PDF content extracted (empty or image-based PDF)';
    }
    
    // Word documents (.docx)
    if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
        originalName.toLowerCase().endsWith('.docx')) {
      console.log('Parsing DOCX...');
      const result = await mammoth.extractRawText({ path: filePath });
      console.log('DOCX parsed, text length:', result.value.length);
      return result.value || 'Word document content extracted (empty document)';
    }
    
    // Word documents (.doc)
    if (mimeType === 'application/msword' || originalName.toLowerCase().endsWith('.doc')) {
      console.log('Parsing DOC...');
      try {
        const result = await mammoth.extractRawText({ path: filePath });
        console.log('DOC parsed, text length:', result.value.length);
        return result.value || 'Word document content extracted (empty document)';
      } catch (err) {
        console.log('DOC parsing failed, returning message');
        return 'Unable to extract text from .doc file. Please save as .docx format.';
      }
    }
    
    // Text files (TXT, MD, JSON, XML, CSV)
    const textExts = ['.txt', '.md', '.json', '.xml', '.csv'];
    const ext = path.extname(originalName).toLowerCase();
    
    if (textExts.includes(ext) || mimeType.includes('text') || mimeType.includes('json') || mimeType.includes('xml')) {
      console.log('Reading text file...');
      const content = fs.readFileSync(filePath, 'utf8');
      console.log('Text file read, length:', content.length);
      return content || 'Empty file';
    }
    
    console.log('Unknown file type, returning empty');
    return 'File uploaded but content extraction not supported for this format.';
  } catch (error) {
    console.error('Parse error:', error.message);
    return `Error parsing file: ${error.message}. File uploaded but content could not be extracted.`;
  }
}

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/collab-editor', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB error:', err));

// In-memory state
const rooms = new Map();
const COLORS = ['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7','#DDA0DD','#98D8C8','#F7DC6F','#FF8C94','#74B9FF'];
const SAVE_INTERVAL = 5000;

class Room {
  constructor(roomId) {
    this.roomId = roomId;
    this.users = new Map();
    this.content = '';
    this.version = 0;
    this.pendingSave = null;
    this.operations = [];
  }

  addUser(socketId, userName) {
    const color = COLORS[this.users.size % COLORS.length];
    const user = {
      id: socketId,
      name: userName || `User${this.users.size + 1}`,
      color,
      cursor: null,
      lastActivity: Date.now()
    };
    this.users.set(socketId, user);
    return user;
  }

  removeUser(socketId) {
    this.users.delete(socketId);
    if (this.users.size === 0) {
      this.scheduleSave();
    }
  }

  updateContent(content, socketId) {
    this.content = content;
    this.version++;
    const user = this.users.get(socketId);
    if (user) user.lastActivity = Date.now();
    this.scheduleSave();
  }

  updateCursor(socketId, cursor) {
    const user = this.users.get(socketId);
    if (user) {
      user.cursor = cursor;
      user.lastActivity = Date.now();
    }
  }

  scheduleSave() {
    if (this.pendingSave) clearTimeout(this.pendingSave);
    this.pendingSave = setTimeout(() => this.saveToDb(), SAVE_INTERVAL);
  }

  async saveToDb() {
    try {
      const doc = await Document.findOne({ roomId: this.roomId });
      if (doc) {
        // Keep last 50 versions
        if (doc.history.length >= 50) {
          doc.history = doc.history.slice(-49);
        }
        doc.history.push({
          content: doc.content,
          timestamp: doc.lastModified,
          version: doc.version
        });
        doc.content = this.content;
        doc.version = this.version;
        doc.lastModified = new Date();
        await doc.save();
      } else {
        await Document.create({
          roomId: this.roomId,
          content: this.content,
          version: this.version
        });
      }
      console.log(`💾 Saved room: ${this.roomId} (v${this.version})`);
    } catch (err) {
      console.error('Save error:', err);
    }
  }

  getUserList() {
    return Array.from(this.users.values()).map(u => ({
      id: u.id,
      name: u.name,
      color: u.color,
      cursor: u.cursor
    }));
  }
}

function getRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Room(roomId));
  }
  return rooms.get(roomId);
}

// Socket.IO handlers
io.on('connection', (socket) => {
  let currentRoom = null;
  let currentUser = null;

  socket.on('join-room', async ({ roomId, userName }) => {
    try {
      currentRoom = roomId || 'default';
      const room = getRoom(currentRoom);
      
      // Load from DB if room is empty
      if (room.users.size === 0) {
        const doc = await Document.findOne({ roomId: currentRoom });
        if (doc) {
          room.content = doc.content;
          room.version = doc.version;
        }
      }

      currentUser = room.addUser(socket.id, userName);
      socket.join(currentRoom);

      // Send initial state
      socket.emit('load-document', {
        content: room.content,
        version: room.version,
        user: currentUser
      });

      // Broadcast user list
      io.to(currentRoom).emit('users-update', room.getUserList());
      
      console.log(`✅ [${currentRoom}] ${currentUser.name} joined (${room.users.size} users)`);
    } catch (err) {
      console.error('Join error:', err);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  socket.on('send-changes', ({ roomId, content, cursor, version }) => {
    try {
      const room = getRoom(roomId);
      
      // Remove strict version checking - allow all updates
      room.updateContent(content, socket.id);
      
      // Broadcast to others
      socket.to(roomId).emit('receive-changes', {
        content,
        version: room.version,
        senderId: socket.id
      });

      // Update cursor
      if (cursor !== undefined) {
        room.updateCursor(socket.id, cursor);
        socket.to(roomId).emit('cursor-update', {
          userId: socket.id,
          cursor,
          color: currentUser?.color,
          name: currentUser?.name
        });
      }
    } catch (err) {
      console.error('Change error:', err);
    }
  });

  socket.on('typing-start', ({ roomId }) => {
    try {
      socket.to(roomId).emit('user-typing', {
        userId: socket.id,
        name: currentUser?.name,
        color: currentUser?.color
      });
    } catch (err) {
      console.error('Typing start error:', err);
    }
  });

  socket.on('typing-stop', ({ roomId }) => {
    try {
      socket.to(roomId).emit('user-stopped-typing', {
        userId: socket.id
      });
    } catch (err) {
      console.error('Typing stop error:', err);
    }
  });

  socket.on('cursor-move', ({ roomId, cursor }) => {
    try {
      const room = getRoom(roomId);
      room.updateCursor(socket.id, cursor);
      socket.to(roomId).emit('cursor-update', {
        userId: socket.id,
        cursor,
        color: currentUser?.color,
        name: currentUser?.name
      });
    } catch (err) {
      console.error('Cursor error:', err);
    }
  });

  socket.on('get-history', async ({ roomId }) => {
    try {
      const doc = await Document.findOne({ roomId });
      if (doc) {
        socket.emit('history-data', {
          history: doc.history.slice(-20).reverse()
        });
      }
    } catch (err) {
      console.error('History error:', err);
    }
  });

  socket.on('disconnect', () => {
    if (currentRoom) {
      const room = rooms.get(currentRoom);
      if (room) {
        room.removeUser(socket.id);
        io.to(currentRoom).emit('users-update', room.getUserList());
        console.log(`❌ [${currentRoom}] ${currentUser?.name} left (${room.users.size} users)`);
        
        if (room.users.size === 0) {
          setTimeout(() => {
            if (room.users.size === 0) {
              rooms.delete(currentRoom);
              console.log(`🗑️  Room ${currentRoom} cleaned up`);
            }
          }, 60000);
        }
      }
    }
  });
});

// REST API
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    rooms: rooms.size,
    connections: io.engine.clientsCount,
    uptime: process.uptime()
  });
});

// Authentication Routes

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create user
    const user = new User({ name, email, password });
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax'
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio
      },
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
});

// Get current user
app.get('/api/auth/me', authenticate, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      bio: req.user.bio,
      role: req.user.role,
      createdAt: req.user.createdAt
    }
  });
});

// Update profile
app.put('/api/auth/profile', authenticate, async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Change password
app.put('/api/auth/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both passwords are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/rooms', async (req, res) => {
  try {
    const docs = await Document.find().select('roomId lastModified version').limit(50);
    res.json({ rooms: docs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/room/:roomId/export', async (req, res) => {
  try {
    const doc = await Document.findOne({ roomId: req.params.roomId });
    if (!doc) return res.status(404).json({ error: 'Room not found' });
    res.json({ content: doc.content, version: doc.version });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// File upload endpoint
app.post('/api/upload', (req, res) => {
  upload.single('file')(req, res, async (err) => {
    try {
      // Handle multer errors
      if (err instanceof multer.MulterError) {
        console.error('Multer error:', err);
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ 
            success: false, 
            error: 'File too large. Maximum size is 10MB' 
          });
        }
        return res.status(400).json({ 
          success: false, 
          error: `Upload error: ${err.message}` 
        });
      } else if (err) {
        console.error('Upload error:', err);
        return res.status(400).json({ 
          success: false, 
          error: err.message 
        });
      }

      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          error: 'No file uploaded. Please select a file.' 
        });
      }

      console.log('File uploaded:', req.file.originalname);
      console.log('File path:', req.file.path);
      console.log('File mimetype:', req.file.mimetype);

      const { roomId } = req.body;
      const filePath = req.file.path;
      const mimeType = req.file.mimetype;
      const originalName = req.file.originalname;

      // Parse file content
      const content = await parseFile(filePath, mimeType, originalName);
      console.log('Content extracted, length:', content.length);

      // Save file metadata to database
      const fileDoc = new File({
        originalName: originalName,
        fileName: req.file.filename,
        mimeType: mimeType,
        size: req.file.size,
        roomId: roomId || 'default',
        content: content,
        filePath: filePath,
        uploadedBy: req.body.userName || 'Anonymous'
      });

      await fileDoc.save();
      console.log('File saved to database:', fileDoc._id);

      res.json({
        success: true,
        fileId: fileDoc._id,
        fileName: originalName,
        fileUrl: `/uploads/${req.file.filename}`,
        content: content,
        message: 'File uploaded and parsed successfully'
      });
    } catch (error) {
      console.error('Upload processing error:', error);
      res.status(500).json({ 
        success: false, 
        error: `Server error: ${error.message}` 
      });
    }
  });
});

// Get all files for a room
app.get('/api/files/:roomId', async (req, res) => {
  try {
    const files = await File.find({ roomId: req.params.roomId })
      .select('-content')
      .sort({ uploadedAt: -1 });
    res.json({ files });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific file with content
app.get('/api/file/:fileId', async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    if (!file) return res.status(404).json({ error: 'File not found' });
    
    file.lastAccessed = new Date();
    await file.save();
    
    res.json({
      fileName: file.originalName,
      content: file.content,
      mimeType: file.mimeType,
      size: file.size
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download file
app.get('/api/file/:fileId/download', async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    if (!file) return res.status(404).json({ error: 'File not found' });
    
    res.download(file.filePath, file.originalName);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete file
app.delete('/api/file/:fileId', async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    if (!file) return res.status(404).json({ error: 'File not found' });
    
    // Delete physical file
    if (fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }
    
    // Delete from database
    await File.findByIdAndDelete(req.params.fileId);
    
    res.json({ success: true, message: 'File deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save edited document
app.post('/api/save-document', async (req, res) => {
  try {
    const { content, fileName, fileFormat, roomId, userName } = req.body;

    if (!content || !fileName) {
      return res.status(400).json({ 
        success: false, 
        error: 'Content and file name are required' 
      });
    }

    let fullFileName = `${fileName}.${fileFormat || 'txt'}`;
    const uniqueFileName = `${Date.now()}-${fullFileName}`;
    const filePath = path.join('uploads', uniqueFileName);
    let mimeType = 'text/plain';
    let fileSize = 0;

    // Handle different formats
    if (fileFormat === 'pdf') {
      // Generate PDF
      const pdfDoc = new PDFDocument();
      const writeStream = fs.createWriteStream(filePath);
      
      pdfDoc.pipe(writeStream);
      
      // Add content to PDF
      pdfDoc.fontSize(12);
      const lines = content.split('\n');
      lines.forEach(line => {
        pdfDoc.text(line, {
          width: 500,
          align: 'left'
        });
      });
      
      pdfDoc.end();
      
      // Wait for PDF to be written
      await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });
      
      mimeType = 'application/pdf';
      fileSize = fs.statSync(filePath).size;
      
    } else if (fileFormat === 'docx') {
      // Generate Word document
      const lines = content.split('\n');
      const paragraphs = lines.map(line => 
        new Paragraph({
          children: [new TextRun(line || ' ')]
        })
      );
      
      const doc = new DocxDocument({
        sections: [{
          properties: {},
          children: paragraphs
        }]
      });
      
      const buffer = await Packer.toBuffer(doc);
      fs.writeFileSync(filePath, buffer);
      
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      fileSize = buffer.length;
      
    } else {
      // Save as text file
      fs.writeFileSync(filePath, content, 'utf8');
      fileSize = Buffer.byteLength(content, 'utf8');
      
      // Set appropriate MIME type
      const mimeTypes = {
        'txt': 'text/plain',
        'md': 'text/markdown',
        'json': 'application/json',
        'xml': 'application/xml',
        'csv': 'text/csv',
        'html': 'text/html'
      };
      mimeType = mimeTypes[fileFormat] || 'text/plain';
    }

    // Save to database
    const fileDoc = new File({
      originalName: fullFileName,
      fileName: uniqueFileName,
      mimeType: mimeType,
      size: fileSize,
      roomId: roomId || 'default',
      content: content,
      filePath: filePath,
      uploadedBy: userName || 'Anonymous'
    });

    await fileDoc.save();

    console.log('Document saved:', fullFileName, 'Size:', fileSize);

    res.json({
      success: true,
      fileId: fileDoc._id,
      fileName: fullFileName,
      filePath: filePath,
      message: 'Document saved successfully'
    });
  } catch (error) {
    console.error('Save document error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get saved documents for a room
app.get('/api/saved-documents/:roomId', async (req, res) => {
  try {
    const documents = await File.find({ 
      roomId: req.params.roomId 
    })
    .select('originalName fileName size uploadedAt uploadedBy')
    .sort({ uploadedAt: -1 });
    
    res.json({ documents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export as PDF (simple text to PDF)
app.post('/api/export-pdf', async (req, res) => {
  try {
    const { content, fileName } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const tempFileName = `${Date.now()}-${fileName || 'document'}.pdf`;
    const tempPath = path.join('uploads', tempFileName);
    
    // Create PDF
    const pdfDoc = new PDFDocument();
    const writeStream = fs.createWriteStream(tempPath);
    
    pdfDoc.pipe(writeStream);
    pdfDoc.fontSize(12);
    
    const lines = content.split('\n');
    lines.forEach(line => {
      pdfDoc.text(line, {
        width: 500,
        align: 'left'
      });
    });
    
    pdfDoc.end();
    
    // Wait for PDF to be written
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
    
    res.download(tempPath, `${fileName || 'document'}.pdf`, (err) => {
      if (err) {
        console.error('Download error:', err);
      }
      // Clean up temp file after download
      setTimeout(() => {
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
      }, 5000);
    });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Shareable Link Routes

// Create shareable link
app.post('/api/share/create', optionalAuth, async (req, res) => {
  try {
    console.log('=== SHARE LINK CREATE REQUEST ===');
    console.log('Body:', req.body);
    console.log('User:', req.user ? req.user.name : 'No user');
    console.log('Headers:', req.headers);
    
    const { roomId, expiresIn } = req.body;

    if (!roomId) {
      console.log('ERROR: No roomId provided');
      return res.status(400).json({ success: false, error: 'Room ID is required' });
    }

    const linkId = crypto.randomBytes(8).toString('hex');
    console.log('Generated linkId:', linkId);
    
    let expiresAt = null;
    if (expiresIn && expiresIn > 0) {
      expiresAt = new Date(Date.now() + expiresIn * 60 * 60 * 1000);
      console.log('Expires at:', expiresAt);
    } else {
      console.log('No expiration');
    }

    console.log('Creating ShareableLink document...');
    const shareableLink = new ShareableLink({
      linkId,
      roomId,
      createdBy: req.user?._id,
      createdByName: req.user?.name || 'Anonymous',
      expiresAt
    });

    console.log('Saving to database...');
    await shareableLink.save();
    console.log('✅ Link saved successfully:', linkId);

    const shareUrl = `http://localhost:3000/share/${linkId}`;

    const response = {
      success: true,
      linkId,
      shareUrl,
      roomId,
      expiresAt
    };
    
    console.log('Sending response:', response);
    return res.json(response);
  } catch (error) {
    console.error('❌ Create share link error:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Access shareable link
app.get('/api/share/:linkId', async (req, res) => {
  try {
    const { linkId } = req.params;
    console.log('Accessing share link:', linkId);

    const shareableLink = await ShareableLink.findOne({ linkId, isActive: true });

    if (!shareableLink) {
      console.log('Link not found:', linkId);
      return res.status(404).json({ success: false, error: 'Link not found or expired' });
    }

    if (shareableLink.expiresAt && shareableLink.expiresAt < new Date()) {
      shareableLink.isActive = false;
      await shareableLink.save();
      console.log('Link expired:', linkId);
      return res.status(410).json({ success: false, error: 'Link has expired' });
    }

    shareableLink.accessCount += 1;
    await shareableLink.save();
    console.log('Link accessed successfully:', linkId, 'Count:', shareableLink.accessCount);

    res.json({
      success: true,
      roomId: shareableLink.roomId,
      createdBy: shareableLink.createdByName,
      createdAt: shareableLink.createdAt
    });
  } catch (error) {
    console.error('Access share link error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Deactivate shareable link
app.delete('/api/share/:linkId', authenticate, async (req, res) => {
  try {
    const { linkId } = req.params;

    const shareableLink = await ShareableLink.findOne({ linkId });

    if (!shareableLink) {
      return res.status(404).json({ success: false, error: 'Link not found' });
    }

    if (shareableLink.createdBy && shareableLink.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    shareableLink.isActive = false;
    await shareableLink.save();

    res.json({ success: true, message: 'Link deactivated' });
  } catch (error) {
    console.error('Deactivate share link error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all links for current user
app.get('/api/share/my-links', authenticate, async (req, res) => {
  try {
    const links = await ShareableLink.find({ 
      createdBy: req.user._id,
      isActive: true 
    }).sort({ createdAt: -1 });

    res.json({ success: true, links });
  } catch (error) {
    console.error('Get my links error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Export as Word document
app.post('/api/export-docx', async (req, res) => {
  try {
    const { content, fileName } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const tempFileName = `${Date.now()}-${fileName || 'document'}.docx`;
    const tempPath = path.join('uploads', tempFileName);
    
    // Create Word document
    const lines = content.split('\n');
    const paragraphs = lines.map(line => 
      new Paragraph({
        children: [new TextRun(line || ' ')]
      })
    );
    
    const doc = new DocxDocument({
      sections: [{
        properties: {},
        children: paragraphs
      }]
    });
    
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(tempPath, buffer);
    
    res.download(tempPath, `${fileName || 'document'}.docx`, (err) => {
      if (err) {
        console.error('Download error:', err);
      }
      // Clean up temp file after download
      setTimeout(() => {
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
      }, 5000);
    });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down...');
  for (const room of rooms.values()) {
    await room.saveToDb();
  }
  await mongoose.connection.close();
  server.close(() => process.exit(0));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
