import { resolveDatabaseUrl } from "./database-url.ts";

export type LimitSource = "postgres" | "memory";

export type LimitResult = {
  allowed: boolean;
  count: number;
  remaining: number;
  limit: number;
  source: LimitSource;
};

export class RateLimitUnavailableError extends Error {
  constructor(message = "The shared rate-limit store is unavailable.") {
    super(message);
    this.name = "RateLimitUnavailableError";
  }
}

export interface RateLimitStore {
  readonly source: LimitSource;
  increment(key: string, limit: number): Promise<{ count: number; reserved: boolean }>;
}

const INCREMENT_COUNTER = [
  "insert into rate_limits (key, day, count)",
  "values ($1, (now() at time zone 'utc')::date, 1)",
  "on conflict (key, day) do update",
  "  set count = rate_limits.count + 1",
  "  where rate_limits.count < $2",
  "returning count",
].join("\n");

const READ_COUNTER = [
  "select count from rate_limits",
  "where key = $1",
  "  and day = (now() at time zone 'utc')::date",
].join("\n");

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

class MemoryRateLimitStore implements RateLimitStore {
  readonly source = "memory" as const;

  private counters = new Map<string, number>();
  private currentDay = todayKey();

  private rotateDay() {
    const day = todayKey();
    if (day !== this.currentDay) {
      this.counters.clear();
      this.currentDay = day;
    }
  }

  async increment(key: string, limit: number) {
    this.rotateDay();
    const current = this.counters.get(key) ?? 0;

    if (current >= limit) {
      return { count: current, reserved: false };
    }

    const next = current + 1;
    this.counters.set(key, next);
    return { count: next, reserved: true };
  }
}

const memoryRateLimitStore = new MemoryRateLimitStore();

function createPostgresRateLimitStore(): RateLimitStore {
  return {
    source: "postgres",
    async increment(key, limit) {
      const { getPool } = await import("./db.ts");
      const pool = getPool();
      const inserted = await pool.query<{ count: number }>(INCREMENT_COUNTER, [key, limit]);

      if (inserted.rows[0]) {
        return { count: Number(inserted.rows[0].count), reserved: true };
      }

      const current = await pool.query<{ count: number }>(READ_COUNTER, [key]);
      return {
        count: Number(current.rows[0]?.count ?? limit),
        reserved: false,
      };
    },
  };
}

export async function consumeLimitWithStore(
  store: RateLimitStore,
  key: string,
  limit: number,
): Promise<LimitResult> {
  const result = await store.increment(key, limit);

  return {
    allowed: result.reserved,
    count: result.count,
    remaining: Math.max(0, limit - result.count),
    limit,
    source: store.source,
  };
}

export async function consumeDailyLimit(key: string, limit: number): Promise<LimitResult> {
  const allowMemoryFallback = process.env.NODE_ENV !== "production";

  if (resolveDatabaseUrl()) {
    try {
      return await consumeLimitWithStore(createPostgresRateLimitStore(), key, limit);
    } catch (error) {
      if (!allowMemoryFallback) {
        console.error("[ratelimit] Neon rate limit is unavailable:", error);
        if (error instanceof RateLimitUnavailableError) throw error;
        throw new RateLimitUnavailableError();
      }

      console.warn(
        "[ratelimit] Neon rate limit failed; using local development fallback:",
        error,
      );
    }
  } else if (!allowMemoryFallback) {
    throw new RateLimitUnavailableError("DATABASE_URL is not configured.");
  }

  return consumeLimitWithStore(memoryRateLimitStore, key, limit);
}
