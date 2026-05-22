import React, { useState, useEffect } from 'react';
import './FileManager.css';

function FileManager({ onFileSelect, currentRoom, socket }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showManager, setShowManager] = useState(false);

  useEffect(() => {
    if (showManager) {
      loadFiles();
    }
  }, [showManager, currentRoom]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/files/${currentRoom}`);
      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error('Load files error:', error);
    }
    setLoading(false);
  };

  const handleFileClick = async (file) => {
    try {
      const response = await fetch(`http://localhost:5000/api/file/${file._id}`);
      const data = await response.json();
      
      if (data.content) {
        onFileSelect(data.content, file.originalName);
        setShowManager(false);
      }
    } catch (error) {
      console.error('Load file error:', error);
    }
  };

  const handleDelete = async (fileId, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this file?')) return;

    try {
      await fetch(`http://localhost:5000/api/file/${fileId}`, {
        method: 'DELETE'
      });
      setFiles(prev => prev.filter(f => f._id !== fileId));
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleDownload = async (file, e) => {
    e.stopPropagation();
    try {
      const response = await fetch(`http://localhost:5000/api/file/${file._id}/download`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.originalName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getFileIcon = (mimeType) => {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('text')) return '📃';
    if (mimeType.includes('json')) return '📋';
    if (mimeType.includes('xml')) return '📰';
    if (mimeType.includes('csv')) return '📊';
    return '📁';
  };

  return (
    <>
      <button 
        className="file-manager-toggle"
        onClick={() => setShowManager(!showManager)}
        title="File Manager"
      >
        📂 Files
      </button>

      {showManager && (
        <div className="file-manager-overlay" onClick={() => setShowManager(false)}>
          <div className="file-manager-modal" onClick={(e) => e.stopPropagation()}>
            <div className="file-manager-header">
              <h3>📂 File Manager - {currentRoom}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowManager(false)}
              >
                ✕
              </button>
            </div>

            <div className="file-manager-body">
              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading files...</p>
                </div>
              ) : files.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <p>No files uploaded yet</p>
                  <small>Upload files to see them here</small>
                </div>
              ) : (
                <div className="files-grid">
                  {files.map(file => (
                    <div 
                      key={file._id} 
                      className="file-card"
                      onClick={() => handleFileClick(file)}
                    >
                      <div className="file-card-icon">
                        {getFileIcon(file.mimeType)}
                      </div>
                      <div className="file-card-info">
                        <div className="file-card-name" title={file.originalName}>
                          {file.originalName}
                        </div>
                        <div className="file-card-meta">
                          <span>{formatFileSize(file.size)}</span>
                          <span>•</span>
                          <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="file-card-actions">
                        <button
                          className="action-btn download-btn"
                          onClick={(e) => handleDownload(file, e)}
                          title="Download"
                        >
                          ⬇️
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={(e) => handleDelete(file._id, e)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
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

export default FileManager;
