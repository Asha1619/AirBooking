import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { formatCurrency, formatDateTime } from '../utils/format';

function MyTrips() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        let active = true;

        async function fetchBookings() {
            try {
                const response = await API.get('bookings/');
                if (active) setBookings(response.data);
            } catch {
                if (active) setMessage('Unable to load your trips. Please try again.');
            } finally {
                if (active) setLoading(false);
            }
        }

        fetchBookings();

        return () => {
            active = false;
        };
    }, []);

    if (loading) {
        return <div className="screen-loading">Loading your trips...</div>;
    }

    return (
        <div className="screen-container">
            <header className="screen-header">
                <div>
                    <p className="screen-eyebrow">Your bookings</p>
                    <h1>My Trips</h1>
                    <p>All your confirmed flights in one place.</p>
                </div>
                <Link className="primary-button" to="/flights">
                    Find another flight
                </Link>
            </header>

            {message && <p className="inline-message error">{message}</p>}

            {bookings.length === 0 && !message ? (
                <div className="empty-state">
                    <h2>No trips yet</h2>
                    <p>Your confirmed bookings will appear here.</p>
                    <Link className="primary-button" to="/flights">
                        Search Flights
                    </Link>
                </div>
            ) : (
                <div className="trip-list">
                    {bookings.map((booking) => {
                        const flight = booking.flight_details || {};

                        return (
                            <article className="trip-card" key={booking.id}>
                                <div className="trip-card-header">
                                    <div>
                                        <p className="screen-eyebrow">{booking.booking_reference}</p>
                                        <h2>{flight.airline || 'Flight'}</h2>
                                        <p>
                                            {flight.flight_number} · Booked{' '}
                                            {formatDateTime(booking.created_at)}
                                        </p>
                                    </div>
                                    <span className="badge badge-paid">
                                        {booking.payment_status}
                                    </span>
                                </div>

                                <div className="flight-route">
                                    <div>
                                        <strong>{flight.departure_airport}</strong>
                                        <p>{formatDateTime(flight.departure_time)}</p>
                                    </div>
                                    <div className="flight-arrow" aria-hidden="true">✈</div>
                                    <div className="flight-route-end">
                                        <strong>{flight.arrival_airport}</strong>
                                        <p>{formatDateTime(flight.arrival_time)}</p>
                                    </div>
                                </div>

                                <div className="trip-card-footer">
                                    <div>
                                        <span>{booking.seats} seat(s)</span>
                                        <strong className="price">
                                            {formatCurrency(booking.total_price)}
                                        </strong>
                                    </div>
                                    {flight.id && (
                                        <Link className="text-link" to={`/flights/${flight.id}`}>
                                            Flight details →
                                        </Link>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default MyTrips;
