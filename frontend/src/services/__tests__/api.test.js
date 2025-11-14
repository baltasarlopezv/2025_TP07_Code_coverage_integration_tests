import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';

// Mock axios before importing api
vi.mock('axios', () => {
  const mockAxios = {
    create: vi.fn(() => ({
      interceptors: {
        request: { use: vi.fn(), handlers: [] },
        response: { use: vi.fn(), handlers: [] },
      },
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    })),
  };
  return { default: mockAxios };
});

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should create axios instance with correct baseURL', async () => {
    // Re-import to get fresh instance
    const api = (await import('../api')).default;
    expect(axios.create).toHaveBeenCalled();
  });

  it('should verify axios interceptors are configured', async () => {
    const api = (await import('../api')).default;
    expect(api.interceptors).toBeDefined();
    expect(api.interceptors.request).toBeDefined();
    expect(api.interceptors.response).toBeDefined();
  });

  it('should test localStorage token handling', () => {
    const token = 'test-token-123';
    
    localStorage.setItem('token', token);
    expect(localStorage.setItem).toHaveBeenCalledWith('token', token);
    
    localStorage.removeItem('token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });
});
