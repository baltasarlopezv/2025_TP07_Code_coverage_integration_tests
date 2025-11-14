import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { courtsService } from '../services/courts';
import { reservationsService } from '../services/reservations';
import CourtCard from '../components/CourtCard';
import './Courts.css';

function Courts() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [reservationData, setReservationData] = useState({
    date: '',
    timeSlot: '',
    notes: '',
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const data = await courtsService.getAllCourts();
      setCourts(data);
    } catch (err) {
      console.error('Error fetching courts:', err);
      setError('Failed to load courts');
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = (court) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedCourt(court);
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedCourt(null);
    setReservationData({ date: '', timeSlot: '', notes: '' });
    setAvailableSlots([]);
    setError('');
    setSuccess('');
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setReservationData({
      ...reservationData,
      [name]: value,
    });

    // If date is changed, fetch available slots
    if (name === 'date' && value && selectedCourt) {
      setLoadingSlots(true);
      setReservationData(prev => ({ ...prev, timeSlot: '' })); // Reset selected slot
      try {
        const data = await courtsService.getAvailableSlots(selectedCourt.id, value);
        setAvailableSlots(data.available_slots);
      } catch (err) {
        console.error('Error fetching available slots:', err);
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    }
  };

  const handleTimeSlotSelect = (slot) => {
    setReservationData({
      ...reservationData,
      timeSlot: `${slot.start}-${slot.end}`,
    });
  };

  const handleSubmitReservation = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!reservationData.timeSlot) {
      setError('Please select a time slot');
      return;
    }

    try {
      // Extract start and end time from timeSlot
      const [startTime, endTime] = reservationData.timeSlot.split('-');
      const dateStr = reservationData.date;
      const startTimeStr = `${dateStr}T${startTime}:00`;
      const endTimeStr = `${dateStr}T${endTime}:00`;

      await reservationsService.createReservation({
        court_id: selectedCourt.id,
        date: dateStr,
        start_time: startTimeStr,
        end_time: endTimeStr,
        notes: reservationData.notes,
      });

      setSuccess('Reservation created successfully!');
      setTimeout(() => {
        handleModalClose();
        navigate('/my-reservations');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create reservation');
    }
  };

  if (loading) {
    return <div className="loading">Loading courts...</div>;
  }

  return (
    <div className="courts-page">
      <h1>Available Courts</h1>

      {courts.length === 0 ? (
        <div className="alert alert-info">No courts available at the moment.</div>
      ) : (
        <div className="courts-grid">
          {courts.map((court) => (
            <CourtCard key={court.id} court={court} onReserve={handleReserve} />
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Reserve {selectedCourt?.name}</h2>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmitReservation}>
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={reservationData.date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label>Select Time Slot (1 hour)</label>
                {!reservationData.date ? (
                  <div className="alert alert-info" style={{ marginTop: '10px' }}>
                    Please select a date first
                  </div>
                ) : loadingSlots ? (
                  <div className="loading-slots">Loading available slots...</div>
                ) : availableSlots.length === 0 ? (
                  <div className="alert alert-warning" style={{ marginTop: '10px' }}>
                    No available slots for this date
                  </div>
                ) : (
                  <div className="time-slots-grid">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.label}
                        type="button"
                        className={`time-slot-btn ${
                          reservationData.timeSlot === `${slot.start}-${slot.end}` ? 'selected' : ''
                        }`}
                        onClick={() => handleTimeSlotSelect(slot)}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notes (optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={reservationData.notes}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleModalClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Courts;
