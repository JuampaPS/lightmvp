"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function BunkerChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: "assistant",
        content: "Hey! I'm Bunker — your guide to immersive light & sound. Ask me about our services, how to get a quote, or what we can bring to your event.",
      }]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Only auto-focus on desktop to avoid forcing keyboard open on mobile
    if (isOpen && window.innerWidth >= 640) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || isLoading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Error");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let assistantText = "";
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: assistantText };
          return updated;
        });
      }
    } catch (err) {
      const detail = err instanceof Error ? err.message : "Unknown error";
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `Error: ${detail}`,
      }]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  return (
    <>
      {/* Chat window */}
      {isOpen && (
        <div
          className="fixed inset-0 sm:inset-auto sm:bottom-20 sm:right-6 z-50 w-full sm:w-[380px] flex flex-col rounded-none sm:rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: "#0a0a0a",
            border: "1px solid rgba(0,212,255,0.2)",
            boxShadow: "0 0 40px rgba(0,212,255,0.08), 0 20px 40px rgba(0,0,0,0.6)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{
              background: "#0d0d0d",
              borderBottom: "1px solid rgba(0,212,255,0.15)",
              paddingTop: "max(12px, env(safe-area-inset-top))",
            }}
          >
            <div className="flex items-center gap-3">
              {/* Logo mark */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.3)" }}
              >
                {/* Light bolt icon */}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 1L3 8h4l-1 5 6-7H8L8 1z" fill="#00D4FF" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-sm leading-none" style={{ color: "#ffffff" }}>
                  Bunker
                </p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(0,212,255,0.6)" }}>
                  Bunker Productions
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 transition-colors"
              style={{ color: "rgba(255,255,255,0.3)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M12.707 4.707a1 1 0 00-1.414-1.414L8 6.586 4.707 3.293a1 1 0 00-1.414 1.414L6.586 8l-3.293 3.293a1 1 0 001.414 1.414L8 9.414l3.293 3.293a1 1 0 001.414-1.414L9.414 8l3.293-3.293z" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div
            className="overflow-y-auto overscroll-contain p-4 space-y-3 flex-1 sm:h-80 sm:flex-none"
            style={{ background: "#080808" }}
          >
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-relaxed"
                  style={
                    msg.role === "user"
                      ? { background: "#00D4FF", color: "#000000", borderBottomRightRadius: "4px" }
                      : {
                          background: "#141414",
                          color: "rgba(255,255,255,0.85)",
                          border: "1px solid rgba(0,212,255,0.12)",
                          borderBottomLeftRadius: "4px",
                        }
                  }
                >
                  {msg.content || (
                    <span className="inline-flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0ms]" style={{ background: "#00D4FF", opacity: 0.6 }} />
                      <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:150ms]" style={{ background: "#00D4FF", opacity: 0.6 }} />
                      <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:300ms]" style={{ background: "#00D4FF", opacity: 0.6 }} />
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            className="flex items-center gap-2 p-3 flex-shrink-0"
            style={{
              background: "#0d0d0d",
              borderTop: "1px solid rgba(0,212,255,0.1)",
              paddingBottom: "max(12px, env(safe-area-inset-bottom))",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              disabled={isLoading}
              className="flex-1 text-sm px-3 py-2 rounded-xl focus:outline-none disabled:opacity-50"
              style={{
                background: "#141414",
                border: "1px solid rgba(0,212,255,0.15)",
                color: "#ffffff",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(0,212,255,0.4)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(0,212,255,0.15)")}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: "#00D4FF", color: "#000000" }}
              aria-label="Send"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1.5 7L12.5 7M12.5 7L8.5 3M12.5 7L8.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating button — hidden when chat is open */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:right-6 z-50 h-12 px-4 rounded-full text-sm font-semibold flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: "#00D4FF",
            color: "#000000",
            boxShadow: "0 0 20px rgba(0,212,255,0.4)",
          }}
          aria-label="Open chat"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          <span>Ask us</span>
        </button>
      )}
    </>
  );
}
