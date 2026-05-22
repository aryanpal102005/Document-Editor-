import React, { useRef, useEffect, useState } from 'react';
import './Editor.css';

function Editor({ content, onChange, onCursorMove, cursors, theme, readOnly }) {
  const textareaRef = useRef(null);
  const cursorLayerRef = useRef(null);
  const [localContent, setLocalContent] = useState(content);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      if (textarea.value !== localContent) {
        textarea.value = localContent;
        textarea.setSelectionRange(start, end);
      }
    }
  }, [localContent]);

  const handleChange = (e) => {
    const newContent = e.target.value;
    const cursor = e.target.selectionStart;
    setLocalContent(newContent);
    onChange(newContent, cursor);
  };

  const handleSelect = () => {
    if (textareaRef.current) {
      onCursorMove(textareaRef.current.selectionStart);
    }
  };

  const renderCursors = () => {
    if (!textareaRef.current) return null;

    return Object.entries(cursors).map(([userId, { cursor, color, name }]) => {
      if (cursor === null || cursor === undefined) return null;

      const textarea = textareaRef.current;
      const textBeforeCursor = localContent.substring(0, cursor);
      const lines = textBeforeCursor.split('\n');
      const line = lines.length;
      const col = lines[lines.length - 1].length;

      const lineHeight = 24;
      const charWidth = 8.4;
      const top = (line - 1) * lineHeight;
      const left = col * charWidth;

      return (
        <div
          key={userId}
          className="remote-cursor"
          style={{
            top: `${top}px`,
            left: `${left}px`,
            borderColor: color
          }}
        >
          <div className="cursor-label" style={{ backgroundColor: color }}>
            {name}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="editor-container">
      <div className="editor-wrapper">
        <textarea
          ref={textareaRef}
          className={`editor-textarea ${theme}`}
          value={localContent}
          onChange={handleChange}
          onSelect={handleSelect}
          onKeyUp={handleSelect}
          onClick={handleSelect}
          readOnly={readOnly}
          placeholder={readOnly ? "Connecting..." : "Start typing... Your changes are synced in real-time!"}
          spellCheck={false}
        />
        <div ref={cursorLayerRef} className="cursor-layer">
          {renderCursors()}
        </div>
      </div>
    </div>
  );
}

export default Editor;
