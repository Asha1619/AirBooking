import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/useAuth';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import FlightSearch from './pages/FlightSearch';
import FlightDetails from './pages/FlightDetails';
import MyTrips from './pages/MyTrips';

function HomeRedirect() {
    const { loading, isAuthenticated, isAdmin } = useAuth();

    if (loading) {
        return <div className="screen-loading">Loading...</div>;
    }

    return (
        <Navigate
            to={isAuthenticated ? (isAdmin ? '/admin-dashboard' : '/dashboard') : '/login'}
            replace
        />
    );
}

function NotFound() {
    return (
        <div className="empty-state">
            <h1>Page not found</h1>
            <p>The screen you are looking for does not exist.</p>
            <Link className="primary-button" to="/dashboard">
                Go to dashboard
            </Link>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomeRedirect />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/dashboard" element={<UserDashboard />} />
                    <Route path="/flights" element={<FlightSearch />} />
                    <Route path="/flights/:id" element={<FlightDetails />} />
                    <Route path="/my-trips" element={<MyTrips />} />
                </Route>

                <Route
                    element={
                        <ProtectedRoute adminOnly>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
