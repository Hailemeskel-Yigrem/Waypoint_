import { useCallback, useEffect, useState } from 'react';
import { getOrg, updateOrg } from '../api/org.js';
import type { Organization, UpdateOrgInput } from '@waypoint/shared';

export function useOrg() {
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrg()
      .then(setOrg)
      .catch(() => setOrg(null))
      .finally(() => setLoading(false));
  }, []);

  const update = useCallback(async (input: UpdateOrgInput) => {
    const o = await updateOrg(input);
    setOrg(o);
    return o;
  }, []);

  return { org, loading, update };
}
