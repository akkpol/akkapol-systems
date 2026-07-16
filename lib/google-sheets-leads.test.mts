import test from "node:test";
import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";

import { createLeadSheetWriter } from "./google-sheets-leads.ts";

test("createLeadSheetWriter appends a new lead with server-side authorization", async () => {
  const { privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
  const requests: Array<{ url: string; init?: RequestInit }> = [];
  const responses = [
    Response.json({ access_token: "test-token", expires_in: 3600 }),
    Response.json({ range: "Leads!L2:L", values: [] }),
    Response.json({ updates: { updatedRows: 1 } }),
  ];
  const fetchImpl: typeof fetch = async (input, init) => {
    requests.push({ url: String(input), init });
    return responses.shift() ?? Response.json({ error: "unexpected request" }, { status: 500 });
  };

  const writer = createLeadSheetWriter(
    {
      spreadsheetId: "sheet_123",
      clientEmail: "lead-writer@example.iam.gserviceaccount.com",
      privateKey,
    },
    { fetchImpl, now: () => Date.UTC(2026, 6, 16, 12, 0, 0) },
  );

  const result = await writer.upsert({
    leadId: "lead-session_123",
    sessionId: "session_123",
    name: "Somchai",
    email: "somchai@example.com",
    phone: "0812345678",
    serviceInterest: "Business Website",
    summary: "สนใจจ้างทำเว็บไซต์",
  });

  assert.deepEqual(result, { action: "appended", row: null });
  assert.equal(requests.length, 3);
  assert.equal(requests[2]?.init?.method, "POST");
  assert.match(requests[2]?.url ?? "", /values\/Leads!A%3AM:append/);
  assert.equal(
    new Headers(requests[2]?.init?.headers).get("authorization"),
    "Bearer test-token",
  );

  const body = JSON.parse(String(requests[2]?.init?.body));
  assert.equal(body.values[0][7], "new");
  assert.equal(body.values[0][11], "session_123");
  assert.equal(body.values[0][12], "lead-session_123");
});

test("createLeadSheetWriter updates the matching session without overwriting pipeline work", async () => {
  const { privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
  const requests: Array<{ url: string; init?: RequestInit }> = [];
  const responses = [
    Response.json({ access_token: "test-token", expires_in: 3600 }),
    Response.json({ values: [["session_123"]] }),
    Response.json({
      values: [[
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
      ]],
    }),
    Response.json({ updatedRows: 1 }),
  ];
  const fetchImpl: typeof fetch = async (input, init) => {
    requests.push({ url: String(input), init });
    return responses.shift() ?? Response.json({ error: "unexpected request" }, { status: 500 });
  };
  const writer = createLeadSheetWriter(
    {
      spreadsheetId: "sheet_123",
      clientEmail: "lead-writer@example.iam.gserviceaccount.com",
      privateKey,
    },
    { fetchImpl, now: () => Date.UTC(2026, 6, 16, 12, 0, 0) },
  );

  const result = await writer.upsert({
    leadId: "lead-session_123",
    sessionId: "session_123",
    name: "",
    email: "new@example.com",
    phone: "0812345678",
    serviceInterest: "Business Website",
    summary: "ขอเริ่มทำเว็บไซต์ครับ",
  });

  assert.deepEqual(result, { action: "updated", row: 2 });
  assert.equal(requests.length, 4);
  assert.equal(requests[3]?.init?.method, "PUT");
  assert.match(requests[3]?.url ?? "", /values\/Leads!A2%3AM2/);
  const body = JSON.parse(String(requests[3]?.init?.body));
  assert.equal(body.values[0][7], "qualified");
  assert.equal(body.values[0][8], 45_678);
  assert.equal(body.values[0][9], "Call Tuesday");
});
