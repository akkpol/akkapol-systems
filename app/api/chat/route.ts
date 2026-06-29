import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { deepseek } from "@ai-sdk/deepseek";
import { saveChatLead } from "@/lib/chat-storage";
import { checkDailyLimit, recordDailyUsage } from "@/lib/ratelimit-daily";

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
  const { messages, id: sessionId, deviceId: bodyDeviceId }: { messages: UIMessage[]; id?: string; deviceId?: string } =
    await req.json();

  const deviceId =
    bodyDeviceId ||
    req.headers.get("x-device-id") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  // --- DAILY LIMIT PER DEVICE ---
  const perDevice = await checkDailyLimit(deviceId);
  if (perDevice >= DAILY_LIMIT) {
    return Response.json(
      { error: "คุณถามครบจำนวนสูงสุดของวันนี้แล้ว (30 ข้อความ) พรุ่งนี้กลับมาใหม่นะ 🙏" },
      { status: 429, headers: { "X-Daily-Limit": "30", "X-Daily-Used": String(perDevice) } },
    );
  }

  // --- GLOBAL BUDGET CHECK ---
  const globalKey = "_total";
  const totalUsed = await checkDailyLimit(globalKey);
  if (totalUsed >= TOTAL_DAILY_BUDGET) {
    console.warn("[chat] Global daily budget reached, rejecting");
    return Response.json(
      { error: "ขออภัย ช่วงนี้มีคนใช้บริการเยอะ พรุ่งนี้กลับมาใหม่นะ 🙏" },
      { status: 429 },
    );
  }

  const result = streamText({
    model: deepseek("deepseek-chat"),
    system: SYSTEM,
    messages: await convertToModelMessages(messages),
    onFinish: async (event) => {
      try {
        // Record usage AFTER successful response
        await Promise.all([
          recordDailyUsage(deviceId),
          recordDailyUsage(globalKey),
        ]);

        const sid = sessionId || crypto.randomUUID();
        await saveChatLead({
          sessionId: sid,
          messages: JSON.stringify(messages),
          messageCount: messages?.length ?? 0,
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
