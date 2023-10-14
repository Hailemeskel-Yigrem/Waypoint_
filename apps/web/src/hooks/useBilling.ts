import { useEffect, useState } from 'react';
import { listInvoices } from '../api/billing.js';
import type { Invoice } from '@waypoint/shared';

export function useBilling() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    listInvoices()
      .then(setInvoices)
      .finally(() => setLoading(false));
  }, []);
  return { invoices, loading };
}
