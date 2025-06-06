import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './components/AuthContext';
import { TaskProvider } from './components/TaskContext';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <TaskProvider>
      <App />
    </TaskProvider>
  </AuthProvider>,
);
