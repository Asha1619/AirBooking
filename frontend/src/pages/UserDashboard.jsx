import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

function UserDashboard() {
    const { user } = useAuth();

    return (
        <div className="screen-container">
            <header className="screen-header">
                <div>
                    <p className="screen-eyebrow">Passenger home</p>
                    <h1>Welcome to AirBooking{user?.first_name ? `, ${user.first_name}` : ''}!</h1>
                    <p>Find your flights and manage your bookings easily.</p>
                </div>
            </header>

            <div className="dashboard-cards">
                <div className="dashboard-card">
                    <span className="card-icon" aria-hidden="true">✈</span>
                    <h3>Search Flights</h3>
                    <p>Explore available flights and find your journey.</p>
                    <Link className="primary-button" to="/flights">
                        Search Now
                    </Link>
                </div>

                <div className="dashboard-card">
                    <span className="card-icon" aria-hidden="true">🧳</span>
                    <h3>My Trips</h3>
                    <p>View and manage your flight bookings.</p>
                    <Link className="primary-button" to="/my-trips">
                        View Trips
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;
