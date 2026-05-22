import React, { useState } from 'react';
import './SaveDocument.css';

function SaveDocument({ content, currentFileName, currentRoom }) {
  const [showModal, setShowModal] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileFormat, setFileFormat] = useState('txt');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!fileName.trim()) {
      alert('Please enter a file name');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('http://localhost:5000/api/save-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content,
          fileName: fileName.trim(),
          fileFormat,
          roomId: currentRoom,
          userName: localStorage.getItem('userName') || 'Anonymous'
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ Document saved successfully: ${data.fileName}`);
        setShowModal(false);
        setFileName('');
      } else {
        alert(`❌ Save failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert(`❌ Failed to save: ${error.message}`);
    }

    setSaving(false);
  };

  const handleExportPDF = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content,
          fileName: fileName || currentFileName || 'document'
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName || currentFileName || 'document'}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        alert('✅ PDF exported successfully');
      } else {
        alert('❌ PDF export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert(`❌ Failed to export PDF: ${error.message}`);
    }
  };

  const handleExportWord = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/export-docx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content,
          fileName: fileName || currentFileName || 'document'
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName || currentFileName || 'document'}.docx`;
        a.click();
        window.URL.revokeObjectURL(url);
        alert('✅ Word document exported successfully');
      } else {
        alert('❌ Word export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert(`❌ Failed to export Word: ${error.message}`);
    }
  };

  return (
    <>
      <button 
        className="save-document-btn"
        onClick={() => setShowModal(true)}
        title="Save Document"
      >
        💾 Save
      </button>

      {showModal && (
        <div className="save-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="save-modal" onClick={(e) => e.stopPropagation()}>
            <div className="save-modal-header">
              <h3>💾 Save Document</h3>
              <button 
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="save-modal-body">
              <div className="form-group">
                <label>File Name</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder={currentFileName || 'Enter file name'}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Format</label>
                <select 
                  value={fileFormat} 
                  onChange={(e) => setFileFormat(e.target.value)}
                >
                  <option value="txt">Text File (.txt)</option>
                  <option value="pdf">PDF Document (.pdf)</option>
                  <option value="docx">Word Document (.docx)</option>
                  <option value="md">Markdown (.md)</option>
                  <option value="json">JSON (.json)</option>
                  <option value="xml">XML (.xml)</option>
                  <option value="csv">CSV (.csv)</option>
                  <option value="html">HTML (.html)</option>
                </select>
              </div>

              <div className="save-actions">
                <button 
                  className="btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? '💾 Saving...' : '💾 Save to Server & Storage'}
                </button>

                <button 
                  className="btn-secondary"
                  onClick={handleExportPDF}
                >
                  📄 Export as PDF
                </button>

                <button 
                  className="btn-secondary"
                  onClick={handleExportWord}
                >
                  📝 Export as Word
                </button>
              </div>

              <div className="save-info">
                <p>📁 Room: <strong>{currentRoom}</strong></p>
                <p>📝 Content Length: <strong>{content.length} characters</strong></p>
                <p>👤 User: <strong>{localStorage.getItem('userName') || 'Anonymous'}</strong></p>
                <p>💾 Storage: <strong>Server + Your Computer</strong></p>
                <p className="info-note">✨ Files saved in PDF/Word format will be stored in uploads folder</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SaveDocument;
