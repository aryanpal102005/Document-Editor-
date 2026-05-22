# File Upload Troubleshooting Guide

## Common Upload Issues

### Issue: "Failed to upload" Error

#### Possible Causes & Solutions:

1. **Backend Not Running**
   ```bash
   # Check if backend is running
   curl http://localhost:5000/health
   
   # If not running, start it
   cd backend
   npm start
   ```

2. **MongoDB Not Connected**
   ```bash
   # Check MongoDB is running
   mongod --dbpath="C:\data\db"
   
   # Check backend logs for MongoDB connection
   ```

3. **Missing Dependencies**
   ```bash
   cd backend
   npm install multer pdf-parse mammoth
   ```

4. **Uploads Directory Missing**
   ```bash
   cd backend
   mkdir uploads
   ```

5. **File Size Too Large**
   - Maximum: 10MB
   - Compress large PDFs
   - Split large documents

6. **Unsupported File Format**
   - Supported: .txt, .doc, .docx, .pdf, .md, .json, .xml, .csv
   - Convert to supported format

### Issue: File Uploads But Content is Empty

#### For PDF Files:

1. **Image-based PDF (Scanned)**
   - PDF contains images, not text
   - Solution: Use OCR software first
   - Recommended: Adobe Acrobat OCR, Online OCR tools

2. **Protected PDF**
   - PDF has security restrictions
   - Solution: Remove password protection first

3. **Corrupted PDF**
   - File may be damaged
   - Solution: Try opening in PDF reader, re-save

#### For Word Documents:

1. **Old .doc Format**
   - Legacy format may have issues
   - Solution: Open in Word, save as .docx

2. **Complex Formatting**
   - Tables, images may cause issues
   - Solution: Copy text to plain document

3. **Corrupted Document**
   - Solution: Open in Word, repair, re-save

### Issue: Upload Button Not Working

1. **Check Browser Console**
   ```
   Press F12 → Console tab
   Look for errors
   ```

2. **Clear Browser Cache**
   ```
   Ctrl + Shift + Delete
   Clear cached files
   ```

3. **Try Different Browser**
   - Chrome (recommended)
   - Firefox
   - Edge

### Issue: CORS Error

**Error in console:**
```
Access to fetch at 'http://localhost:5000/api/upload' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution:**
```javascript
// backend/server.js - Check CORS is enabled
app.use(cors());
```

### Issue: Network Error

1. **Check Backend URL**
   ```javascript
   // frontend/src/components/FileUpload.js
   // Should be: http://localhost:5000/api/upload
   ```

2. **Firewall Blocking**
   ```bash
   # Windows - Allow port 5000
   netsh advfirewall firewall add rule name="Node Server" dir=in action=allow protocol=TCP localport=5000
   ```

## Testing File Upload

### Test 1: Simple Text File

1. Create `test.txt` with content:
   ```
   Hello World
   This is a test
   ```

2. Upload via UI
3. Should load immediately

### Test 2: PDF File

1. Use any text-based PDF
2. Upload via UI
3. Check content extracted

### Test 3: Word Document

1. Create simple .docx file
2. Add some text
3. Upload and verify

## Debug Mode

### Enable Backend Logging

```javascript
// backend/server.js
console.log('File uploaded:', req.file);
console.log('Parsing file...');
console.log('Content extracted:', content.substring(0, 100));
```

### Enable Frontend Logging

```javascript
// frontend/src/components/FileUpload.js
console.log('Uploading:', file.name);
console.log('Response:', data);
```

## Manual Testing

### Test Backend Directly

```bash
# Using curl (Windows)
curl -X POST -F "file=@C:\path\to\test.txt" -F "roomId=default" http://localhost:5000/api/upload

# Using PowerShell
$file = Get-Item "C:\path\to\test.txt"
$form = @{
    file = $file
    roomId = "default"
}
Invoke-RestMethod -Uri "http://localhost:5000/api/upload" -Method Post -Form $form
```

### Test with Postman

1. Open Postman
2. Create POST request: `http://localhost:5000/api/upload`
3. Body → form-data
4. Add key: `file` (type: File)
5. Add key: `roomId` (type: Text, value: "default")
6. Send request

## Check Server Logs

```bash
# Backend terminal should show:
File uploaded: document.pdf
File path: uploads/1234567890-123456789.pdf
File mimetype: application/pdf
Parsing PDF...
PDF parsed, text length: 1234
Content extracted, length: 1234
File saved to database: 507f1f77bcf86cd799439011
```

## Verify Database

```bash
# Connect to MongoDB
mongosh

# Use database
use collab-editor

# Check files collection
db.files.find().pretty()

# Should show uploaded files
```

## Common Error Messages

### "Only documents are allowed"
- File type not supported
- Check file extension
- Rename file with correct extension

### "File too large"
- File exceeds 10MB limit
- Compress or split file

### "No file uploaded"
- File input empty
- Try selecting file again

### "MongoDB connection error"
- Start MongoDB: `mongod`
- Check connection string

### "ENOENT: no such file or directory"
- Uploads folder missing
- Create: `mkdir uploads`

## Still Not Working?

1. **Restart Everything**
   ```bash
   # Stop all servers (Ctrl+C)
   
   # Restart MongoDB
   mongod --dbpath="C:\data\db"
   
   # Restart backend
   cd backend
   npm start
   
   # Restart frontend
   cd frontend
   npm start
   ```

2. **Check All Dependencies**
   ```bash
   cd backend
   npm list multer pdf-parse mammoth
   
   # If missing, install
   npm install
   ```

3. **Check File Permissions**
   - Ensure uploads/ folder is writable
   - Check file read permissions

4. **Try Different File**
   - Use simple .txt file first
   - Verify basic upload works
   - Then try PDF/Word

## Get Help

If still having issues:

1. Check browser console (F12)
2. Check backend terminal logs
3. Copy error messages
4. Open GitHub issue with:
   - Error message
   - File type trying to upload
   - Browser and OS
   - Backend logs

---

**Most Common Fix:** Restart backend server after installing dependencies!
