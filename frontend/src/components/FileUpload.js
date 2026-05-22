import React, { useState, useRef } from 'react';
import './FileUpload.css';

function FileUpload({ onFileLoad, currentRoom }) {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;
    
    setUploading(true);

    for (const file of selectedFiles) {
      try {
        console.log('Uploading file:', file.name, 'Type:', file.type, 'Size:', file.size);
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('roomId', currentRoom);
        formData.append('userName', localStorage.getItem('userName') || 'Anonymous');

        const response = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();
        console.log('Upload response:', data);
        
        if (data.success) {
          setFiles(prev => [...prev, {
            name: file.name,
            type: file.type,
            size: file.size,
            url: data.fileUrl,
            id: data.fileId,
            content: data.content
          }]);

          // Load content into editor
          if (data.content) {
            onFileLoad(data.content, file.name);
            alert(`✅ File uploaded successfully: ${file.name}`);
          } else {
            alert(`⚠️ File uploaded but no content extracted: ${file.name}`);
          }
        } else {
          console.error('Upload failed:', data.error);
          alert(`❌ Upload failed: ${data.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert(`❌ Failed to upload ${file.name}: ${error.message}`);
      }
    }

    setUploading(false);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const input = fileInputRef.current;
    input.files = e.dataTransfer.files;
    handleFileSelect({ target: input });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const deleteFile = async (fileId) => {
    try {
      await fetch(`http://localhost:5000/api/file/${fileId}`, {
        method: 'DELETE'
      });
      setFiles(prev => prev.filter(f => f.id !== fileId));
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const loadFile = async (fileId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/file/${fileId}`);
      const data = await response.json();
      if (data.content) {
        onFileLoad(data.content, data.fileName);
      }
    } catch (error) {
      console.error('Load error:', error);
    }
  };

  return (
    <div className="file-upload">
      <div 
        className="upload-area"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".txt,.doc,.docx,.pdf,.md,.json,.xml,.csv,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        {uploading ? (
          <div className="uploading">
            <div className="spinner"></div>
            <p>Uploading...</p>
          </div>
        ) : (
          <>
            <div className="upload-icon">📁</div>
            <p className="upload-text">
              <strong>Click to upload</strong> or drag and drop
            </p>
            <p className="upload-hint">
              TXT, DOC, DOCX, PDF, MD, JSON, XML, CSV
            </p>
          </>
        )}
      </div>

      {files.length > 0 && (
        <div className="file-list">
          <h4>Uploaded Files</h4>
          {files.map(file => (
            <div key={file.id} className="file-item">
              <div className="file-info">
                <span className="file-icon">
                  {file.type.includes('pdf') ? '📄' : 
                   file.type.includes('word') ? '📝' : '📃'}
                </span>
                <div className="file-details">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">
                    {(file.size / 1024).toFixed(2)} KB
                  </span>
                </div>
              </div>
              <div className="file-actions">
                <button 
                  className="btn-load"
                  onClick={() => loadFile(file.id)}
                  title="Load in editor"
                >
                  📂
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => deleteFile(file.id)}
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
  );
}

export default FileUpload;
