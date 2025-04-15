
const DEEPSEEP_API_KEY = Deno.env.get("DEEPSEEP_API_KEY");
const API_URL = "https://api.deepseek.com/v1/chat/completions";

import { corsHeaders } from "../utils/cors.ts";

export async function callDeepSeekAPI(messages: any[]) {
  if (!DEEPSEEP_API_KEY) {
    console.error("DeepSeek API key not found in environment variables");
    return {
      error: {
        message: "DeepSeek API key not configured",
        status: 500
      }
    };
  }

  try {
    console.log("Sending request to DeepSeek API with", messages.length, "messages");
    
    // Add system prompt to guide AI to focus on WAKTI
    const systemMessage = {
      role: "system",
      content: `You are WAKTI, an AI assistant specializing in productivity and business management.
Your primary focus is helping users with WAKTI features:
- Task Management & To-Do Lists
- Appointment & Booking Systems
- Messaging & Contact Management
- Business Dashboard features
- Staff management and tracking

While you can help with general questions, your specialty is productivity and WAKTI functionality.
If a message contains [WAKTI FOCUS LEVEL: HIGH], prioritize WAKTI topics and gently guide the conversation back to productivity.
If a message contains [WAKTI FOCUS LEVEL: MEDIUM], balance between general assistance and WAKTI topics.
If a message contains [WAKTI FOCUS LEVEL: LOW], you can freely discuss general topics.

If the user mentions a [RECENT WAKTI TOPIC], try to relate your response to this topic when appropriate.
Be concise, helpful, and positive. Avoid lengthy explanations unless specifically requested.`
    };

    // Add the system message to the conversation
    const conversationWithSystem = [systemMessage, ...messages];
    
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEP_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: conversationWithSystem,
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("DeepSeek API error:", response.status, errorData);
      return {
        error: {
          message: errorData.error?.message || `API error: ${response.status} ${response.statusText}`,
          status: response.status
        }
      };
    }

    const data = await response.json();
    console.log("DeepSeek API response successful");
    
    return {
      aiResponse: data.choices[0].message.content
    };
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    return {
      error: {
        message: `Failed to call DeepSeek API: ${error.message}`,
        status: 500
      }
    };
  }
}
