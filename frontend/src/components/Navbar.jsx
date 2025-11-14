import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🏟️ Courts Reservation
        </Link>

        <div className="navbar-menu">
          <Link to="/courts" className="nav-link">
            Courts
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/my-reservations" className="nav-link">
                My Reservations
              </Link>
              <div className="nav-user">
                <span className="user-name">
                  {user?.first_name} {user?.last_name}
                </span>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
