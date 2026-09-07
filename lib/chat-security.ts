import {
  createHash,
  createHmac,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";

import type { UIMessage } from "ai";

export const MAX_REQUEST_BYTES = 64 * 1024;
export const MAX_MESSAGE_COUNT = 20;
export const MAX_MESSAGE_CHARS = 2_000;
export const MAX_TOTAL_CHARS = 12_000;

const SESSION_ID_RE = /^[A-Za-z0-9_-]{1,80}$/;
const SESSION_TOKEN_RE = /^[a-f0-9]{64}$/;
const DEVICE_ID_RE = /^[A-Za-z0-9_-]{8,128}$/;
const ALLOWED_ROLES = new Set(["user", "assistant"]);

type ValidationSuccess = {
  ok: true;
  value: {
    messages: UIMessage[];
    sessionId?: string;
    sessionToken?: string;
    deviceId?: string;
  };
};

type ValidationFailure = {
  ok: false;
  status: number;
  error: string;
};

export type ChatPayloadValidationResult = ValidationSuccess | ValidationFailure;

export type JsonBodyReadResult =
  | { ok: true; value: unknown }
  | { ok: false; status: 400 | 413; error: string };

function normalizeId(value: unknown, pattern: RegExp): string | undefined {
  return typeof value === "string" && pattern.test(value) ? value : undefined;
}

export function normalizeSessionId(value: unknown): string | undefined {
  return normalizeId(value, SESSION_ID_RE);
}

export function normalizeSessionToken(value: unknown): string | undefined {
  return normalizeId(value, SESSION_TOKEN_RE);
}

export function normalizeDeviceId(value: unknown): string | undefined {
  return normalizeId(value, DEVICE_ID_RE);
}

export async function readJsonBodyWithLimit(
  request: Request,
  maxBytes = MAX_REQUEST_BYTES,
): Promise<JsonBodyReadResult> {
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    return { ok: false, status: 413, error: "Chat request is too large." };
  }

  if (!request.body) {
    return { ok: false, status: 400, error: "Invalid JSON request body." };
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel();
        return { ok: false, status: 413, error: "Chat request is too large." };
      }

      chunks.push(value);
    }
  } catch {
    return { ok: false, status: 400, error: "Invalid JSON request body." };
  } finally {
    reader.releaseLock();
  }

  const bodyBytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bodyBytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return { ok: true, value: JSON.parse(new TextDecoder().decode(bodyBytes)) };
  } catch {
    return { ok: false, status: 400, error: "Invalid JSON request body." };
  }
}

