import test from "node:test";
import assert from "node:assert/strict";

import {
  createChatPostHandler,
  type ChatFinishEvent,
  type ChatRouteDependencies,
  type ChatTranscript,
} from "../app/api/chat/handler.ts";
import { MAX_REQUEST_BYTES } from "./chat-security.ts";
import type { ChatLead } from "./chat-lead.ts";
import { RateLimitUnavailableError } from "./ratelimit-daily.ts";

const message = {
  id: "message_1", role: "user" as const,
  parts: [{ type: "text" as const, text: "สนใจจ้างทำเว็บไซต์ somchai@example.com" }],
};

function request(body: unknown, headers: HeadersInit = {}) {
  return new Request("https://portfolio.test/api/chat", {
    method: "POST", headers: { host: "portfolio.test", origin: "https://portfolio.test", ...headers }, body: JSON.stringify(body),
  });
}

function allowed(limit: number) {
  return { allowed: true, count: 1, remaining: limit - 1, limit };
}

function setup(overrides: Partial<ChatRouteDependencies> = {}) {
  const calls = { stream: [] as unknown[][], limits: [] as Array<[string, number]>, transcripts: [] as ChatTranscript[], leads: [] as ChatLead[] };
  const dependencies: ChatRouteDependencies = {
    isChatConfigured: () => true,
    sessionSecret: "test-secret",
    streamChat: async (messages, onFinish) => {
      calls.stream.push(messages);
      return new Response(new ReadableStream({ async start(controller) {
        await onFinish({ finishReason: "stop", usage: { totalTokens: 17 } });
        controller.enqueue(new TextEncoder().encode("mock AI response")); controller.close();
      } }));
    },
    consumeDailyLimit: async (key, limit) => { calls.limits.push([key, limit]); return allowed(limit); },
    saveTranscript: async (transcript) => { calls.transcripts.push(transcript); },
    extractLead: (_messages, sessionId) => ({ leadId: `lead-${sessionId}`, sessionId, name: "Somchai", email: "somchai@example.com", phone: "", serviceInterest: "Business Website", summary: "สนใจจ้างทำเว็บไซต์" }),
    saveStructuredLead: async (lead) => { calls.leads.push(lead); },
    resolveSession: (sessionId) => ({ sessionId: sessionId ?? "generated-session", sessionToken: "signed-session-token" }),
    ...overrides,
  };
  return { POST: createChatPostHandler(dependencies), calls };
}

test("POST rejects an origin that does not match the host", async () => {
  const { POST, calls } = setup();
  const response = await POST(request({ messages: [message] }, { origin: "https://evil.test" }));
  assert.equal(response.status, 403); assert.equal(calls.limits.length, 0); assert.equal(calls.stream.length, 0);
});

test("POST rejects a request whose declared size exceeds MAX_REQUEST_BYTES", async () => {
  const { POST, calls } = setup();
  const response = await POST(request({ messages: [message] }, { "content-length": String(MAX_REQUEST_BYTES + 1) }));
  assert.equal(response.status, 413); assert.equal(calls.limits.length, 0);
});

test("POST enforces the byte limit when Content-Length is missing", async () => {
  const { POST, calls } = setup();
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new Uint8Array(MAX_REQUEST_BYTES + 1));
      controller.close();
    },
  });
  const response = await POST(new Request("https://portfolio.test/api/chat", {
    method: "POST",
    headers: { host: "portfolio.test", origin: "https://portfolio.test" },
    body,
    duplex: "half",
  } as RequestInit & { duplex: "half" }));

  assert.equal(response.status, 413);
  assert.equal(calls.limits.length, 0);
});

test("POST rejects an invalid payload", async () => {
  const { POST, calls } = setup(); const response = await POST(request({ messages: [] }));
  assert.equal(response.status, 400); assert.equal(calls.limits.length, 0);
});

test("POST returns 429 when the device quota is exhausted", async () => {
  const { POST, calls } = setup({ consumeDailyLimit: async (key, limit) => { calls.limits.push([key, limit]); return { allowed: false, count: 30, remaining: 0, limit }; } });
  const response = await POST(request({ messages: [message] }));
  assert.equal(response.status, 429); assert.equal(response.headers.get("x-daily-remaining"), "0"); assert.equal(calls.limits.length, 1); assert.equal(calls.stream.length, 0);
});

test("POST returns 503 when the AI provider is not configured", async () => {
  const { POST, calls } = setup({ isChatConfigured: () => false }); const response = await POST(request({ messages: [message] }));
  assert.equal(response.status, 503); assert.equal(calls.limits.length, 0); assert.equal(calls.stream.length, 0);
});

test("POST returns 503 when the shared rate-limit store is unavailable", async () => {
  const { POST, calls } = setup({ consumeDailyLimit: async () => { throw new RateLimitUnavailableError(); } });
  const response = await POST(request({ messages: [message] }));
  assert.equal(response.status, 503); assert.equal(calls.stream.length, 0);
});

test("POST returns 429 when the global quota is exhausted", async () => {
  let invocation = 0;
  const { POST, calls } = setup({ consumeDailyLimit: async (key, limit) => { calls.limits.push([key, limit]); invocation += 1; return invocation === 1 ? allowed(limit) : { allowed: false, count: 500, remaining: 0, limit }; } });
  const response = await POST(request({ messages: [message] }));
  assert.equal(response.status, 429); assert.equal(calls.limits[1]?.[0], "_total"); assert.equal(calls.stream.length, 0);
});

test("POST invokes the AI provider after validation", async () => {
  const { POST, calls } = setup(); const response = await POST(request({ messages: [message], id: "session_1" }));
  assert.equal(response.status, 200); assert.equal(await response.text(), "mock AI response"); assert.deepEqual(calls.stream[0], [message]);
  assert.equal(response.headers.get("x-chat-session-id"), "session_1"); assert.equal(response.headers.get("x-chat-session-token"), "signed-session-token");
});

test("a persistence failure does not fail the streamed chat response", async () => {
  const errors: unknown[][] = []; const originalError = console.error; console.error = (...args: unknown[]) => { errors.push(args); };
  try {
    const { POST, calls } = setup({ saveTranscript: async () => { throw new Error("Blob unavailable"); } }); const response = await POST(request({ messages: [message] }));
    assert.equal(await response.text(), "mock AI response"); assert.equal(calls.leads.length, 0); assert.equal(errors.length, 1);
  } finally { console.error = originalError; }
});

test("POST saves the transcript and structured lead after the stream finishes", async () => {
  let finish: ((event: ChatFinishEvent) => Promise<void>) | undefined;
  const { POST, calls } = setup({ streamChat: async (_messages, onFinish) => { finish = onFinish; return new Response("deferred stream"); } });
  const response = await POST(request({ messages: [message], id: "session_1" }));
  assert.equal(calls.transcripts.length, 0); assert.equal(calls.leads.length, 0); assert.equal(await response.text(), "deferred stream"); await finish?.({ finishReason: "stop", usage: { totalTokens: 23 } });
  assert.deepEqual(calls.transcripts[0], { sessionId: "session_1", messages: JSON.stringify([message]), messageCount: 1, finishReason: "stop", tokensUsed: 23 }); assert.equal(calls.leads[0]?.sessionId, "session_1");
});

