import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { authService } from '../../services/auth';

vi.mock('../../services/auth');

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should login successfully', async () => {
    const mockUser = { id: '123', email: 'test@example.com', role: 'USER' };
    authService.getToken.mockReturnValue(null);
    authService.login.mockResolvedValue({ access_token: 'token' });
    authService.getProfile.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    expect(result.current.user).toEqual(mockUser);
  });

  it('should register successfully', async () => {
    const mockUser = { id: '123', email: 'new@example.com', role: 'USER' };
    authService.getToken.mockReturnValue(null);
    authService.register.mockResolvedValue({ id: '123' });
    authService.login.mockResolvedValue({ access_token: 'token' });
    authService.getProfile.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.register({});
    });

    expect(result.current.user).toEqual(mockUser);
  });

  it('should logout user', async () => {
    const mockUser = { id: '123', email: 'test@example.com', role: 'USER' };
    authService.getToken.mockReturnValue('test-token');
    authService.getProfile.mockResolvedValue(mockUser);
    authService.logout.mockImplementation(() => {});

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.user).toEqual(mockUser));

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
  });

  it('should check if user is admin', async () => {
    const mockAdmin = { id: '123', email: 'admin@example.com', role: 'ADMIN' };
    authService.getToken.mockReturnValue('admin-token');
    authService.getProfile.mockResolvedValue(mockAdmin);

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.user).toEqual(mockAdmin));

    expect(result.current.isAdmin).toBe(true);
  });
});
