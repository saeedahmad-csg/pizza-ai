"use client";

import React, { useState } from "react";
import { ChatMessage, ChatResponsePayload, SystemPromptConfig } from "@/lib/types";
import { DEFAULT_SYSTEM_PROMPT_CONFIG } from "@/lib/defaultPrompt";
import { ChatWindow } from "@/components/ChatWindow";
import { TestChips } from "@/components/TestChips";

export default function Home() {
  const [config] = useState<SystemPromptConfig>(DEFAULT_SYSTEM_PROMPT_CONFIG);
  const [provider, setProvider] = useState<"gemini" | "simulator">("simulator");
  const [isLoading, setIsLoading] = useState(false);

  const initialGreeting: ChatMessage = {
    id: "welcome-1",
    role: "assistant",
    content:
      "Hey there! 🍕 Welcome to Cheesy Crust Pizza! I'm your cheerful order assistant. How can I help you today? Ask me about our menu, prices, or delivery time!",
    timestamp: "Just now",
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          systemPromptConfig: config,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data: ChatResponsePayload = await res.json();
      setMessages([...newMessages, data.message]);
      setProvider(data.provider);
    } catch (err) {
      console.error("Chat communication error:", err);
      const fallbackReply: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content:
          "Oops! Our ovens are running hot and we had a momentary glitch. Please try asking again!",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...newMessages, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content:
          "Chat reset! 🍕 What can I get started for you from the Cheesy Crust Pizza menu today?",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  return (
    <div className="app-container">
      {/* Top Application Header */}
      <header className="app-header">
        <div className="brand-wrapper">
          <div className="brand-logo" aria-hidden="true">
            🍕
          </div>
          <div className="brand-info">
            <h1>Cheesy Crust Pizza</h1>
            <p>
              Hot & Fresh Pizza Assistant <span className="brand-badge">Online</span>
            </p>
          </div>
        </div>

        <div className="header-actions">
          <div className="badge-mode" style={{ color: "var(--accent-gold)" }}>
            <span>🛵</span>
            <span>Delivery: 30–45 Mins</span>
          </div>
          <div className="badge-mode" style={{ color: "#94a3b8" }}>
            <span>⏰</span>
            <span>11 AM – 11 PM</span>
          </div>
        </div>
      </header>

      {/* Main Customer Chat Container */}
      <main className="main-chat-container">
        <div className="chat-card">
          <TestChips
            onSelectPrompt={handleSendMessage}
            disabled={isLoading}
          />

          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onClearChat={handleClearChat}
            onOpenInspector={() => {}}
            provider={provider}
          />
        </div>
      </main>
    </div>
  );
}
