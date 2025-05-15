import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskListFooter from './components/TaskListFooter';
import EditModal from './components/EditModal';
import { TaskProvider } from './components/TaskContext';

function AppContent() {
  return (
    <div className="app-container">
      <TaskForm />
      <EditModal />
      <TaskList />
      <TaskListFooter />
    </div>
  );
}

function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}

export default App;
