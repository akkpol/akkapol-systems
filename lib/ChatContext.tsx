"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type ChatContextType = {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prev) => !prev);

  return (
    <ChatContext.Provider value={{ open, setOpen, toggle }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatState() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatState must be used within ChatProvider");
  return ctx;
}
