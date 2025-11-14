import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Courts from '../Courts';

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    isAuthenticated: false,
    user: null,
  })),
}));

vi.mock('../../services/courts', () => ({
  courtsService: {
    getAllCourts: vi.fn(() => Promise.resolve([])),
    getAvailableSlots: vi.fn(),
  }
}));

vi.mock('../../services/reservations', () => ({
  reservationsService: {
    createReservation: vi.fn(),
  }
}));

const renderCourts = () => {
  return render(
    <BrowserRouter>
      <Courts />
    </BrowserRouter>
  );
};

describe('Courts Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    renderCourts();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render courts heading', async () => {
    renderCourts();
    const heading = await screen.findByRole('heading', { name: /available courts/i });
    expect(heading).toBeInTheDocument();
  });
});
