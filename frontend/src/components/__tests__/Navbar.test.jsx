import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar';

const mockNavigate = vi.fn();
const mockLogout = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    isAuthenticated: false,
    user: null,
    logout: mockLogout,
  })),
}));

const renderNavbar = () => {
  return render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
};

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render navbar brand', () => {
    renderNavbar();

    const brandLink = screen.getByRole('link', { name: /courts reservation/i });
    expect(brandLink).toBeInTheDocument();
    expect(brandLink).toHaveAttribute('href', '/');
  });

  it('should render courts link', () => {
    renderNavbar();

    const courtsLinks = screen.getAllByRole('link', { name: /courts/i });
    expect(courtsLinks.length).toBeGreaterThan(0);
  });

  it('should render login and register links when not authenticated', () => {
    renderNavbar();

    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /my reservations/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
  });

  it('should render navbar links', () => {
    renderNavbar();

    // Check that courts link exists
    const courtsLinks = screen.getAllByRole('link', { name: /courts/i });
    expect(courtsLinks.length).toBeGreaterThan(0);
    
    // Check auth-related links
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });
});
