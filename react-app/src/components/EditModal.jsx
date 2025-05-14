import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function EditModal({
  isOpen,
  taskToEdit,
  onClose,
  onSave,
  onTextChange,
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      const timeout = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [isOpen]);

  if (!visible) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'fade-in' : 'fade-out'}`}>
      <div className={`modal-content ${isOpen ? 'slide-in' : 'slide-out'}`}>
        <h2>Edit Task</h2>
        <textarea
          type="text"
          value={taskToEdit?.text || ''}
          onChange={onTextChange}
        />
        <button type="button" onClick={onSave}>Save</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

EditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  taskToEdit: PropTypes.shape({
    text: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onTextChange: PropTypes.func.isRequired,
};

EditModal.defaultProps = {
  taskToEdit: null,
};

export default EditModal;
