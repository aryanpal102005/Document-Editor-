import React from 'react';
import './ConnectionStatus.css';

function ConnectionStatus({ connected }) {
  return (
    <div className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
      <span className="status-dot"></span>
      <span className="status-text">{connected ? 'Connected' : 'Disconnected'}</span>
    </div>
  );
}

export default ConnectionStatus;
