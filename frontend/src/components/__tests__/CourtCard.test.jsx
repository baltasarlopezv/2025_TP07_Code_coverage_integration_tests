import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CourtCard from '../CourtCard';

describe('CourtCard Component', () => {
  const mockCourt = {
    id: 'court-123',
    name: 'Court 1',
    sport: { name: 'Football' },
    description: 'A great football court',
    location: 'Downtown',
    capacity: 10,
    price_per_hour: 100,
    image_url: 'https://example.com/court.jpg',
  };

  it('should render court information correctly', () => {
    render(<CourtCard court={mockCourt} />);

    expect(screen.getByText('Court 1')).toBeInTheDocument();
    expect(screen.getByText('Football')).toBeInTheDocument();
    expect(screen.getByText('A great football court')).toBeInTheDocument();
    expect(screen.getByText(/Downtown/)).toBeInTheDocument();
    expect(screen.getByText(/10 people/)).toBeInTheDocument();
    expect(screen.getByText(/\$100\/hour/)).toBeInTheDocument();
  });

  it('should render image when image_url is provided', () => {
    render(<CourtCard court={mockCourt} />);

    const image = screen.getByAltText('Court 1');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/court.jpg');
  });

  it('should render placeholder when image_url is not provided', () => {
    const courtWithoutImage = { ...mockCourt, image_url: null };
    render(<CourtCard court={courtWithoutImage} />);

    expect(screen.getByText('🏟️')).toBeInTheDocument();
  });

  it('should display "Unknown Sport" when sport is not provided', () => {
    const courtWithoutSport = { ...mockCourt, sport: null };
    render(<CourtCard court={courtWithoutSport} />);

    expect(screen.getByText('Unknown Sport')).toBeInTheDocument();
  });

  it('should call onReserve when Reserve button is clicked', () => {
    const onReserveMock = vi.fn();
    render(<CourtCard court={mockCourt} onReserve={onReserveMock} />);

    const reserveButton = screen.getByText('Reserve Now');
    fireEvent.click(reserveButton);

    expect(onReserveMock).toHaveBeenCalledWith(mockCourt);
    expect(onReserveMock).toHaveBeenCalledTimes(1);
  });

  it('should not render Reserve button when onReserve is not provided', () => {
    render(<CourtCard court={mockCourt} />);

    expect(screen.queryByText('Reserve Now')).not.toBeInTheDocument();
  });
});
