import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import {
  ChatMessage,
  ChatRequestPayload,
  ChatResponsePayload,
  SystemPromptConfig,
} from "@/lib/types";
import {
  DEFAULT_SYSTEM_PROMPT_CONFIG,
  compileSystemPrompt,
} from "@/lib/defaultPrompt";
import {
  evaluateGuardrails,
  generateSimulatedResponse,
} from "@/lib/simulator";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequestPayload;
    const { messages, systemPromptConfig, customSystemPrompt } = body;

    const activeConfig: SystemPromptConfig =
      systemPromptConfig || DEFAULT_SYSTEM_PROMPT_CONFIG;
    const systemPromptText =
      customSystemPrompt && customSystemPrompt.trim().length > 0
        ? customSystemPrompt
        : compileSystemPrompt(activeConfig);

    const lastUserMessage = [...(messages || [])]
      .reverse()
      .find((m) => m.role === "user");

    const apiKey = process.env.GEMINI_API_KEY;

    // Check if any guardrail was triggered by the user input
    const guardrail = lastUserMessage
      ? evaluateGuardrails(lastUserMessage.content, activeConfig)
      : null;

    // If an API key is available, use real Google Gemini AI
    if (apiKey && apiKey.trim().length > 0) {
      try {
        const ai = new GoogleGenAI({ apiKey });

        // Map messages to Gemini contents format
        // Filter out system messages from thread
        const geminiContents = (messages || [])
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m) => ({
            role: m.role === "assistant" ? ("model" as const) : ("user" as const),
            parts: [{ text: m.content }],
          }));

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: geminiContents,
          config: {
            systemInstruction: systemPromptText,
            temperature: 0.7,
          },
        });

        const replyText = (
          response.text ||
          "I'm here to help with your Cheesy Crust Pizza order! What can I get for you?"
        ).replace(/\*\*/g, "");

        const replyMessage: ChatMessage = {
          id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          role: "assistant",
          content: replyText,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          guardrailTriggered: guardrail || undefined,
          isSimulated: false,
        };

        const payload: ChatResponsePayload = {
          message: replyMessage,
          systemPromptUsed: systemPromptText,
          isSimulated: false,
          provider: "gemini",
        };

        return NextResponse.json(payload);
      } catch (geminiError) {
        console.warn(
          "Gemini API invocation failed or key rate-limited. Falling back seamlessly to pizza simulator engine:",
          geminiError
        );
        // Fallback to local simulator below
      }
    }

    // Zero-config fallback simulator engine
    const simResult = generateSimulatedResponse(messages || [], activeConfig);

    const replyMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      role: "assistant",
      content: simResult.content.replace(/\*\*/g, ""),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      guardrailTriggered: simResult.guardrailTriggered || guardrail || undefined,
      isSimulated: true,
    };

    const payload: ChatResponsePayload = {
      message: replyMessage,
      systemPromptUsed: systemPromptText,
      isSimulated: true,
      provider: "simulator",
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Error processing chat message:", error);
    return NextResponse.json(
      { error: "Failed to process chat response" },
      { status: 500 }
    );
  }
}
