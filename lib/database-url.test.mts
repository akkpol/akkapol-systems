import assert from "node:assert/strict";
import test from "node:test";

import { resolveDatabaseUrl } from "./database-url.ts";

test("prefers DATABASE_URL", () => {
  assert.equal(
    resolveDatabaseUrl({
      DATABASE_URL: "postgres://primary",
      POSTGRES_URL: "postgres://fallback",
    }),
    "postgres://primary",
  );
});

test("falls back to POSTGRES_URL", () => {
  assert.equal(
    resolveDatabaseUrl({ POSTGRES_URL: "postgres://fallback" }),
    "postgres://fallback",
  );
});

test("returns undefined when no database URL is configured", () => {
  assert.equal(resolveDatabaseUrl({}), undefined);
});
