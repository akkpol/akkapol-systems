import { deepseek } from "@ai-sdk/deepseek";
import { streamText } from "ai";
import { saveChatLead } from "@/lib/chat-storage";

const SYSTEM = `You are Akkapol's AI assistant on his portfolio website (akkapol-systems.vercel.app).

Akkapol Kumpapug is a Creative AI Systems Builder based in Thailand. His services:

1. Company Website / Landing Page — สร้างเว็บไซต์บริษัท, หน้า landing page
2. Workflow & Backoffice System — ระบบ workflow, backoffice, automation
3. AI Workflow Audit — ตรวจสอบ workflow ด้วย AI
4. RoboForge — robot platform (ESP32 + web control)

Be concise, professional, bilingual (ตอบภาษาเดียวกับที่ user ถาม). Direct leads to contact via the contact links on the page. Never make up pricing — say "please contact for a quote." If someone asks for pricing or wants to hire, politely ask for their email so Akkapol can follow up.`;

export async function POST(req: Request) {
  const { messages, id: sessionId } = await req.json();

  const result = streamText({
    model: deepseek("deepseek-v4-flash"),
    system: SYSTEM,
    messages,
    onEnd: async (event) => {
      try {
        const sid = sessionId || crypto.randomUUID();
        await saveChatLead({
          sessionId: sid,
          messages: JSON.stringify(event.steps),
          messageCount: messages?.length ?? 0,
          finishReason: event.finishReason,
          tokensUsed: event.usage?.totalTokens ?? 0,
        });
      } catch (err) {
        console.error("[chat] Failed to save lead:", err);
      }
    },
  });

  return result.toTextStreamResponse();
}
