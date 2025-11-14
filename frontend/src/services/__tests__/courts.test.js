import { describe, it, expect, beforeEach, vi } from 'vitest';
import { courtsService } from '../courts';
import api from '../api';

vi.mock('../api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}));

describe('Courts Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllCourts', () => {
    it('should fetch all courts', async () => {
      const mockCourts = [
        { id: '1', name: 'Court 1', location: 'Location 1' },
        { id: '2', name: 'Court 2', location: 'Location 2' },
      ];

      api.get.mockResolvedValue({ data: mockCourts });

      const result = await courtsService.getAllCourts();

      expect(api.get).toHaveBeenCalledWith('/api/courts');
      expect(result).toEqual(mockCourts);
    });

    it('should handle errors when fetching courts', async () => {
      const error = new Error('Failed to fetch courts');
      api.get.mockRejectedValue(error);

      await expect(courtsService.getAllCourts()).rejects.toThrow('Failed to fetch courts');
    });
  });

  describe('getCourtById', () => {
    it('should fetch a specific court by ID', async () => {
      const mockCourt = {
        id: 'court-123',
        name: 'Court 1',
        location: 'Location 1',
        price_per_hour: 100,
      };

      api.get.mockResolvedValue({ data: mockCourt });

      const result = await courtsService.getCourtById('court-123');

      expect(api.get).toHaveBeenCalledWith('/api/courts/court-123');
      expect(result).toEqual(mockCourt);
    });

    it('should handle errors when court not found', async () => {
      const error = new Error('Court not found');
      api.get.mockRejectedValue(error);

      await expect(courtsService.getCourtById('invalid-id')).rejects.toThrow('Court not found');
    });
  });

  describe('getAvailableSlots', () => {
    it('should fetch available slots for a court on a specific date', async () => {
      const courtId = 'court-123';
      const date = '2025-12-01';
      const mockSlots = {
        court_id: courtId,
        date: date,
        available_slots: [
          { start: '12:00', end: '13:00', label: '12:00 - 13:00' },
          { start: '13:00', end: '14:00', label: '13:00 - 14:00' },
        ],
      };

      api.get.mockResolvedValue({ data: mockSlots });

      const result = await courtsService.getAvailableSlots(courtId, date);

      expect(api.get).toHaveBeenCalledWith(`/api/courts/${courtId}/available-slots`, {
        params: { date },
      });
      expect(result).toEqual(mockSlots);
    });

    it('should handle errors when fetching available slots', async () => {
      const error = new Error('Failed to fetch slots');
      api.get.mockRejectedValue(error);

      await expect(courtsService.getAvailableSlots('court-123', '2025-12-01')).rejects.toThrow(
        'Failed to fetch slots'
      );
    });
  });

  describe('createCourt', () => {
    it('should create a new court', async () => {
      const newCourtData = {
        name: 'New Court',
        sport_id: 'sport-123',
        location: 'New Location',
        price_per_hour: 150,
        capacity: 10,
      };

      const mockResponse = {
        id: 'court-new-123',
        ...newCourtData,
      };

      api.post.mockResolvedValue({ data: mockResponse });

      const result = await courtsService.createCourt(newCourtData);

      expect(api.post).toHaveBeenCalledWith('/api/courts', newCourtData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when creating court', async () => {
      const error = new Error('Unauthorized');
      api.post.mockRejectedValue(error);

      await expect(courtsService.createCourt({})).rejects.toThrow('Unauthorized');
    });
  });

  describe('updateCourt', () => {
    it('should update an existing court', async () => {
      const courtId = 'court-123';
      const updateData = {
        name: 'Updated Court Name',
        price_per_hour: 200,
      };

      const mockResponse = {
        id: courtId,
        ...updateData,
      };

      api.put.mockResolvedValue({ data: mockResponse });

      const result = await courtsService.updateCourt(courtId, updateData);

      expect(api.put).toHaveBeenCalledWith(`/api/courts/${courtId}`, updateData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when updating court', async () => {
      const error = new Error('Court not found');
      api.put.mockRejectedValue(error);

      await expect(courtsService.updateCourt('invalid-id', {})).rejects.toThrow('Court not found');
    });
  });

  describe('deleteCourt', () => {
    it('should delete a court', async () => {
      const courtId = 'court-123';
      const mockResponse = { message: 'Court deleted successfully' };

      api.delete.mockResolvedValue({ data: mockResponse });

      const result = await courtsService.deleteCourt(courtId);

      expect(api.delete).toHaveBeenCalledWith(`/api/courts/${courtId}`);
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when deleting court', async () => {
      const error = new Error('Forbidden');
      api.delete.mockRejectedValue(error);

      await expect(courtsService.deleteCourt('court-123')).rejects.toThrow('Forbidden');
    });
  });
});
