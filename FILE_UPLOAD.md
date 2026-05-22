# 📁 File Upload & Document Editing Feature

## Overview

CollabEdit Pro now supports uploading and editing various document formats including PDF, Word documents, and text files. Users can upload files from their computer (C: drive or any location) or mobile devices, and the content will be automatically extracted and loaded into the collaborative editor.

## 🎯 Supported File Formats

### Documents
- **PDF** (.pdf) - Portable Document Format
- **Word** (.doc, .docx) - Microsoft Word documents
- **Text** (.txt) - Plain text files
- **Markdown** (.md) - Markdown files

### Data Files
- **JSON** (.json) - JavaScript Object Notation
- **XML** (.xml) - Extensible Markup Language
- **CSV** (.csv) - Comma-Separated Values

## 🚀 How to Use

### Upload Files

1. **Click Upload Button**
   - Click the "📤 Upload" button in the header
   - This opens the file upload interface

2. **Select Files**
   - Click the upload area to browse files
   - Or drag and drop files directly
   - Multiple files can be uploaded at once

3. **Automatic Processing**
   - Files are automatically parsed
   - Content is extracted and displayed
   - Text becomes editable in real-time

### Access Files

1. **File Manager**
   - Click "📂 Files" button to open File Manager
   - View all uploaded files in current room
   - Files are organized by upload date

2. **Load File**
   - Click any file card to load it
   - Content appears in the editor
   - All users in the room can see it

3. **Download Files**
   - Click download button (⬇️) on any file
   - Original file is downloaded
   - Preserves original format

### Manage Files

1. **Delete Files**
   - Click delete button (🗑️) on any file
   - Confirm deletion
   - File removed from server and database

2. **File Information**
   - View file name, size, and upload date
   - See file type icon
   - Track last access time

## 📱 Mobile Support

### Upload from Mobile

1. **Open on Mobile Browser**
   ```
   http://YOUR_IP:3000
   ```

2. **Upload Files**
   - Tap "Upload" button
   - Select from:
     - Camera
     - Photo library
     - Files app
     - Cloud storage (Google Drive, iCloud, etc.)

3. **Edit on Mobile**
   - Full editing capabilities
   - Real-time sync with desktop
   - Touch-friendly interface

## 💻 Desktop File Access

### Windows

1. **Browse C: Drive**
   - Click Upload → Browse
   - Navigate to any folder
   - Select documents

2. **Common Locations**
   ```
   C:\Users\YourName\Documents
   C:\Users\YourName\Desktop
   C:\Users\YourName\Downloads
   ```

3. **Network Drives**
   - Access network shares
   - Cloud storage folders
   - External drives

### macOS/Linux

1. **Browse File System**
   - Click Upload → Browse
   - Navigate to any location

2. **Common Locations**
   ```
   ~/Documents
   ~/Desktop
   ~/Downloads
   ```

## 🔧 Technical Details

### File Size Limits

- **Maximum file size**: 10 MB
- **Recommended**: Under 5 MB for best performance
- **Large files**: May take longer to parse

### File Processing

#### PDF Files
- Extracts all text content
- Preserves paragraph structure
- Removes images and formatting
- Uses `pdf-parse` library

#### Word Documents (.docx)
- Extracts text content
- Preserves basic structure
- Removes formatting
- Uses `mammoth` library

#### Word Documents (.doc)
- Basic text extraction
- Legacy format support
- Limited formatting preservation

#### Text Files
- Direct content reading
- UTF-8 encoding
- Preserves all formatting

### Storage

1. **File Storage**
   - Files stored in `backend/uploads/`
   - Unique filename generated
   - Original name preserved in database

2. **Database Storage**
   - File metadata in MongoDB
   - Extracted content cached
   - Room association maintained

3. **Content Extraction**
   - Parsed on upload
   - Cached for quick access
   - Re-parsed if needed

## 🎨 User Interface

### Upload Area

```
┌─────────────────────────────────┐
│         📁                      │
│   Click to upload               │
│   or drag and drop              │
│                                 │
│   TXT, DOC, DOCX, PDF, MD      │
│   JSON, XML, CSV                │
└─────────────────────────────────┘
```

### File Manager

