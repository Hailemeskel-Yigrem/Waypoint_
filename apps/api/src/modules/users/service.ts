import { AppError } from '../../lib/errors.js';
import { hashPassword, verifyPassword, hashToken, generateToken } from '../../lib/crypto.js';
import { ok, err, type Result } from '../../lib/result.js';
import type { UserRepository } from './repository.js';
import type {
  User,
  CreateUserInput,
  UpdateUserInput,
  LoginInput,
  AuthTokenResponse,
} from './types.js';
import type { PaginationQuery, PaginatedResult } from '../../lib/pagination.js';
import type { BillingService } from '../billing/service.js';
import { encodeJwt } from '../../middleware/auth.js';
import type { AuthContext } from '../../lib/types.js';

export class UserService {
  constructor(
    private readonly repo: UserRepository,
    private readonly billing: BillingService,
    private readonly jwtSecret: string,
    private readonly apiKeySalt: string,
  ) {}

  sanitize(user: User): Omit<User, 'passwordHash' | 'apiKeyHash'> {
    const { passwordHash: _, apiKeyHash: __, ...safe } = user;
    return safe;
  }

  async create(
    organizationId: string,
    input: CreateUserInput,
  ): Promise<Result<Omit<User, 'passwordHash' | 'apiKeyHash'>>> {
    const seatCheck = await this.billing.canAddSeat(organizationId);
    if (!seatCheck.ok) return seatCheck as Result<never>;

    const existing = await this.repo.findByEmail(organizationId, input.email);
    if (existing) {
      return err(AppError.conflict(`User with email '${input.email}' already exists`));
    }

    const passwordHash = input.password ? hashPassword(input.password) : null;
    const user = await this.repo.create({ ...input, organizationId, passwordHash });
    return ok(this.sanitize(user));
  }

  async getById(
    organizationId: string,
    id: string,
  ): Promise<Result<Omit<User, 'passwordHash' | 'apiKeyHash'>>> {
    const user = await this.repo.findById(organizationId, id);
    if (!user) return err(AppError.notFound('User', id));
    return ok(this.sanitize(user));
  }

  async update(
    organizationId: string,
    id: string,
    input: UpdateUserInput,
  ): Promise<Result<Omit<User, 'passwordHash' | 'apiKeyHash'>>> {
    const passwordHash = input.password ? hashPassword(input.password) : undefined;
    const updated = await this.repo.update(organizationId, id, { ...input, passwordHash });
    if (!updated) return err(AppError.notFound('User', id));
    return ok(this.sanitize(updated));
  }

  async delete(organizationId: string, id: string): Promise<Result<void>> {
    const deleted = await this.repo.delete(organizationId, id);
    if (!deleted) return err(AppError.notFound('User', id));
    return ok(undefined);
  }

  async list(
    organizationId: string,
    query: PaginationQuery,
  ): Promise<PaginatedResult<Omit<User, 'passwordHash' | 'apiKeyHash'>>> {
    const result = await this.repo.list(organizationId, query);
    return {
      ...result,
      items: result.items.map((u) => this.sanitize(u)),
    };
  }

  async login(input: LoginInput): Promise<Result<AuthTokenResponse>> {
    const user = await this.repo.findByEmail(input.organizationId, input.email);
    if (!user || !user.passwordHash) {
      return err(AppError.unauthorized('Invalid credentials'));
    }
    if (user.status !== 'active') {
      return err(AppError.forbidden('Account is not active'));
    }
    if (!verifyPassword(input.password, user.passwordHash)) {
      return err(AppError.unauthorized('Invalid credentials'));
    }

    const auth: AuthContext = {
      userId: user.id,
      organizationId: user.organizationId,
      role: user.role,
      email: user.email,
    };
    const token = encodeJwt(auth, this.jwtSecret);
    return ok({ token, user: this.sanitize(user) });
  }

  async generateApiKey(
    organizationId: string,
    userId: string,
  ): Promise<Result<{ apiKey: string }>> {
    const user = await this.repo.findById(organizationId, userId);
    if (!user) return err(AppError.notFound('User', userId));

    const apiKey = `wpk_${generateToken(24)}`;
    const apiKeyHash = hashToken(apiKey + this.apiKeySalt);
    await this.repo.update(organizationId, userId, { apiKeyHash });
    return ok({ apiKey });
  }
}
