import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [hideCompleted, setHideCompleted] = useState(false);
  const [sortOrder, setSortOrder] = useState('default');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const textareaRef = useRef(null);

  const handleInputChange = (e) => {
    setTask(e.target.value);
  };

  const handleCreateTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { id: Date.now(), text: task, completed: false }]);
      setTask('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCreateTask();
    }
  };

  const toggleTaskCompletion = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const openEditModal = (task) => {
    setTaskToEdit(task);
    setIsEditModalOpen(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const closeEditModal = () => {
    setTaskToEdit(null);
    setIsEditModalOpen(false);
  };

  const handleEditTaskSave = () => {
    if (taskToEdit) {
      setTasks(tasks.map(task => task.id === taskToEdit.id ? { ...task, text: taskToEdit.text } : task));
      closeEditModal();
    }
  };

  const toggleHideCompleted = () => {
    setHideCompleted(!hideCompleted);
  };

  const toggleSortOrder = () => {
    if (sortOrder === 'default') {
      setSortOrder('asc');
    } else if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      setSortOrder('default');
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.text.localeCompare(b.text);
    } else if (sortOrder === 'desc') {
      return b.text.localeCompare(a.text);
    }
    return 0;
  });

  const filteredTasks = hideCompleted ? sortedTasks.filter(task => !task.completed) : sortedTasks;

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

  return (
    <div className="app-container">
      <div className="task-form">
        <input
          type="text"
          placeholder="Write new task here..."
          value={task}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleCreateTask}>Create</button>
      </div>

      {isEditModalOpen && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Task</h2>
            <textarea
              ref={textareaRef}
              type="text"
              value={taskToEdit?.text || ''}
              onChange={(e) => setTaskToEdit({ ...taskToEdit, text: e.target.value })}
            />
            <button onClick={handleEditTaskSave}>Save</button>
            <button onClick={closeEditModal}>Cancel</button>
          </div>
        </div>
      )}

      <div className="task-list">
        <div className="task-list-header" onClick={toggleSortOrder}>
          Tasks {sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : ''}
        </div>
        {filteredTasks.map(task => (
          <div key={task.id} className="task-item">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
            />
            <span>{task.text}</span>
            <button onClick={() => openEditModal(task)}>Edit</button>
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </div>
        ))}
      </div>

      <div className="task-list-footer">
        <label>
          <input
            type="checkbox"
            checked={hideCompleted}
            onChange={toggleHideCompleted}
          />
          Hide completed
        </label>
      </div>
    </div>
  );
}

export default App;
