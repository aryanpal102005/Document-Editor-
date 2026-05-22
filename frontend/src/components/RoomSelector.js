import React, { useState } from 'react';
import './RoomSelector.css';

function RoomSelector({ currentRoom, onRoomChange }) {
  const [showInput, setShowInput] = useState(false);
  const [newRoom, setNewRoom] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newRoom.trim()) {
      onRoomChange(newRoom.trim());
      setNewRoom('');
      setShowInput(false);
    }
  };

  return (
    <div className="room-selector">
      <span className="current-room">📁 {currentRoom}</span>
      {!showInput ? (
        <button 
          className="change-room-btn"
          onClick={() => setShowInput(true)}
        >
          Change Room
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="room-input-form">
          <input
            type="text"
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
            placeholder="Enter room name"
            autoFocus
          />
          <button type="submit">Join</button>
          <button type="button" onClick={() => setShowInput(false)}>✕</button>
        </form>
      )}
    </div>
  );
}

export default RoomSelector;
