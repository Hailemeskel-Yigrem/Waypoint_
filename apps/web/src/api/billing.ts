import { apiRequest } from './client.js';
import type { Invoice } from '@waypoint/shared';

export async function listInvoices(): Promise<Invoice[]> {
  const res = await apiRequest<{ data: Invoice[] }>('/billing/invoices');
  return res.data;
}
