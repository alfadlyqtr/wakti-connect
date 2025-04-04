
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
      console.error("OPENAI_API_KEY not found in environment variables");
      return new Response(
        JSON.stringify({ 
          valid: false, 
          message: "OPENAI_API_KEY environment variable is not set" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get test type from request
    let body;
    try {
      body = await req.json();
    } catch (err) {
      console.error("Error parsing request body:", err);
      body = { test: "completion" }; // Default if parsing fails
    }
    
    const { test = "completion" } = body;
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

    console.log(`Testing OpenAI API with endpoint: ${endpoint}`);
    
    // Test the OpenAI API
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        console.log("OpenAI API test successful");
        return new Response(
          JSON.stringify({ valid: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else {
        const errorData = await response.json().catch(() => ({ error: { message: "Unknown error" } }));
        console.error("OpenAI API error:", errorData);
        return new Response(
          JSON.stringify({ 
            valid: false, 
            message: errorData.error?.message || "API returned an error" 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } catch (fetchError) {
      console.error("Fetch error during OpenAI API test:", fetchError);
      return new Response(
        JSON.stringify({ 
          valid: false, 
          message: `Network error: ${fetchError.message}` 
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
