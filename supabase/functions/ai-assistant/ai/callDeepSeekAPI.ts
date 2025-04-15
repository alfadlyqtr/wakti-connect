
const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY");
const API_URL = "https://api.deepseek.com/v1/chat/completions";

import { corsHeaders } from "../utils/cors.ts";

export async function callDeepSeekAPI(messages: any[]) {
  if (!DEEPSEEK_API_KEY) {
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
    
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages,
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
