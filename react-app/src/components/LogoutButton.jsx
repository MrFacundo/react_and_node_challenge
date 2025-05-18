import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	return (
		<button
			type="button"
			className="action-btn logout-btn"
			onClick={handleLogout}>
			Logout
		</button>
	);
}

export default LogoutButton;
