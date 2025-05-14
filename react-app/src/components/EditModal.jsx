import React from 'react';

const EditModal = ({ isOpen, taskToEdit, onClose, onSave, onTextChange, textareaRef }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Task</h2>
        <textarea
          ref={textareaRef}
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