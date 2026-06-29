export async function saveChatLead(data: {
  sessionId: string;
  messages: string;
  messageCount: number;
  finishReason?: string;
  tokensUsed?: number;
}) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.log("[chat] Blob not configured — skipping save:", data.sessionId);
    return null;
  }

  try {
    const { put } = await import("@vercel/blob");
    const blobPath = `chat-leads/${data.sessionId}.json`;
    const blob = await put(blobPath, JSON.stringify(data, null, 2), {
      contentType: "application/json",
      access: "private",
    });
    console.log("[chat] Saved to Blob:", blob.url);
    return blob;
  } catch (err) {
    console.error("[chat] Blob save failed (chat still works):", err);
    return null;
  }
}
