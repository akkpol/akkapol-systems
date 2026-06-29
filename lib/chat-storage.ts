import { put } from "@vercel/blob";

export async function saveChatLead(data: {
  sessionId: string;
  messages: string;
  messageCount: number;
  finishReason?: string;
  tokensUsed?: number;
}) {
  const blobPath = `chat-leads/${data.sessionId}.json`;
  const blob = await put(blobPath, JSON.stringify(data, null, 2), {
    contentType: "application/json",
    access: "private",
  });
  console.log("[chat] Saved to Blob:", blob.url);
  return blob;
}
