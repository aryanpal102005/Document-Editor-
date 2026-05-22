# 💾 Quick Save Reference Guide

## All Save Options

### 1. 💾 Save to Server & Storage
**What it does:**
- Saves file to `backend/uploads/` folder
- Stores metadata in MongoDB
- Access anytime from File Manager
- Share with team members

**Formats Available:**
- ✅ PDF Document (.pdf)
- ✅ Word Document (.docx)
- ✅ Text File (.txt)
- ✅ Markdown (.md)
- ✅ JSON (.json)
- ✅ XML (.xml)
- ✅ CSV (.csv)
- ✅ HTML (.html)

**How to use:**
```
1. Click "💾 Save" button
2. Enter file name
3. Select format (PDF/Word/Text/etc.)
4. Click "Save to Server & Storage"
5. ✅ Done! File saved in uploads folder
```

---

### 2. ⬇️ Download to Computer
**What it does:**
- Downloads file to your Downloads folder
- Can move to C: drive or anywhere
- Offline access
- No server storage

**How to use:**
```
1. Click "💾 Save" button
2. Enter file name
3. Select format
4. Click "Download to Computer"
5. File downloads to Downloads folder
6. Move to C:\Documents\ or anywhere
```

---

### 3. 📄 Export as PDF
**What it does:**
- Converts content to PDF
- Downloads to computer
- Professional format
- Print-ready

**How to use:**
```
1. Click "💾 Save" button
2. Enter file name
3. Click "Export as PDF"
4. PDF downloads to computer
```

---

### 4. 📝 Export as Word
**What it does:**
- Converts content to Word (.docx)
- Downloads to computer
- Editable in MS Word
- Professional format

**How to use:**
```
1. Click "💾 Save" button
2. Enter file name
3. Click "Export as Word"
4. Word document downloads
```

---

## Quick Comparison

| Option | Server Storage | Computer | Format Options | Access Later |
|--------|---------------|----------|----------------|--------------|
| **Save to Server** | ✅ | ❌ | All formats | ✅ |
| **Download** | ❌ | ✅ | All formats | ❌ |
| **Export PDF** | ❌ | ✅ | PDF only | ❌ |
| **Export Word** | ❌ | ✅ | Word only | ❌ |

---

## Common Workflows

### Workflow 1: Save for Team
```
Goal: Share with team members

Steps:
1. Edit document
2. Save to Server (PDF or Word)
3. Team can access from File Manager
4. Everyone can load and edit
```

### Workflow 2: Personal Backup
```
Goal: Keep on your computer

Steps:
1. Edit document
2. Download to Computer
3. File saves to Downloads
4. Move to C:\Documents\
```

### Workflow 3: Multiple Backups
```
Goal: Save everywhere

Steps:
1. Edit document
2. Save to Server (for team)
3. Export as PDF (for printing)
4. Export as Word (for editing)
5. Download as Text (for backup)
```

### Workflow 4: PDF to Word Conversion
```
Goal: Convert PDF to editable Word

Steps:
1. Upload PDF file
2. Content loads in editor
3. Save as Word Document (.docx)
4. Download or save to server
5. Now editable in MS Word!
```

---

## Storage Locations

### Server Storage
```
Location: backend/uploads/
Path: C:\collab-editor\backend\uploads\
Files: 1234567890-filename.pdf
Access: File Manager in app
```

### Computer Storage
```
Location: Downloads folder
Path: C:\Users\YourName\Downloads\
Files: filename.pdf
Access: File Explorer
```

---

## File Formats Explained

### PDF (.pdf)
- **Best for:** Final documents, sharing, printing
- **Pros:** Universal, professional, print-ready
- **Cons:** Not easily editable

### Word (.docx)
- **Best for:** Editable documents, collaboration
- **Pros:** Editable, professional, widely used
- **Cons:** Requires Word or compatible app

### Text (.txt)
- **Best for:** Simple notes, code, quick edits
- **Pros:** Universal, small size, fast
- **Cons:** No formatting

### Markdown (.md)
- **Best for:** Documentation, README files
- **Pros:** Formatted text, version control friendly
- **Cons:** Requires Markdown viewer

---

## Quick Tips

✅ **Save frequently** - Don't lose your work
✅ **Use descriptive names** - Easy to find later
✅ **Choose right format** - PDF for final, Word for editing
✅ **Multiple backups** - Server + Computer
✅ **Organize files** - Use clear naming convention

---

## Keyboard Shortcuts (Future)

- `Ctrl + S` - Quick save
- `Ctrl + Shift + S` - Save as
- `Ctrl + E` - Export menu

---

## Need Help?

**Can't save?**
- Check backend is running
- Check MongoDB connected
- Restart servers

**File not found?**
- Check uploads folder
- Check File Manager
- Verify save was successful

**Format issues?**
- Try different format
- Check file size
- Restart backend

---

**Remember: Save to Server for team access, Download for personal backup!** 💾
