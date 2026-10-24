import assert from "node:assert/strict";
import test from "node:test";

import {
  saveChatLead,
  type ChatTranscriptData,
  type SaveChatLeadDependencies,
  type TranscriptStore,
} from "./chat-storage.ts";

const transcript: ChatTranscriptData = {
  sessionId: "session-1",
  messages: "[]",
  messageCount: 2,
};

test("saveChatLead inserts the transcript through the store", async () => {
  const calls: ChatTranscriptData[] = [];
  const store: TranscriptStore = {
    async insert(data) {
      calls.push(data);
    },
  };
  const dependencies: SaveChatLeadDependencies = { store, hasDatabase: true };

  const result = await saveChatLead(transcript, dependencies);

  assert.equal(result, true);
  assert.deepEqual(calls, [transcript]);
});

test("saveChatLead skips storage when the database is not configured", async () => {
  let called = false;
  const store: TranscriptStore = {
    async insert() {
      called = true;
    },
  };

  const result = await saveChatLead(transcript, {
    store,
    hasDatabase: false,
  });

  assert.equal(result, null);
  assert.equal(called, false);
});

test("saveChatLead returns null when the database insert fails", async () => {
  const store: TranscriptStore = {
    async insert() {
      throw new Error("database unavailable");
    },
  };

  const result = await saveChatLead(transcript, {
    store,
    hasDatabase: true,
  });

  assert.equal(result, null);
});
