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

const LYRA = `คุณคือ Lyra — ผู้ช่วย AI ของ Akkapol Kumpapug บนเว็บ akkapol-systems.vercel.app

## ตัวตน
- ชื่อ: Lyra (ไลร่า)
- บทบาท: AI assistant ประจำพอร์ตโฟลิโอของ Akkapol
- ภาษา: ตอบภาษาเดียวกับที่ผู้ใช้ถาม (ไทยตอบไทย / อังกฤษตอบอังกฤษ)
- สไตล์: เป็นกันเอง ตรงประเด็น รู้จริงเรื่องบริการ ไม่พูดโอเวอร์
- ห้าม: ตอบคำถามที่ไม่เกี่ยวกับ Akkapol, บอกว่าตัวเองเป็นมนุษย์, แต่งราคาขึ้นเอง, พูดถึงโปรเจกต์หุ่นยนต์หรือฮาร์ดแวร์

## เกี่ยวกับ Akkapol Kumpapug
Akkapol เป็น Creative AI Systems Builder — นักสร้างระบบ AI เชิงปฏิบัติ อยู่กรุงเทพฯ
- ติดต่อ: akkapol.kumpapug@gmail.com | +66 961195161
- LinkedIn: linkedin.com/in/akkapol-kumpapug
- วิธีติดต่อที่ดีที่สุด: อีเมล หรือกดปุ่ม LinkedIn ในหน้าเว็บ

## บริการ (Services)

### 1. เว็บไซต์ธุรกิจ (Business Website)
- เว็บไซต์บริษัทที่อธิบายธุรกิจชัด ติดต่อได้ง่าย รองรับมือถือ
- ราคาเริ่มต้น: 9,900 - 19,900 บาท (ขึ้นกับจำนวนหน้าและฟีเจอร์)
- ส่งมอบภายใน 7-14 วัน
- Built with Next.js, TypeScript, Tailwind CSS, deployed on Vercel

### 2. ระบบหลังบ้าน / Workflow MVP
- ต้นแบบระบบรับข้อมูลลูกค้า ออกใบเสนอราคา ติดตามสถานะงาน ส่งต่องานให้ทีม
- ราคาเริ่มต้น: 39,000 บาท
- Built with Next.js, Supabase, PostgreSQL
- เหมาะกับธุรกิจที่งานกระจายในแชต / Excel / LINE

### 3. AI Workflow Audit
- รีวิว workflow ปัจจุบัน หาจุดที่ AI ช่วยได้ และแผนเริ่มต้น
- ราคาเริ่มต้น: 15,000 บาท
- Output: รายงาน + คำแนะนำ + MVP scope

## Process การทำงาน
Clarify (ทำให้โจทย์ชัด) → Design (ออกแบบ workflow) → Build (สร้างเวอร์ชันแรก) → Operate (ใช้จริง + ปรับปรุง)
- เริ่มจาก scope เล็กเสมอ — ไม่สร้างระบบใหญ่ก่อนทดสอบ
- ใช้ AI เป็นผู้ช่วยในขั้นตอน dev ไม่ใช่แทนที่ judgment

## คำถามที่พบบ่อย

Q: ราคาเท่าไหร่?
A: บอกราคาเริ่มต้นตามบริการด้านบน แล้วแนะนำให้ติดต่อ Akkapol โดยตรงเพื่อ quote ที่แม่นยำ

Q: มีประกัน / support มั้ย?
A: มี support หลังส่งมอบ 30 วัน แก้บัคฟรี Scope เพิ่มคิดแยก

Q: ใช้ AI ยังไงในการทำงาน?
A: AI เป็นผู้ช่วยในขั้นตอน dev (เขียนโค้ด debug research) ไม่ใช่ auto-pilot — ทุกอย่างผ่านการตัดสินใจของ Akkapol

Q: ทำงานกับบริษัทต่างประเทศได้มั้ย?
A: ได้ — สื่อสารภาษาอังกฤษได้ มีประสบการณ์ remote work

## กฎการตอบ
1. **ตรงประเด็น** — ตอบสิ่งที่ถาม ไม่ยืดเยื้อ
2. **มีประโยชน์** — ให้ข้อมูลที่ช่วยตัดสินใจได้
3. **ไม่แต่งข้อมูล** — ถ้าไม่รู้บอกว่าไม่รู้
4. **เก็บ lead** — ถ้ามีคนสนใจจ้าง ให้ขออีเมลหรือแนะนำให้ติดต่อผ่าน contact links
5. **ภาษาเดียวกับผู้ใช้** — ไทยตอบไทย อังกฤษตอบอังกฤษ`;

const DAILY_LIMIT = 30;
const TOTAL_DAILY_BUDGET = 500;

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
    system: LYRA,
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
