"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/lib/types";

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onClearChat: () => void;
  onOpenInspector: () => void;
  provider: "gemini" | "simulator";
}

export function ChatWindow({
  messages,
  onSendMessage,
  isLoading,
  onClearChat,
  provider,
}: ChatWindowProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    onSendMessage(inputValue.trim());
    setInputValue("");
  };

  return (
    <section className="chat-panel" aria-label="Customer Chat Window">
      {/* Chat Sub-Header */}
      <div
        style={{
          padding: "12px 24px",
          background: "rgba(13, 16, 24, 0.7)",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="pulse-dot" />
          <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#f8fafc" }}>
            Cheesy Crust Order Assistant
          </span>
          <span
            style={{
              fontSize: "0.7rem",
              padding: "2px 8px",
              borderRadius: "12px",
              background:
                provider === "gemini"
                  ? "rgba(42, 157, 143, 0.2)"
                  : "rgba(255, 183, 3, 0.15)",
              color: provider === "gemini" ? "#5eead4" : "#ffd166",
              border:
                provider === "gemini"
                  ? "1px solid rgba(42, 157, 143, 0.4)"
                  : "1px solid rgba(255, 183, 3, 0.4)",
              fontWeight: "600",
            }}
          >
            {provider === "gemini" ? "✨ Gemini 2.5 AI" : "⚡ Ready"}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            className="btn-icon"
            style={{ fontSize: "0.75rem", padding: "5px 10px" }}
            onClick={onClearChat}
            title="Clear chat history"
          >
            🗑️ Clear Chat
          </button>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="chat-thread-container">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-wrapper ${msg.role === "user" ? "user" : "assistant"}`}
          >
            <div className="message-avatar">
              {msg.role === "user" ? "👤" : "🍕"}
            </div>

            <div className="message-content-box">
              {/* Subtle guardrail policy pill */}
              {msg.guardrailTriggered && (
                <div
                  className={`guardrail-trigger-badge ${msg.guardrailTriggered.type}`}
                  style={{ marginBottom: "6px", fontSize: "0.72rem" }}
                  title={msg.guardrailTriggered.explanation}
                >
                  <span>🛡️</span>
                  <span>Policy Enforced: {msg.guardrailTriggered.label}</span>
                </div>
              )}

              <div className="message-bubble">
                {msg.content.replace(/\*\*/g, "")}
              </div>

              <div className="message-meta">
                <span>{msg.role === "user" ? "You" : "Cheesy Crust Assistant"}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message-wrapper assistant">
            <div className="message-avatar">🍕</div>
            <div className="typing-indicator" aria-label="Assistant is thinking">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="chat-input-bar">
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            className="chat-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about our pizza menu, prices, delivery time, or order..."
            disabled={isLoading}
            autoFocus
          />
          <button
            type="submit"
            className="btn-send"
            disabled={!inputValue.trim() || isLoading}
          >
            <span>Send</span>
            <span>➤</span>
          </button>
        </form>
      </div>
    </section>
  );
}
