import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authService } from '../auth';
import api from '../api';

vi.mock('../api');

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should login successfully and store token', async () => {
    const mockResponse = {
      data: { access_token: 'test-token-123', token_type: 'bearer' },
    };
    api.post.mockResolvedValue(mockResponse);

    const result = await authService.login('test@example.com', 'password123');

    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'test-token-123');
    expect(result).toEqual(mockResponse.data);
  });

  it('should logout and clear localStorage', () => {
    localStorage.setItem('token', 'test-token');
    authService.logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });

  it('should return token from localStorage', () => {
    localStorage.getItem.mockReturnValue('test-token-123');

    const result = authService.getToken();

    expect(result).toBe('test-token-123');
  });

  it('should check if user is authenticated', () => {
    localStorage.getItem.mockReturnValue('test-token-123');

    expect(authService.isAuthenticated()).toBe(true);
  });

  it('should get user profile', async () => {
    const mockUser = { id: '1', email: 'test@test.com' };
    api.get.mockResolvedValue({ data: mockUser });

    const result = await authService.getProfile();

    expect(result).toEqual(mockUser);
  });

  it('should get current user from localStorage', () => {
    const mockUser = { id: '1', email: 'test@test.com' };
    localStorage.getItem.mockReturnValue(JSON.stringify(mockUser));

    const result = authService.getCurrentUser();

    expect(result).toEqual(mockUser);
  });
});
