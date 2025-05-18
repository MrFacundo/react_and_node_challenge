import { useState, useEffect } from 'react';
import { useTasks } from './TaskContext';

function EditTaskModal() {
  const {
    isEditTaskModalOpen, taskToEdit, closeEditTaskModal, updateTask,
  } = useTasks();
  const [visible, setVisible] = useState(false);
  const [editedText, setEditedText] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setEditedText(taskToEdit.text);
    }
  }, [taskToEdit]);

  useEffect(() => {
    if (isEditTaskModalOpen) {
      setVisible(true);
    } else {
      const timeout = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [isEditTaskModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeEditTaskModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeEditTaskModal]);

  const handleSave = () => {
    if (taskToEdit && editedText.trim()) {
      const sanitizedText = editedText.trim().replace(/\s+/g, ' ');
      updateTask(taskToEdit.id, { description: sanitizedText });
      closeEditTaskModal();
    }
  };

  if (!visible) return null;

  return (
    <div className={`modal-overlay ${isEditTaskModalOpen ? 'fade-in' : 'fade-out'}`}>
      <div className={`modal-content ${isEditTaskModalOpen ? 'slide-in' : 'slide-out'}`}>
        <h2>Edit Task</h2>
        <textarea
          type="text"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
        />
        <button type="button" onClick={handleSave}>Save</button>
        <button type="button" onClick={closeEditTaskModal}>Cancel</button>
      </div>
    </div>
  );
}

export default EditTaskModal;
