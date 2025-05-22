import {
  createContext, useContext, useState, useEffect, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  fetchTasks, createTask, updateTask, deleteTask, toggleTaskCompletion,
} from '../api';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

function getOrderParams(sortOrder) {
  if (sortOrder === 'DESCRIPTION_ASC') {
    return { orderBy: 'DESCRIPTION', direction: 'asc' };
  }
  if (sortOrder === 'DESCRIPTION_DESC') {
    return { orderBy: 'DESCRIPTION', direction: 'desc' };
  }
  if (sortOrder === 'CREATED_AT_DESC') {
    return { orderBy: 'CREATED_AT', direction: 'desc' };
  }
  return { orderBy: 'CREATED_AT', direction: 'asc' };
}

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [hideCompleted, setHideCompleted] = useState(false);
  const [sortOrder, setSortOrder] = useState('CREATED_AT_ASC');
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const { token } = useAuth();

  // Fetch tasks from API when the component mounts or when fetching parameters change
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const filter = hideCompleted ? 'INCOMPLETE' : undefined;
        const { orderBy, direction } = getOrderParams(sortOrder);
        const tasksFromApi = await fetchTasks(filter, orderBy, token, direction);
        setTasks(tasksFromApi.map((task) => ({ ...task, text: task.description })));
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };

    loadTasks();
  }, [hideCompleted, sortOrder, token]);

  // Data state management functions
  const addTask = async (taskText) => {
    if (!taskText?.trim()) return;
    try {
      await createTask(taskText, token);
      const filter = hideCompleted ? 'INCOMPLETE' : undefined;
      const { orderBy, direction } = getOrderParams(sortOrder);
      const tasksFromApi = await fetchTasks(filter, orderBy, token, direction);
      setTasks(tasksFromApi.map((task) => ({ ...task, text: task.description })));
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const modifyTask = async (id, updates) => {
    try {
      const updatedTask = await updateTask(id, updates, token);
      setTasks(
        tasks.map((task) => (
          task.id === id
            ? { ...updatedTask, text: updatedTask.description }
            : task
        )),
      );
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const removeTask = async (id) => {
    try {
      await deleteTask(id, token);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const toggleCompletion = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    try {
      const updated = await toggleTaskCompletion(id, task.state, token);
      setTasks(tasks.map((t) => (t.id === id ? { ...updated, text: updated.description } : t)));
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
    }
  };

  // UI state management functions
  const openEditTaskModal = (task) => {
    setTaskToEdit(task);
    setIsEditTaskModalOpen(true);
  };

  const closeEditTaskModal = () => {
    setTaskToEdit(null);
    setIsEditTaskModalOpen(false);
  };

  const toggleSortOrderFunc = () => {
    if (sortOrder === 'CREATED_AT_ASC') {
      setSortOrder('CREATED_AT_DESC');
    } else if (sortOrder === 'CREATED_AT_DESC') {
      setSortOrder('DESCRIPTION_ASC');
    } else if (sortOrder === 'DESCRIPTION_ASC') {
      setSortOrder('DESCRIPTION_DESC');
    } else {
      setSortOrder('CREATED_AT_ASC');
    }
  };

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    tasks,
    addTask,
    updateTask: modifyTask,
    deleteTask: removeTask,
    toggleTaskCompletion: toggleCompletion,
    hideCompleted,
    isEditTaskModalOpen,
    taskToEdit,
    toggleHideCompleted: () => setHideCompleted(!hideCompleted),
    toggleSortOrder: toggleSortOrderFunc,
    openEditTaskModal,
    closeEditTaskModal,
  }), [
    tasks,
    hideCompleted,
    isEditTaskModalOpen,
    taskToEdit,
    sortOrder,
  ]);

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

TaskProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useTasks = () => useContext(TaskContext);
