import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";
import { prepareAIRequest } from "./ai/prepareAIRequest.ts";
import { callDeepSeekAPI } from "./ai/callDeepSeekAPI.ts";
import { saveConversation } from "./db/saveConversation.ts";

// Increase server timeout to 60 seconds
const SERVER_TIMEOUT = 60000;

serve(async (req) => {
  console.log("AI assistant function called with URL:", req.url);
  console.log("Request method:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Add a server timeout to avoid hanging requests
  const timeoutId = setTimeout(() => {
    console.error("Server timeout reached (60s). Request aborted.");
  }, SERVER_TIMEOUT);

  try {
    // Create an AbortController for request cancellation
    const controller = new AbortController();
    const signal = controller.signal;
    
    // Get request data
    let requestData;
    try {
      requestData = await req.json();
      console.log("Request data received:", Object.keys(requestData));
    } catch (error) {
      console.error("Error parsing request JSON:", error);
      clearTimeout(timeoutId);
      return new Response(
        JSON.stringify({ error: "Invalid request format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Extract data from request - supporting different formats
    const message = requestData.message || requestData.user_prompt;
    const context = requestData.context || '';
    const userContext = requestData.userContext || '';
    const systemPrompt = requestData.system_prompt || '';
    
    if (!message) {
      console.error("Missing message in request");
      clearTimeout(timeoutId);
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For compatibility, create a minimal user object if user info not available
    const defaultUser = { id: 'anonymous-user' };
    
    // Prepare the AI request with default user
    console.log("Preparing AI request...");
    let conversation;
    try {
      // Pass default user since we're not requiring authentication
      conversation = await prepareAIRequest(defaultUser, message, context);
      console.log("AI conversation prepared with", conversation.length, "messages");
    } catch (error) {
      console.error("Error preparing AI request:", error);
      clearTimeout(timeoutId);
      return new Response(
        JSON.stringify({ error: "Error preparing AI request: " + (error.message || "Unknown error") }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Call DeepSeek API with signal for cancellation
    console.log("Calling DeepSeek API...");
    const { aiResponse, error: apiError } = await callDeepSeekAPI(conversation, signal);
    if (apiError) {
      console.error("DeepSeek API error:", apiError.status, apiError.message);
      clearTimeout(timeoutId);
      return new Response(
        JSON.stringify({ error: apiError.message || "Error calling AI model" }),
        { status: apiError.status || 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("DeepSeek API response received, length:", aiResponse?.length || 0);
    
    // Skip saving if using anonymous user - this keeps functionality working without requiring auth
    
    console.log("Sending successful response");
    clearTimeout(timeoutId);
    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Unexpected error in AI assistant function:", error.message);
    console.error(error.stack);
    clearTimeout(timeoutId);
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
