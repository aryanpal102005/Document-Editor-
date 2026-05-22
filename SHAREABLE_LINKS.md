# 🔗 Shareable Link System

## Overview
The shareable link system allows users to create unique URLs for documents that can be shared with others for real-time collaboration.

## Features

### ✨ Core Features
- **Unique Link Generation**: Create unique shareable links for any room/document
- **Expiration Options**: Set link expiration (1 hour, 24 hours, 7 days, 30 days, or never)
- **Access Tracking**: Track how many times a link has been accessed
- **Link Management**: Deactivate links when no longer needed
- **Anonymous Sharing**: Share links even without authentication
- **Auto Room Join**: Recipients automatically join the correct room

### 🔄 Workflow

```
User A (Creator)
  ↓
1. Opens document in room
  ↓
2. Clicks "🔗 Share" button
  ↓
3. Selects expiration time (optional)
  ↓
4. Clicks "Generate Link"
  ↓
5. Copies shareable URL
  ↓
6. Shares URL with User B

User B (Recipient)
  ↓
1. Opens shared URL
  ↓
2. Automatically joins room
  ↓
3. Sees same document
  ↓
4. Can edit in real-time
```

## API Endpoints

### Create Shareable Link
```http
POST /api/share/create
Content-Type: application/json
Authorization: Bearer <token> (optional)

{
  "roomId": "default",
  "expiresIn": 24  // hours (0 = never expires)
}

Response:
{
  "success": true,
  "linkId": "a1b2c3d4e5f6g7h8",
  "shareUrl": "http://localhost:3000/share/a1b2c3d4e5f6g7h8",
  "roomId": "default",
  "expiresAt": "2024-01-15T10:30:00.000Z"
}
```

### Access Shareable Link
```http
GET /api/share/:linkId

Response:
{
  "success": true,
  "roomId": "default",
  "createdBy": "John Doe",
  "createdAt": "2024-01-14T10:30:00.000Z"
}
```

### Deactivate Link
```http
DELETE /api/share/:linkId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Link deactivated"
}
```

### Get My Links
```http
GET /api/share/my-links
Authorization: Bearer <token>

Response:
{
  "links": [
    {
      "linkId": "a1b2c3d4e5f6g7h8",
      "roomId": "default",
      "createdBy": "user_id",
      "createdByName": "John Doe",
      "expiresAt": "2024-01-15T10:30:00.000Z",
      "accessCount": 5,
      "isActive": true,
      "createdAt": "2024-01-14T10:30:00.000Z"
    }
  ]
}
```

## Database Schema

### ShareableLink Model
```javascript
{
  linkId: String,           // Unique 16-character hex ID
  roomId: String,           // Target room ID
  createdBy: ObjectId,      // User who created (optional)
  createdByName: String,    // Creator's name
  expiresAt: Date,          // Expiration date (null = never)
  accessCount: Number,      // Number of times accessed
  isActive: Boolean,        // Link status
  createdAt: Date,          // Creation timestamp
  updatedAt: Date           // Last update timestamp
}
```

## Frontend Components

### ShareLink Component
**Location**: `frontend/src/components/ShareLink.js`

**Props**:
- `roomId` (string): Current room ID
- `userName` (string): Current user's name

**Features**:
- Modal dialog for link generation
- Expiration time selector
- Copy to clipboard functionality
- Success/error messages
- Dark/light theme support

## Usage Examples

### Basic Usage
```javascript
import ShareLink from './components/ShareLink';

<ShareLink 
  roomId="my-room"
  userName="John Doe"
/>
```

### Generate Link (Frontend)
```javascript
const generateLink = async () => {
  const response = await fetch('http://localhost:5000/api/share/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      roomId: 'my-room',
      expiresIn: 24  // 24 hours
    })
  });

  const data = await response.json();
  console.log('Share URL:', data.shareUrl);
};
```

