import React from 'react';
import './TypingIndicator.css';

function TypingIndicator({ typingUsers }) {
  if (!typingUsers || typingUsers.length === 0) return null;

  return (
    <div className="typing-indicator">
      <div className="typing-content">
        {typingUsers.length === 1 ? (
          <span>
            <strong style={{ color: typingUsers[0].color }}>
              {typingUsers[0].name}
            </strong> is typing...
          </span>
        ) : typingUsers.length === 2 ? (
          <span>
            <strong style={{ color: typingUsers[0].color }}>
              {typingUsers[0].name}
            </strong> and{' '}
            <strong style={{ color: typingUsers[1].color }}>
              {typingUsers[1].name}
            </strong> are typing...
          </span>
        ) : (
          <span>
            <strong style={{ color: typingUsers[0].color }}>
              {typingUsers[0].name}
            </strong> and {typingUsers.length - 1} others are typing...
          </span>
        )}
        <span className="typing-dots">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </div>
    </div>
  );
}

export default TypingIndicator;
