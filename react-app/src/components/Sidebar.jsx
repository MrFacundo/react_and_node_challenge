import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from './AuthContext';

function Sidebar({ open, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`sidebar${open ? ' open' : ''}`}>
      <nav>
        <ul>
          <li>
            <Link to="/edit-profile" onClick={onClose}>Edit Profile</Link>
          </li>
          <li>
            <button
              type="button"
              className="action-btn logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

Sidebar.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Sidebar;
