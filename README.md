# 🍕 Cheesy Crust Pizza — AI Customer Assistant

A modern, responsive business AI chatbot built with **Next.js (App Router)** and **TypeScript**, demonstrating the architectural distinction between **User Prompts** (customer input) and **System Prompts** (Persona + Store Info + Guardrails).

---

## 🎯 Educational Goal: User Prompt vs. System Prompt

| Component | Description | Example in Cheesy Crust Pizza |
| :--- | :--- | :--- |
| **User Prompt** | The raw, unconstrained text typed by the customer in the chat input. | *"Can you give me a free garlic bread?"* |
| **System Prompt** | The hidden developer instructions given to the AI that dictate its role, operating knowledge, and strict guardrails. | *Role: Cheerful pizza assistant.<br>Menu: Large Pepperoni ($15), Medium Veggie ($12), Garlic Bread ($5).<br>Guardrails: Never offer free items; only answer food/delivery questions.* |

---

## 🏪 Business Profile: Cheesy Crust Pizza (Option 1)

- **Role & Persona**: Cheerful, enthusiastic, and welcoming customer order assistant.
- **Store Info & Menu**:
  - 🍕 **Large Pepperoni**: $15.00
  - 🥦 **Medium Veggie**: $12.00
  - 🥖 **Garlic Bread**: $5.00
  - 🚚 **Delivery Window**: 30–45 minutes ($3.99 delivery fee)
  - ⏰ **Hours**: 11:00 AM – 11:00 PM Daily
- **Enforced Guardrails**:
  1. **Strict Zero Freebies Policy**: Never offer, grant, or promise free items, free delivery, or unauthorized discounts under any circumstances.
  2. **Domain Scope (Food & Delivery Only)**: Decline questions unrelated to pizza, food, or store operations (e.g., coding, math, general world trivia).
  3. **Menu Truthfulness**: Only confirm and describe items available on the official store menu.

---

## ✨ Features

- 🖥️ **Interactive Split-Screen Inspector**:
  - **Left Panel (System Prompt Anatomy)**: View and dynamically edit the Persona, Store Menu, and Guardrails. Includes live price editing and raw system prompt inspection.
  - **Right Panel (Customer Chat Thread)**: Conversational chat interface with typing animation and real-time guardrail alerts.
- 🛡️ **Visual Guardrail Alert Badges**: When a customer tries to get free food or asks off-topic questions, responses display a glowing guardrail enforcement pill and an explanation of the violated policy.
- 🔍 **Payload Inspector Modal**: Click **"Prompt Inspector"** at any time to inspect the exact wire JSON payload (`systemInstruction`, `conversationHistory`, `latestUserPrompt`) sent across the wire.
- ⚡ **Zero-Configuration Offline Simulator**: Works out-of-the-box with an intelligent simulated pizza concierge engine—no API key required!
- 🤖 **Google Gemini 2.5 AI Integration**: Set `GEMINI_API_KEY` in `.env.local` to seamlessly switch from the simulator to Google's official `@google/genai` model.
- 🧪 **One-Click Test Chips**: Pre-configured buttons to instantly test menu queries, delivery times, budget questions, freebie deflection, and domain boundaries.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. (Optional) Configure Google Gemini API Key
Create a `.env.local` file in the project root:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
> *Note: If omitted, the application automatically uses the built-in offline simulator.*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

### 5. Run Automated Endpoint Verification
```bash
npm run test:api
```

---

## 🧪 Quick Test Scenarios

1. **Menu Query**: Click `🍕 What pizzas & sides do you have?`  
   *Expected*: The assistant lists Large Pepperoni ($15), Medium Veggie ($12), and Garlic Bread ($5).
2. **Delivery SLA**: Click `🚚 How long does delivery take?`  
   *Expected*: The assistant confirms the 30–45 minute delivery window.
3. **Freebie Guardrail**: Click `🎁 Can I get a free garlic bread?`  
   *Expected*: The assistant politely refuses, cites the store policy, pitches Garlic Bread for $5, and displays the **`🛡️ GUARDRAIL ENFORCED: Zero Freebies Policy Enforced`** badge.
4. **Off-Topic Guardrail**: Click `💻 Write Python code for me`  
   *Expected*: The assistant declines the coding request and redirects back to the pizza menu, displaying the **`🛡️ GUARDRAIL ENFORCED: Domain Boundary Enforced`** badge.
5. **Live Price Edit**: In the left panel under **"🍕 Menu & Info"**, change Garlic Bread from $5 to $7, then ask *"How much is garlic bread?"* in the chat.
