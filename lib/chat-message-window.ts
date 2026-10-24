export const MAX_REQUEST_HISTORY_MESSAGES = 16;
export const MAX_REQUEST_HISTORY_CHARS = 12_000;

type WindowMessagePart = {
  type?: unknown;
  text?: unknown;
};

export type WindowMessage = {
  role?: unknown;
  parts?: unknown;
};

function textLength(message: WindowMessage): number {
  if (!Array.isArray(message.parts)) return 0;

  return message.parts.reduce((total, part) => {
    if (!part || typeof part !== "object") return total;
    const { type, text } = part as WindowMessagePart;
    return type === "text" && typeof text === "string" ? total + text.length : total;
  }, 0);
}

/**
 * Keeps the most recent part of a conversation within the server-side limits.
 * The window starts at a user message so the model never receives a dangling
 * assistant reply as its first turn.
 */
export function selectMessagesForRequest<T extends WindowMessage>(
  messages: readonly T[],
  maxMessages = MAX_REQUEST_HISTORY_MESSAGES,
  maxChars = MAX_REQUEST_HISTORY_CHARS,
): T[] {
  if (messages.length === 0) return [];

  const selected: T[] = [];
  let totalChars = 0;

  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (selected.length >= maxMessages) break;

    const message = messages[index];
    const length = textLength(message);
    if (selected.length > 0 && totalChars + length > maxChars) break;

    selected.unshift(message);
    totalChars += length;
  }

  while (selected.length > 0 && selected[0].role !== "user") {
    selected.shift();
  }

  return selected.length > 0 ? selected : messages.slice(-1);
}
