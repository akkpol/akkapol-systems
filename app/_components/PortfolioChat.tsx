"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { useChatState } from "@/lib/ChatContext";

const DEVICE_ID_KEY = "ak-device-id";
const CHAT_SESSION_ID_KEY = "ak-chat-session-id";
const CHAT_SESSION_TOKEN_KEY = "ak-chat-session-token";

/** Get or create a stable device ID in localStorage */
function getDeviceId(): string {
  if (typeof window === "undefined") return "server-render";

  let id: string | null = null;
  try {
    id = localStorage.getItem(DEVICE_ID_KEY);
  } catch { /* noop */ }
  if (!id) {
    id = crypto.randomUUID();
    try { localStorage.setItem(DEVICE_ID_KEY, id); } catch { /* noop */ }
  }
  return id;
}

function getChatSession(): { sessionId?: string; sessionToken?: string } {
  if (typeof window === "undefined") return {};

  try {
    return {
      sessionId: localStorage.getItem(CHAT_SESSION_ID_KEY) ?? undefined,
      sessionToken: localStorage.getItem(CHAT_SESSION_TOKEN_KEY) ?? undefined,
    };
  } catch {
    return {};
  }
}

const chatFetch: typeof fetch = async (input, init) => {
  const response = await fetch(input, init);
  const sessionId = response.headers.get("x-chat-session-id");
  const sessionToken = response.headers.get("x-chat-session-token");

  if (sessionId && sessionToken) {
    try {
      localStorage.setItem(CHAT_SESSION_ID_KEY, sessionId);
      localStorage.setItem(CHAT_SESSION_TOKEN_KEY, sessionToken);
    } catch { /* noop */ }
  }

  return response;
};

function MessageIcon({ role }: { role: string }) {
  return (
    <span className="text-sm shrink-0 select-none">
      {role === "user" ? "👤" : "🤖"}
    </span>
  );
}

