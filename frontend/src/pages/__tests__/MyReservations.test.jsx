import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyReservations from '../MyReservations';

vi.mock('../../services/reservations', () => ({
  reservationsService: {
    getMyReservations: vi.fn(() => Promise.resolve([])),
    cancelReservation: vi.fn(),
  }
}));

describe('MyReservations Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    render(<MyReservations />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render reservations heading', async () => {
    render(<MyReservations />);
    const heading = await screen.findByRole('heading', { name: /my reservations/i });
    expect(heading).toBeInTheDocument();
  });
});
