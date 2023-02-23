import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { AppError, isAppError } from '../lib/errors.js';
import type { Logger } from '../lib/logger.js';

export function createErrorHandler(logger: Logger) {
  return function errorHandler(
    error: FastifyError | Error,
    request: FastifyRequest,
    reply: FastifyReply,
  ): void {
    const log = logger.child({
      requestId: request.requestId,
      path: request.url,
      method: request.method,
    });

    if (error instanceof ZodError) {
      log.warn({ err: error }, 'Validation error');
      reply.status(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          details: error.flatten(),
        },
      });
      return;
    }

    if (isAppError(error)) {
      if (error.statusCode >= 500) {
        log.error({ err: error }, error.message);
      } else {
        log.warn({ err: error, code: error.code }, error.message);
      }
      reply.status(error.statusCode).send({
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      });
      return;
    }

    if (error.message === 'TENANT_MISMATCH') {
      reply.status(403).send({
        error: {
          code: 'TENANT_MISMATCH',
          message: 'Resource belongs to a different organization',
        },
      });
      return;
    }

    log.error({ err: error }, 'Unhandled error');
    reply.status(500).send({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    });
  };
}

export function notFoundHandler(_request: FastifyRequest, reply: FastifyReply): void {
  reply.status(404).send({
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
    },
  });
}

export function throwIfError<T>(result: { ok: boolean; error?: AppError; value?: T }): T {
  if (!result.ok && result.error) {
    throw result.error;
  }
  return result.value as T;
}
