import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authService } from '../auth';
import api from '../api';

vi.mock('../api');

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        first_name: 'Test',
        last_name: 'User',
      };

      const mockResponse = {
        data: {
          id: '123',
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await authService.register(userData);

      expect(api.post).toHaveBeenCalledWith('/api/auth/register', userData);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle registration errors', async () => {
      const userData = { email: 'test@example.com', password: 'pass' };
      const error = new Error('Registration failed');

      api.post.mockRejectedValue(error);

      await expect(authService.register(userData)).rejects.toThrow('Registration failed');
    });
  });

  describe('login', () => {
    it('should login successfully and store token', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      const mockResponse = {
        data: {
          access_token: 'test-token-123',
          token_type: 'bearer',
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await authService.login(email, password);

      expect(api.post).toHaveBeenCalledWith(
        '/api/auth/login',
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'test-token-123');
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle login errors', async () => {
      const error = new Error('Invalid credentials');
      api.post.mockRejectedValue(error);

      await expect(authService.login('test@example.com', 'wrong')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('getProfile', () => {
    it('should fetch user profile and store in localStorage', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
      };

      const mockResponse = { data: mockUser };
      api.get.mockResolvedValue(mockResponse);

      const result = await authService.getProfile();

      expect(api.get).toHaveBeenCalledWith('/api/auth/me');
      expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
      expect(result).toEqual(mockUser);
    });

    it('should handle profile fetch errors', async () => {
      const error = new Error('Unauthorized');
      api.get.mockRejectedValue(error);

      await expect(authService.getProfile()).rejects.toThrow('Unauthorized');
    });
  });

  describe('logout', () => {
    it('should clear token and user from localStorage', () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify({ id: '123' }));

      authService.logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('user');
    });
  });

  describe('getCurrentUser', () => {
    it('should return parsed user from localStorage', () => {
      const user = { id: '123', email: 'test@example.com' };
      localStorage.getItem.mockReturnValue(JSON.stringify(user));

      const result = authService.getCurrentUser();

      expect(localStorage.getItem).toHaveBeenCalledWith('user');
      expect(result).toEqual(user);
    });

    it('should return null when no user in localStorage', () => {
      localStorage.getItem.mockReturnValue(null);

      const result = authService.getCurrentUser();

      expect(result).toBeNull();
    });

    it('should return null for invalid JSON', () => {
      localStorage.getItem.mockReturnValue('invalid-json');

      expect(() => authService.getCurrentUser()).toThrow();
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      localStorage.getItem.mockReturnValue('test-token-123');

      const result = authService.getToken();

      expect(localStorage.getItem).toHaveBeenCalledWith('token');
      expect(result).toBe('test-token-123');
    });

    it('should return null when no token exists', () => {
      localStorage.getItem.mockReturnValue(null);

      const result = authService.getToken();

      expect(result).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      localStorage.getItem.mockReturnValue('test-token-123');

      const result = authService.isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false when token does not exist', () => {
      localStorage.getItem.mockReturnValue(null);

      const result = authService.isAuthenticated();

      expect(result).toBe(false);
    });
  });
});
