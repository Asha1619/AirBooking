import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { formatCurrency, formatDateTime } from '../utils/format';

function FlightSearch() {
    const [filters, setFilters] = useState({
        departure: '',
        arrival: '',
        date: '',
        available: true
    });

    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [searched, setSearched] = useState(false);

    function handleChange(e) {
        const { name, value, type, checked } = e.target;

        setFilters({
            ...filters,
            [name]: type === 'checkbox' ? checked : value
        });
    }

    async function handleSearch(e) {
        e.preventDefault();

        setLoading(true);
        setMessage('');
        setFlights([]);
        setSearched(true);

        try {
            const response = await API.get('flights/search/', {
                params: {
                    departure: filters.departure,
                    arrival: filters.arrival,
                    date: filters.date,
                    available: filters.available ? 'true' : 'false'
                }
            });

            setFlights(response.data);

            if (response.data.length === 0) {
                setMessage('No flights found. Try different search filters.');
            }
        } catch (error) {
            setMessage(
                error.response?.status === 401
                    ? 'Your session has expired. Please log in again.'
                    : 'Unable to load flights. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="screen-container">
            <header className="screen-header">
                <div>
                    <p className="screen-eyebrow">Flights</p>
                    <h1>Find Your Flight</h1>
                    <p>Search and discover available flights for your journey.</p>
                </div>
            </header>

            <form className="search-form" onSubmit={handleSearch}>
                <div className="field">
                    <label htmlFor="departure">Departure Airport</label>
                    <input
                        id="departure"
                        type="text"
                        name="departure"
                        placeholder="Example: Kochi"
                        value={filters.departure}
                        onChange={handleChange}
                    />
                </div>

                <div className="field">
                    <label htmlFor="arrival">Arrival Airport</label>
                    <input
                        id="arrival"
                        type="text"
                        name="arrival"
                        placeholder="Example: Delhi"
                        value={filters.arrival}
                        onChange={handleChange}
                    />
                </div>

                <div className="field">
                    <label htmlFor="date">Departure Date</label>
                    <input
                        id="date"
                        type="date"
                        name="date"
                        value={filters.date}
                        onChange={handleChange}
                    />
                </div>

                <label className="checkbox-field" htmlFor="available">
                    <input
                        id="available"
                        type="checkbox"
                        name="available"
                        checked={filters.available}
                        onChange={handleChange}
                    />
                    Only available flights
                </label>

                <button className="primary-button" type="submit" disabled={loading}>
                    {loading ? 'Searching...' : 'Search Flights'}
                </button>
            </form>

            {message && <p className="inline-message">{message}</p>}

            <div className="flight-results">
                {flights.map((flight) => (
                    <article className="flight-card" key={flight.id}>
                        <div className="flight-card-header">
                            <div>
                                <h3>{flight.airline}</h3>
                                <p>{flight.flight_number}</p>
                            </div>
                            <span className={`badge badge-${String(flight.status).toLowerCase().replace(/\s+/g, '-')}`}>
                                {flight.status}
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

                        <div className="flight-card-footer">
                            <div>
                                <strong className="price">{formatCurrency(flight.price)}</strong>
                                <p>{flight.available_seats} seats available</p>
                            </div>
                            <Link className="primary-button" to={`/flights/${flight.id}`}>
                                View Details
                            </Link>
                        </div>
                    </article>
                ))}
            </div>

            {!searched && (
                <div className="empty-state">
                    <h2>Ready to take off?</h2>
                    <p>Use the search form above to see available flights.</p>
                </div>
            )}
        </div>
    );
}

export default FlightSearch;
