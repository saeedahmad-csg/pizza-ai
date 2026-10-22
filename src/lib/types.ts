export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'pizza' | 'side' | 'beverage';
  tag?: string;
}

export interface StoreInfo {
  name: string;
  tagline: string;
  items: MenuItem[];
  deliveryTime: string;
  deliveryFee: string;
  hours: string;
  phone: string;
}

export interface GuardrailItem {
  id: string;
  title: string;
  rule: string;
  badgeLabel: string;
  description: string;
  enforceKeywords: string[];
}

export interface SystemPromptConfig {
  role: string;
  storeInfo: StoreInfo;
  guardrails: GuardrailItem[];
}

export interface GuardrailTrigger {
  type: 'freebie' | 'off_topic' | 'custom';
  label: string;
  ruleViolated: string;
  explanation: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  guardrailTriggered?: GuardrailTrigger;
  isSimulated?: boolean;
}

export interface ChatRequestPayload {
  messages: ChatMessage[];
  systemPromptConfig?: SystemPromptConfig;
  customSystemPrompt?: string;
}

export interface ChatResponsePayload {
  message: ChatMessage;
  systemPromptUsed: string;
  isSimulated: boolean;
  provider: 'gemini' | 'simulator';
}
