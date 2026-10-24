import assert from "node:assert/strict";
import test from "node:test";

import { MAX_MESSAGE_COUNT, MAX_TOTAL_CHARS } from "./chat-security.ts";
import {
  MAX_REQUEST_HISTORY_CHARS,
  MAX_REQUEST_HISTORY_MESSAGES,
  selectMessagesForRequest,
} from "./chat-message-window.ts";

function message(role: "user" | "assistant", text: string) {
  return { role, parts: [{ type: "text", text }] };
}

test("client history window stays within the server limits", () => {
  assert.ok(MAX_REQUEST_HISTORY_MESSAGES <= MAX_MESSAGE_COUNT);
  assert.ok(MAX_REQUEST_HISTORY_CHARS <= MAX_TOTAL_CHARS);
});

test("keeps a short conversation unchanged", () => {
  const messages = [message("user", "hi"), message("assistant", "hello")];

  assert.deepEqual(selectMessagesForRequest(messages), messages);
});

test("keeps at most 16 messages and starts with a user message", () => {
  const messages = Array.from({ length: 20 }, (_, index) =>
    message(index % 2 === 0 ? "user" : "assistant", `message-${index}`)
  );

  const selected = selectMessagesForRequest(messages);

  assert.equal(selected.length, 16);
  assert.equal(selected[0]?.role, "user");
  assert.equal(selected[0]?.parts[0]?.text, "message-4");
  assert.equal(selected.at(-1)?.parts[0]?.text, "message-19");
});

test("drops older messages to stay within the character budget", () => {
  const messages = [
    message("user", "a".repeat(5_000)),
    message("assistant", "b".repeat(5_000)),
    message("user", "c".repeat(5_000)),
    message("assistant", "d".repeat(5_000)),
  ];

  const selected = selectMessagesForRequest(messages);

  assert.deepEqual(selected.map((item) => item.parts[0]?.text), [
    "c".repeat(5_000),
    "d".repeat(5_000),
  ]);
});

test("drops leading assistant messages from the window", () => {
  const messages = [
    message("assistant", "a"),
    message("user", "b"),
    message("assistant", "c"),
  ];

  const selected = selectMessagesForRequest(messages, 3);

  assert.deepEqual(selected.map((item) => item.role), ["user", "assistant"]);
});

test("falls back to the last message when no user message fits", () => {
  const messages = [message("assistant", "a"), message("assistant", "b")];

  const selected = selectMessagesForRequest(messages);

  assert.deepEqual(selected.map((item) => item.parts[0]?.text), ["b"]);
});

test("handles an empty conversation", () => {
  assert.deepEqual(selectMessagesForRequest([]), []);
});
