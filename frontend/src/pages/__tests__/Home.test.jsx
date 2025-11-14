import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    isAuthenticated: false,
    user: null,
  })),
}));

const renderHome = () => {
  return render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
};

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render hero section', () => {
    renderHome();

    expect(screen.getByText(/welcome to courts reservation system/i)).toBeInTheDocument();
    expect(screen.getByText(/book your favorite sports courts/i)).toBeInTheDocument();
  });

  it('should render browse courts link', () => {
    renderHome();

    const browseLink = screen.getByRole('link', { name: /browse courts/i });
    expect(browseLink).toBeInTheDocument();
    expect(browseLink).toHaveAttribute('href', '/courts');
  });

  it('should render get started link when not authenticated', () => {
    renderHome();

    const getStartedLink = screen.getByRole('link', { name: /get started/i });
    expect(getStartedLink).toBeInTheDocument();
    expect(getStartedLink).toHaveAttribute('href', '/register');
  });

  it('should render all main content', () => {
    renderHome();

    // Verify features are rendered
    expect(screen.getByText(/multiple sports/i)).toBeInTheDocument();
    expect(screen.getByText(/instant booking/i)).toBeInTheDocument();
    expect(screen.getByText(/easy payment/i)).toBeInTheDocument();
    expect(screen.getByText(/manage reservations/i)).toBeInTheDocument();
  });

  it('should render features section', () => {
    renderHome();

    expect(screen.getByText(/why choose us/i)).toBeInTheDocument();
    expect(screen.getByText(/multiple sports/i)).toBeInTheDocument();
    expect(screen.getByText(/instant booking/i)).toBeInTheDocument();
    expect(screen.getByText(/easy payment/i)).toBeInTheDocument();
    expect(screen.getByText(/manage reservations/i)).toBeInTheDocument();
  });

  it('should render all feature descriptions', () => {
    renderHome();

    expect(screen.getByText(/football, tennis, basketball/i)).toBeInTheDocument();
    expect(screen.getByText(/reserve your court in seconds/i)).toBeInTheDocument();
    expect(screen.getByText(/secure and convenient payment/i)).toBeInTheDocument();
    expect(screen.getByText(/track and manage all your bookings/i)).toBeInTheDocument();
  });
});
