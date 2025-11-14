import { useState, useEffect } from 'react';
import { reservationsService } from '../services/reservations';
import './MyReservations.css';

function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const data = await reservationsService.getMyReservations();
      setReservations(data);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    try {
      await reservationsService.cancelReservation(id);
      setReservations(
        reservations.map((res) =>
          res.id === id ? { ...res, status: 'CANCELLED' } : res
        )
      );
    } catch (err) {
      alert('Failed to cancel reservation');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString();
  };

  const formatTime = (timeStr) => {
    return new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'status-confirmed';
      case 'CANCELLED':
        return 'status-cancelled';
      case 'COMPLETED':
        return 'status-completed';
      default:
        return 'status-pending';
    }
  };

  if (loading) {
    return <div className="loading">Loading reservations...</div>;
  }

  return (
    <div className="reservations-page">
      <h1>My Reservations</h1>

      {error && <div className="alert alert-error">{error}</div>}

      {reservations.length === 0 ? (
        <div className="alert alert-info">
          You don't have any reservations yet.
        </div>
      ) : (
        <div className="reservations-list">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="reservation-card">
              <div className="reservation-header">
                <h3>{reservation.court?.name || 'Court'}</h3>
                <span className={`status-badge ${getStatusClass(reservation.status)}`}>
                  {reservation.status}
                </span>
              </div>

              <div className="reservation-details">
                <div className="detail-row">
                  <strong>Date:</strong> {formatDate(reservation.date)}
                </div>
                <div className="detail-row">
                  <strong>Time:</strong> {formatTime(reservation.start_time)} -{' '}
                  {formatTime(reservation.end_time)}
                </div>
                <div className="detail-row">
                  <strong>Location:</strong> {reservation.court?.location || 'N/A'}
                </div>
                <div className="detail-row">
                  <strong>Price:</strong> ${reservation.total_price}
                </div>
                {reservation.notes && (
                  <div className="detail-row">
                    <strong>Notes:</strong> {reservation.notes}
                  </div>
                )}
              </div>

              {reservation.status === 'CONFIRMED' && (
                <div className="reservation-actions">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleCancel(reservation.id)}
                  >
                    Cancel Reservation
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyReservations;
