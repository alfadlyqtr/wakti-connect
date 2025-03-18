
import { corsHeaders } from "../utils/cors.ts";

export async function callDeepSeepAPI(conversation) {
  const DEEPSEEP_API_KEY = Deno.env.get("DEEPSEEP_API_KEY");
  
  if (!DEEPSEEP_API_KEY) {
    console.error("Missing DeepSeep API key");
    return {
      error: new Response(
        JSON.stringify({ error: "Server configuration error: Missing API key" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    };
  }
  
  console.log("Calling DeepSeep API with conversation containing", conversation.length, "messages");
  
  // Added retry logic
  const MAX_RETRIES = 2;
  let retries = 0;
  let lastError = null;
  
  while (retries <= MAX_RETRIES) {
    try {
      if (retries > 0) {
        console.log(`Retry attempt ${retries}/${MAX_RETRIES}`);
      }
      
      // Call DeepSeep API
      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${DEEPSEEP_API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: conversation,
          temperature: 0.7,
          max_tokens: 1000
        })
      });
      
      console.log("DeepSeep API response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("DeepSeep API error response:", errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { error: errorText };
        }
        
        // Some errors should not be retried
        if (response.status === 401 || response.status === 403) {
          return {
            error: new Response(
              JSON.stringify({ error: "API authentication error", details: errorData }),
              { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            )
          };
        }
        
        // For other errors, we'll retry
        throw new Error(`DeepSeep API error (${response.status}): ${JSON.stringify(errorData)}`);
      }
      
      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error("Failed to parse DeepSeep API response:", e);
        throw new Error("Invalid JSON response from DeepSeep API");
      }
      
      console.log("DeepSeep API response received:", 
        data.choices && data.choices[0] ? "Valid response" : "Invalid response format");
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error("Invalid response format from DeepSeep API:", JSON.stringify(data));
        throw new Error("Invalid response format from DeepSeep API");
      }
      
      const aiResponse = data.choices[0].message.content;
      
      return { aiResponse };
    } catch (error) {
      console.error(`DeepSeep API error (attempt ${retries + 1}/${MAX_RETRIES + 1}):`, error);
      lastError = error;
      retries++;
      
      if (retries <= MAX_RETRIES) {
        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, retries) * 1000;
        console.log(`Waiting ${delay}ms before retrying...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  console.error("DeepSeep API call failed after all retry attempts");
  return {
    error: new Response(
      JSON.stringify({ 
        error: "Error calling AI service after multiple attempts", 
        details: lastError?.message 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  };
}
