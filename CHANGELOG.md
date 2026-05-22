# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-01-15

### 🎉 Major Release - Complete Rewrite

### Added
- **MongoDB Integration** - Persistent document storage with auto-save
- **Room System** - Multiple isolated collaboration rooms
- **Live Cursor Tracking** - See where other users are typing in real-time
- **User Presence** - Color-coded avatars and active user list
- **Version Control** - Track document versions with 50-version history
- **Dark/Light Theme** - Toggle between themes with smooth transitions
- **Connection Status** - Real-time connection indicator
- **Auto-reconnect** - Automatic reconnection on network issues
- **Room Selector** - Easy room switching interface
- **REST API** - Health checks, room listing, document export
- **Rate Limiting** - Protection against abuse (1000 req/15min)
- **Graceful Shutdown** - Proper cleanup on server shutdown
- **Modern UI** - Complete redesign with professional interface
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Custom Scrollbars** - Themed scrollbars matching UI
- **User Dropdown** - View all active collaborators
- **Cursor Labels** - See user names at cursor positions
- **Version Conflict Detection** - Sync detection and resolution

### Changed
- **Complete Backend Rewrite** - From in-memory to MongoDB-backed
- **Socket.IO Enhancement** - Better connection handling and events
- **Editor Component** - New component-based architecture
- **Improved Performance** - Optimized for 100+ concurrent users
- **Better Error Handling** - Comprehensive error management
- **Enhanced Security** - CORS, rate limiting, input validation

### Technical
- React 18.2.0
- Socket.IO 4.8.3
- MongoDB with Mongoose
- Express.js with rate limiting
- Modern CSS with animations
- Component-based architecture

### Documentation
- Comprehensive README
- API documentation
- Advanced features guide
- Deployment guide
- Troubleshooting guide
- Contributing guidelines
- Feature roadmap

---

## [1.0.0] - 2024-01-01

### Initial Release

### Added
- Basic real-time collaborative editing
- Socket.IO WebSocket connection
- Simple textarea editor
- In-memory document storage
- Basic UI with minimal styling
- Connection handling
- Broadcast changes to all users

### Features
- Real-time text synchronization
- Multiple users can edit simultaneously
- Simple and lightweight
- Easy to set up and run

### Technical
- React 19.2.5
- Socket.IO 4.8.3
- Express.js
- In-memory storage

---

## [Unreleased]

### Planned for v2.1
- [ ] Rich text editor with formatting
- [ ] Syntax highlighting for code
- [ ] Line numbers
- [ ] Find and replace
- [ ] Document templates
- [ ] User authentication
- [ ] Room passwords
- [ ] File upload support

### Planned for v2.2
- [ ] Operational Transformation (OT)
- [ ] Offline mode with sync
- [ ] Document folders
- [ ] Advanced version control
- [ ] Diff viewer
- [ ] Export to PDF

### Planned for v3.0
- [ ] Team workspaces
- [ ] Built-in chat
- [ ] Video conferencing
- [ ] SSO integration
- [ ] Enterprise features
- [ ] Mobile apps

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 2.0.0 | 2024-01-15 | Complete rewrite with MongoDB, rooms, cursors |
| 1.0.0 | 2024-01-01 | Initial release with basic features |

---

## Migration Guide

### From v1.0 to v2.0

#### Breaking Changes
1. **Storage** - Documents now stored in MongoDB (not in-memory)
2. **Socket Events** - New event structure with room support
3. **API** - New REST API endpoints

#### Migration Steps

1. **Install MongoDB**
   ```bash
   # Download and install MongoDB
   mongod --dbpath="C:\data\db"
   ```

2. **Update Dependencies**
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. **Update Socket Events**
   ```javascript
   // Old (v1.0)
   socket.emit('send-changes', content);
   
   // New (v2.0)
   socket.emit('send-changes', {
     roomId: 'default',
     content: content,
     cursor: cursorPosition,
     version: version
   });
   ```

4. **Update Environment Variables**
   ```env
   MONGODB_URI=mongodb://localhost:27017/collab-editor
   PORT=5000
   ```

5. **Restart Servers**
   ```bash
   # Use the new start script
   start.bat
   ```

---

## Support

- **Documentation**: See [README.md](README.md)
- **Issues**: [GitHub Issues](https://github.com/your-repo/collab-editor/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/collab-editor/discussions)

---

## Contributors

Thank you to all contributors who helped make this project better!

- [@your-username](https://github.com/your-username) - Creator and maintainer

See [CONTRIBUTING.md](CONTRIBUTING.md) to become a contributor.

---

**Note**: This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for new functionality (backwards compatible)
- **PATCH** version for bug fixes (backwards compatible)


## [2.1.0] - 2024-01-16

### 🎉 File Upload & Document Editing Feature

### Added
- **File Upload System** - Upload documents from computer or mobile
- **PDF Support** - Extract and edit text from PDF files
- **Word Document Support** - Support for .doc and .docx files
- **Multiple Format Support** - TXT, MD, JSON, XML, CSV files
- **File Manager** - Browse, manage, and organize uploaded files
- **Drag & Drop Upload** - Easy drag-and-drop interface
- **File Download** - Download original uploaded files
- **File Deletion** - Remove unwanted files
- **Content Extraction** - Automatic text extraction from documents
- **Mobile Upload** - Upload files from mobile devices
- **File Preview** - View file details before loading
- **Room-based Storage** - Files organized by collaboration room

### Technical
- Multer for file uploads
- pdf-parse for PDF text extraction
- mammoth for Word document parsing
- File metadata stored in MongoDB
- Physical files stored in uploads directory
- RESTful API for file operations

### API Endpoints
- `POST /api/upload` - Upload file
- `GET /api/files/:roomId` - Get room files
- `GET /api/file/:fileId` - Get file content
- `GET /api/file/:fileId/download` - Download file
- `DELETE /api/file/:fileId` - Delete file

### Components
- FileUpload component - Upload interface
- FileManager component - File browser
- File model - MongoDB schema

### Documentation
- FILE_UPLOAD.md - Complete file upload guide
- Updated README.md with file features
- Updated FEATURES.md with capabilities


## [2.2.0] - 2024-01-17

### 🎉 Save & Export Feature

### Added
- **Save to Server** - Save edited documents to MongoDB
- **Download to Computer** - Download files to C: drive or any location
- **Export as PDF** - Export documents as PDF format
- **Saved Documents Manager** - View and access all saved documents
- **Multiple Format Support** - Save as TXT, MD, JSON, XML, CSV, HTML
- **Version Tracking** - Track who saved and when
- **File Size Display** - See document sizes
- **Quick Access** - Load saved documents with one click
- **Delete Saved Documents** - Remove unwanted saved files

### Components
- SaveDocument component - Save dialog interface
- SavedDocuments component - Saved documents browser

### API Endpoints
- `POST /api/save-document` - Save edited content
- `GET /api/saved-documents/:roomId` - Get saved documents
- `POST /api/export-pdf` - Export as PDF

### Features
- Save edited PDFs and Word documents
- Download to local computer
- Access saved documents anytime
- Share saved documents with team
- Multiple format options
- User tracking for saves

### Documentation
- SAVE_FEATURE.md - Complete save feature guide
- Updated README.md
- Updated FEATURES.md
