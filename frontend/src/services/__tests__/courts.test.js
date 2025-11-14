import { describe, it, expect, beforeEach, vi } from 'vitest';
import { courtsService } from '../courts';
import api from '../api';

vi.mock('../api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  }
}));

describe('Courts Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch all courts', async () => {
    const mockCourts = [
      { id: '1', name: 'Court 1' },
      { id: '2', name: 'Court 2' },
    ];
    api.get.mockResolvedValue({ data: mockCourts });

    const result = await courtsService.getAllCourts();

    expect(api.get).toHaveBeenCalledWith('/api/courts');
    expect(result).toEqual(mockCourts);
  });

  it('should fetch available slots', async () => {
    const mockSlots = {
      available_slots: [{ start: '12:00', end: '13:00' }],
    };
    api.get.mockResolvedValue({ data: mockSlots });

    const result = await courtsService.getAvailableSlots('court-123', '2025-12-01');

    expect(result).toEqual(mockSlots);
  });

  it('should get court by id', async () => {
    const mockCourt = { id: 'court-1', name: 'Court A' };
    api.get.mockResolvedValue({ data: mockCourt });

    const result = await courtsService.getCourtById('court-1');

    expect(result).toEqual(mockCourt);
  });

  it('should create a court', async () => {
    const mockCourt = { id: 'court-1', name: 'New Court' };
    api.post.mockResolvedValue({ data: mockCourt });

    const result = await courtsService.createCourt({});

    expect(result).toEqual(mockCourt);
  });
});
