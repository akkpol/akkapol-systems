import { createSign } from "node:crypto";

import {
  buildLeadSheetRow,
  type ChatLead,
  type LeadSheetCell,
} from "./chat-lead.ts";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const GOOGLE_SHEETS_API = "https://sheets.googleapis.com/v4/spreadsheets";

export type LeadSheetWriterConfig = {
  spreadsheetId: string;
  clientEmail: string;
  privateKey: string;
};

type LeadSheetWriterDependencies = {
  fetchImpl?: typeof fetch;
  now?: () => number;
};

type GoogleValuesResponse = {
  values?: LeadSheetCell[][];
};

function base64Url(value: string): string {
  return Buffer.from(value).toString("base64url");
}

async function getAccessToken(
  config: LeadSheetWriterConfig,
  fetchImpl: typeof fetch,
  now: () => number,
): Promise<string> {
  const issuedAt = Math.floor(now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64Url(JSON.stringify({
    iss: config.clientEmail,
    scope: GOOGLE_SHEETS_SCOPE,
    aud: GOOGLE_TOKEN_URL,
    iat: issuedAt,
    exp: issuedAt + 3600,
  }));
  const unsignedToken = `${header}.${payload}`;
  const signature = createSign("RSA-SHA256")
    .update(unsignedToken)
    .end()
    .sign(config.privateKey, "base64url");
  const assertion = `${unsignedToken}.${signature}`;

  const response = await fetchImpl(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!response.ok) {
    throw new Error(`Google authorization failed with status ${response.status}.`);
  }

  const body = await response.json() as { access_token?: unknown };
  if (typeof body.access_token !== "string" || !body.access_token) {
    throw new Error("Google authorization response did not include an access token.");
  }

  return body.access_token;
}

async function googleSheetsRequest(
  fetchImpl: typeof fetch,
  accessToken: string,
  url: string,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("authorization", `Bearer ${accessToken}`);
  if (init.body) {
    headers.set("content-type", "application/json");
  }

  const response = await fetchImpl(url, { ...init, headers });
  if (!response.ok) {
    throw new Error(`Google Sheets request failed with status ${response.status}.`);
  }

  return response;
}

export function createLeadSheetWriter(
  config: LeadSheetWriterConfig,
  dependencies: LeadSheetWriterDependencies = {},
) {
  const fetchImpl = dependencies.fetchImpl ?? fetch;
  const now = dependencies.now ?? Date.now;
  const valuesBase = `${GOOGLE_SHEETS_API}/${encodeURIComponent(config.spreadsheetId)}/values`;

  return {
    async upsert(lead: ChatLead): Promise<{ action: "appended" | "updated"; row: number | null }> {
      const accessToken = await getAccessToken(config, fetchImpl, now);
      const idRange = encodeURIComponent("Leads!L2:L");
      const idResponse = await googleSheetsRequest(
        fetchImpl,
        accessToken,
        `${valuesBase}/${idRange}?majorDimension=ROWS&valueRenderOption=UNFORMATTED_VALUE`,
      );
      const idBody = await idResponse.json() as GoogleValuesResponse;
      const existingIndex = (idBody.values ?? []).findIndex(
        (row) => row[0] === lead.sessionId,
      );
      const updatedAtSerial = now() / 86_400_000 + 25_569;

      if (existingIndex < 0) {
        const row = buildLeadSheetRow(lead, updatedAtSerial);
        const appendRange = encodeURIComponent("Leads!A:M");
        await googleSheetsRequest(
          fetchImpl,
          accessToken,
          `${valuesBase}/${appendRange}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
          {
            method: "POST",
            body: JSON.stringify({ values: [row] }),
          },
        );
        return { action: "appended", row: null };
      }

      const rowNumber = existingIndex + 2;
      const rowRange = encodeURIComponent(`Leads!A${rowNumber}:M${rowNumber}`);
      const existingResponse = await googleSheetsRequest(
        fetchImpl,
        accessToken,
        `${valuesBase}/${rowRange}?majorDimension=ROWS&valueRenderOption=UNFORMATTED_VALUE`,
      );
      const existingBody = await existingResponse.json() as GoogleValuesResponse;
      const row = buildLeadSheetRow(lead, updatedAtSerial, existingBody.values?.[0] ?? []);

      await googleSheetsRequest(
        fetchImpl,
        accessToken,
        `${valuesBase}/${rowRange}?valueInputOption=RAW`,
        {
          method: "PUT",
          body: JSON.stringify({ values: [row] }),
        },
      );

      return { action: "updated", row: rowNumber };
    },
  };
}

export async function saveChatLeadToGoogleSheets(lead: ChatLead) {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!spreadsheetId || !clientEmail || !privateKey) {
    console.log("[chat] Google Sheets not configured — skipping lead:", lead.sessionId);
    return null;
  }

  return createLeadSheetWriter({ spreadsheetId, clientEmail, privateKey }).upsert(lead);
}
