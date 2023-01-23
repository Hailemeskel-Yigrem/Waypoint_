import type { InvoiceStatus } from '../constants/index.js';
import type { EntityId, OrgId } from './id.js';
import type { Money } from '../utils/money.js';

export interface Invoice {
  id: EntityId;
  orgId: OrgId;
  number: string;
  status: InvoiceStatus;
  periodStart: string;
  periodEnd: string;
  subtotal: Money;
  tax: Money;
  total: Money;
  dueAt: string;
  paidAt?: string;
}

export interface InvoiceLineItem {
  id: EntityId;
  invoiceId: EntityId;
  description: string;
  quantity: number;
  unitPrice: Money;
  total: Money;
}
