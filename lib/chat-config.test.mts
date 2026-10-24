import assert from "node:assert/strict";
import test from "node:test";

import { isChatConfigured } from "./chat-config.ts";

test("requires the provider key", () => {
  assert.equal(
    isChatConfigured({
      NODE_ENV: "production",
      CHAT_SESSION_SECRET: "secret",
      DATABASE_URL: "postgres://primary",
    }),
    false,
  );
});

test("requires the session secret in production", () => {
  assert.equal(
    isChatConfigured({
      NODE_ENV: "production",
      DEEPSEEK_API_KEY: "key",
      DATABASE_URL: "postgres://primary",
    }),
    false,
  );
});

test("requires a database in production", () => {
  assert.equal(
    isChatConfigured({
      NODE_ENV: "production",
      DEEPSEEK_API_KEY: "key",
      CHAT_SESSION_SECRET: "secret",
    }),
    false,
  );
});

test("accepts a fully configured production environment", () => {
  assert.equal(
    isChatConfigured({
      NODE_ENV: "production",
      DEEPSEEK_API_KEY: "key",
      CHAT_SESSION_SECRET: "secret",
      DATABASE_URL: "postgres://primary",
    }),
    true,
  );
});

test("allows a missing session secret and database outside production", () => {
  assert.equal(
    isChatConfigured({ NODE_ENV: "development", DEEPSEEK_API_KEY: "key" }),
    true,
  );
  assert.equal(
    isChatConfigured({ NODE_ENV: "test", DEEPSEEK_API_KEY: "key" }),
    true,
  );
});
