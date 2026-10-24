import assert from "node:assert/strict";
import test from "node:test";

import {
  saveChatLead,
  type SaveChatLeadDependencies,
} from "./chat-storage.ts";

const transcript = {
  sessionId: "session-1",
  messages: "[]",
  messageCount: 2,
};

test("saveChatLead overwrites the rolling transcript for the same session", async () => {
  const calls: Array<{ path: string; options: Record<string, unknown> }> = [];
  const put: NonNullable<SaveChatLeadDependencies["put"]> = async (path, _body, options) => {
    calls.push({ path, options });
    return { url: `https://blob.example/${path}` };
  };
  const dependencies: SaveChatLeadDependencies = { put, hasBlobToken: true };

  await saveChatLead(transcript, dependencies);
  await saveChatLead(transcript, dependencies);

  assert.equal(calls.length, 2);
  assert.equal(calls[0]?.path, "chat-leads/session-1.json");
  assert.deepEqual(calls[0]?.options, {
    contentType: "application/json",
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
});

test("saveChatLead skips storage when Blob is not configured", async () => {
  let called = false;
  const result = await saveChatLead(transcript, {
    hasBlobToken: false,
    put: async () => {
      called = true;
      return null;
    },
  });

  assert.equal(result, null);
  assert.equal(called, false);
});

test("saveChatLead returns null when the Blob write fails", async () => {
  const result = await saveChatLead(transcript, {
    hasBlobToken: true,
    put: async () => {
      throw new Error("write failed");
    },
  });

  assert.equal(result, null);
});
