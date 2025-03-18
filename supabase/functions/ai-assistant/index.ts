
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";
import { authenticateUser } from "./auth/authenticateUser.ts";
import { checkUserAccess } from "./auth/checkUserAccess.ts";
import { prepareAIRequest } from "./ai/prepareAIRequest.ts";
import { callDeepSeepAPI } from "./ai/callDeepSeepAPI.ts";
import { saveConversation } from "./db/saveConversation.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate the user
    const { user, supabaseClient, error: authError } = await authenticateUser(req);
    if (authError) return authError;
    
    // Check if user can use AI assistant
    const { canUseAI, error: accessError } = await checkUserAccess(user, supabaseClient);
    if (accessError) return accessError;
    
    if (!canUseAI) {
      return new Response(
        JSON.stringify({ error: "Feature only available for Business and Individual plans" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Get request data
    const { message, context } = await req.json();
    
    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare the AI request
    const conversation = await prepareAIRequest(user, message, context, supabaseClient);
    
    // Call DeepSeep API
    const { aiResponse, error: apiError } = await callDeepSeepAPI(conversation);
    if (apiError) return apiError;
    
    // Save the conversation
    await saveConversation(user.id, message, aiResponse, supabaseClient);
    
    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error in AI assistant function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
