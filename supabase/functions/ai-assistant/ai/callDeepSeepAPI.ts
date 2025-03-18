
import { corsHeaders } from "../utils/cors.ts";

export async function callDeepSeepAPI(conversation) {
  const DEEPSEEP_API_KEY = Deno.env.get("DEEPSEEP_API_KEY");
  
  if (!DEEPSEEP_API_KEY) {
    console.error("Missing DeepSeep API key");
    return {
      error: new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    };
  }
  
  console.log("Sending request to DeepSeep API with conversation:", JSON.stringify(conversation));
  
  try {
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
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error("DeepSeep API error:", errorData);
      return {
        error: new Response(
          JSON.stringify({ error: "Error from AI service", details: errorData }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      };
    }
    
    const data = await response.json();
    console.log("Response from DeepSeep API:", JSON.stringify(data));
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Invalid response format from DeepSeep API:", JSON.stringify(data));
      return {
        error: new Response(
          JSON.stringify({ error: "Invalid response format from AI service" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      };
    }
    
    const aiResponse = data.choices[0].message.content;
    
    return { aiResponse };
  } catch (error) {
    console.error("Error calling DeepSeep API:", error);
    return {
      error: new Response(
        JSON.stringify({ error: "Error calling AI service" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    };
  }
}
