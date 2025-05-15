import {
  createContext, useContext, useState, useEffect,
} from 'react';

import PropTypes from 'prop-types';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  const [hideCompleted, setHideCompleted] = useState(false);
  const [sortOrder, setSortOrder] = useState('default');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Data context functions
  const addTask = (taskText) => {
    setTasks([...tasks, {
      id: Date.now(),
      text: taskText,
      completed: false,
    }]);
  };

  const updateTask = (id, newText) => {
    setTasks(tasks.map((task) => (
      task.id === id ? { ...task, text: newText } : task
    )));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTaskCompletion = (id) => {
    setTasks(tasks.map((task) => (
      task.id === id ? { ...task, completed: !task.completed } : task
    )));
  };

  // UI context functions
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

  const openEditModal = (task) => {
    setTaskToEdit(task);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setTaskToEdit(null);
    setIsEditModalOpen(false);
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.text.localeCompare(b.text);
    }
    if (sortOrder === 'desc') {
      return b.text.localeCompare(a.text);
    }
    return 0;
  });

  const filteredTasks = hideCompleted
    ? sortedTasks.filter((item) => !item.completed)
    : sortedTasks;

  return (
    <TaskContext.Provider
      value={{
        tasks,
        hideCompleted,
        sortOrder,
        isEditModalOpen,
        taskToEdit,
        filteredTasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        toggleHideCompleted,
        toggleSortOrder,
        openEditModal,
        closeEditModal,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

TaskProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useTasks = () => useContext(TaskContext);
