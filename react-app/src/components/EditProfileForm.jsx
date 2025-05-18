import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function EditProfileForm() {
	const { user, updateProfile } = useAuth();
	const navigate = useNavigate();
	const [form, setForm] = useState({
		email: '',
		name: '',
		password: '',
	});
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess('');
		setLoading(true);
		try {
			const updates = {};
			if (form.email) updates.email = form.email;
			if (form.name) updates.name = form.name;
			if (form.password) updates.password = form.password;
			await updateProfile(updates);
			setSuccess('Profile updated!');
			setForm({ ...form, password: '' });
		} catch (err) {
			setError('Update failed.');
		} finally {
			setLoading(false);
		}
	};

	const allInputsEmpty = !form.email && !form.name && !form.password;

	return (
		<form onSubmit={handleSubmit} className="edit-profile-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 400 }}>
			<h2>Edit Profile</h2>
			<div>
				<div><strong>Username:</strong> {user?.name}</div>
				<div><strong>Email:</strong> {user?.email}</div>
			</div>
			<p>Update your profile information below:
				<br />
				<i>(Leave blank to keep current)</i>
			</p>
			<input
				name="email"
				type="email"
				placeholder="New Email"
				value={form.email}
				onChange={handleChange}
				autoComplete="off"
			/>
			<input
				name="name"
				type="text"
				placeholder="New Name"
				value={form.name}
				onChange={handleChange}
				autoComplete="off"
			/>
			<input
				name="password"
				type="password"
				placeholder="New Password "
				value={form.password}
				onChange={handleChange}
				autoComplete="new-password"
			/>
			<button type="submit" disabled={loading || allInputsEmpty}>Save</button>
			{error && <div style={{ color: 'red' }}>{error}</div>}
			{success && <div style={{ color: 'green' }}>{success}</div>}
			<button type="button" onClick={() => navigate('/')}>Back</button>
		</form>
	);
}

export default EditProfileForm;
