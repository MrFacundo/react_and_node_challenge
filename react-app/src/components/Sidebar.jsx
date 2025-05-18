import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';

function Sidebar({ open, onClose }) {
  return (
    <div className={`sidebar${open ? ' open' : ''}`}>
      <nav>
        <ul>
          <li>
            <Link to="/edit-profile" onClick={onClose}>Edit Profile</Link>
          </li>
          <li>
            <LogoutButton />
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
