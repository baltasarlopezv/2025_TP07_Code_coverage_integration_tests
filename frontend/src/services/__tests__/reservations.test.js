import { describe, it, expect, beforeEach, vi } from 'vitest';
import { reservationsService } from '../reservations';
import api from '../api';

vi.mock('../api');

describe('Reservations Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a reservation', async () => {
    const mockResponse = {
      id: 'reservation-123',
      status: 'CONFIRMED',
    };
    api.post.mockResolvedValue({ data: mockResponse });

    const result = await reservationsService.createReservation({});

    expect(result).toEqual(mockResponse);
  });

  it('should fetch user reservations', async () => {
    const mockReservations = [
      { id: 'res-1', status: 'CONFIRMED' },
    ];
    api.get.mockResolvedValue({ data: mockReservations });

    const result = await reservationsService.getMyReservations();

    expect(result).toEqual(mockReservations);
  });

  it('should cancel a reservation', async () => {
    const mockResponse = { message: 'Cancelled' };
    api.delete.mockResolvedValue({ data: mockResponse });

    const result = await reservationsService.cancelReservation('res-123');

    expect(result).toEqual(mockResponse);
  });

  it('should get all reservations', async () => {
    const mockReservations = [{ id: 'res-1' }];
    api.get.mockResolvedValue({ data: mockReservations });

    const result = await reservationsService.getAllReservations();

    expect(result).toEqual(mockReservations);
  });

  it('should get reservation by id', async () => {
    const mockReservation = { id: 'res-1', status: 'CONFIRMED' };
    api.get.mockResolvedValue({ data: mockReservation });

    const result = await reservationsService.getReservationById('res-1');

    expect(result).toEqual(mockReservation);
  });
});
