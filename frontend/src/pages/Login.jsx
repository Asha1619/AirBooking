import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, user, loading: sessionLoading } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    if (sessionLoading) {
        return <div className="screen-loading">Loading...</div>;
    }

    if (user) {
        const fallback = user.is_staff ? '/admin-dashboard' : '/dashboard';
        return <Navigate to={location.state?.from?.pathname || fallback} replace />;
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
            const currentUser = await login(formData);
            const fallback = currentUser.is_staff ? '/admin-dashboard' : '/dashboard';

            navigate(location.state?.from?.pathname || fallback, { replace: true });
        } catch (error) {
            const data = error.response?.data;

            if (data?.detail) {
                setMessage(data.detail);
            } else if (data) {
                setMessage(JSON.stringify(data));
            } else {
                setMessage('Unable to connect to the server.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>AirBooking</h1>
                <h2>Welcome Back!</h2>

                <p className="auth-subtitle">Login to continue your journey</p>

                <form onSubmit={handleSubmit}>
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

                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        required
                    />

                    {message && <p className="auth-message">{message}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
