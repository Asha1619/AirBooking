import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

function Navbar() {
    const { user, isAdmin, logout } = useAuth();

    return (
        <nav className="app-navbar">
            <Link
                className="app-navbar-brand"
                to={isAdmin ? '/admin-dashboard' : '/dashboard'}
            >
                AirBooking
            </Link>

            <div className="app-navbar-links">
                {isAdmin ? (
                    <NavLink to="/admin-dashboard" end>
                        Admin Dashboard
                    </NavLink>
                ) : (
                    <>
                        <NavLink to="/dashboard" end>
                            Home
                        </NavLink>
                        <NavLink to="/flights">Search Flights</NavLink>
                        <NavLink to="/my-trips">My Trips</NavLink>
                    </>
                )}
            </div>

            <div className="app-navbar-user">
                {user?.username && (
                    <span className="app-navbar-username">{user.username}</span>
                )}
                <button type="button" onClick={logout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
