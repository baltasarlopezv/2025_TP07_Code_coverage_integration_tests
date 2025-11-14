import './CourtCard.css';

function CourtCard({ court, onReserve }) {
  return (
    <div className="court-card">
      <div className="court-image">
        {court.image_url ? (
          <img src={court.image_url} alt={court.name} />
        ) : (
          <div className="court-image-placeholder">
            <span>🏟️</span>
          </div>
        )}
      </div>

      <div className="court-content">
        <h3 className="court-name">{court.name}</h3>
        <p className="court-sport">{court.sport?.name || 'Unknown Sport'}</p>
        <p className="court-description">{court.description}</p>

        <div className="court-details">
          <div className="court-detail">
            <strong>Location:</strong> {court.location}
          </div>
          <div className="court-detail">
            <strong>Capacity:</strong> {court.capacity} people
          </div>
          <div className="court-detail">
            <strong>Price:</strong> ${court.price_per_hour}/hour
          </div>
        </div>

        {onReserve && (
          <button className="btn btn-primary" onClick={() => onReserve(court)}>
            Reserve Now
          </button>
        )}
      </div>
    </div>
  );
}

export default CourtCard;
