import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { UserProfile } from '@waypoint/shared';
import { getDirectory } from '../api/users.js';
import { useDirectory } from './useDirectory.js';

vi.mock('../api/users.js', () => ({ getDirectory: vi.fn() }));

const user: UserProfile = {
  id: 'user-1',
  orgId: 'org-1',
  email: 'alex@example.test',
  firstName: 'Alex',
  lastName: 'Morgan',
  role: 'member',
  isActive: true,
  createdAt: '2026-06-25T09:00:00.000Z',
  updatedAt: '2026-06-25T09:00:00.000Z',
};

describe('useDirectory', () => {
  beforeEach(() => vi.mocked(getDirectory).mockReset());

  it('loads directory entries and clears the loading state', async () => {
    vi.mocked(getDirectory).mockResolvedValue([user]);
    const { result } = renderHook(() => useDirectory());

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.users).toEqual([user]);
    expect(result.current.error).toBeNull();
  });

  it('exposes a rejected directory request', async () => {
    vi.mocked(getDirectory)
      .mockResolvedValueOnce([user])
      .mockRejectedValueOnce(new Error('directory unavailable'));
    const { result } = renderHook(() => useDirectory());

    await waitFor(() => expect(result.current.users).toEqual([user]));
    await act(async () => result.current.refresh());

    expect(result.current.loading).toBe(false);
    expect(result.current.users).toEqual([user]);
    expect(result.current.error?.message).toBe('directory unavailable');
  });
});
