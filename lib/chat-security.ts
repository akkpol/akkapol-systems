import { createHash } from "node:crypto";

import type { UIMessage } from "ai";

export const MAX_REQUEST_BYTES = 64 * 1024;
export const MAX_MESSAGE_COUNT = 20;
export const MAX_MESSAGE_CHARS = 2_000;
export const MAX_TOTAL_CHARS = 12_000;

const SESSION_ID_RE = /^[A-Za-z0-9_-]{1,80}$/;
const DEVICE_ID_RE = /^[A-Za-z0-9_-]{8,128}$/;
const ALLOWED_ROLES = new Set(["user", "assistant", "system"]);

type ValidationSuccess = {
  ok: true;
  value: {
    messages: UIMessage[];
    sessionId?: string;
    deviceId?: string;
  };
};

type ValidationFailure = {
  ok: false;
  status: number;
  error: string;
};

export type ChatPayloadValidationResult = ValidationSuccess | ValidationFailure;

function normalizeId(value: unknown, pattern: RegExp): string | undefined {
  return typeof value === "string" && pattern.test(value) ? value : undefined;
}

function getTextParts(message: UIMessage): string[] {
  if (!Array.isArray(message.parts)) {
    return [];
  }

  return message.parts.flatMap((part) => {
    if (part?.type !== "text" || typeof part.text !== "string") {
      return [];
    }

    return [part.text];
  });
}

export function normalizeSessionId(value: unknown): string | undefined {
  return normalizeId(value, SESSION_ID_RE);
}

export function normalizeDeviceId(value: unknown): string | undefined {
  return normalizeId(value, DEVICE_ID_RE);
}

export function validateChatPayload(body: unknown): ChatPayloadValidationResult {
  if (!body || typeof body !== "object") {
    return {
      ok: false,
      status: 400,
      error: "Invalid chat payload.",
    };
  }

  const { messages, id, deviceId } = body as {
    messages?: unknown;
    id?: unknown;
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

  for (const message of messages) {
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

    const textParts = getTextParts(typedMessage);

    if (textParts.length === 0) {
      return {
        ok: false,
        status: 400,
        error: "Chat messages must include text content.",
      };
    }

    for (const text of textParts) {
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
    }
  }

  return {
    ok: true,
    value: {
      messages: messages as UIMessage[],
      sessionId: normalizeSessionId(id),
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
    return (
      origin.host === hostHeader ||
      origin.hostname === "localhost" ||
      origin.hostname === "127.0.0.1"
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
  const userAgent = headers.get("user-agent")?.trim() || "unknown";

  const fingerprint = forwardedFor || realIp
    ? `ip:${forwardedFor ?? realIp}|ua:${userAgent}`
    : fallbackDeviceId
      ? `device:${fallbackDeviceId}|ua:${userAgent}`
      : `anon:${userAgent}`;

  return createHash("sha256").update(fingerprint).digest("hex");
}