export function validateChatPayload(body: unknown): ChatPayloadValidationResult {
  if (!body || typeof body !== "object") {
    return {
      ok: false,
      status: 400,
      error: "Invalid chat payload.",
    };
  }

  const { messages, id, sessionId, sessionToken, deviceId } = body as {
    messages?: unknown;
    id?: unknown;
    sessionId?: unknown;
    sessionToken?: unknown;
    deviceId?: unknown;
  };

  if (!Array.isArray(messages) || messages.length === 0) {
    return {
      ok: false,
      status: 400,
      error: "At least one chat message is required.",
    };
  }

  if (messages.length > MAX_MESSAGE_COUNT) {
    return {
      ok: false,
      status: 413,
      error: `Too many messages. Maximum ${MAX_MESSAGE_COUNT} messages per request.`,
    };
  }

  let totalChars = 0;
  const sanitizedMessages: UIMessage[] = [];

  for (const [messageIndex, message] of messages.entries()) {
    if (!message || typeof message !== "object") {
      return {
        ok: false,
        status: 400,
        error: "Chat messages must be objects.",
      };
    }

    const typedMessage = message as UIMessage;
    if (typeof typedMessage.role !== "string" || !ALLOWED_ROLES.has(typedMessage.role)) {
      return {
        ok: false,
        status: 400,
        error: "Chat messages contain an unsupported role.",
      };
    }

    if (!Array.isArray(typedMessage.parts) || typedMessage.parts.length === 0) {
      return {
        ok: false,
        status: 400,
        error: "Chat messages must include text content.",
      };
    }

    const textParts: Array<{ type: "text"; text: string }> = [];
    for (const part of typedMessage.parts) {
      if (!part || part.type !== "text" || typeof part.text !== "string") {
        return {
          ok: false,
          status: 400,
          error: "Chat messages only support plain text.",
        };
      }

      const text = part.text;
      if (text.length > MAX_MESSAGE_CHARS) {
        return {
          ok: false,
          status: 413,
          error: `A single message exceeded the ${MAX_MESSAGE_CHARS} character limit.`,
        };
      }

      totalChars += text.length;
      if (totalChars > MAX_TOTAL_CHARS) {
        return {
          ok: false,
          status: 413,
          error: `The chat request exceeded the ${MAX_TOTAL_CHARS} character limit.`,
        };
      }

      textParts.push({ type: "text", text });
    }

    sanitizedMessages.push({
      id: typeof typedMessage.id === "string" && typedMessage.id.length <= 128
        ? typedMessage.id
        : `message-${messageIndex}`,
      role: typedMessage.role as "user" | "assistant",
      parts: textParts,
    });
  }

  return {
    ok: true,
    value: {
      messages: sanitizedMessages,
      sessionId: normalizeSessionId(sessionId) ?? normalizeSessionId(id),
      sessionToken: normalizeSessionToken(sessionToken),
      deviceId: normalizeDeviceId(deviceId),
    },
  };
}

export function isAllowedOrigin(originHeader: string | null, hostHeader: string | null): boolean {
  if (!originHeader) {
    return true;
  }

  if (!hostHeader) {
    return false;
  }

  try {
    const origin = new URL(originHeader);
    const requestHost = new URL(`http://${hostHeader}`);
    const isLocalHostname = (hostname: string) =>
      hostname === "localhost" || hostname === "127.0.0.1";

    return (
      origin.host.toLowerCase() === hostHeader.toLowerCase() ||
      (isLocalHostname(origin.hostname) && isLocalHostname(requestHost.hostname))
    );
  } catch {
    return false;
  }
}

function firstForwardedAddress(value: string | null): string | undefined {
  const candidate = value?.split(",")[0]?.trim();
  return candidate || undefined;
}

export function getRateLimitKey(
  headers: Pick<Headers, "get">,
  fallbackDeviceId?: string,
): string {
  const forwardedFor = firstForwardedAddress(headers.get("x-forwarded-for"));
  const realIp = headers.get("x-real-ip")?.trim() || undefined;
  const fingerprint = forwardedFor || realIp
    ? `ip:${forwardedFor ?? realIp}`
    : fallbackDeviceId
      ? `device:${fallbackDeviceId}`
      : "anon:unidentified";

  return createHash("sha256").update(fingerprint).digest("hex");
}

function signSessionId(sessionId: string, secret: string): string {
  return createHmac("sha256", secret).update(sessionId).digest("hex");
}

function tokensMatch(expected: string, received: string): boolean {
  const expectedBytes = Buffer.from(expected, "hex");
  const receivedBytes = Buffer.from(received, "hex");
  return expectedBytes.length === receivedBytes.length
    && timingSafeEqual(expectedBytes, receivedBytes);
}

export function resolveChatSession(
  requestedSessionId: string | undefined,
  requestedToken: string | undefined,
  secret: string | undefined,
): { sessionId: string; sessionToken?: string } {
  if (secret && requestedSessionId && requestedToken) {
    const expectedToken = signSessionId(requestedSessionId, secret);
    if (tokensMatch(expectedToken, requestedToken)) {
      return { sessionId: requestedSessionId, sessionToken: requestedToken };
    }
  }

  const sessionId = randomUUID();
  return {
    sessionId,
    sessionToken: secret ? signSessionId(sessionId, secret) : undefined,
  };
}

