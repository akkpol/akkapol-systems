export type ChatTranscriptData = {
  sessionId: string;
  messages: string;
  messageCount: number;
  finishReason?: string;
  tokensUsed?: number;
};

type TranscriptPutOptions = {
  contentType: string;
  access: "private";
  addRandomSuffix: boolean;
  allowOverwrite: boolean;
};

type TranscriptPut = (
  path: string,
  body: string,
  options: TranscriptPutOptions,
) => Promise<unknown>;

export type SaveChatLeadDependencies = {
  put?: TranscriptPut;
  hasBlobToken?: boolean;
};

export async function saveChatLead(
  data: ChatTranscriptData,
  dependencies: SaveChatLeadDependencies = {},
) {
  const hasBlobToken = dependencies.hasBlobToken
    ?? Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  if (!hasBlobToken) {
    console.log("[chat] Blob not configured — skipping save:", data.sessionId);
    return null;
  }

  try {
    const put: TranscriptPut = dependencies.put
      ?? ((await import("@vercel/blob")).put as unknown as TranscriptPut);
    const blobPath = `chat-leads/${data.sessionId}.json`;
    const blob = await put(blobPath, JSON.stringify({
      ...data,
      savedAt: new Date().toISOString(),
    }, null, 2), {
      contentType: "application/json",
      access: "private",
      addRandomSuffix: false,
      // One rolling transcript per chat session. Without this, Vercel Blob
      // rejects every write after the first one for the same pathname.
      allowOverwrite: true,
    });
    const blobUrl = (blob as { url?: unknown } | null)?.url;
    console.log("[chat] Saved to Blob:", typeof blobUrl === "string" ? blobUrl : data.sessionId);
    return blob;
  } catch (err) {
    console.error("[chat] Blob save failed (chat still works):", err);
    return null;
  }
}
