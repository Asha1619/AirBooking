import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/useAuth';

function Register() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: ''
    });

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    if (user) {
        return <Navigate to={user.is_staff ? '/admin-dashboard' : '/dashboard'} replace />;
    }

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setMessage('');
        setLoading(true);

        try {
            const response = await API.post('auth/register/', formData);

            setMessage(
                `Welcome ${response.data.username}! Your registration is successful. Please wait for admin approval.`
            );

            setTimeout(() => {
                navigate('/login', { replace: true });
            }, 3000);
        } catch (error) {
            const errors = error.response?.data;

            if (errors) {
                const errorMessages = Object.entries(errors)
                    .map(([field, messages]) => {
                        const text = Array.isArray(messages)
                            ? messages.join(', ')
                            : String(messages);
                        return `${field}: ${text}`;
                    })
                    .join('\n');

                setMessage(errorMessages);
            } else {
                setMessage('Unable to connect to the server.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card auth-card-register">
                <h1>AirBooking</h1>
                <h2>Create Account</h2>

                <p className="auth-subtitle">Register to start booking your flights</p>

                <form onSubmit={handleSubmit}>
                    <div className="auth-name-row">
                        <div>
                            <label>First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                placeholder="First name"
                                value={formData.first_name}
                                onChange={handleChange}
                                autoComplete="given-name"
                            />
                        </div>
                        <div>
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Last name"
                                value={formData.last_name}
                                onChange={handleChange}
                                autoComplete="family-name"
                            />
                        </div>
                    </div>

                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Enter username"
                        value={formData.username}
                        onChange={handleChange}
                        autoComplete="username"
                        required
                    />

                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        required
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                        required
                    />

                    {message && <p className="auth-message">{message}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? 'Registering...' : 'Create Account'}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
