
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";
import { authenticateUser } from "./auth/authenticateUser.ts";
import { checkUserAccess } from "./auth/checkUserAccess.ts";
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
    
    // Log auth header for debugging (mask most of it for security)
    const authHeader = req.headers.get("Authorization") || "none";
    const hasAuth = authHeader !== "none";
    console.log("Authorization header present:", hasAuth);
    if (hasAuth) {
      const masked = authHeader.substring(0, 15) + "..." + authHeader.substring(authHeader.length - 10);
      console.log("Masked auth header:", masked);
    }
    
    // Authenticate the user
    console.log("Authenticating user...");
    const { user, supabaseClient, error: authError } = await authenticateUser(req);
    if (authError) {
      console.error("Authentication error:", authError.status, "Message:", authError.statusText);
      clearTimeout(timeoutId);
      return authError;
    }
    
    console.log("User authenticated:", user.id);
    
    // Check if user can use AI assistant - optimized with new checkUserAccess
    console.log("Checking user access...");
    const { canUseAI, error: accessError } = await checkUserAccess(user, supabaseClient);
    if (accessError) {
      console.error("Access check error:", accessError.status, accessError.statusText);
      clearTimeout(timeoutId);
      return accessError;
    }
    
    // If user doesn't have access, return a clear error
    if (!canUseAI) {
      console.log("User does not have access to AI assistant:", user.id);
      clearTimeout(timeoutId);
      return new Response(
        JSON.stringify({ error: "Feature only available for Business and Individual plans" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("User has access to AI assistant");
    
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

    // Prepare the AI request
    console.log("Preparing AI request...");
    let conversation;
    try {
      conversation = await prepareAIRequest(user, message, context, supabaseClient);
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
    
    // Save the conversation
    console.log("Saving conversation...");
    try {
      await saveConversation(user.id, message, aiResponse, supabaseClient);
      console.log("Conversation saved successfully");
    } catch (error) {
      // Don't fail if saving fails, just log it
      console.error("Error saving conversation:", error);
    }
    
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
