
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          message: "OPENAI_API_KEY environment variable is not set" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get test type from request
    const { test = "completion" } = await req.json();
    let endpoint;
    let requestBody;

    // Configure test based on requested functionality
    if (test === "tts") {
      endpoint = "https://api.openai.com/v1/audio/speech";
      requestBody = {
        model: "tts-1",
        input: "This is a test.",
        voice: "alloy",
      };
    } else {
      // Default to a simple chat completion test
      endpoint = "https://api.openai.com/v1/chat/completions";
      requestBody = {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Say test" }],
        max_tokens: 5
      };
    }

    // Test the OpenAI API
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      return new Response(
        JSON.stringify({ valid: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      const errorData = await response.json().catch(() => ({ error: { message: "Unknown error" } }));
      return new Response(
        JSON.stringify({ 
          valid: false, 
          message: errorData.error?.message || "API returned an error" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error testing OpenAI connection:", error);
    
    return new Response(
      JSON.stringify({ 
        valid: false, 
        message: error.message || "An unknown error occurred" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
