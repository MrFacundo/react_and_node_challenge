import { useState, useEffect } from 'react';
import { useTasks } from './TaskContext';

function EditModal() {
  const {
    isEditModalOpen, taskToEdit, closeEditModal, updateTask,
  } = useTasks();
  const [visible, setVisible] = useState(false);
  const [editedText, setEditedText] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setEditedText(taskToEdit.text);
    }
  }, [taskToEdit]);

  useEffect(() => {
    if (isEditModalOpen) {
      setVisible(true);
    } else {
      const timeout = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [isEditModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeEditModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeEditModal]);

  const handleSave = () => {
    if (taskToEdit && editedText.trim()) {
      updateTask(taskToEdit.id, editedText);
      closeEditModal();
    }
  };

  if (!visible) return null;

  return (
    <div className={`modal-overlay ${isEditModalOpen ? 'fade-in' : 'fade-out'}`}>
      <div className={`modal-content ${isEditModalOpen ? 'slide-in' : 'slide-out'}`}>
        <h2>Edit Task</h2>
        <textarea
          type="text"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
        />
        <button type="button" onClick={handleSave}>Save</button>
        <button type="button" onClick={closeEditModal}>Cancel</button>
      </div>
    </div>
  );
}

export default EditModal;
