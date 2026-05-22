import React, { useState } from 'react';
import './ShareLink.css';

function ShareLink({ roomId, userName }) {
  const [showModal, setShowModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [expiresIn, setExpiresIn] = useState(0);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateLink = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      console.log('=== GENERATING LINK ===');
      console.log('Room ID:', roomId);
      console.log('Expires In:', expiresIn);
      console.log('Token exists:', !!token);
      
      const requestBody = {
        roomId,
        expiresIn: expiresIn > 0 ? expiresIn : null
      };
      
      console.log('Request body:', requestBody);
      
      const response = await fetch('http://localhost:5000/api/share/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType);
      
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned non-JSON response. Check backend console.');
      }
      
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        console.log('✅ Link generated successfully:', data.shareUrl);
        setShareUrl(data.shareUrl);
      } else {
        console.error('❌ Error from server:', data.error);
        alert(data.error || 'Failed to generate link');
      }
    } catch (error) {
      console.error('❌ Generate link error:', error);
      alert('Failed to generate shareable link: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setShowModal(false);
    setShareUrl('');
    setCopied(false);
  };

  return (
    <>
      <button 
        className="share-button"
        onClick={() => setShowModal(true)}
        title="Share Document"
      >
        🔗 Share
      </button>

      {showModal && (
        <div className="share-modal-overlay" onClick={handleClose}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <div className="share-modal-header">
              <h2>🔗 Share Document</h2>
              <button className="close-btn" onClick={handleClose}>✕</button>
            </div>

            <div className="share-modal-body">
              {!shareUrl ? (
                <>
                  <p className="share-info">
                    Create a shareable link for room: <strong>{roomId}</strong>
                  </p>

                  <div className="expiry-section">
                    <label>Link Expiration:</label>
                    <select 
                      value={expiresIn} 
                      onChange={(e) => setExpiresIn(Number(e.target.value))}
                      className="expiry-select"
                    >
                      <option value={0}>Never expires</option>
                      <option value={1}>1 hour</option>
                      <option value={24}>24 hours</option>
                      <option value={168}>7 days</option>
                      <option value={720}>30 days</option>
                    </select>
                  </div>

                  <button 
                    className="generate-btn"
                    onClick={generateLink}
                    disabled={loading}
                  >
                    {loading ? 'Generating...' : '✨ Generate Link'}
                  </button>
                </>
              ) : (
                <>
                  <p className="success-message">✅ Link created successfully!</p>
                  
                  <div className="share-url-container">
                    <input 
                      type="text" 
                      value={shareUrl} 
                      readOnly 
                      className="share-url-input"
                    />
                    <button 
                      className="copy-btn"
                      onClick={copyToClipboard}
                    >
                      {copied ? '✓ Copied' : '📋 Copy'}
                    </button>
                  </div>

                  <div className="share-instructions">
                    <p>📤 Share this link with others to collaborate</p>
                    <p>🔄 Anyone with this link can view and edit the document</p>
                    {expiresIn > 0 && (
                      <p>⏰ Link expires in {expiresIn} hour{expiresIn > 1 ? 's' : ''}</p>
                    )}
                  </div>

                  <button 
                    className="new-link-btn"
                    onClick={() => {
                      setShareUrl('');
                      setCopied(false);
                    }}
                  >
                    Create Another Link
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ShareLink;
