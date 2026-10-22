"use client";

import React, { useState } from "react";
import { SystemPromptConfig } from "@/lib/types";
import { compileSystemPrompt } from "@/lib/defaultPrompt";

interface SystemPromptInspectorProps {
  config: SystemPromptConfig;
  onChangeConfig: (newConfig: SystemPromptConfig) => void;
  onResetDefault: () => void;
  customPromptOverride: string;
  setCustomPromptOverride: (val: string) => void;
  isCustomOverrideActive: boolean;
  setIsCustomOverrideActive: (val: boolean) => void;
}

export function SystemPromptInspector({
  config,
  onChangeConfig,
  onResetDefault,
  customPromptOverride,
  setCustomPromptOverride,
  isCustomOverrideActive,
  setIsCustomOverrideActive,
}: SystemPromptInspectorProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "menu" | "guardrails" | "raw">("overview");
  const [copied, setCopied] = useState(false);

  const compiledPrompt = isCustomOverrideActive
    ? customPromptOverride
    : compileSystemPrompt(config);

  const handlePriceChange = (itemId: string, newPrice: number) => {
    const updatedItems = config.storeInfo.items.map((item) =>
      item.id === itemId ? { ...item, price: newPrice } : item
    );
    onChangeConfig({
      ...config,
      storeInfo: {
        ...config.storeInfo,
        items: updatedItems,
      },
    });
  };

  const handleRoleChange = (newRole: string) => {
    onChangeConfig({
      ...config,
      role: newRole,
    });
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(compiledPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="system-prompt-panel" aria-label="System Prompt Inspector">
      <div className="panel-header">
        <div className="panel-title">
          <span>⚙️</span> System Prompt Anatomy
        </div>
        <div className="panel-actions">
          <button
            className="btn-icon"
            onClick={onResetDefault}
            title="Reset system prompt to default"
          >
            ↺ Reset
          </button>
        </div>
      </div>

      <div className="panel-tabs">
        <button
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          🎭 Persona
        </button>
        <button
          className={`tab-btn ${activeTab === "menu" ? "active" : ""}`}
          onClick={() => setActiveTab("menu")}
        >
          🍕 Menu & Info
        </button>
        <button
          className={`tab-btn ${activeTab === "guardrails" ? "active" : ""}`}
          onClick={() => setActiveTab("guardrails")}
        >
          🛡️ Guardrails
        </button>
        <button
          className={`tab-btn ${activeTab === "raw" ? "active" : ""}`}
          onClick={() => setActiveTab("raw")}
        >
          📜 Raw Prompt
        </button>
      </div>

      <div className="panel-body">
        {/* TAB 1: OVERVIEW & PERSONA */}
        {activeTab === "overview" && (
          <>
            <div className="inspector-card">
              <div className="card-label">
                <span>Core Instruction</span>
                <span>Role & Tone</span>
              </div>
              <h4 className="card-title">Assistant Persona</h4>
              <p className="card-desc" style={{ marginBottom: "12px" }}>
                The persona defines how the AI greets customers, expresses enthusiasm, and handles ordering tone.
              </p>
              <textarea
                value={config.role}
                onChange={(e) => handleRoleChange(e.target.value)}
                rows={4}
                style={{
                  width: "100%",
                  background: "var(--bg-input)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-medium)",
                  borderRadius: "8px",
                  padding: "10px",
                  fontSize: "0.82rem",
                  fontFamily: "var(--font-main)",
                  lineHeight: "1.5",
                  outline: "none",
                  resize: "vertical",
                }}
              />
            </div>

            <div className="inspector-card">
              <div className="card-label">
                <span>Live Status</span>
                <span style={{ color: "#2a9d8f" }}>Active</span>
              </div>
              <h4 className="card-title">Prompt Dimensions</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "10px" }}>
                <div style={{ background: "rgba(0,0,0,0.3)", padding: "10px", borderRadius: "8px" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>MENU ITEMS</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--accent-gold)" }}>
                    {config.storeInfo.items.length} items
                  </div>
                </div>
                <div style={{ background: "rgba(0,0,0,0.3)", padding: "10px", borderRadius: "8px" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>GUARDRAILS</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#ff8591" }}>
                    {config.guardrails.length} enforced
                  </div>
                </div>
              </div>
            </div>

            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
              💡 <strong>Tip:</strong> Any changes made to Persona, Menu, or Guardrails immediately recompile into the System Prompt sent to the AI backend.
            </div>
          </>
        )}

        {/* TAB 2: STORE INFO & MENU */}
        {activeTab === "menu" && (
          <>
            <div className="inspector-card">
              <div className="card-label">
                <span>Store Specifications</span>
                <span>Cheesy Crust</span>
              </div>
              <h4 className="card-title">Operating Information</h4>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
                <div><strong>Hours:</strong> {config.storeInfo.hours}</div>
                <div><strong>Delivery SLA:</strong> {config.storeInfo.deliveryTime}</div>
                <div><strong>Delivery Fee:</strong> {config.storeInfo.deliveryFee}</div>
              </div>
            </div>

            <div className="inspector-card">
              <div className="card-label">
                <span>Interactive Menu</span>
                <span>Editable Prices</span>
              </div>
              <h4 className="card-title">Official Offerings</h4>
              <p className="card-desc" style={{ marginBottom: "12px" }}>
                Edit item prices below to see how changing store data updates the AI assistant&apos;s answers in real time!
              </p>

              {config.storeInfo.items.map((item) => (
                <div key={item.id} className="menu-item-row">
                  <div>
                    <div className="menu-item-name">
                      {item.name} {item.tag && <span style={{ fontSize: "0.68rem", color: "var(--accent-gold)", fontWeight: "normal" }}>({item.tag})</span>}
                    </div>
                    <div className="menu-item-meta">{item.description.slice(0, 42)}...</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ fontSize: "0.85rem", color: "var(--accent-gold)" }}>$</span>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      className="menu-item-price-input"
                      value={item.price}
                      onChange={(e) =>
                        handlePriceChange(item.id, parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* TAB 3: GUARDRAILS */}
        {activeTab === "guardrails" && (
          <>
            <div className="inspector-card">
              <div className="card-label">
                <span>Safety & Policy</span>
                <span>Mandatory</span>
              </div>
              <h4 className="card-title">Enforced Business Rules</h4>
              <p className="card-desc">
                These guardrails override customer requests and instruct the model to politely deflect prohibited requests.
              </p>

              {config.guardrails.map((g) => (
                <div
                  key={g.id}
                  className={`guardrail-card ${g.id === "domain-only" ? "scope" : ""}`}
                >
                  <div className="guardrail-card-title">
                    <span>🛡️</span> {g.title}
                  </div>
                  <div className="guardrail-card-rule">{g.rule}</div>
                  <div style={{ marginTop: "6px", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                    <strong>Trigger keywords:</strong> {g.enforceKeywords.slice(0, 5).join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* TAB 4: RAW PROMPT INSPECTOR */}
        {activeTab === "raw" && (
          <>
            <div className="inspector-card">
              <div className="card-label">
                <span>Compilation Output</span>
                <button
                  className="btn-icon"
                  style={{ fontSize: "0.7rem" }}
                  onClick={handleCopyPrompt}
                >
                  {copied ? "✓ Copied" : "📋 Copy"}
                </button>
              </div>
              <h4 className="card-title">Exact AI System Instruction</h4>
              <p className="card-desc" style={{ marginBottom: "12px" }}>
                This is the complete text passed to <code>systemInstruction</code> in the model request.
              </p>

              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.78rem", cursor: "pointer", color: "var(--text-secondary)" }}>
                  <input
                    type="checkbox"
                    checked={isCustomOverrideActive}
                    onChange={(e) => {
                      if (e.target.checked && !customPromptOverride) {
                        setCustomPromptOverride(compiledPrompt);
                      }
                      setIsCustomOverrideActive(e.target.checked);
                    }}
                  />
                  <span>Enable Custom Raw Override</span>
                </label>
              </div>

              {isCustomOverrideActive ? (
                <textarea
                  value={customPromptOverride}
                  onChange={(e) => setCustomPromptOverride(e.target.value)}
                  rows={14}
                  className="raw-code-box"
                  style={{ width: "100%", resize: "vertical" }}
                />
              ) : (
                <pre className="raw-code-box">{compiledPrompt}</pre>
              )}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
