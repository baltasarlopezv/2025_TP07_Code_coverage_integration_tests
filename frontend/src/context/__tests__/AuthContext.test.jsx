import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { authService } from '../../services/auth';

vi.mock('../../services/auth');

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('AuthProvider initialization', () => {
    it('should initialize with no user when no token exists', async () => {
      authService.getToken.mockReturnValue(null);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should load user profile when token exists', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        role: 'USER',
      };

      authService.getToken.mockReturnValue('test-token');
      authService.getProfile.mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should handle error when loading profile fails', async () => {
      authService.getToken.mockReturnValue('invalid-token');
      authService.getProfile.mockRejectedValue(new Error('Unauthorized'));
      authService.logout.mockImplementation(() => {});

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(authService.logout).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        role: 'USER',
      };

      authService.getToken.mockReturnValue(null);
      authService.login.mockResolvedValue({ access_token: 'token' });
      authService.getProfile.mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let loginResult;
      await act(async () => {
        loginResult = await result.current.login('test@example.com', 'password123');
      });

      expect(loginResult.success).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should handle login failure', async () => {
      authService.getToken.mockReturnValue(null);
      authService.login.mockRejectedValue({
        response: { data: { detail: 'Invalid credentials' } },
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let loginResult;
      await act(async () => {
        loginResult = await result.current.login('test@example.com', 'wrongpassword');
      });

      expect(loginResult.success).toBe(false);
      expect(loginResult.error).toBe('Invalid credentials');
      expect(result.current.user).toBeNull();
    });
  });

  describe('register', () => {
    it('should register and login successfully', async () => {
      const mockUser = {
        id: '123',
        email: 'new@example.com',
        role: 'USER',
      };

      const userData = {
        email: 'new@example.com',
        password: 'password123',
        first_name: 'New',
        last_name: 'User',
      };

      authService.getToken.mockReturnValue(null);
      authService.register.mockResolvedValue({ id: '123' });
      authService.login.mockResolvedValue({ access_token: 'token' });
      authService.getProfile.mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let registerResult;
      await act(async () => {
        registerResult = await result.current.register(userData);
      });

      expect(registerResult.success).toBe(true);
      expect(authService.register).toHaveBeenCalledWith(userData);
      expect(result.current.user).toEqual(mockUser);
    });

    it('should handle registration failure', async () => {
      authService.getToken.mockReturnValue(null);
      authService.register.mockRejectedValue({
        response: { data: { detail: 'Email already exists' } },
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let registerResult;
      await act(async () => {
        registerResult = await result.current.register({
          email: 'existing@example.com',
          password: 'password',
        });
      });

      expect(registerResult.success).toBe(false);
      expect(registerResult.error).toBe('Email already exists');
    });
  });

  describe('logout', () => {
    it('should logout user', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        role: 'USER',
      };

      authService.getToken.mockReturnValue('test-token');
      authService.getProfile.mockResolvedValue(mockUser);
      authService.logout.mockImplementation(() => {});

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      act(() => {
        result.current.logout();
      });

      expect(authService.logout).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('should return true for admin users', async () => {
      const mockAdmin = {
        id: '123',
        email: 'admin@example.com',
        role: 'ADMIN',
      };

      authService.getToken.mockReturnValue('admin-token');
      authService.getProfile.mockResolvedValue(mockAdmin);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockAdmin);
      });

      expect(result.current.isAdmin).toBe(true);
    });

    it('should return false for non-admin users', async () => {
      const mockUser = {
        id: '123',
        email: 'user@example.com',
        role: 'USER',
      };

      authService.getToken.mockReturnValue('user-token');
      authService.getProfile.mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      expect(result.current.isAdmin).toBe(false);
    });
  });

  describe('useAuth hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');
    });
  });
});
