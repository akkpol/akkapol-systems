type ChatMessage = {
  role?: unknown;
  parts?: unknown;
};

export type ChatLead = {
  leadId: string;
  sessionId: string;
  name: string;
  email: string;
  phone: string;
  serviceInterest: string;
  summary: string;
};

export type LeadSheetCell = string | number | boolean | null;

export function buildLeadSheetRow(
  lead: ChatLead,
  updatedAtSerial: number,
  existingRow: LeadSheetCell[] = [],
): LeadSheetCell[] {
  return [
    existingRow[0] || updatedAtSerial,
    updatedAtSerial,
    lead.name || existingRow[2] || "",
    lead.email || existingRow[3] || "",
    lead.phone || existingRow[4] || "",
    lead.serviceInterest,
    lead.summary,
    existingRow[7] || "new",
    existingRow[8] || "",
    existingRow[9] || "",
    "ai_chat",
    lead.sessionId,
    lead.leadId,
  ];
}

function getUserText(messages: ChatMessage[]): string[] {
  return messages.flatMap((message) => {
    if (message.role !== "user" || !Array.isArray(message.parts)) {
      return [];
    }

    return message.parts.flatMap((part) => {
      if (
        !part ||
        typeof part !== "object" ||
        !("type" in part) ||
        !("text" in part) ||
        part.type !== "text" ||
        typeof part.text !== "string"
      ) {
        return [];
      }

      const text = part.text.trim();
      return text ? [text] : [];
    });
  });
}

export function extractChatLead(
  messages: ChatMessage[],
  sessionId: string,
): ChatLead | null {
  const userText = getUserText(messages);
  const summary = userText.join(" ").replace(/\s+/g, " ").trim();
  const email = summary.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? "";
  const phoneCandidate = summary.match(/(?:\+?66|0)[\d\s-]{8,13}\d/)?.[0] ?? "";
  const phone = phoneCandidate.replace(/^\+66/, "0").replace(/\D/g, "");
  const hasExplicitHiringIntent = /อยากจ้าง|สนใจจ้าง|ขอใบเสนอราคา|พร้อมเริ่ม|hire you|work with you|request (?:a )?quote|proposal/i.test(summary);

  if (!email && !phone && !hasExplicitHiringIntent) {
    return null;
  }

  const name = summary.match(/(?:ผมชื่อ|ฉันชื่อ|ชื่อ|I(?:'m| am))\s+([A-Za-zก-๙][A-Za-zก-๙ .'-]{1,60}?)(?=\s+(?:อีเมล|email|โทร|phone)|$)/i)?.[1]?.trim() ?? "";
  const serviceInterest = /ระบบหลังบ้าน|workflow|automation|\bMVP\b/i.test(summary)
    ? "Workflow MVP"
    : /AI\s*workflow|AI\s*audit|วิเคราะห์.*AI|รีวิว.*workflow/i.test(summary)
      ? "AI Workflow Audit"
      : /เว็บไซต์|website|landing\s*page/i.test(summary)
        ? "Business Website"
        : "General inquiry";

  return {
    leadId: `lead-${sessionId}`,
    sessionId,
    name,
    email,
    phone,
    serviceInterest,
    summary: summary.slice(-500),
  };
}
