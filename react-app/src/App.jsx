import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskListFooter from './components/TaskListFooter';
import EditModal from './components/EditModal';

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
      <TaskForm
        task={task}
        onInputChange={handleInputChange}
        onKeyPress={handleKeyPress}
        onCreateTask={handleCreateTask}
      />

      <EditModal
        isOpen={isEditModalOpen}
        taskToEdit={taskToEdit}
        onClose={closeEditModal}
        onSave={handleEditTaskSave}
        onTextChange={(e) => setTaskToEdit({ ...taskToEdit, text: e.target.value })}
        textareaRef={textareaRef}
      />

      <TaskList
        tasks={filteredTasks}
        onToggleCompletion={toggleTaskCompletion}
        onEditTask={openEditModal}
        onDeleteTask={handleDeleteTask}
        sortOrder={sortOrder}
        onToggleSortOrder={toggleSortOrder}
      />

      <TaskListFooter
        hideCompleted={hideCompleted}
        onToggleHideCompleted={toggleHideCompleted}
      />
    </div>
  );
}

export default App;
