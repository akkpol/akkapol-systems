const BLOB_PREFIX = "ratelimit";
const MAX_RETRIES = 5;

type CounterSnapshot = {
  count: number;
  etag?: string;
};

type LimitResult = {
  allowed: boolean;
  count: number;
  remaining: number;
  limit: number;
  source: "blob" | "memory";
};

export class CounterWriteConflictError extends Error {
  constructor(message = "Counter write conflicted with a concurrent update.") {
    super(message);
    this.name = "CounterWriteConflictError";
  }
}

export interface CounterStore {
  readonly source: "blob" | "memory";
  readCounter(path: string): Promise<CounterSnapshot>;
  createCounter(path: string, count: number): Promise<void>;
  updateCounter(path: string, count: number, etag: string): Promise<void>;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function toCounterPath(key: string, date = todayKey()): string {
  return `${BLOB_PREFIX}/${date}/${key}.json`;
}

class MemoryCounterStore implements CounterStore {
  readonly source = "memory" as const;

  private counters = new Map<string, number>();
  private lastDate = "";

  private rotate(date: string) {
    if (this.lastDate !== date) {
      this.counters.clear();
      this.lastDate = date;
    }
  }

  async readCounter(path: string): Promise<CounterSnapshot> {
    const date = todayKey();
    this.rotate(date);
    return { count: this.counters.get(path) ?? 0 };
  }

  async createCounter(path: string, count: number): Promise<void> {
    const date = todayKey();
    this.rotate(date);

    if (this.counters.has(path)) {
      throw new CounterWriteConflictError();
    }

    this.counters.set(path, count);
  }

  async updateCounter(path: string, count: number): Promise<void> {
    const date = todayKey();
    this.rotate(date);
    this.counters.set(path, count);
  }
}

const memoryCounterStore = new MemoryCounterStore();

async function createBlobCounterStore(): Promise<CounterStore | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return null;
  }

  const { BlobPreconditionFailedError, get, put } = await import("@vercel/blob");

  return {
    source: "blob",
    async readCounter(path: string): Promise<CounterSnapshot> {
      const result = await get(path, { access: "private" });
      if (!result || result.statusCode !== 200 || !result.stream) {
        return { count: 0 };
      }

      const payload = await new Response(result.stream).json().catch(() => null);
      const count = typeof payload?.count === "number" && payload.count >= 0
        ? payload.count
        : 0;

      return {
        count,
        etag: result.blob.etag,
      };
    },
    async createCounter(path: string, count: number): Promise<void> {
      try {
        await put(path, JSON.stringify({ count }), {
          contentType: "application/json",
          access: "private",
          addRandomSuffix: false,
          allowOverwrite: false,
        });
      } catch (error) {
        if (error instanceof BlobPreconditionFailedError) {
          throw new CounterWriteConflictError();
        }
        throw error;
      }
    },
    async updateCounter(path: string, count: number, etag: string): Promise<void> {
      try {
        await put(path, JSON.stringify({ count }), {
          contentType: "application/json",
          access: "private",
          addRandomSuffix: false,
          allowOverwrite: true,
          ifMatch: etag,
        });
      } catch (error) {
        if (error instanceof BlobPreconditionFailedError) {
          throw new CounterWriteConflictError();
        }
        throw error;
      }
    },
  };
}

export async function consumeLimitWithStore(
  store: CounterStore,
  path: string,
  limit: number,
  maxRetries = MAX_RETRIES,
): Promise<LimitResult> {
  for (let attempt = 0; attempt < maxRetries; attempt += 1) {
    const current = await store.readCounter(path);
    if (current.count >= limit) {
      return {
        allowed: false,
        count: current.count,
        remaining: 0,
        limit,
        source: store.source,
      };
    }

    try {
      if (current.etag) {
        await store.updateCounter(path, current.count + 1, current.etag);
      } else {
        await store.createCounter(path, current.count + 1);
      }

      return {
        allowed: true,
        count: current.count + 1,
        remaining: Math.max(0, limit - (current.count + 1)),
        limit,
        source: store.source,
      };
    } catch (error) {
      if (error instanceof CounterWriteConflictError) {
        continue;
      }
      throw error;
    }
  }

  throw new Error(`Failed to reserve a rate-limit slot after ${maxRetries} attempts.`);
}

export async function consumeDailyLimit(key: string, limit: number): Promise<LimitResult> {
  const path = toCounterPath(key);

  try {
    const blobStore = await createBlobCounterStore();
    if (blobStore) {
      return await consumeLimitWithStore(blobStore, path, limit);
    }
  } catch (error) {
    console.error("[ratelimit] Blob-backed rate limit failed; falling back to memory:", error);
  }

  return consumeLimitWithStore(memoryCounterStore, path, limit);
}
