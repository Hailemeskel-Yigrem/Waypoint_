import { useEffect, useState } from 'react';
import { getDirectory } from '../api/users.js';
import type { UserProfile } from '@waypoint/shared';

export function useDirectory() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getDirectory()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);
  return { users, loading };
}
