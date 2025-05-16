import React from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskListFooter from './components/TaskListFooter';
import EditModal from './components/EditModal';

const AppContent = React.memo(() => (
  <div className="app-container">
    <TaskForm />
    <EditModal />
    <TaskList />
    <TaskListFooter />
  </div>
));

function App() {
  return (
    <AppContent />
  );
}

export default App;
