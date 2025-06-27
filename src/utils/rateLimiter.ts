// Rate limiter utility

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();

  check(action: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const key = `${action}_${window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 'anonymous'}`;
    
    if (!this.limits.has(key)) {
      this.limits.set(key, { count: 0, resetAt: now + windowMs });
    }
    
    const limit = this.limits.get(key)!;
    
    if (now > limit.resetAt) {
      limit.count = 0;
      limit.resetAt = now + windowMs;
    }
    
    if (limit.count >= maxRequests) {
      const waitTime = Math.ceil((limit.resetAt - now) / 1000);
      throw new Error(`Demasiadas solicitudes. Espera ${waitTime} segundos.`);
    }
    
    limit.count++;
    return true;
  }

  reset(action: string): void {
    const key = `${action}_${window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 'anonymous'}`;
    this.limits.delete(key);
  }

  resetAll(): void {
    this.limits.clear();
  }

  getRemainingRequests(action: string, maxRequests: number = 10): number {
    const key = `${action}_${window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 'anonymous'}`;
    const limit = this.limits.get(key);
    
    if (!limit) return maxRequests;
    
    const now = Date.now();
    if (now > limit.resetAt) return maxRequests;
    
    return Math.max(0, maxRequests - limit.count);
  }

  getResetTime(action: string): number | null {
    const key = `${action}_${window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 'anonymous'}`;
    const limit = this.limits.get(key);
    
    if (!limit) return null;
    
    const now = Date.now();
    if (now > limit.resetAt) return null;
    
    return limit.resetAt;
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter();

// Helper function for common rate limit checks
export function checkRateLimit(
  action: string,
  config?: { max?: number; window?: number }
): void {
  const { max = 10, window = 60000 } = config || {};
  rateLimiter.check(action, max, window);
}
