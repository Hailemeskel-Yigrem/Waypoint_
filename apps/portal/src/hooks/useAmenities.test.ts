import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Amenity } from '@waypoint/shared';
import { listAmenities } from '../api/amenities.js';
import { useAmenities } from './useAmenities.js';

vi.mock('../api/amenities.js', () => ({ listAmenities: vi.fn() }));

const amenity: Amenity = {
  id: 'amenity-1',
  orgId: 'org-1',
  name: 'Gym',
  type: 'gym',
  capacity: 20,
  isActive: true,
};

describe('useAmenities', () => {
  beforeEach(() => vi.mocked(listAmenities).mockReset());

  it('exposes loading state and resolved amenity data', async () => {
    vi.mocked(listAmenities).mockResolvedValue([amenity]);
    const { result } = renderHook(() => useAmenities());

    expect(result.current.loading).toBe(true);
    expect(result.current.amenities).toEqual([]);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.amenities).toEqual([amenity]);
    expect(result.current.error).toBeNull();
  });

  it('exposes request errors and clears them after a successful refresh', async () => {
    vi.mocked(listAmenities)
      .mockRejectedValueOnce(new Error('network unavailable'))
      .mockResolvedValueOnce([amenity]);
    const { result } = renderHook(() => useAmenities());

    await waitFor(() => expect(result.current.error?.message).toBe('network unavailable'));
    await act(async () => result.current.refresh());

    expect(result.current.error).toBeNull();
    expect(result.current.amenities).toEqual([amenity]);
  });
});
