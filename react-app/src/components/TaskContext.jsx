import {
  createContext, useContext, useState, useEffect, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  fetchTasks, createTask, updateTask, deleteTask, toggleTaskCompletion,
} from '../api';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [hideCompleted, setHideCompleted] = useState(false);
  const [sortOrder, setSortOrder] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const filter = hideCompleted ? 'INCOMPLETE' : undefined;
        const orderBy = sortOrder;
        const tasksFromApi = await fetchTasks(filter, orderBy);
        setTasks(tasksFromApi.map((task) => ({ ...task, text: task.description })));
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };

    loadTasks();
  }, [hideCompleted, sortOrder]);

  // Data state management functions
  const addTask = async (taskText) => {
    if (!taskText?.trim()) return;
    try {
      const newTask = await createTask(taskText);
      setTasks([...tasks, { ...newTask, text: newTask.description }]);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const modifyTask = async (id, updates) => {
    try {
      const updatedTask = await updateTask(id, updates);
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
      await deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const toggleCompletion = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    try {
      const updated = await toggleTaskCompletion(id, task.state);
      setTasks(tasks.map((t) => (t.id === id ? { ...updated, text: updated.description } : t)));
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
    }
  };

  // UI state management functions
  const openEditModal = (task) => {
    setTaskToEdit(task);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setTaskToEdit(null);
    setIsEditModalOpen(false);
  };

  const toggleSortOrderFunc = () => {
    const orders = ['DESCRIPTION', 'CREATED_AT', 'COMPLETED_AT'];
    setSortOrder(orders[(orders.indexOf(sortOrder) + 1) % orders.length]);
  };

  const value = useMemo(() => ({
    tasks,
    addTask,
    updateTask: modifyTask,
    deleteTask: removeTask,
    toggleTaskCompletion: toggleCompletion,
    hideCompleted,
    isEditModalOpen,
    taskToEdit,
    toggleHideCompleted: () => setHideCompleted(!hideCompleted),
    toggleSortOrder: toggleSortOrderFunc,
    openEditModal,
    closeEditModal,
  }), [
    tasks,
    hideCompleted,
    isEditModalOpen,
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
