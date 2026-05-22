# 💾 Save & Export Feature Documentation

## Overview

CollabEdit Pro now allows users to save their edited documents and access them later. You can save documents to the server, download to your computer, or export as PDF.

## 🎯 Features

### 1. Save to Server
- Save edited content to MongoDB
- Access from any device
- Share with team members
- Automatic versioning

### 2. Download to Computer
- Download directly to your C: drive or any location
- Multiple format support
- Instant download
- No server storage needed

### 3. Export as PDF
- Convert to PDF format
- Professional document export
- Shareable format
- Print-ready

## 🚀 How to Use

### Save Edited Document

1. **Edit Your Document**
   - Upload a PDF/Word document
   - Make your changes in the editor
   - Content is automatically synced

2. **Click Save Button**
   - Click "💾 Save" in the header
   - Save dialog opens

3. **Enter Details**
   - File Name: Enter desired name
   - Format: Choose format (.txt, .md, .json, etc.)
   - Click "Save to Server"

4. **Access Later**
   - Click "📂 Files" to see all saved documents
   - Click any document to load it
   - Continue editing

### Download to Computer

1. **Click Save Button**
2. **Enter File Name**
3. **Click "⬇️ Download to Computer"**
4. **File saves to your Downloads folder**

You can then:
- Move to C: drive
- Move to any folder
- Email to others
- Upload to cloud storage

### Export as PDF

1. **Click Save Button**
2. **Enter File Name**
3. **Click "📄 Export as PDF"**
4. **PDF downloads to your computer**

## 📁 File Formats Supported

### Save Formats
- **.txt** - Plain text
- **.md** - Markdown
- **.json** - JSON data
- **.xml** - XML data
- **.csv** - CSV data
- **.html** - HTML document

### Export Formats
- **PDF** - Portable Document Format
- **TXT** - Plain text (via download)

## 🔄 Workflow Examples

### Example 1: Edit PDF and Save

```
1. Upload PDF from C:\Documents\report.pdf
2. Content loads in editor
3. Make edits (add text, modify content)
4. Click "💾 Save"
5. Enter name: "edited-report"
6. Choose format: .txt
7. Click "Save to Server"
8. ✅ Saved! Access anytime from "Files"
```

### Example 2: Edit and Download

```
1. Upload Word document
2. Edit content
3. Click "💾 Save"
4. Enter name: "final-version"
5. Click "⬇️ Download to Computer"
6. File saved to C:\Users\YourName\Downloads\final-version.txt
7. Move to desired location
```

### Example 3: Collaborative Editing

```
User A:
1. Upload document
2. Edit content
3. Save to server as "project-draft"

User B (same room):
1. Click "📂 Files"
2. See "project-draft"
3. Click to load
4. Continue editing
5. Save as "project-draft-v2"
```

## 📊 Save Options Comparison

| Feature | Save to Server | Download | Export PDF |
|---------|---------------|----------|------------|
| Access from anywhere | ✅ | ❌ | ❌ |
| Share with team | ✅ | ❌ | ✅ |
| Offline access | ❌ | ✅ | ✅ |
| Version history | ✅ | ❌ | ❌ |
| Format options | Multiple | Multiple | PDF only |
| Storage location | Server | Your computer | Your computer |

## 🎨 User Interface

### Save Dialog

```
┌─────────────────────────────────┐
│  💾 Save Document          ✕   │
├─────────────────────────────────┤
│                                 │
│  File Name                      │
│  [edited-document________]      │
│                                 │
│  Format                         │
│  [Text File (.txt)      ▼]      │
│                                 │
│  [💾 Save to Server]            │
│  [⬇️ Download to Computer]      │
│  [📄 Export as PDF]             │
│                                 │
│  📁 Room: default               │
│  📝 Content: 1,234 characters   │
│  👤 User: John Doe              │
└─────────────────────────────────┘
```

### Saved Documents List

