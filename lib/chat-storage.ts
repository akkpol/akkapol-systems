import { resolveDatabaseUrl } from "./database-url.ts";

export type ChatTranscriptData = {
  sessionId: string;
  messages: string;
  messageCount: number;
  finishReason?: string;
  tokensUsed?: number;
};

export interface TranscriptStore {
  insert(data: ChatTranscriptData): Promise<void>;
}

export type SaveChatLeadDependencies = {
  store?: TranscriptStore;
  hasDatabase?: boolean;
};

const INSERT_TRANSCRIPT = [
  "insert into chat_transcripts",
  "  (session_id, messages, message_count, finish_reason, tokens_used)",
  "values",
  "  ($1::uuid, $2::jsonb, $3, $4, $5)",
].join("\n");

export function createPostgresTranscriptStore(): TranscriptStore {
  return {
    async insert(data) {
      const { getPool } = await import("./db.ts");
      await getPool().query(INSERT_TRANSCRIPT, [
        data.sessionId,
        data.messages,
        data.messageCount,
        data.finishReason ?? null,
        data.tokensUsed ?? 0,
      ]);
    },
  };
}

export async function saveChatLead(
  data: ChatTranscriptData,
  dependencies: SaveChatLeadDependencies = {},
) {
  const hasDatabase = dependencies.hasDatabase
    ?? (Boolean(dependencies.store) || Boolean(resolveDatabaseUrl()));

  if (!hasDatabase) {
    console.log("[chat] Database not configured — skipping transcript:", data.sessionId);
    return null;
  }

  try {
    const store = dependencies.store ?? createPostgresTranscriptStore();
    await store.insert(data);
    console.log("[chat] Saved transcript:", data.sessionId);
    return true;
  } catch (err) {
    console.error(
      "[chat] Transcript save failed (chat still works):",
      data.sessionId,
      err instanceof Error ? err.message : err,
    );
    return null;
  }
}
