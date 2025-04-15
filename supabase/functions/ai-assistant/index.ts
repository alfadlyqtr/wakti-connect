
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";
import { authenticateUser } from "./auth/authenticateUser.ts";
import { checkUserAccess } from "./auth/checkUserAccess.ts";
import { prepareAIRequest } from "./ai/prepareAIRequest.ts";
import { callDeepSeekAPI } from "./ai/callDeepSeekAPI.ts";
import { saveConversation } from "./db/saveConversation.ts";

serve(async (req) => {
  console.log("AI assistant function called with URL:", req.url);
  console.log("Request method:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate the user
    console.log("Authenticating user...");
    const { user, supabaseClient, error: authError } = await authenticateUser(req);
    if (authError) {
      console.error("Authentication error:", authError.status);
      return new Response(
        JSON.stringify({ error: authError.message || "Authentication failed" }),
        { status: authError.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("User authenticated:", user.id);
    
    // Check if user can use AI assistant
    console.log("Checking user access...");
    const { canUseAI, error: accessError } = await checkUserAccess(user, supabaseClient);
    if (accessError) {
      console.error("Access check error:", accessError.status);
      return new Response(
        JSON.stringify({ error: accessError.message || "Access check failed" }),
        { status: accessError.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (!canUseAI) {
      console.log("User does not have access to AI assistant:", user.id);
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
      console.log("Request data received:", JSON.stringify(requestData));
    } catch (error) {
      console.error("Error parsing request JSON:", error);
      return new Response(
        JSON.stringify({ error: "Invalid request format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const { message, context } = requestData;
    
    if (!message) {
      console.error("Missing message in request");
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
      return new Response(
        JSON.stringify({ error: "Error preparing AI request: " + (error.message || "Unknown error") }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Call DeepSeek API
    console.log("Calling DeepSeek API...");
    const { aiResponse, error: apiError } = await callDeepSeekAPI(conversation);
    if (apiError) {
      console.error("DeepSeek API error:", apiError.status, apiError.message);
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
    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Unexpected error in AI assistant function:", error.message);
    console.error(error.stack);
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
