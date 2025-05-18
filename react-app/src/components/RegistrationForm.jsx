import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function RegistrationForm() {
	const { register } = useAuth();
	const navigate = useNavigate();
	const [form, setForm] = useState({ email: '', password: '', name: '' });
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);
		try {
			await register(form.email, form.password, form.name);
			navigate('/');
		} catch (err) {
			setError(`Registration failed.${err?.body?.error ? ' ' + err.body.error : ''}`);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<h2>Register</h2>
			<input
				name="email"
				type="email"
				placeholder="Email"
				value={form.email}
				onChange={handleChange}
				required
			/>
			<input
				name="name"
				type="text"
				placeholder="Name"
				value={form.name}
				onChange={handleChange}
				required
			/>
			<input
				name="password"
				type="password"
				placeholder="Password"
				value={form.password}
				onChange={handleChange}
				required
			/>
			<button type="submit" disabled={loading}>Register</button>
			{error && <div>{error}</div>}
			<div>
				Already have an account? <Link to="/login">Login</Link>
			</div>
		</form>
	);
}

export default RegistrationForm;
