import test from "node:test";
import assert from "node:assert/strict";

import { buildLeadSheetRow, extractChatLead } from "./chat-lead.ts";

test("extractChatLead ignores casual chat and assistant contact details", () => {
  const lead = extractChatLead(
    [
      {
        role: "user",
        parts: [{ type: "text", text: "สวัสดีครับ" }],
      },
      {
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "ติดต่อ Akkapol ได้ที่ akkapol.kumpapug@gmail.com",
          },
        ],
      },
    ],
    "session_123",
  );

  assert.equal(lead, null);
});

test("extractChatLead structures contact details from an interested user", () => {
  const lead = extractChatLead(
    [
      {
        role: "user",
        parts: [
          {
            type: "text",
            text: "สนใจจ้างทำเว็บไซต์ครับ ผมชื่อ Somchai อีเมล somchai@example.com โทร 081-234-5678",
          },
        ],
      },
    ],
    "session_website",
  );

  assert.deepEqual(lead, {
    leadId: "lead-session_website",
    sessionId: "session_website",
    name: "Somchai",
    email: "somchai@example.com",
    phone: "0812345678",
    serviceInterest: "Business Website",
    summary:
      "สนใจจ้างทำเว็บไซต์ครับ ผมชื่อ Somchai อีเมล somchai@example.com โทร 081-234-5678",
  });
});

test("extractChatLead records explicit hiring intent without contact details", () => {
  const lead = extractChatLead(
    [
      {
        role: "user",
        parts: [
          {
            type: "text",
            text: "อยากจ้างทำระบบหลังบ้านและขอใบเสนอราคาครับ",
          },
        ],
      },
    ],
    "session_workflow",
  );

  assert.equal(lead?.serviceInterest, "Workflow MVP");
  assert.equal(lead?.email, "");
  assert.equal(lead?.phone, "");
});

test("buildLeadSheetRow preserves the operator-managed pipeline fields", () => {
  const row = buildLeadSheetRow(
    {
      leadId: "lead-session_123",
      sessionId: "session_123",
      name: "",
      email: "new@example.com",
      phone: "0812345678",
      serviceInterest: "Business Website",
      summary: "ขอเริ่มทำเว็บไซต์ครับ",
    },
    46_000,
    [
      45_000,
      45_100,
      "Somchai",
      "old@example.com",
      "",
      "General inquiry",
      "old summary",
      "qualified",
      45_678,
      "Call Tuesday",
      "ai_chat",
      "session_123",
      "lead-session_123",
    ],
  );

  assert.deepEqual(row, [
    45_000,
    46_000,
    "Somchai",
    "new@example.com",
    "0812345678",
    "Business Website",
    "ขอเริ่มทำเว็บไซต์ครับ",
    "qualified",
    45_678,
    "Call Tuesday",
    "ai_chat",
    "session_123",
    "lead-session_123",
  ]);
});
