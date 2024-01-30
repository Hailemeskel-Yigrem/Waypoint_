import { useCallback, useEffect, useState } from 'react';
import { listVisitors, createVisitor } from '../api/visitors.js';
import type { Visitor, CreateVisitorInput } from '@waypoint/shared';

export function useVisitors() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setVisitors(await listVisitors());
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const create = useCallback(async (input: CreateVisitorInput) => {
    const v = await createVisitor(input);
    setVisitors((prev) => [...prev, v]);
    return v;
  }, []);

  return { visitors, loading, refresh, create };
}
