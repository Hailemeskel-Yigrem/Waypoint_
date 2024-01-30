import { useCallback, useEffect, useState } from 'react';
import { listSpaces, createSpace, listDesks } from '../api/spaces.js';
import type { Space, Desk, CreateSpaceInput } from '@waypoint/shared';

export function useSpaces() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [desks, setDesks] = useState<Desk[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [s, d] = await Promise.all([listSpaces(), listDesks()]);
    setSpaces(s);
    setDesks(d);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const create = useCallback(async (input: CreateSpaceInput) => {
    const space = await createSpace(input);
    setSpaces((prev) => [...prev, space]);
    return space;
  }, []);

  return { spaces, desks, loading, refresh, create };
}
