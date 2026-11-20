import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import API from '../services/api';
import { formatCurrency, formatDateTime } from '../utils/format';

function FlightDetails() {
    const { id } = useParams();

    const [flight, setFlight] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [message, setMessage] = useState('');
    const [seats, setSeats] = useState(1);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingError, setBookingError] = useState('');
    const [confirmation, setConfirmation] = useState(null);

    useEffect(() => {
        let active = true;

        async function fetchFlight() {
            setLoading(true);
            setMessage('');

            try {
                const response = await API.get(`flights/${id}/`);
                if (active) setFlight(response.data);
            } catch {
                if (active) setMessage('Unable to load flight details.');
            } finally {
                if (active) setLoading(false);
            }
        }

        fetchFlight();

        return () => {
            active = false;
        };
    }, [id]);

    async function refreshStatus() {
        setRefreshing(true);

        try {
            const response = await API.get(`flights/${id}/`);
            setFlight(response.data);
        } catch {
            setMessage('Unable to refresh flight status.');
        } finally {
            setRefreshing(false);
        }
    }

    async function handleBooking(e) {
        e.preventDefault();

        setBookingError('');
        setBookingLoading(true);

        try {
            const response = await API.post('bookings/', {
                flight: Number(id),
                seats: Number(seats)
            });

            setConfirmation(response.data.booking);
            setFlight((current) => ({
                ...current,
                available_seats: current.available_seats - Number(seats)
            }));
        } catch (error) {
            const data = error.response?.data;
            setBookingError(
                data?.error || data?.detail || 'Unable to complete your booking. Please try again.'
            );
        } finally {
            setBookingLoading(false);
        }
    }

    if (loading) {
        return <div className="screen-loading">Loading flight details...</div>;
    }

    if (message || !flight) {
        return (
            <div className="empty-state">
                <h1>Flight not available</h1>
                <p>{message || 'Flight not found.'}</p>
                <Link className="primary-button" to="/flights">
                    Back to Flights
                </Link>
            </div>
        );
    }

    const isBookable =
        !['Cancelled', 'Completed'].includes(flight.status) && flight.available_seats > 0;

    return (
        <div className="screen-container">
            <Link className="back-link" to="/flights">
                ← Back to Flights
            </Link>

            <header className="screen-header">
                <div>
                    <p className="screen-eyebrow">{flight.flight_number}</p>
                    <h1>{flight.airline}</h1>
                    <span className={`badge badge-${String(flight.status).toLowerCase().replace(/\s+/g, '-')}`}>
                        {flight.status}
                    </span>
                </div>
                <div className="detail-price-group">
                    <strong className="price detail-price">{formatCurrency(flight.price)}</strong>
                    <button
                        type="button"
                        className="secondary-button small"
                        onClick={refreshStatus}
                        disabled={refreshing}
                    >
                        {refreshing ? 'Refreshing...' : 'Refresh status'}
                    </button>
                </div>
            </header>

            <div className="details-grid">
                <section className="panel">
                    <h2>Flight Details</h2>

                    <div className="detail-route">
                        <div>
                            <p className="detail-label">Departure</p>
                            <h3>{flight.departure_airport}</h3>
                            <p>{formatDateTime(flight.departure_time)}</p>
                        </div>
                        <div className="detail-divider" aria-hidden="true">✈</div>
                        <div>
                            <p className="detail-label">Arrival</p>
                            <h3>{flight.arrival_airport}</h3>
                            <p>{formatDateTime(flight.arrival_time)}</p>
                        </div>
                    </div>

                    <dl className="detail-list">
                        <div>
                            <dt>Flight number</dt>
                            <dd>{flight.flight_number}</dd>
                        </div>
                        <div>
                            <dt>Airline</dt>
                            <dd>{flight.airline}</dd>
                        </div>
                        <div>
                            <dt>Seats available</dt>
                            <dd>{flight.available_seats}</dd>
                        </div>
                        <div>
                            <dt>Price per seat</dt>
                            <dd>{formatCurrency(flight.price)}</dd>
                        </div>
                    </dl>
                </section>

                <section className="panel booking-panel">
                    <h2>Book this Flight</h2>

                    {confirmation ? (
                        <div className="confirmation">
                            <span className="confirmation-icon" aria-hidden="true">✓</span>
                            <h3>Booking confirmed!</h3>
                            <p>Your booking reference is</p>
                            <strong className="reference">{confirmation.booking_reference}</strong>
                            <p className="confirmation-total">
                                Total paid: {formatCurrency(confirmation.total_price)}
                            </p>
                            <Link className="primary-button" to="/my-trips">
                                View My Trips
                            </Link>
                        </div>
                    ) : isBookable ? (
                        <form onSubmit={handleBooking}>
                            <div className="field">
                                <label htmlFor="seats">Number of seats</label>
                                <input
                                    id="seats"
                                    type="number"
                                    min="1"
                                    max={flight.available_seats}
                                    value={seats}
                                    onChange={(e) => setSeats(e.target.value)}
                                    required
                                />
                                <small>Maximum {flight.available_seats} seats</small>
                            </div>

                            <div className="booking-total">
                                <span>Total</span>
                                <strong>
                                    {formatCurrency((Number(flight.price) || 0) * (Number(seats) || 0))}
                                </strong>
                            </div>

                            {bookingError && <p className="inline-message error">{bookingError}</p>}

                            <button
                                className="primary-button full-width"
                                type="submit"
                                disabled={bookingLoading}
                            >
                                {bookingLoading ? 'Confirming...' : 'Confirm Booking'}
                            </button>
                        </form>
                    ) : (
                        <p className="inline-message">
                            This flight is currently unavailable for booking.
                        </p>
                    )}
                </section>
            </div>
        </div>
    );
}

export default FlightDetails;
