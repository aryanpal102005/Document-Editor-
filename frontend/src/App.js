import React, { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import Editor from './components/Editor';
import UserList from './components/UserList';
import ConnectionStatus from './components/ConnectionStatus';
import RoomSelector from './components/RoomSelector';
import FileUpload from './components/FileUpload';
import FileManager from './components/FileManager';
import SaveDocument from './components/SaveDocument';
import TypingIndicator from './components/TypingIndicator';
import Login from './components/Login';
import Signup from './components/Signup';
import UserProfile from './components/UserProfile';
import ShareLink from './components/ShareLink';
import './App.css';

function App() {
  const [socket, setSocket] = useState(null);
  const [content, setContent] = useState('');
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [roomId, setRoomId] = useState('default');
  const [connected, setConnected] = useState(false);
  const [version, setVersion] = useState(0);
  const [cursors, setCursors] = useState({});
  const [theme, setTheme] = useState('dark');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [currentFileName, setCurrentFileName] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const isLocalChange = useRef(false);
  const typingTimeout = useRef(null);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsAuthenticated(true);
      setAuthUser(JSON.parse(user));
    }

    // Check for shared link in URL
    const path = window.location.pathname;
    const shareMatch = path.match(/^\/share\/([a-f0-9]+)$/);
    
    if (shareMatch) {
      const linkId = shareMatch[1];
      handleSharedLink(linkId);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const newSocket = io('http://localhost:5000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10
    });

    newSocket.on('connect', () => {
      setConnected(true);
      const userName = authUser?.name || localStorage.getItem('userName') || 'Anonymous';
      localStorage.setItem('userName', userName);
      newSocket.emit('join-room', { roomId, userName });
    });

    newSocket.on('disconnect', () => setConnected(false));

    newSocket.on('load-document', ({ content, version, user }) => {
      setContent(content);
      setVersion(version);
      setCurrentUser(user);
    });

    newSocket.on('receive-changes', ({ content, version, senderId }) => {
      setContent(content);
      setVersion(version);
    });

    newSocket.on('users-update', (userList) => {
      setUsers(userList);
    });

    newSocket.on('cursor-update', ({ userId, cursor, color, name }) => {
      setCursors(prev => ({
        ...prev,
        [userId]: { cursor, color, name }
      }));
    });

    newSocket.on('error', ({ message }) => {
      console.error('Socket error:', message);
    });

    newSocket.on('user-typing', ({ userId, name, color }) => {
      setTypingUsers(prev => {
        const exists = prev.find(u => u.id === userId);
        if (exists) return prev;
        return [...prev, { id: userId, name, color }];
      });
    });

    newSocket.on('user-stopped-typing', ({ userId }) => {
      setTypingUsers(prev => prev.filter(u => u.id !== userId));
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [roomId, isAuthenticated, authUser]);

  const handleChange = useCallback((newContent, cursor) => {
    isLocalChange.current = true;
    setContent(newContent);
    
    if (socket && connected) {
      socket.emit('send-changes', {
        roomId,
        content: newContent,
        cursor,
        version
      });

      socket.emit('typing-start', { roomId });
      
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
      
      typingTimeout.current = setTimeout(() => {
        socket.emit('typing-stop', { roomId });
      }, 1000);
    }

    setTimeout(() => {
      isLocalChange.current = false;
    }, 50);
  }, [socket, connected, roomId, version]);

  const handleCursorMove = useCallback((cursor) => {
    if (socket && connected) {
      socket.emit('cursor-move', { roomId, cursor });
    }
  }, [socket, connected, roomId]);

  const changeRoom = (newRoomId) => {
    if (socket) {
      socket.close();
    }
    setRoomId(newRoomId);
    setContent('');
    setUsers([]);
    setCursors({});
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleFileLoad = (fileContent, fileName) => {
    setContent(fileContent);
    setCurrentFileName(fileName);
    setShowFileUpload(false);
    
    if (socket && connected) {
      socket.emit('send-changes', {
        roomId,
        content: fileContent,
        cursor: 0,
        version
      });
    }
  };

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setAuthUser(user);
  };

  const handleSignup = (user) => {
    setIsAuthenticated(true);
    setAuthUser(user);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthUser(null);
    if (socket) {
      socket.close();
    }
  };

  const handleProfileUpdate = (user) => {
    setAuthUser(user);
  };

  const handleSharedLink = async (linkId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/share/${linkId}`);
      const data = await response.json();

      if (data.success) {
        setRoomId(data.roomId);
        window.history.replaceState({}, '', '/');
        alert(`Joined shared room: ${data.roomId}\nCreated by: ${data.createdBy}`);
      } else {
        alert(data.error || 'Invalid or expired link');
        window.history.replaceState({}, '', '/');
      }
    } catch (error) {
      console.error('Shared link error:', error);
      alert('Failed to access shared link');
      window.history.replaceState({}, '', '/');
    }
  };

  if (!isAuthenticated) {
    return showSignup ? (
      <Signup 
        onSignup={handleSignup}
        onSwitchToLogin={() => setShowSignup(false)}
      />
    ) : (
      <Login 
        onLogin={handleLogin}
        onSwitchToSignup={() => setShowSignup(true)}
      />
    );
  }

  return (
    <div className={`app ${theme}`}>
      <header className="app-header">
        <div className="header-left">
          <h1>⚡ CollabEdit Pro</h1>
          <RoomSelector currentRoom={roomId} onRoomChange={changeRoom} />
          {currentFileName && (
            <span className="current-file-badge">📄 {currentFileName}</span>
          )}
        </div>
        <div className="header-right">
          <ShareLink 
            roomId={roomId}
            userName={authUser?.name}
          />
          <SaveDocument 
            content={content}
            currentFileName={currentFileName}
            currentRoom={roomId}
          />
          <button 
            className="upload-toggle"
            onClick={() => setShowFileUpload(!showFileUpload)}
            title="Upload Document"
          >
            📤 Upload
          </button>
          <FileManager 
            onFileSelect={handleFileLoad}
            currentRoom={roomId}
            socket={socket}
          />
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <ConnectionStatus connected={connected} />
          <UserList users={users} currentUser={currentUser} />
          <UserProfile 
            user={authUser}
            onUpdate={handleProfileUpdate}
            onLogout={handleLogout}
          />
        </div>
      </header>

      <main className="app-main">
        {showFileUpload ? (
          <FileUpload 
            onFileLoad={handleFileLoad}
            currentRoom={roomId}
          />
        ) : (
          <Editor
            content={content}
            onChange={handleChange}
            onCursorMove={handleCursorMove}
            cursors={cursors}
            theme={theme}
            readOnly={!connected}
          />
        )}
        <TypingIndicator typingUsers={typingUsers} />
      </main>

      <footer className="app-footer">
        <span>👥 {users.length} active user{users.length !== 1 ? 's' : ''}</span>
        <span>📝 Room: {roomId}</span>
        <span>v{version}</span>
      </footer>
    </div>
  );
}

export default App;
