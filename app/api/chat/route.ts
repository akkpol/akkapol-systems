import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
} from "ai";
import { deepseek } from "@ai-sdk/deepseek";
import {
  getRateLimitKey,
  isAllowedOrigin,
  MAX_REQUEST_BYTES,
  validateChatPayload,
} from "@/lib/chat-security";
import { saveChatLead } from "@/lib/chat-storage";
import { consumeDailyLimit } from "@/lib/ratelimit-daily";

const SYSTEM = `You are Akkapol's AI assistant on his portfolio website (akkapol-systems.vercel.app).

Akkapol Kumpapug is a Creative AI Systems Builder based in Thailand. His services:

1. Company Website / Landing Page — สร้างเว็บไซต์บริษัท, หน้า landing page
2. Workflow & Backoffice System — ระบบ workflow, backoffice, automation
3. AI Workflow Audit — ตรวจสอบ workflow ด้วย AI
4. RoboForge — robot platform (ESP32 + web control)

Be concise, professional, bilingual (ตอบภาษาเดียวกับที่ user ถาม). Direct leads to contact via the contact links on the page. Never make up pricing — say "please contact for a quote." If someone asks for pricing or wants to hire, politely ask for their email so Akkapol can follow up.`;

const DAILY_LIMIT = 30; // messages per device per day
const TOTAL_DAILY_BUDGET = 500; // hard cap across all devices

export const maxDuration = 30;

export async function POST(req: Request) {
  if (!isAllowedOrigin(req.headers.get("origin"), req.headers.get("host"))) {
    return Response.json(
      { error: "Invalid request origin." },
      { status: 403 },
    );
  }

  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return Response.json(
      { error: "Chat request is too large." },
      { status: 413 },
    );
  }

  const body = await req.json().catch(() => null);
  const payload = validateChatPayload(body);
  if (!payload.ok) {
    return Response.json(
      { error: payload.error },
      { status: payload.status },
    );
  }

  const rateLimitKey = getRateLimitKey(req.headers, payload.value.deviceId);
  const perDevice = await consumeDailyLimit(rateLimitKey, DAILY_LIMIT);
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

  const globalBudget = await consumeDailyLimit("_total", TOTAL_DAILY_BUDGET);
  if (!globalBudget.allowed) {
    console.warn("[chat] Global daily budget reached, rejecting");
    return Response.json(
      { error: "ขออภัย ช่วงนี้มีคนใช้บริการเยอะ พรุ่งนี้กลับมาใหม่นะ 🙏" },
      { status: 429 },
    );
  }

  const result = streamText({
    model: deepseek("deepseek-chat"),
    system: SYSTEM,
    messages: await convertToModelMessages(payload.value.messages),
    onFinish: async (event) => {
      try {
        const sid = payload.value.sessionId || crypto.randomUUID();
        await saveChatLead({
          sessionId: sid,
          messages: JSON.stringify(payload.value.messages),
          messageCount: payload.value.messages.length,
          finishReason: event.finishReason,
          tokensUsed: event.usage?.totalTokens ?? 0,
        });
      } catch (err) {
        console.error("[chat] Failed to save lead:", err);
      }
    },
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