### Access Shared Link (Frontend)
```javascript
const accessSharedLink = async (linkId) => {
  const response = await fetch(`http://localhost:5000/api/share/${linkId}`);
  const data = await response.json();
  
  if (data.success) {
    // Join the room
    joinRoom(data.roomId);
  }
};
```

## Security Features

### 🔒 Security Measures
- **Unique IDs**: 16-character hex IDs (128-bit entropy)
- **Expiration**: Automatic link expiration via MongoDB TTL index
- **Access Control**: Only creators can deactivate their links
- **Rate Limiting**: Protected by global rate limiter
- **Status Tracking**: Active/inactive status for link management

### 🛡️ Best Practices
- Set expiration times for sensitive documents
- Deactivate links when no longer needed
- Monitor access counts for suspicious activity
- Use authentication for additional security

## URL Format

### Shareable Link Structure
```
http://localhost:3000/share/{linkId}

Example:
http://localhost:3000/share/a1b2c3d4e5f6g7h8
```

### URL Routing
The app automatically detects `/share/:linkId` URLs and:
1. Extracts the link ID
2. Fetches room information from backend
3. Joins the user to the correct room
4. Cleans up the URL (removes `/share/...`)

## Expiration Options

| Option | Duration | Use Case |
|--------|----------|----------|
| Never | Permanent | Long-term collaboration |
| 1 hour | 60 minutes | Quick edits |
| 24 hours | 1 day | Daily collaboration |
| 7 days | 1 week | Weekly projects |
| 30 days | 1 month | Monthly projects |

## Error Handling

### Common Errors
- **404 Not Found**: Link doesn't exist or was deleted
- **410 Gone**: Link has expired
- **403 Forbidden**: Unauthorized to deactivate link
- **400 Bad Request**: Invalid room ID or parameters

### Error Messages
```javascript
// Link not found
{ error: 'Link not found or expired' }

// Link expired
{ error: 'Link has expired' }

// Unauthorized
{ error: 'Unauthorized' }

// Invalid parameters
{ error: 'Room ID is required' }
```

## Testing

### Test Workflow
1. **Create Link**:
   - Open document in room
   - Click "🔗 Share" button
   - Select expiration time
   - Generate link

2. **Share Link**:
   - Copy generated URL
   - Open in new browser tab/window
   - Verify auto-join to room

3. **Real-time Collaboration**:
   - Type in one window
   - Verify changes appear in other window
   - Test cursor tracking
   - Test user presence

4. **Expiration**:
   - Create link with 1-hour expiration
   - Wait for expiration (or manually update DB)
   - Try accessing expired link
   - Verify error message

## Future Enhancements

### Planned Features
- [ ] Password-protected links
- [ ] View-only links (read-only access)
- [ ] Link analytics dashboard
- [ ] Email sharing integration
- [ ] QR code generation
- [ ] Custom link aliases
- [ ] Access permissions (view/edit/admin)
- [ ] Link usage statistics
- [ ] Bulk link management

## Troubleshooting

### Link Not Working
1. Check if link is active in database
2. Verify expiration date hasn't passed
3. Check network connectivity
4. Verify backend server is running

### Room Not Loading
1. Check if room exists in database
2. Verify Socket.IO connection
3. Check browser console for errors
4. Verify MongoDB connection

### Copy Button Not Working
1. Check browser clipboard permissions
2. Use HTTPS in production
3. Verify navigator.clipboard API support
4. Check browser compatibility

## Browser Support

### Clipboard API
- Chrome 63+
- Firefox 53+
- Safari 13.1+
- Edge 79+

### WebSocket (Socket.IO)
- All modern browsers
- IE 10+ (with polyfills)

## Production Deployment

### Environment Variables
```env
# Backend
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com

# Update in ShareLink.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

### HTTPS Required
- Clipboard API requires HTTPS in production
- Use SSL certificates (Let's Encrypt)
- Update CORS settings for production domain

---

**Built with ❤️ for seamless collaboration**
