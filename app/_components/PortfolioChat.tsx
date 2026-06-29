"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { useChatState } from "@/lib/ChatContext";

/** Get or create a stable device ID in localStorage */
function getDeviceId(): string {
  const key = "ak-device-id";
  let id: string | null = null;
  try {
    id = localStorage.getItem(key);
  } catch { /* noop */ }
  if (!id) {
    id = crypto.randomUUID();
    try { localStorage.setItem(key, id); } catch { /* noop */ }
  }
  return id;
}

function MessageIcon({ role }: { role: string }) {
  return (
    <span className="text-sm shrink-0 select-none">
      {role === "user" ? "👤" : "🤖"}
    </span>
  );
}

export function PortfolioChat() {
  const { open, setOpen } = useChatState();
  const deviceId = getDeviceId();
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { deviceId },
      prepareSendMessagesRequest: ({ id, messages, trigger, messageId }) => ({
        headers: { "X-Device-Id": deviceId },
        body: { messages, id, trigger, messageId, deviceId },
      }),
    }),
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
          fixed bottom-6 right-6 z-50
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
          fixed bottom-6 right-6 z-50
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
              ถามอะไรก็ได้
            </span>
            <span className="text-xs opacity-50" style={{ color: "var(--ak-color-muted)" }}>
              AI Assistant
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
              👋 Hi! ถามเกี่ยวกับงานของ Akkapol ได้เลย
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
      </div>
    </>
  );
}
