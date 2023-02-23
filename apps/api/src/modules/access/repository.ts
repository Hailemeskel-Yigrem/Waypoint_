import type { AccessPolicy, CreateAccessPolicyInput, AccessEvaluationContext } from './types.js';
import type { PaginatedResult, PaginationQuery } from '../../lib/pagination.js';

export interface AccessPolicyRepository {
  create(input: CreateAccessPolicyInput): Promise<AccessPolicy>;
  findById(organizationId: string, id: string): Promise<AccessPolicy | null>;
  list(organizationId: string, query: PaginationQuery): Promise<PaginatedResult<AccessPolicy>>;
  findByAction(organizationId: string, action: AccessPolicy['action']): Promise<AccessPolicy[]>;
  delete(organizationId: string, id: string): Promise<boolean>;
}

export interface AccessEvaluator {
  evaluate(context: AccessEvaluationContext): Promise<AccessPolicy | null>;
}
