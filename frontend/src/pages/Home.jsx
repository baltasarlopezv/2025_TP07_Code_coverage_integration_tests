import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <h1 className="hero-title">Welcome to Courts Reservation System</h1>
        <p className="hero-subtitle">
          Book your favorite sports courts easily and quickly
        </p>
        <div className="hero-actions">
          <Link to="/courts" className="btn btn-primary btn-large">
            Browse Courts
          </Link>
          {!isAuthenticated && (
            <Link to="/register" className="btn btn-secondary btn-large">
              Get Started
            </Link>
          )}
        </div>
      </section>

      <section className="features">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🏟️</div>
            <h3>Multiple Sports</h3>
            <p>Football, Tennis, Basketball and more</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Instant Booking</h3>
            <p>Reserve your court in seconds</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Easy Payment</h3>
            <p>Secure and convenient payment options</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Manage Reservations</h3>
            <p>Track and manage all your bookings</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
