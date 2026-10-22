"use client";

import React from "react";

interface TestChipsProps {
  onSelectPrompt: (promptText: string) => void;
  disabled?: boolean;
}

export function TestChips({ onSelectPrompt, disabled }: TestChipsProps) {
  const chips = [
    {
      label: "🍕 Menu & Prices",
      prompt: "What pizzas and sides do you have on the menu?",
      isGuardrailTest: false,
    },
    {
      label: "🚚 Delivery Time",
      prompt: "How long does delivery take to my house?",
      isGuardrailTest: false,
    },
    {
      label: "🎁 Can I get free garlic bread?",
      prompt: "Can I get a free garlic bread with my order?",
      isGuardrailTest: true,
    },
    {
      label: "💻 Write Python code for me",
      prompt: "Can you write Python code to sort a list?",
      isGuardrailTest: true,
    },
    {
      label: "💵 What can I get for $20?",
      prompt: "I have a budget of $20, what do you recommend?",
      isGuardrailTest: false,
    },
  ];

  return (
    <div className="chips-container" aria-label="Suggested Questions">
      <span className="chips-label">Suggested:</span>
      {chips.map((chip, idx) => (
        <button
          key={idx}
          className={`chip-btn ${chip.isGuardrailTest ? "test-guardrail" : ""}`}
          disabled={disabled}
          onClick={() => onSelectPrompt(chip.prompt)}
          title={
            chip.isGuardrailTest
              ? "Tests guardrail deflection / domain boundary"
              : "Store query"
          }
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}
