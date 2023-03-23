import type { User, CreateUserInput, UpdateUserInput } from './types.js';
import type { PaginatedResult, PaginationQuery } from '../../lib/pagination.js';

export interface UserRepository {
  create(input: CreateUserInput & { passwordHash?: string | null }): Promise<User>;
  findById(organizationId: string, id: string): Promise<User | null>;
  findByEmail(organizationId: string, email: string): Promise<User | null>;
  findByApiKeyHash(keyHash: string): Promise<User | null>;
  update(
    organizationId: string,
    id: string,
    input: UpdateUserInput & { passwordHash?: string | null; apiKeyHash?: string | null },
  ): Promise<User | null>;
  delete(organizationId: string, id: string): Promise<boolean>;
  list(organizationId: string, query: PaginationQuery): Promise<PaginatedResult<User>>;
  countActive(organizationId: string): Promise<number>;
}
