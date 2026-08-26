import type { UIMessage } from "ai";

import {
  getRateLimitKey,
  isAllowedOrigin,
  MAX_REQUEST_BYTES,
  validateChatPayload,
} from "../../../lib/chat-security.ts";
import type { ChatLead } from "../../../lib/chat-lead.ts";

const DAILY_LIMIT = 30;
const TOTAL_DAILY_BUDGET = 500;

export type ChatFinishEvent = {
  finishReason?: string;
  usage?: { totalTokens?: number };
};

export type ChatTranscript = {
  sessionId: string;
  messages: string;
  messageCount: number;
  finishReason?: string;
  tokensUsed?: number;
};

export type ChatRouteDependencies = {
  streamChat: (
    messages: UIMessage[],
    onFinish: (event: ChatFinishEvent) => Promise<void>,
  ) => Promise<Response>;
  consumeDailyLimit: (
    key: string,
    limit: number,
  ) => Promise<{
    allowed: boolean;
    count: number;
    remaining: number;
    limit: number;
  }>;
  saveTranscript: (transcript: ChatTranscript) => Promise<unknown>;
  extractLead: (messages: UIMessage[], sessionId: string) => ChatLead | null;
  saveStructuredLead: (lead: ChatLead) => Promise<unknown>;
  randomUUID: () => string;
};

/** Builds the route handler with all network and persistence boundaries injectable. */
export function createChatPostHandler(dependencies: ChatRouteDependencies) {
  return async function POST(req: Request): Promise<Response> {
    if (!isAllowedOrigin(req.headers.get("origin"), req.headers.get("host"))) {
      return Response.json({ error: "Invalid request origin." }, { status: 403 });
    }

    const contentLength = Number(req.headers.get("content-length") ?? 0);
    if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
      return Response.json({ error: "Chat request is too large." }, { status: 413 });
    }

    const body = await req.json().catch(() => null);
    const payload = validateChatPayload(body);
    if (!payload.ok) {
      return Response.json({ error: payload.error }, { status: payload.status });
    }

    const rateLimitKey = getRateLimitKey(req.headers, payload.value.deviceId);
    const perDevice = await dependencies.consumeDailyLimit(rateLimitKey, DAILY_LIMIT);
    if (!perDevice.allowed) {
      return Response.json(
        { error: "คุณถามครบจำนวนสูงสุดของวันนี้แล้ว (30 ข้อความ) พรุ่งนี้กลับมาใหม่นะ 🙏" },
        {
          status: 429,
          headers: {
            "X-Daily-Limit": String(perDevice.limit),
            "X-Daily-Used": String(perDevice.count),
            "X-Daily-Remaining": String(perDevice.remaining),
          },
        },
      );
    }

    const globalBudget = await dependencies.consumeDailyLimit("_total", TOTAL_DAILY_BUDGET);
    if (!globalBudget.allowed) {
      console.warn("[chat] Global daily budget reached, rejecting");
      return Response.json(
        { error: "ขออภัย ช่วงนี้มีคนใช้บริการเยอะ พรุ่งนี้กลับมาใหม่นะ 🙏" },
        { status: 429 },
      );
    }

    return dependencies.streamChat(payload.value.messages, async (event) => {
      try {
        const sessionId = payload.value.sessionId || dependencies.randomUUID();
        await dependencies.saveTranscript({
          sessionId,
          messages: JSON.stringify(payload.value.messages),
          messageCount: payload.value.messages.length,
          finishReason: event.finishReason,
          tokensUsed: event.usage?.totalTokens ?? 0,
        });

        const lead = dependencies.extractLead(payload.value.messages, sessionId);
        if (lead) {
          await dependencies.saveStructuredLead(lead);
        }
      } catch (error) {
        console.error("[chat] Failed to save lead:", error);
      }
    });
  };
}
