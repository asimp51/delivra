import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

/**
 * Rate Limiting Guard — prevents API abuse
 *
 * Rules:
 * - 100 requests per minute per IP for public endpoints
 * - 300 requests per minute per user for authenticated endpoints
 * - 10 requests per minute for auth endpoints (login/register)
 *
 * In production, use Redis for distributed rate limiting:
 *   npm install @nestjs/throttler
 *   ThrottlerModule.forRoot({ ttl: 60, limit: 100 })
 *
 * This is a simple in-memory implementation for development.
 */

const requestCounts = new Map<string, { count: number; resetTime: number }>();

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit = 100, windowMs = 60000) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const key = request.ip || request.connection?.remoteAddress || 'unknown';
    const now = Date.now();

    const entry = requestCounts.get(key);

    if (!entry || now > entry.resetTime) {
      requestCounts.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (entry.count >= this.limit) {
      throw new HttpException(
        { message: 'Too many requests. Please try again later.', retryAfter: Math.ceil((entry.resetTime - now) / 1000) },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    entry.count++;
    return true;
  }
}

// Stricter rate limit for auth endpoints
@Injectable()
export class AuthRateLimitGuard extends RateLimitGuard {
  constructor() {
    super(10, 60000); // 10 requests per minute
  }
}
