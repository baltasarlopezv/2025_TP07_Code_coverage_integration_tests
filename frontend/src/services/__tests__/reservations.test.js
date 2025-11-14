import { describe, it, expect, beforeEach, vi } from 'vitest';
import { reservationsService } from '../reservations';
import api from '../api';

vi.mock('../api');

describe('Reservations Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createReservation', () => {
    it('should create a new reservation', async () => {
      const reservationData = {
        court_id: 'court-123',
        date: '2025-12-01T00:00:00',
        start_time: '2025-12-01T14:00:00',
        end_time: '2025-12-01T15:00:00',
        notes: 'Test reservation',
      };

      const mockResponse = {
        id: 'reservation-123',
        ...reservationData,
        status: 'CONFIRMED',
        total_price: 100,
      };

      api.post.mockResolvedValue({ data: mockResponse });

      const result = await reservationsService.createReservation(reservationData);

      expect(api.post).toHaveBeenCalledWith('/api/reservations', reservationData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when creating reservation', async () => {
      const error = new Error('Time slot already reserved');
      api.post.mockRejectedValue(error);

      await expect(reservationsService.createReservation({})).rejects.toThrow(
        'Time slot already reserved'
      );
    });
  });

  describe('getMyReservations', () => {
    it('should fetch current user reservations', async () => {
      const mockReservations = [
        {
          id: 'res-1',
          court_id: 'court-1',
          date: '2025-12-01',
          status: 'CONFIRMED',
        },
        {
          id: 'res-2',
          court_id: 'court-2',
          date: '2025-12-02',
          status: 'PENDING',
        },
      ];

      api.get.mockResolvedValue({ data: mockReservations });

      const result = await reservationsService.getMyReservations();

      expect(api.get).toHaveBeenCalledWith('/api/reservations/my-reservations');
      expect(result).toEqual(mockReservations);
    });

    it('should handle errors when fetching user reservations', async () => {
      const error = new Error('Unauthorized');
      api.get.mockRejectedValue(error);

      await expect(reservationsService.getMyReservations()).rejects.toThrow('Unauthorized');
    });
  });

  describe('getAllReservations', () => {
    it('should fetch all reservations (admin only)', async () => {
      const mockReservations = [
        { id: 'res-1', user_id: 'user-1' },
        { id: 'res-2', user_id: 'user-2' },
        { id: 'res-3', user_id: 'user-3' },
      ];

      api.get.mockResolvedValue({ data: mockReservations });

      const result = await reservationsService.getAllReservations();

      expect(api.get).toHaveBeenCalledWith('/api/reservations/all');
      expect(result).toEqual(mockReservations);
    });

    it('should handle errors when fetching all reservations', async () => {
      const error = new Error('Forbidden');
      api.get.mockRejectedValue(error);

      await expect(reservationsService.getAllReservations()).rejects.toThrow('Forbidden');
    });
  });

  describe('getReservationById', () => {
    it('should fetch a specific reservation by ID', async () => {
      const mockReservation = {
        id: 'reservation-123',
        court_id: 'court-123',
        user_id: 'user-123',
        date: '2025-12-01',
        status: 'CONFIRMED',
      };

      api.get.mockResolvedValue({ data: mockReservation });

      const result = await reservationsService.getReservationById('reservation-123');

      expect(api.get).toHaveBeenCalledWith('/api/reservations/reservation-123');
      expect(result).toEqual(mockReservation);
    });

    it('should handle errors when fetching reservation by ID', async () => {
      const error = new Error('Reservation not found');
      api.get.mockRejectedValue(error);

      await expect(reservationsService.getReservationById('invalid-id')).rejects.toThrow(
        'Reservation not found'
      );
    });
  });

  describe('cancelReservation', () => {
    it('should cancel a reservation', async () => {
      const reservationId = 'reservation-123';
      const mockResponse = { message: 'Reservation cancelled successfully' };

      api.delete.mockResolvedValue({ data: mockResponse });

      const result = await reservationsService.cancelReservation(reservationId);

      expect(api.delete).toHaveBeenCalledWith(`/api/reservations/${reservationId}`);
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when cancelling reservation', async () => {
      const error = new Error('Reservation not found');
      api.delete.mockRejectedValue(error);

      await expect(reservationsService.cancelReservation('invalid-id')).rejects.toThrow(
        'Reservation not found'
      );
    });
  });
});
