import React, { useState, useEffect } from 'react';
import './SavedDocuments.css';

function SavedDocuments({ currentRoom, onDocumentLoad }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (showModal) {
      loadDocuments();
    }
  }, [showModal, currentRoom]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/saved-documents/${currentRoom}`);
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Load documents error:', error);
    }
    setLoading(false);
  };

  const handleDocumentClick = async (doc) => {
    try {
      const response = await fetch(`http://localhost:5000/api/file/${doc._id}`);
      const data = await response.json();
      
      if (data.content) {
        onDocumentLoad(data.content, doc.originalName);
        setShowModal(false);
      }
    } catch (error) {
      console.error('Load document error:', error);
    }
  };

  const handleDelete = async (docId, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this document?')) return;

    try {
      await fetch(`http://localhost:5000/api/file/${docId}`, {
        method: 'DELETE'
      });
      setDocuments(prev => prev.filter(d => d._id !== docId));
      alert('✅ Document deleted');
    } catch (error) {
      console.error('Delete error:', error);
      alert('❌ Failed to delete');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <>
      <button 
        className="saved-docs-btn"
        onClick={() => setShowModal(true)}
        title="Saved Documents"
      >
        📚 Saved
      </button>

      {showModal && (
        <div className="saved-docs-overlay" onClick={() => setShowModal(false)}>
          <div className="saved-docs-modal" onClick={(e) => e.stopPropagation()}>
            <div className="saved-docs-header">
              <h3>📚 Saved Documents - {currentRoom}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="saved-docs-body">
              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading documents...</p>
                </div>
              ) : documents.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <p>No saved documents yet</p>
                  <small>Save your edited documents to see them here</small>
                </div>
              ) : (
                <div className="documents-list">
                  {documents.map(doc => (
                    <div 
                      key={doc._id} 
                      className="document-item"
                      onClick={() => handleDocumentClick(doc)}
                    >
                      <div className="doc-icon">📄</div>
                      <div className="doc-info">
                        <div className="doc-name">{doc.originalName}</div>
                        <div className="doc-meta">
                          <span>👤 {doc.uploadedBy}</span>
                          <span>•</span>
                          <span>📅 {formatDate(doc.uploadedAt)}</span>
                          <span>•</span>
                          <span>📦 {formatSize(doc.size)}</span>
                        </div>
                      </div>
                      <button
                        className="delete-btn"
                        onClick={(e) => handleDelete(doc._id, e)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SavedDocuments;
