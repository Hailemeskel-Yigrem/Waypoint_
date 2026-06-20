import { generateId } from '../../lib/id.js';
import { paginate, offsetFromPage, sortItems } from '../../lib/pagination.js';
import type { AccessPolicyRepository } from './repository.js';
import type { AccessPolicy, CreateAccessPolicyInput, AccessEvaluationContext } from './types.js';

export class MemoryAccessPolicyRepository implements AccessPolicyRepository {
  private readonly store = new Map<string, AccessPolicy>();

  private key(orgId: string, id: string): string {
    return `${orgId}:${id}`;
  }

  async create(input: CreateAccessPolicyInput): Promise<AccessPolicy> {
    const now = new Date();
    const policy: AccessPolicy = {
      id: generateId('accessPolicy'),
      organizationId: input.organizationId,
      name: input.name,
      action: input.action,
      effect: input.effect,
      priority: input.priority ?? 100,
      conditions: input.conditions,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    this.store.set(this.key(policy.organizationId, policy.id), policy);
    return policy;
  }

  async findById(organizationId: string, id: string): Promise<AccessPolicy | null> {
    const p = this.store.get(this.key(organizationId, id));
    return p?.organizationId === organizationId ? p : null;
  }

  async list(organizationId: string, query) {
    const all = [...this.store.values()].filter((p) => p.organizationId === organizationId);
    const sorted = sortItems(all, query.sortBy as keyof AccessPolicy, query.sortOrder);
    const offset = offsetFromPage(query.page, query.limit);
    return paginate(
      sorted.slice(offset, offset + query.limit),
      query.page,
      query.limit,
      all.length,
    );
  }

  async findByAction(
    organizationId: string,
    action: AccessPolicy['action'],
  ): Promise<AccessPolicy[]> {
    return [...this.store.values()]
      .filter((p) => p.organizationId === organizationId && p.action === action && p.isActive)
      .sort((a, b) => a.priority - b.priority);
  }

  async delete(organizationId: string, id: string): Promise<boolean> {
    return this.store.delete(this.key(organizationId, id));
  }

  clear(): void {
    this.store.clear();
  }
}

function matchesConditions(policy: AccessPolicy, ctx: AccessEvaluationContext): boolean {
  const c = policy.conditions;
  const at = ctx.at ?? new Date();

  if (c.roles && !c.roles.includes(ctx.userRole)) return false;
  if (c.spaceIds && ctx.spaceId && !c.spaceIds.includes(ctx.spaceId)) return false;
  if (c.deskIds && ctx.deskId && !c.deskIds.includes(ctx.deskId)) return false;
  if (c.daysOfWeek && !c.daysOfWeek.includes(at.getDay())) return false;

  const hour = at.getHours();
  if (c.startHour !== undefined && hour < c.startHour) return false;
  if (c.endHour !== undefined && hour >= c.endHour) return false;

  return true;
}

export function evaluatePolicies(
  policies: AccessPolicy[],
  ctx: AccessEvaluationContext,
): AccessPolicy | null {
  for (const policy of policies) {
    if (matchesConditions(policy, ctx)) {
      return policy;
    }
  }
  return null;
}
