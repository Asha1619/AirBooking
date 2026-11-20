import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

function ProtectedRoute({ children, adminOnly = false }) {
    const { loading, isAuthenticated, isAdmin } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="screen-loading">Loading your session...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default ProtectedRoute;
