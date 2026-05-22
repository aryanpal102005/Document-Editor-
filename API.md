# API Documentation

## REST API Endpoints

### Health Check

**GET** `/health`

Check server health and status.

**Response:**
```json
{
  "status": "ok",
  "rooms": 5,
  "connections": 12,
  "uptime": 3600.5
}
```

---

### List All Rooms

**GET** `/api/rooms`

Get a list of all active rooms.

**Response:**
```json
{
  "rooms": [
    {
      "roomId": "default",
      "lastModified": "2024-01-15T10:30:00.000Z",
      "version": 42
    },
    {
      "roomId": "project-alpha",
      "lastModified": "2024-01-15T11:00:00.000Z",
      "version": 15
    }
  ]
}
```

---

### Export Room Content

**POST** `/api/room/:roomId/export`

Export the content of a specific room.

**Parameters:**
- `roomId` (path) - The ID of the room to export

**Response:**
```json
{
  "content": "Document content here...",
  "version": 42
}
```

**Error Response:**
```json
{
  "error": "Room not found"
}
```

---

## Socket.IO Events

### Client → Server Events

#### join-room

Join a collaboration room.

**Payload:**
```javascript
{
  roomId: "default",
  userName: "John Doe"
}
```

**Example:**
```javascript
socket.emit('join-room', {
  roomId: 'my-room',
  userName: 'Alice'
});
```

---

#### send-changes

Send document changes to other users.

**Payload:**
```javascript
{
  roomId: "default",
  content: "Updated document content",
  cursor: 42,
  version: 10
}
```

**Example:**
```javascript
socket.emit('send-changes', {
  roomId: 'my-room',
  content: 'Hello World',
  cursor: 11,
  version: 5
});
```

---

#### cursor-move

Update cursor position.

**Payload:**
```javascript
{
  roomId: "default",
  cursor: 42
}
```

**Example:**
```javascript
socket.emit('cursor-move', {
  roomId: 'my-room',
  cursor: 25
});
```

---

#### get-history

Request document version history.

**Payload:**
```javascript
{
  roomId: "default"
}
```

**Example:**
```javascript
socket.emit('get-history', {
  roomId: 'my-room'
});
```

---

### Server → Client Events

#### load-document

Receive initial document when joining a room.

**Payload:**
```javascript
{
  content: "Document content",
  version: 10,
  user: {
    id: "socket-id",
    name: "John Doe",
    color: "#FF6B6B"
  }
}
```

**Example:**
```javascript
socket.on('load-document', ({ content, version, user }) => {
  console.log('Loaded document:', content);
  console.log('Version:', version);
  console.log('Your user:', user);
});
```

---

#### receive-changes

Receive document changes from other users.

**Payload:**
```javascript
{
  content: "Updated content",
  version: 11,
  senderId: "other-socket-id"
}
```

**Example:**
```javascript
socket.on('receive-changes', ({ content, version, senderId }) => {
  console.log('Received changes from:', senderId);
  updateEditor(content);
});
```

---

#### users-update

Receive updated list of active users.

**Payload:**
```javascript
[
  {
    id: "socket-id-1",
    name: "Alice",
    color: "#FF6B6B",
    cursor: 10
  },
  {
    id: "socket-id-2",
    name: "Bob",
    color: "#4ECDC4",
    cursor: 25
  }
]
```

**Example:**
```javascript
socket.on('users-update', (users) => {
  console.log('Active users:', users.length);
  updateUserList(users);
});
```

---

#### cursor-update

Receive cursor position update from another user.

**Payload:**
```javascript
{
  userId: "socket-id",
  cursor: 42,
  color: "#FF6B6B",
  name: "Alice"
}
```

**Example:**
```javascript
socket.on('cursor-update', ({ userId, cursor, color, name }) => {
  renderRemoteCursor(userId, cursor, color, name);
});
```

---

#### sync-required

Server detected version conflict, refresh required.

**Payload:**
```javascript
{
  content: "Latest content",
  version: 15
}
```

