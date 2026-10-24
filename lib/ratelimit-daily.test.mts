import assert from "node:assert/strict";
import test from "node:test";

import {
  consumeDailyLimit,
  consumeLimitWithStore,
  RateLimitUnavailableError,
  type RateLimitStore,
} from "./ratelimit-daily.ts";

class FakeRateLimitStore implements RateLimitStore {
  readonly source = "memory" as const;

  private readonly values = new Map<string, number>();

  seed(key: string, count: number) {
    this.values.set(key, count);
  }

  async increment(key: string, limit: number) {
    const current = this.values.get(key) ?? 0;

    if (current >= limit) {
      return { count: current, reserved: false };
    }

    const next = current + 1;
    this.values.set(key, next);
    return { count: next, reserved: true };
  }
}

test("consumeLimitWithStore increments a fresh counter", async () => {
  const store = new FakeRateLimitStore();
  const result = await consumeLimitWithStore(store, "client-a", 3);

  assert.equal(result.allowed, true);
  assert.equal(result.count, 1);
  assert.equal(result.remaining, 2);
  assert.equal(result.source, "memory");
});

test("consumeLimitWithStore blocks when the limit is reached", async () => {
  const store = new FakeRateLimitStore();
  store.seed("client-a", 3);

  const result = await consumeLimitWithStore(store, "client-a", 3);

  assert.equal(result.allowed, false);
  assert.equal(result.count, 3);
  assert.equal(result.remaining, 0);
});

test("consumeLimitWithStore keeps client keys isolated", async () => {
  const store = new FakeRateLimitStore();

  const first = await consumeLimitWithStore(store, "client-a", 2);
  const second = await consumeLimitWithStore(store, "client-b", 2);

  assert.equal(first.count, 1);
  assert.equal(second.count, 1);
  assert.equal(second.allowed, true);
});

test("consumeDailyLimit fails closed in production without a database", async () => {
  const environment = process.env as Record<string, string | undefined>;
  const previousNodeEnv = environment.NODE_ENV;
  const previousDatabaseUrl = environment.DATABASE_URL;
  const previousPostgresUrl = environment.POSTGRES_URL;

  environment.NODE_ENV = "production";
  delete environment.DATABASE_URL;
  delete environment.POSTGRES_URL;

  try {
    await assert.rejects(
      () => consumeDailyLimit("production-client", 3),
      RateLimitUnavailableError,
    );
  } finally {
    if (previousNodeEnv === undefined) delete environment.NODE_ENV;
    else environment.NODE_ENV = previousNodeEnv;

    if (previousDatabaseUrl === undefined) delete environment.DATABASE_URL;
    else environment.DATABASE_URL = previousDatabaseUrl;

    if (previousPostgresUrl === undefined) delete environment.POSTGRES_URL;
    else environment.POSTGRES_URL = previousPostgresUrl;
  }
});

test("consumeDailyLimit development fallback supports repeated reservations", async () => {
  const environment = process.env as Record<string, string | undefined>;
  const previousNodeEnv = environment.NODE_ENV;
  const previousDatabaseUrl = environment.DATABASE_URL;
  const previousPostgresUrl = environment.POSTGRES_URL;

  environment.NODE_ENV = "test";
  delete environment.DATABASE_URL;
  delete environment.POSTGRES_URL;

  try {
    const key = "development-client-" + Date.now();
    const first = await consumeDailyLimit(key, 3);
    const second = await consumeDailyLimit(key, 3);

    assert.equal(first.count, 1);
    assert.equal(second.count, 2);
    assert.equal(second.remaining, 1);
    assert.equal(second.source, "memory");
  } finally {
    if (previousNodeEnv === undefined) delete environment.NODE_ENV;
    else environment.NODE_ENV = previousNodeEnv;

    if (previousDatabaseUrl === undefined) delete environment.DATABASE_URL;
    else environment.DATABASE_URL = previousDatabaseUrl;

    if (previousPostgresUrl === undefined) delete environment.POSTGRES_URL;
    else environment.POSTGRES_URL = previousPostgresUrl;
  }
});
