import { apiRequest } from './client.js';
import type { Visitor, CreateVisitorInput } from '@waypoint/shared';

export async function listVisitors(): Promise<Visitor[]> {
  const res = await apiRequest<{ data: Visitor[] }>('/visitors');
  return res.data;
}

export async function createVisitor(input: CreateVisitorInput): Promise<Visitor> {
  const res = await apiRequest<{ data: Visitor }>('/visitors', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return res.data;
}
