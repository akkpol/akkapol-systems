import test from "node:test";
import assert from "node:assert/strict";

import {
  getRateLimitKey,
  isAllowedOrigin,
  MAX_MESSAGE_CHARS,
  MAX_MESSAGE_COUNT,
  normalizeDeviceId,
  normalizeSessionId,
  validateChatPayload,
} from "./chat-security.ts";

test("normalizeSessionId rejects unsafe values", () => {
  assert.equal(normalizeSessionId("safe_session-01"), "safe_session-01");
  assert.equal(normalizeSessionId("../escape"), undefined);
  assert.equal(normalizeSessionId(""), undefined);
});

test("normalizeDeviceId enforces the expected shape", () => {
  assert.equal(normalizeDeviceId("abcDEF12"), "abcDEF12");
  assert.equal(normalizeDeviceId("short"), undefined);
  assert.equal(normalizeDeviceId("bad/slash-id"), undefined);
});

test("validateChatPayload rejects too many messages", () => {
  const messages = Array.from({ length: MAX_MESSAGE_COUNT + 1 }, (_, index) => ({
    role: "user",
    parts: [{ type: "text", text: `message-${index}` }],
  }));

  const result = validateChatPayload({ messages });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.status, 413);
  }
});

test("validateChatPayload rejects oversized text parts", () => {
  const result = validateChatPayload({
    messages: [
      {
        role: "user",
        parts: [{ type: "text", text: "x".repeat(MAX_MESSAGE_CHARS + 1) }],
      },
    ],
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.status, 413);
  }
});

test("validateChatPayload accepts a bounded well-formed payload", () => {
  const result = validateChatPayload({
    id: "session_123",
    deviceId: "device_12345678",
    messages: [
      {
        role: "user",
        parts: [{ type: "text", text: "hello" }],
      },
    ],
  });

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.sessionId, "session_123");
    assert.equal(result.value.deviceId, "device_12345678");
  }
});

test("isAllowedOrigin only accepts same-host or local origins", () => {
  assert.equal(isAllowedOrigin("https://akkapol-systems.vercel.app", "akkapol-systems.vercel.app"), true);
  assert.equal(isAllowedOrigin("http://localhost:3000", "localhost:3000"), true);
  assert.equal(isAllowedOrigin("https://evil.example", "akkapol-systems.vercel.app"), false);
});

test("getRateLimitKey prefers server headers over client IDs", () => {
  const headers = new Headers({
    "x-forwarded-for": "203.0.113.9",
    "user-agent": "unit-test-agent",
  });

  const withOneDeviceId = getRateLimitKey(headers, "device_aaaaaaaa");
  const withAnotherDeviceId = getRateLimitKey(headers, "device_bbbbbbbb");

  assert.equal(withOneDeviceId, withAnotherDeviceId);
});