export function PortfolioChat() {
  const { open, setOpen } = useChatState();
  const transport = useMemo(() => new DefaultChatTransport({
    api: "/api/chat",
    fetch: chatFetch,
    prepareSendMessagesRequest: ({ id, messages, trigger, messageId }) => ({
      body: {
        messages,
        id,
        trigger,
        messageId,
        deviceId: getDeviceId(),
        ...getChatSession(),
      },
    }),
  }), []);
  const {
    clearError,
    error,
    messages,
    regenerate,
    sendMessage,
    status,
  } = useChat({
    transport,
  });
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    clearError();
    sendMessage({ text });
    setInput("");
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open chat"
        className={`
          fixed bottom-6 right-6 z-50 print:hidden
          w-14 h-14 rounded-full
          flex items-center justify-center
          transition-all duration-300
          shadow-lg hover:shadow-xl
          border
          ${open ? "scale-0 opacity-0" : "scale-100 opacity-100"}
        `}
        style={{
          background: "var(--ak-color-bg-elevated)",
          borderColor: "var(--ak-color-accent)",
          color: "var(--ak-color-fg)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px var(--ak-color-accent)",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M8 9h8M8 13h6" />
        </svg>
      </button>

      {/* Chat panel */}
      <div
        className={`
          fixed bottom-6 right-6 z-50 print:hidden
          w-[22rem] max-w-[calc(100vw-3rem)]
          h-[32rem] max-h-[calc(100vh-6rem)]
          rounded-lg
          flex flex-col
          border
          transition-all duration-300
          origin-bottom-right
          ${open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}
        `}
        style={{
          background: "var(--ak-color-bg)",
          borderColor: "var(--ak-border-subtle)",
          boxShadow: "var(--ak-shadow-panel)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 shrink-0 rounded-t-lg"
          style={{ background: "var(--ak-surface-panel)" }}
        >
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background:
                  status === "streaming"
                    ? "var(--ak-color-accent)"
                    : "var(--ak-color-muted)",
              }}
            />
            <span className="text-sm font-medium" style={{ color: "var(--ak-color-fg)" }}>
              💫 Lyra
            </span>
            <span className="text-xs opacity-50" style={{ color: "var(--ak-color-muted)" }}>
              AI Assistant · DeepSeek
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-lg opacity-60 hover:opacity-100 transition-opacity px-1"
            aria-label="Close"
            style={{ color: "var(--ak-color-fg)" }}
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm">
          {messages.length === 0 && (
            <div
              className="text-center py-8 text-sm"
              style={{ color: "var(--ak-color-muted)" }}
            >
              💫 สวัสดีค่ะ! ฉันคือ Lyra — ผู้ช่วย AI ของ Akkapol
              ถามเรื่องบริการ เว็บไซต์ธุรกิจ Workflow MVP หรือการติดต่อได้เลย
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${message.role === "user" ? "justify-end" : ""}`}
            >
              {message.role !== "user" && <MessageIcon role="assistant" />}
              <div
                className={`
                  px-3 py-2 rounded-lg max-w-[85%] leading-relaxed
                  ${message.role === "user"
                    ? "rounded-br-sm"
                    : "rounded-bl-sm"
                  }
                `}
                style={{
                  background:
                    message.role === "user"
                      ? "var(--ak-color-accent)"
                      : "var(--ak-surface-panel)",
                  color:
                    message.role === "user"
                      ? "var(--ak-color-ink)"
                      : "var(--ak-color-fg)",
                }}
              >
                {message.parts.map((part, i) =>
                  part.type === "text" ? (
                    <span key={i}>{part.text}</span>
                  ) : null
                )}
              </div>
              {message.role === "user" && <MessageIcon role="user" />}
            </div>
          ))}
          {error && (
            <div
              role="alert"
              className="rounded-lg border px-3 py-3 text-xs leading-relaxed"
              style={{
                borderColor: "color-mix(in srgb, var(--ak-color-accent) 45%, transparent)",
                background: "var(--ak-surface-panel)",
                color: "var(--ak-color-fg)",
              }}
            >
              <p>Lyra ใช้งานไม่ได้ชั่วคราว กรุณาลองอีกครั้ง หรือติดต่อ Akkapol ทางอีเมล</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    clearError();
                    void regenerate();
                  }}
                  className="rounded-md border px-2.5 py-1.5 font-medium"
                  style={{ borderColor: "var(--ak-border-subtle)" }}
                >
                  ลองอีกครั้ง
                </button>
                <a
                  href="mailto:akkapol.kumpapug@gmail.com"
                  className="rounded-md px-2.5 py-1.5 font-medium underline"
                  style={{ color: "var(--ak-color-accent)" }}
                >
                  ส่งอีเมล
                </a>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="p-3 shrink-0 border-t"
          style={{ borderColor: "var(--ak-border-subtle)" }}
        >
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="พิมพ์คำถาม..."
              maxLength={2000}
              disabled={status === "streaming"}
              className="
                flex-1 px-3 py-2 text-sm rounded-md
                outline-none border
                disabled:opacity-50
              "
              style={{
                background: "var(--ak-surface-panel)",
                borderColor: "var(--ak-border-subtle)",
                color: "var(--ak-color-fg)",
                fontFamily: "inherit",
              }}
            />
            <button
              type="submit"
              disabled={status === "streaming" || !input.trim()}
              className="
                px-3 py-2 rounded-md text-sm font-medium
                transition-all duration-150
                disabled:opacity-40 disabled:cursor-not-allowed
              "
              style={{
                background: "var(--ak-color-accent)",
                color: "var(--ak-color-ink)",
              }}
            >
              ▸
            </button>
          </div>
        </form>
        <p
          className="px-3 pb-2 text-[10px] leading-relaxed"
          style={{ color: "var(--ak-color-muted)" }}
        >
          ข้อความของคุณจะถูกบันทึกเพื่อให้ Akkapol ติดตามกลับ{` `}
          <a
            href="/privacy"
            target="_blank"
            rel="noreferrer"
            className="underline hover:opacity-80"
            style={{ color: "var(--ak-color-accent)" }}
          >
            นโยบายความเป็นส่วนตัว
          </a>
        </p>
      </div>
    </>
  );
}

