import React, { useState } from 'react';
import './UserList.css';

function UserList({ users, currentUser }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="user-list">
      <button 
        className="user-list-toggle"
        onClick={() => setExpanded(!expanded)}
      >
        👥 {users.length}
      </button>
      
      {expanded && (
        <div className="user-list-dropdown">
          <h3>Active Users</h3>
          <div className="user-items">
            {users.map(user => (
              <div key={user.id} className="user-item">
                <div 
                  className="user-avatar" 
                  style={{ backgroundColor: user.color }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="user-name">
                  {user.name}
                  {currentUser?.id === user.id && ' (You)'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserList;