```
┌─────────────────────────────────┐
│  📂 File Manager - Room Name    │
├─────────────────────────────────┤
│  ┌───────┐  ┌───────┐          │
│  │  📄   │  │  📝   │          │
│  │ Doc1  │  │ Doc2  │          │
│  │ 2.5MB │  │ 1.2MB │          │
│  │ ⬇️ 🗑️  │  │ ⬇️ 🗑️  │          │
│  └───────┘  └───────┘          │
└─────────────────────────────────┘
```

## 🔒 Security

### File Validation

- **Type checking**: Only allowed formats
- **Size limits**: Prevents large uploads
- **Virus scanning**: Recommended for production
- **Content sanitization**: Removes malicious code

### Access Control

- **Room-based**: Files isolated by room
- **User tracking**: Upload history maintained
- **Deletion rights**: Any user can delete (configurable)

### Data Privacy

- **Local storage**: Files on your server
- **No external services**: All processing local
- **Encryption**: Add HTTPS in production
- **Backup**: Regular database backups recommended

## 📊 API Endpoints

### Upload File
```http
POST /api/upload
Content-Type: multipart/form-data

Body:
- file: File
- roomId: string
- userName: string (optional)

Response:
{
  "success": true,
  "fileId": "...",
  "fileName": "document.pdf",
  "content": "Extracted text...",
  "fileUrl": "/uploads/..."
}
```

### Get Room Files
```http
GET /api/files/:roomId

Response:
{
  "files": [
    {
      "_id": "...",
      "originalName": "document.pdf",
      "size": 1024000,
      "uploadedAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Get File Content
```http
GET /api/file/:fileId

Response:
{
  "fileName": "document.pdf",
  "content": "Extracted text...",
  "mimeType": "application/pdf",
  "size": 1024000
}
```

### Download File
```http
GET /api/file/:fileId/download

Response: File download
```

### Delete File
```http
DELETE /api/file/:fileId

Response:
{
  "success": true,
  "message": "File deleted"
}
```

## 🐛 Troubleshooting

### Upload Fails

**Issue**: File won't upload

**Solutions**:
1. Check file size (< 10MB)
2. Verify file format is supported
3. Check internet connection
4. Try different browser
5. Clear browser cache

### Content Not Extracted

**Issue**: File uploads but content is empty

**Solutions**:
1. **PDF**: May be image-based (scanned)
   - Use OCR tool first
   - Convert to text-based PDF

2. **Word**: May be corrupted
   - Open and re-save in Word
   - Try exporting as .docx

3. **Encoding**: Wrong character encoding
   - Save as UTF-8
   - Use plain text format

### File Manager Empty

**Issue**: No files showing

**Solutions**:
1. Check correct room selected
2. Refresh the page
3. Verify files uploaded successfully
4. Check browser console for errors

## 🚀 Advanced Usage

### Batch Upload

```javascript
// Upload multiple files at once
const files = document.querySelector('input[type="file"]').files;
for (const file of files) {
  // Upload each file
}
```

### Custom Processing

```javascript
// Add custom file processors
// backend/server.js

async function parseCustomFormat(filePath) {
  // Your custom parsing logic
  return extractedText;
}
```

### File Conversion

```javascript
// Convert between formats
// Example: PDF to Markdown

const content = await parseFile('document.pdf');
const markdown = convertToMarkdown(content);
```

## 📈 Performance Tips

1. **Optimize File Size**
   - Compress PDFs before upload
   - Remove unnecessary images
   - Use text-based formats when possible

2. **Batch Operations**
   - Upload multiple files together
   - Process in background
   - Show progress indicators

3. **Caching**
   - Content cached after first parse
   - Faster subsequent loads
   - Reduces server load

## 🎓 Best Practices

1. **File Naming**
   - Use descriptive names
   - Avoid special characters
   - Include version numbers

2. **Organization**
   - Use separate rooms for projects
   - Delete old files regularly
   - Keep backups of important files

3. **Collaboration**
   - Notify team before uploading
   - Use meaningful file names
   - Document changes in chat

## 🔮 Future Enhancements

- [ ] OCR for scanned PDFs
- [ ] Image file support
- [ ] Excel/spreadsheet support
- [ ] PowerPoint support
- [ ] File versioning
- [ ] File comments
- [ ] File sharing links
- [ ] Folder organization
- [ ] Advanced search
- [ ] File preview
- [ ] Collaborative annotations

---

**Need help?** Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) or open an issue on GitHub.
