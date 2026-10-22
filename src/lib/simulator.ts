import { ChatMessage, GuardrailTrigger, SystemPromptConfig } from "./types";

/**
 * Checks a user prompt against active guardrails to detect if any rule was triggered.
 */
export function evaluateGuardrails(
  userText: string,
  config: SystemPromptConfig
): GuardrailTrigger | null {
  const lower = userText.toLowerCase().trim();

  // 0. Respectful language check
  const vulgarWords = ["fuck", "bitch", "asshole", "shit", "bastard", "crap", "idiot", "shut up"];
  const hasVulgar = vulgarWords.some((w) => lower.split(/\s+/).includes(w) || lower === w);
  if (hasVulgar) {
    return {
      type: "custom",
      label: "Respectful Language Policy",
      ruleViolated: "Maintain polite, welcoming, and respectful communication.",
      explanation:
        "The customer used inappropriate language. The assistant maintained hospitality and gently redirected to pizza.",
    };
  }

  // 1. Freebie check
  const freebieKeywords = [
    "free",
    "gratis",
    "complimentary",
    "on the house",
    "no charge",
    "without paying",
    "discount",
    "promo code",
    "coupon",
    "give it to me for nothing",
    "can i have free",
    "can i get free",
    "free bread",
    "free pizza",
  ];
  const hasFreebie = freebieKeywords.some((kw) => lower.includes(kw));
  if (hasFreebie) {
    return {
      type: "freebie",
      label: "Zero Freebies Policy Enforced",
      ruleViolated: "Never offer or promise free items or unauthorized discounts.",
      explanation:
        "The customer attempted to ask for complimentary or free items. The guardrail prevented the assistant from giving away free goods.",
    };
  }

  // 2. Off-topic check
  const offTopicKeywords = [
    "python",
    "javascript",
    "write code",
    "sql",
    "who is",
    "who was",
    "capital of",
    "president",
    "homework",
    "solve this equation",
    "translate",
    "tell me about quantum",
    "crypto",
    "bitcoin",
    "weather tomorrow",
    "weather in",
    "stock market",
  ];
  const isOffTopic = offTopicKeywords.some((kw) => lower.includes(kw));
  if (isOffTopic) {
    return {
      type: "off_topic",
      label: "Domain Boundary Enforced",
      ruleViolated: "Only answer questions regarding food, menu, and delivery.",
      explanation:
        "The user asked a question outside the scope of Cheesy Crust Pizza operations. The assistant declined and redirected to food.",
    };
  }

  // 3. Unknown item check
  const nonMenuItems = [
    "burger",
    "cheeseburger",
    "sushi",
    "taco",
    "tacos",
    "steak",
    "burrito",
    "hot dog",
    "ramen",
    "pad thai",
    "chicken wings",
  ];
  const asksUnknown = nonMenuItems.some((kw) => lower.includes(kw));
  if (asksUnknown) {
    return {
      type: "custom",
      label: "Off-Menu Item Guardrail",
      ruleViolated: "Only confirm and describe items on the official menu.",
      explanation:
        "The customer asked for an item not sold at Cheesy Crust Pizza. The assistant clarified the actual menu offerings.",
    };
  }

  return null;
}

/**
 * Intelligent simulation engine that generates contextual, accurate pizza assistant responses
 * using the live active System Prompt configuration.
 * Plain text only: never uses asterisks (**) for bolding.
 */
