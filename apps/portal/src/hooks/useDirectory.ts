import { useCallback, useEffect, useState } from 'react';
import { getDirectory } from '../api/users.js';
import type { UserProfile } from '@waypoint/shared';

export function useDirectory() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setUsers(await getDirectory());
    } catch (cause) {
      setError(cause instanceof Error ? cause : new Error('Failed to load directory'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { users, loading, error, refresh };
}
