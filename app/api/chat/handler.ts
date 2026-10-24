import type { UIMessage } from "ai";

import {
  getRateLimitKey,
  isAllowedOrigin,
  readJsonBodyWithLimit,
  resolveChatSession,
  type ChatPayloadValidationResult,
  validateChatPayload,
} from "../../../lib/chat-security.ts";
import type { ChatLead } from "../../../lib/chat-lead.ts";
import { RateLimitUnavailableError } from "../../../lib/ratelimit-daily.ts";

const DAILY_LIMIT = 30;
const TOTAL_DAILY_BUDGET = 500;

export type ChatFinishEvent = { finishReason?: string; usage?: { totalTokens?: number } };
export type ChatTranscript = {
  sessionId: string;
  messages: string;
  messageCount: number;
  finishReason?: string;
  tokensUsed?: number;
};

type ChatSession = { sessionId: string; sessionToken?: string };

export type ChatRouteDependencies = {
  isChatConfigured: () => boolean;
  sessionSecret?: string;
  streamChat: (
    messages: UIMessage[],
    onFinish: (event: ChatFinishEvent) => Promise<void>,
    abortSignal: AbortSignal,
  ) => Promise<Response>;
  consumeDailyLimit: (key: string, limit: number) => Promise<{
    allowed: boolean;
    count: number;
    remaining: number;
    limit: number;
  }>;
  saveTranscript: (transcript: ChatTranscript) => Promise<unknown>;
  extractLead: (messages: UIMessage[], sessionId: string) => ChatLead | null;
  saveStructuredLead: (lead: ChatLead) => Promise<unknown>;
  resolveSession?: (
    requestedSessionId: string | undefined,
    requestedToken: string | undefined,
    secret: string | undefined,
  ) => ChatSession;
};

function unavailable(): Response {
  return Response.json({ error: "Lyra is temporarily unavailable." }, { status: 503 });
}

function payloadFailure(payload: Exclude<ChatPayloadValidationResult, { ok: true }>): Response {
  return Response.json({ error: payload.error }, { status: payload.status });
}

async function consumeLimit(
  consumeDailyLimit: ChatRouteDependencies["consumeDailyLimit"],
  key: string,
  limit: number,
) {
  try {
    return await consumeDailyLimit(key, limit);
  } catch (error) {
    if (error instanceof RateLimitUnavailableError) return null;
    throw error;
  }
}

/** Builds the route handler with all network and persistence boundaries injectable. */
export function createChatPostHandler(dependencies: ChatRouteDependencies) {
  const resolveSession = dependencies.resolveSession ?? resolveChatSession;

  return async function POST(req: Request): Promise<Response> {
    if (!isAllowedOrigin(req.headers.get("origin"), req.headers.get("host"))) {
      return Response.json({ error: "Invalid request origin." }, { status: 403 });
    }

    const parsedBody = await readJsonBodyWithLimit(req);
    if (!parsedBody.ok) {
      return Response.json({ error: parsedBody.error }, { status: parsedBody.status });
    }
    const payload = validateChatPayload(parsedBody.value);
    if (!payload.ok) return payloadFailure(payload);
    if (!dependencies.isChatConfigured()) return unavailable();

    const rateLimitKey = getRateLimitKey(req.headers, payload.value.deviceId);
    const perDevice = await consumeLimit(dependencies.consumeDailyLimit, rateLimitKey, DAILY_LIMIT);
    if (!perDevice) return unavailable();
    if (!perDevice.allowed) {
      return Response.json(
        { error: "คุณถามครบจำนวนสูงสุดของวันนี้แล้ว (30 ข้อความ) พรุ่งนี้กลับมาใหม่นะ 🙏" },
        { status: 429, headers: {
          "X-Daily-Limit": String(perDevice.limit),
          "X-Daily-Used": String(perDevice.count),
          "X-Daily-Remaining": String(perDevice.remaining),
        } },
      );
    }

    const globalBudget = await consumeLimit(dependencies.consumeDailyLimit, "_total", TOTAL_DAILY_BUDGET);
    if (!globalBudget) return unavailable();
    if (!globalBudget.allowed) {
      console.warn("[chat] Global daily budget reached, rejecting");
      return Response.json(
        { error: "ขออภัย ช่วงนี้มีคนใช้บริการเยอะ พรุ่งนี้กลับมาใหม่นะ 🙏" },
        { status: 429 },
      );
    }

    const chatSession = resolveSession(
      payload.value.sessionId,
      payload.value.sessionToken,
      dependencies.sessionSecret,
    );
    const response = await dependencies.streamChat(
      payload.value.messages,
      async (event) => {
        try {
          await dependencies.saveTranscript({
            sessionId: chatSession.sessionId,
            messages: JSON.stringify(payload.value.messages),
            messageCount: payload.value.messages.length,
            finishReason: event.finishReason,
            tokensUsed: event.usage?.totalTokens ?? 0,
          });
          const lead = dependencies.extractLead(payload.value.messages, chatSession.sessionId);
          if (lead) await dependencies.saveStructuredLead(lead);
        } catch (error) {
          console.error("[chat] Failed to save lead:", error);
        }
      },
      req.signal,
    );

    response.headers.set("X-Chat-Session-Id", chatSession.sessionId);
    if (chatSession.sessionToken) response.headers.set("X-Chat-Session-Token", chatSession.sessionToken);
    return response;
  };
}
