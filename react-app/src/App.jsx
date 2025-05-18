import { useState } from 'react';
import './App.css';
import {
  BrowserRouter as Router, Routes, Route, Navigate,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from './components/AuthContext';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import EditProfileForm from './components/EditProfileForm';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskListFooter from './components/TaskListFooter';
import EditTaskModal from './components/EditTaskModal';
import Sidebar from './components/Sidebar';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const userInitial = user && user.name ? user.name.charAt(0).toUpperCase() : '';

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-container">
      <Routes>
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/edit-profile" element={<ProtectedRoute><EditProfileForm /></ProtectedRoute>} />
        <Route
          path="/"
          element={(
            <ProtectedRoute>
              <>
                <button
                  className="menu-btn"
                  onClick={openSidebar}
                  aria-label="Open menu"
                  type="button"
                >
                  {userInitial}
                </button>
                <Sidebar open={sidebarOpen} onClose={closeSidebar} />
                {sidebarOpen && (
                  <div
                    className="sidebar-overlay"
                    onClick={closeSidebar}
                    aria-label="Close sidebar overlay"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') closeSidebar();
                    }}
                  />
                )}
                <TaskForm />
                <EditTaskModal />
                <TaskList />
                <TaskListFooter />
              </>
            </ProtectedRoute>
          )}
        />
        <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
