import { useEffect, useState } from 'react';
import API from '../services/api';
import { formatCurrency, formatDateTime } from '../utils/format';

const FLIGHT_STATUSES = ['Scheduled', 'On Time', 'Delayed', 'Cancelled', 'Completed'];

function AdminDashboard() {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        let active = true;

        async function loadAdminData() {
            const [usersResult, flightsResult] = await Promise.allSettled([
                API.get('admin/users/pending/'),
                API.get('admin/flights/')
            ]);

            if (!active) return;

            const loadErrors = [];

            if (usersResult.status === 'fulfilled') {
                setPendingUsers(usersResult.value.data);
            } else {
                loadErrors.push('Unable to load pending users.');
            }

            if (flightsResult.status === 'fulfilled') {
                setFlights(flightsResult.value.data);
            } else {
                loadErrors.push('Unable to load flights.');
            }

            if (loadErrors.length > 0) setError(loadErrors.join(' '));
            setLoading(false);
        }

        loadAdminData();

        return () => {
            active = false;
        };
    }, []);

    async function reviewUser(id, approvalStatus) {
        setUpdatingId(id);
        setError('');
        setNotice('');

        try {
            await API.post(`admin/users/${id}/approve/`, {
                approval_status: approvalStatus
            });

            setPendingUsers((current) => current.filter((user) => user.id !== id));
            setNotice(`User ${approvalStatus.toLowerCase()} successfully.`);
        } catch {
            setError('Unable to update this user. Please try again.');
        } finally {
            setUpdatingId(null);
        }
    }

    async function changeFlightStatus(id, status) {
        setUpdatingId(id);
        setError('');
        setNotice('');

        try {
            await API.put(`admin/flights/${id}/status/`, { status });

            setFlights((current) =>
                current.map((flight) =>
                    flight.id === id ? { ...flight, status } : flight
                )
            );
            setNotice('Flight status updated successfully.');
        } catch {
            setError('Unable to update the flight status. Please try again.');
        } finally {
            setUpdatingId(null);
        }
    }

    if (loading) {
        return <div className="screen-loading">Loading admin dashboard...</div>;
    }

    return (
        <div className="screen-container">
            <header className="screen-header">
                <div>
                    <p className="screen-eyebrow">Administration</p>
                    <h1>Admin Dashboard</h1>
                    <p>Approve passengers and keep flight statuses up to date.</p>
                </div>
            </header>

            <div className="admin-stats">
                <div className="stat-card">
                    <span>Pending approvals</span>
                    <strong>{pendingUsers.length}</strong>
                </div>
                <div className="stat-card">
                    <span>Total flights</span>
                    <strong>{flights.length}</strong>
                </div>
                <div className="stat-card">
                    <span>Flights with seats</span>
                    <strong>{flights.filter((flight) => flight.available_seats > 0).length}</strong>
                </div>
            </div>

            {error && <p className="inline-message error">{error}</p>}
            {notice && <p className="inline-message success">{notice}</p>}

            <section className="panel admin-panel">
                <h2>Pending User Approvals</h2>

                {pendingUsers.length === 0 ? (
                    <div className="empty-state compact">
                        <h3>All caught up</h3>
                        <p>There are no users waiting for approval.</p>
                    </div>
                ) : (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.approval_status}</td>
                                        <td>
                                            <div className="table-actions">
                                                <button
                                                    type="button"
                                                    className="primary-button small"
                                                    disabled={updatingId === user.id}
                                                    onClick={() => reviewUser(user.id, 'Approved')}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    type="button"
                                                    className="secondary-button small"
                                                    disabled={updatingId === user.id}
                                                    onClick={() => reviewUser(user.id, 'Rejected')}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <section className="panel admin-panel">
                <h2>Flight Statuses</h2>

                {flights.length === 0 ? (
                    <div className="empty-state compact">
                        <h3>No flights yet</h3>
                        <p>Add flights in the Django admin to manage them here.</p>
                    </div>
                ) : (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Flight</th>
                                    <th>Route</th>
                                    <th>Departure</th>
                                    <th>Price</th>
                                    <th>Seats</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {flights.map((flight) => (
                                    <tr key={flight.id}>
                                        <td>
                                            <strong>{flight.airline}</strong>
                                            <br />
                                            <small>{flight.flight_number}</small>
                                        </td>
                                        <td>{flight.departure_airport} → {flight.arrival_airport}</td>
                                        <td>{formatDateTime(flight.departure_time)}</td>
                                        <td>{formatCurrency(flight.price)}</td>
                                        <td>{flight.available_seats}</td>
                                        <td>
                                            <select
                                                aria-label={`Status for ${flight.flight_number}`}
                                                value={flight.status}
                                                disabled={updatingId === flight.id}
                                                onChange={(e) =>
                                                    changeFlightStatus(flight.id, e.target.value)
                                                }
                                            >
                                                {FLIGHT_STATUSES.map((status) => (
                                                    <option key={status} value={status}>
                                                        {status}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

export default AdminDashboard;