**Example:**
```javascript
socket.on('sync-required', ({ content, version }) => {
  alert('Your version was out of sync. Refreshing...');
  updateEditor(content);
  updateVersion(version);
});
```

---

#### history-data

Receive document version history.

**Payload:**
```javascript
{
  history: [
    {
      content: "Version 1 content",
      timestamp: "2024-01-15T10:00:00.000Z",
      version: 1
    },
    {
      content: "Version 2 content",
      timestamp: "2024-01-15T10:05:00.000Z",
      version: 2
    }
  ]
}
```

**Example:**
```javascript
socket.on('history-data', ({ history }) => {
  console.log('Document history:', history);
  displayHistory(history);
});
```

---

#### error

Receive error message from server.

**Payload:**
```javascript
{
  message: "Error description"
}
```

**Example:**
```javascript
socket.on('error', ({ message }) => {
  console.error('Server error:', message);
  showErrorNotification(message);
});
```

---

## Connection Events

### connect

Fired when socket connects to server.

```javascript
socket.on('connect', () => {
  console.log('Connected to server');
  setConnectionStatus(true);
});
```

---

### disconnect

Fired when socket disconnects from server.

```javascript
socket.on('disconnect', () => {
  console.log('Disconnected from server');
  setConnectionStatus(false);
});
```

---

### reconnect

Fired when socket successfully reconnects.

```javascript
socket.on('reconnect', (attemptNumber) => {
  console.log('Reconnected after', attemptNumber, 'attempts');
});
```

---

## Complete Client Example

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 10
});

// Connection events
socket.on('connect', () => {
  console.log('Connected');
  socket.emit('join-room', {
    roomId: 'my-room',
    userName: 'Alice'
  });
});

socket.on('disconnect', () => {
  console.log('Disconnected');
});

// Document events
socket.on('load-document', ({ content, version, user }) => {
  setContent(content);
  setVersion(version);
  setCurrentUser(user);
});

socket.on('receive-changes', ({ content, version }) => {
  setContent(content);
  setVersion(version);
});

socket.on('users-update', (users) => {
  setActiveUsers(users);
});

socket.on('cursor-update', ({ userId, cursor, color, name }) => {
  updateRemoteCursor(userId, cursor, color, name);
});

// Send changes
function handleTextChange(newContent, cursorPosition) {
  socket.emit('send-changes', {
    roomId: 'my-room',
    content: newContent,
    cursor: cursorPosition,
    version: currentVersion
  });
}

// Send cursor movement
function handleCursorMove(position) {
  socket.emit('cursor-move', {
    roomId: 'my-room',
    cursor: position
  });
}
```

---

## Rate Limiting

All API endpoints are rate-limited to **1000 requests per 15 minutes** per IP address.

**Rate Limit Headers:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642248000
```

**Rate Limit Exceeded Response:**
```json
{
  "error": "Too many requests, please try again later."
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 400  | Bad Request - Invalid parameters |
| 401  | Unauthorized - Authentication required |
| 403  | Forbidden - Access denied |
| 404  | Not Found - Resource doesn't exist |
| 429  | Too Many Requests - Rate limit exceeded |
| 500  | Internal Server Error |

---

## WebSocket Connection

**URL:** `ws://localhost:5000`

**Connection Options:**
```javascript
{
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 10,
  timeout: 20000,
  transports: ['websocket', 'polling']
}
```

---

## Data Models

### Document Schema

```javascript
{
  roomId: String,        // Unique room identifier
  content: String,       // Document content
  version: Number,       // Version number
  lastModified: Date,    // Last modification timestamp
  history: [{
    content: String,     // Historical content
    timestamp: Date,     // When this version was created
    version: Number      // Version number
  }]
}
```

### User Object

```javascript
{
  id: String,           // Socket ID
  name: String,         // User display name
  color: String,        // User color (hex)
  cursor: Number,       // Current cursor position
  lastActivity: Number  // Timestamp of last activity
}
```

---

For more information, see [README.md](README.md) and [ADVANCED.md](ADVANCED.md)
