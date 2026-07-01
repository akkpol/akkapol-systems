import test from "node:test";
import assert from "node:assert/strict";

import {
  consumeLimitWithStore,
  CounterWriteConflictError,
  type CounterStore,
} from "./ratelimit-daily.ts";

class FakeCounterStore implements CounterStore {
  readonly source = "memory" as const;
  private readonly values = new Map<string, { count: number; etag?: string }>();
  private conflictOnce = false;

  seed(path: string, count: number, etag = "seed-etag") {
    this.values.set(path, { count, etag });
  }

  simulateOneConflict() {
    this.conflictOnce = true;
  }

  async readCounter(path: string) {
    return this.values.get(path) ?? { count: 0 };
  }

  async createCounter(path: string, count: number) {
    if (this.values.has(path)) {
      throw new CounterWriteConflictError();
    }

    this.values.set(path, { count, etag: `etag-${count}` });
  }

  async updateCounter(path: string, count: number, etag: string) {
    const current = this.values.get(path);
    if (!current || current.etag !== etag) {
      throw new CounterWriteConflictError();
    }

    if (this.conflictOnce) {
      this.conflictOnce = false;
      this.values.set(path, { count: current.count + 1, etag: "external-update" });
      throw new CounterWriteConflictError();
    }

    this.values.set(path, { count, etag: `etag-${count}` });
  }
}

test("consumeLimitWithStore increments a fresh counter", async () => {
  const store = new FakeCounterStore();
  const result = await consumeLimitWithStore(store, "ratelimit/2026-07-01/client.json", 3);

  assert.equal(result.allowed, true);
  assert.equal(result.count, 1);
  assert.equal(result.remaining, 2);
});

test("consumeLimitWithStore blocks when the limit is reached", async () => {
  const store = new FakeCounterStore();
  store.seed("ratelimit/2026-07-01/client.json", 3);

  const result = await consumeLimitWithStore(store, "ratelimit/2026-07-01/client.json", 3);

  assert.equal(result.allowed, false);
  assert.equal(result.count, 3);
  assert.equal(result.remaining, 0);
});

test("consumeLimitWithStore retries after a write conflict", async () => {
  const store = new FakeCounterStore();
  const path = "ratelimit/2026-07-01/client.json";
  store.seed(path, 1, "etag-1");
  store.simulateOneConflict();

  const result = await consumeLimitWithStore(store, path, 4);

  assert.equal(result.allowed, true);
  assert.equal(result.count, 3);
  assert.equal(result.remaining, 1);
});