export function generateSimulatedResponse(
  messages: ChatMessage[],
  config: SystemPromptConfig
): { content: string; guardrailTriggered?: GuardrailTrigger } {
  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
  const text = lastUserMsg ? lastUserMsg.content : "";
  const lower = text.toLowerCase();

  // Multi-turn conversational memory: analyze previous 2-3 turns
  const previousTurns = messages.slice(-5, -1);
  const recentHistoryText = previousTurns.map((m) => m.content.toLowerCase()).join(" ");

  const guardrail = evaluateGuardrails(text, config);

  // Guardrail 0: Respectful Language Filter
  if (guardrail?.label === "Respectful Language Policy") {
    return {
      content: `I am here to help you order fresh, hot pizza! 🍕 Let's please keep our conversation friendly and respectful. Can I get you started with our popular Large Pepperoni ($15) or our crispy Garlic Bread ($5) today?`,
      guardrailTriggered: guardrail,
    };
  }

  // Conversational Memory: Follow-up questions referencing previous messages
  if (
    lower.includes("how much was that") ||
    lower.includes("how much is it") ||
    lower.includes("what about that") ||
    lower.includes("the first one") ||
    lower.includes("the second one")
  ) {
    if (recentHistoryText.includes("pepperoni")) {
      return {
        content: `As we mentioned, the Large Pepperoni is $15.00! Hand-stretched, crispy, and baked fresh to order. Would you like to add one?`,
      };
    }
    if (recentHistoryText.includes("veggie")) {
      return {
        content: `The Medium Veggie is $12.00! Packed with fresh bell peppers, mushrooms, red onions, and black olives.`,
      };
    }
    if (recentHistoryText.includes("garlic")) {
      return {
        content: `Our oven-toasted Garlic Bread is just $5.00!`,
      };
    }
  }

  if (lower.startsWith("add ") || lower.includes("add that") || lower.includes("i'll take that") || lower.includes("i will take")) {
    return {
      content: `Great choice! I have added that to your order! 🍕 Our delivery window is ${config.storeInfo.deliveryTime}. Would you like to add our crispy Garlic Bread ($5) or are you ready to finalize?`,
    };
  }

  // Guardrail 1: Freebie Blocked
  if (guardrail?.type === "freebie") {
    const garlicBread = config.storeInfo.items.find((i) =>
      i.name.toLowerCase().includes("garlic")
    );
    const garlicPrice = garlicBread ? `$${garlicBread.price.toFixed(2)}` : "$5.00";

    return {
      content: `Haha, I totally respect the hustle! 🍕 However, as much as I would love to shower you with pizza presents, our store policy at ${config.storeInfo.name} does not allow me to give away free items or discounts.\n\nOur warm, oven-toasted Garlic Bread is just ${garlicPrice}, drenched in rich garlic butter and parsley—it is worth every single penny! Can I add one to your order today? 😊`,
      guardrailTriggered: guardrail,
    };
  }

  // Guardrail 2: Off-topic Redirect
  if (guardrail?.type === "off_topic") {
    return {
      content: `That sounds interesting, but I am strictly trained as your ${config.storeInfo.name} pizza concierge! 🍕✨\n\nI cannot help with coding, homework, or general trivia, but I can tell you all about our crispy pizzas, fresh sides, and lightning-fast delivery! Would you like to hear about our Large Pepperoni or Medium Veggie today?`,
      guardrailTriggered: guardrail,
    };
  }

  // Guardrail 3: Off-menu Item
  if (guardrail?.type === "custom") {
    return {
      content: `Ah, that sounds tasty, but we specialize exclusively in handcrafted artisan pizzas and sides here at ${config.storeInfo.name}! 🥖🍕\n\nWe do not serve that item, but we would love to prepare our fresh Large Pepperoni ($15), our garden-fresh Medium Veggie ($12), or our savory Garlic Bread ($5) for you! What can I get started?`,
      guardrailTriggered: guardrail,
    };
  }

  // Specific Query: Delivery Time
  if (
    lower.includes("delivery") ||
    lower.includes("how long") ||
    lower.includes("time") ||
    lower.includes("speed") ||
    lower.includes("when will")
  ) {
    return {
      content: `Our delivery time is approximately ${config.storeInfo.deliveryTime} from when your order comes out of the oven! 🛵💨\n\nWe bake everything fresh to order. Delivery is ${config.storeInfo.deliveryFee}. Are you looking to order for delivery right away?`,
    };
  }

  // Specific Query: Hours or Location / Contact
  if (
    lower.includes("hour") ||
    lower.includes("open") ||
    lower.includes("close") ||
    lower.includes("phone") ||
    lower.includes("contact")
  ) {
    return {
      content: `We are open ${config.storeInfo.hours}! ⏰\n\nYou can reach our kitchen directly at ${config.storeInfo.phone}. How can I help you with your order today? 🍕`,
    };
  }

  // Specific Query: Menu, Prices, What do you have?
  if (
    lower.includes("menu") ||
    lower.includes("what do you have") ||
    lower.includes("what's on") ||
    lower.includes("items") ||
    lower.includes("pizzas") ||
    lower.includes("sides") ||
    lower.includes("price") ||
    lower.includes("cost")
  ) {
    const itemsList = config.storeInfo.items
      .map(
        (item) =>
          `• ${item.name} — $${item.price.toFixed(2)}\n  ${item.description}`
      )
      .join("\n\n");

    return {
      content: `Here is our official menu at ${config.storeInfo.name}! Fresh ingredients, artisan dough, and hot ovens: 🍕✨\n\n${itemsList}\n\nOur delivery window is ${config.storeInfo.deliveryTime}. What sounds delicious to you?`,
    };
  }

  // Budget calculations: e.g., "I have $20"
  const budgetMatch = text.match(/\$?(\d+)/);
  if (budgetMatch && (lower.includes("have") || lower.includes("budget") || lower.includes("spend") || lower.includes("recommend"))) {
    const budget = parseInt(budgetMatch[1], 10);
    if (budget >= 20) {
      return {
        content: `With a $${budget} budget, you can get a feast! 🎉\n\nI recommend getting our Medium Veggie ($12) plus our savory Garlic Bread ($5) for just $17 total! Or you can grab our signature Large Pepperoni for $15 and still have change left over! Which one strikes your fancy? 🍕🥖`,
      };
    } else if (budget >= 15) {
      return {
        content: `With $${budget}, you can get our star attraction: the Large Pepperoni ($15)! It is hand-stretched, crispy, and generously loaded with cheese and pepperoni! 🍕 Would you like to get that started?`,
      };
    } else if (budget >= 12) {
      return {
        content: `With $${budget}, you can enjoy our wholesome Medium Veggie ($12)! Packed with crisp bell peppers, mushrooms, red onions, and black olives! 🌿🍕`,
      };
    } else if (budget >= 5) {
      return {
        content: `With $${budget}, our golden, oven-toasted Garlic Bread ($5) is the perfect choice! Brushed with garlic butter and fresh parsley. 🥖✨`,
      };
    }
  }

  // Specific item questions:
  if (lower.includes("pepperoni")) {
    const item = config.storeInfo.items.find((i) =>
      i.name.toLowerCase().includes("pepperoni")
    );
    return {
      content: `Our ${item ? item.name : "Large Pepperoni"} is priced at $${item ? item.price.toFixed(2) : "15.00"}! 🍕 It features robust marinara, whole-milk mozzarella, and crispy cupped pepperoni baked to bubbly perfection. Shall I ring one up for you?`,
    };
  }

  if (lower.includes("veggie") || lower.includes("vegetarian")) {
    const item = config.storeInfo.items.find((i) =>
      i.name.toLowerCase().includes("veggie")
    );
    return {
      content: `Our ${item ? item.name : "Medium Veggie"} is $${item ? item.price.toFixed(2) : "12.00"}! 🥦🍅 It is topped with fresh bell peppers, sliced mushrooms, sweet red onions, and black olives. A garden favorite! Would you like one?`,
    };
  }

  if (lower.includes("garlic") || lower.includes("bread")) {
    const item = config.storeInfo.items.find((i) =>
      i.name.toLowerCase().includes("garlic")
    );
    return {
      content: `Our ${item ? item.name : "Garlic Bread"} is $${item ? item.price.toFixed(2) : "5.00"}! 🥖 Freshly toasted artisan baguette with melted garlic herb butter. It is the ultimate sidekick to any pizza!`,
    };
  }

  // Greetings / General
  if (
    lower.includes("hi") ||
    lower.includes("hello") ||
    lower.includes("hey") ||
    lower.includes("morning") ||
    lower.includes("evening")
  ) {
    return {
      content: `Welcome to ${config.storeInfo.name}! 🍕👋 I am your cheerful pizza assistant. Whether you are craving our Large Pepperoni ($15), Medium Veggie ($12), or delicious Garlic Bread ($5), I am here to help! How can I make your day tastier?`,
    };
  }

  // Fallback cheerful response keeping strictly within persona
  return {
    content: `Thanks for chatting with ${config.storeInfo.name}! 🍕 I am here to help you order fresh pizzas (Large Pepperoni $15, Medium Veggie $12), our crispy Garlic Bread ($5), or answer questions about our ${config.storeInfo.deliveryTime} delivery window! What would you like to know?`,
  };
}
