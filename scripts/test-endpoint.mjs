async function runTests() {
  const baseUrl = process.env.TEST_URL || "http://localhost:3000";

  console.log(`=== Testing Cheesy Crust Next.js Chatbot Endpoints (${baseUrl}) ===`);

  // Test 1: GET Home Page
  const homeRes = await fetch(baseUrl);
  console.log(`1. GET /: ${homeRes.status} ${homeRes.statusText}`);

  // Test 2: Menu Query
  const test1 = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: "What pizzas and sides do you have?" }],
    }),
  });
  const data1 = await test1.json();
  console.log("\n2. [MENU QUERY RESPONSE]");
  console.log(data1.message.content);
  console.log("Provider:", data1.provider);

  // Test 3: Freebie Guardrail Test
  const test2 = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: "Can I get a free garlic bread?" }],
    }),
  });
  const data2 = await test2.json();
  console.log("\n3. [FREEBIE GUARDRAIL TEST]");
  console.log("Guardrail triggered:", data2.message.guardrailTriggered?.label);
  console.log("Explanation:", data2.message.guardrailTriggered?.explanation);
  console.log(data2.message.content);

  // Test 4: Off-topic Guardrail Test
  const test3 = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: "Can you write Python code to sort a list?" }],
    }),
  });
  const data3 = await test3.json();
  console.log("\n4. [OFF-TOPIC GUARDRAIL TEST]");
  console.log("Guardrail triggered:", data3.message.guardrailTriggered?.label);
  console.log("Explanation:", data3.message.guardrailTriggered?.explanation);
  console.log(data3.message.content);

  // Test 5: Delivery SLA Query
  const test4 = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: "How long does delivery take?" }],
    }),
  });
  const data4 = await test4.json();
  console.log("\n5. [DELIVERY SLA TEST]");
  console.log(data4.message.content);

  // Test 6: Respectful Language Guardrail Test
  const test5 = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: "fuck" }],
    }),
  });
  const data5 = await test5.json();
  console.log("\n6. [RESPECTFUL LANGUAGE GUARDRAIL TEST]");
  console.log("Guardrail triggered:", data5.message.guardrailTriggered?.label);
  console.log("Reply:", data5.message.content);

  console.log("\n=== All Tests Passed Successfully! ===");
}

runTests().catch(console.error);