```
┌─────────────────────────────────┐
│  📚 Saved Documents - Room      │
├─────────────────────────────────┤
│  📄 edited-report.txt           │
│  👤 John • 📅 Jan 15 • 📦 2.5KB │
│                            🗑️   │
├─────────────────────────────────┤
│  📄 project-draft.md            │
│  👤 Alice • 📅 Jan 14 • 📦 5KB  │
│                            🗑️   │
└─────────────────────────────────┘
```

## 🔧 API Endpoints

### Save Document
```http
POST /api/save-document
Content-Type: application/json

{
  "content": "Document content...",
  "fileName": "my-document",
  "fileFormat": "txt",
  "roomId": "default",
  "userName": "John Doe"
}

Response:
{
  "success": true,
  "fileId": "...",
  "fileName": "my-document.txt",
  "message": "Document saved successfully"
}
```

### Get Saved Documents
```http
GET /api/saved-documents/:roomId

Response:
{
  "documents": [
    {
      "_id": "...",
      "originalName": "my-document.txt",
      "size": 1024,
      "uploadedAt": "2024-01-15T10:00:00Z",
      "uploadedBy": "John Doe"
    }
  ]
}
```

### Export as PDF
```http
POST /api/export-pdf
Content-Type: application/json

{
  "content": "Document content...",
  "fileName": "my-document"
}

Response: PDF file download
```

## 💡 Tips & Best Practices

### File Naming
- Use descriptive names: "project-report-v2"
- Avoid special characters: / \ : * ? " < > |
- Include version numbers: "draft-v1", "draft-v2"
- Use dates: "report-2024-01-15"

### Format Selection
- **TXT**: Simple text, universal compatibility
- **MD**: Markdown for formatted text
- **JSON**: Structured data
- **HTML**: Web-ready content

### Saving Strategy
1. **Save frequently** - Don't lose work
2. **Use versions** - Keep multiple versions
3. **Descriptive names** - Easy to find later
4. **Download backups** - Keep local copies

### Collaboration
1. **Communicate** - Tell team when you save
2. **Version naming** - Use clear version numbers
3. **Regular saves** - Save after major edits
4. **Review history** - Check previous versions

## 🐛 Troubleshooting

### Save Failed

**Issue**: "Failed to save document"

**Solutions**:
1. Check internet connection
2. Verify backend is running
3. Check MongoDB is connected
4. Try different file name
5. Check file name doesn't contain special characters

### Download Not Working

**Issue**: Download button doesn't work

**Solutions**:
1. Check browser allows downloads
2. Check Downloads folder permissions
3. Try different browser
4. Disable popup blocker

### Can't Find Saved Document

**Issue**: Saved document not showing

**Solutions**:
1. Check correct room selected
2. Refresh the page
3. Click "📂 Files" to reload list
4. Check document was saved successfully

### PDF Export Issues

**Issue**: PDF export fails

**Solutions**:
1. Try downloading as TXT first
2. Check content isn't too large
3. Use online PDF converter
4. Save to server and download later

## 🔒 Security & Privacy

### Data Storage
- Documents stored in MongoDB
- Files stored in uploads/ directory
- Room-based isolation
- User tracking enabled

### Access Control
- Only room members can access
- No public sharing (yet)
- Delete anytime
- Full control over your data

### Backup Recommendations
1. **Regular downloads** - Download important documents
2. **Multiple locations** - Save to cloud storage
3. **Version control** - Keep multiple versions
4. **Export copies** - Export as PDF for archival

## 📈 Future Enhancements

- [ ] Real PDF export (not just text)
- [ ] Word document export (.docx)
- [ ] Version comparison
- [ ] Restore previous versions
- [ ] Share links
- [ ] Collaborative annotations
- [ ] Auto-save drafts
- [ ] Cloud storage integration

## 🆘 Need Help?

- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- See [FILE_UPLOAD.md](FILE_UPLOAD.md)
- Open GitHub issue
- Contact support

---

**Save your work regularly! Don't lose your edits!** 💾
