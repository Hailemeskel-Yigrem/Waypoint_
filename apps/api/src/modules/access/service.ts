import { AppError } from '../../lib/errors.js';
import { ok, err, type Result } from '../../lib/result.js';
import type { AccessPolicyRepository } from './repository.js';
import type {
  AccessPolicy,
  CreateAccessPolicyInput,
  AccessEvaluationContext,
  AccessAction,
} from './types.js';
import type { PaginationQuery, PaginatedResult } from '../../lib/pagination.js';
import type { UserRepository } from '../users/repository.js';
import { evaluatePolicies } from './memory.repository.js';

export class AccessService {
  constructor(
    private readonly repo: AccessPolicyRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async create(
    organizationId: string,
    input: Omit<CreateAccessPolicyInput, 'organizationId'>,
  ): Promise<Result<AccessPolicy>> {
    const policy = await this.repo.create({ ...input, organizationId });
    return ok(policy);
  }

  async list(
    organizationId: string,
    query: PaginationQuery,
  ): Promise<PaginatedResult<AccessPolicy>> {
    return this.repo.list(organizationId, query);
  }

  async delete(organizationId: string, id: string): Promise<Result<void>> {
    const deleted = await this.repo.delete(organizationId, id);
    if (!deleted) return err(AppError.notFound('AccessPolicy', id));
    return ok(undefined);
  }

  async evaluate(ctx: AccessEvaluationContext): Promise<Result<boolean>> {
    const policies = await this.repo.findByAction(ctx.organizationId, ctx.action);
    const match = evaluatePolicies(policies, ctx);

    if (!match) {
      return ok(true);
    }

    if (match.effect === 'deny') {
      return err(AppError.accessDenied(`Denied by policy '${match.name}'`));
    }

    return ok(true);
  }

  async canBook(
    organizationId: string,
    userId: string,
    deskId?: string | null,
    spaceId?: string | null,
  ): Promise<Result<void>> {
    const user = await this.userRepo.findById(organizationId, userId);
    if (!user) return err(AppError.notFound('User', userId));

    const action: AccessAction = deskId ? 'book_desk' : 'book_space';
    const result = await this.evaluate({
      organizationId,
      userId,
      userRole: user.role,
      action,
      deskId,
      spaceId,
      at: new Date(),
    });

    if (!result.ok) return result as Result<never>;
    return ok(undefined);
  }
}
