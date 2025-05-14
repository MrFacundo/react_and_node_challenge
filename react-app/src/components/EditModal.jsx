import React, { useState, useEffect } from 'react';

const EditModal = ({ isOpen, taskToEdit, onClose, onSave, onTextChange }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      const timeout = setTimeout(() => setVisible(false), 300); // Match animation duration
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!visible) return null;

  return (
    <div
      className={`modal-overlay ${isOpen ? 'fade-in' : 'fade-out'}`}
      onClick={onClose}
    >
      <div
        className={`modal-content ${isOpen ? 'slide-in' : 'slide-out'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Edit Task</h2>
        <textarea
          autoFocus
          type="text"
          value={taskToEdit?.text || ''}
          onChange={onTextChange}
        />
        <button onClick={onSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default EditModal;