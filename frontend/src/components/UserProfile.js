import React, { useState } from 'react';
import './UserProfile.css';

function UserProfile({ user, onUpdate, onLogout }) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ name, bio, avatar })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userName', data.user.name);
        onUpdate(data.user);
        setEditing(false);
        alert('✅ Profile updated successfully');
      } else {
        alert('❌ Update failed: ' + data.error);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('❌ Network error');
    }

    setLoading(false);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userName');
      onLogout();
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      <button 
        className="profile-btn"
        onClick={() => setShowModal(true)}
        title="Profile"
      >
        <div className="profile-avatar" style={{ backgroundColor: user.color || '#667eea' }}>
          {avatar ? (
            <img src={avatar} alt={name} />
          ) : (
            getInitials(name)
          )}
        </div>
      </button>

      {showModal && (
        <div className="profile-overlay" onClick={() => setShowModal(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-header">
              <h3>👤 User Profile</h3>
              <button 
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="profile-body">
              <div className="profile-avatar-large" style={{ backgroundColor: user.color || '#667eea' }}>
                {avatar ? (
                  <img src={avatar} alt={name} />
                ) : (
                  getInitials(name)
                )}
              </div>

              {editing ? (
                <div className="profile-form">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself"
                      rows={3}
                    />
                  </div>

                  <div className="form-group">
                    <label>Avatar URL (optional)</label>
                    <input
                      type="url"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>

                  <div className="profile-actions">
                    <button 
                      className="btn-primary"
                      onClick={handleUpdate}
                      disabled={loading}
                    >
                      {loading ? '💾 Saving...' : '💾 Save Changes'}
                    </button>
                    <button 
                      className="btn-secondary"
                      onClick={() => {
                        setEditing(false);
                        setName(user.name);
                        setBio(user.bio || '');
                        setAvatar(user.avatar || '');
                      }}
                    >
                      ✕ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="profile-info">
                  <h2>{user.name}</h2>
                  <p className="profile-email">📧 {user.email}</p>
                  {user.bio && <p className="profile-bio">{user.bio}</p>}
                  
                  <div className="profile-stats">
                    <div className="stat">
                      <span className="stat-label">Member since</span>
                      <span className="stat-value">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="profile-actions">
                    <button 
                      className="btn-primary"
                      onClick={() => setEditing(true)}
                    >
                      ✏️ Edit Profile
                    </button>
                    <button 
                      className="btn-logout"
                      onClick={handleLogout}
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserProfile;
