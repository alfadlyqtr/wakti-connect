
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const DEEPSEEP_API_KEY = Deno.env.get("DEEPSEEP_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") as string;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;

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
    // Create authenticated Supabase client
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Get auth user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing Authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Get the token from the Authorization header
    const token = authHeader.replace("Bearer ", "");
    
    // Verify the token and get the user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Check if user is on a paid plan
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("account_type")
      .eq("id", user.id)
      .single();
      
    if (profileError) {
      return new Response(
        JSON.stringify({ error: "Error fetching user profile" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (profile.account_type !== "business" && profile.account_type !== "individual") {
      return new Response(
        JSON.stringify({ error: "Feature only available for Business and Individual plans" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get user's AI assistant settings
    const { data: settings, error: settingsError } = await supabaseClient
      .from("ai_assistant_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();
      
    if (settingsError && settingsError.code !== "PGRST116") { // Not found error is ok
      return new Response(
        JSON.stringify({ error: "Error fetching AI settings" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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

    // Get user knowledge uploads if available
    const { data: knowledgeUploads } = await supabaseClient
      .from("ai_knowledge_uploads")
      .select("title, content")
      .eq("user_id", user.id);
    
    // Format knowledge uploads for the AI context
    const knowledgeContext = knowledgeUploads?.length > 0 
      ? "Custom knowledge: " + knowledgeUploads.map(k => `${k.title}: ${k.content}`).join(" | ")
      : "";

    // Prepare AI personality based on settings
    const aiName = settings?.assistant_name || "WAKTI";
    const tone = settings?.tone || "balanced";
    const responseLength = settings?.response_length || "balanced";
    
    // Get user's full name for personalized greeting
    const { data: userProfile } = await supabaseClient
      .from("profiles")
      .select("full_name, display_name, business_name")
      .eq("id", user.id)
      .single();
      
    const userName = userProfile?.display_name || userProfile?.full_name || userProfile?.business_name || "there";
    
    // Build system message based on settings
    let systemMessage = `You are ${aiName}, a helpful AI assistant for the WAKTI productivity platform. `;
    
    // Add tone instructions
    if (tone === "formal") {
      systemMessage += "Maintain a formal and professional tone. ";
    } else if (tone === "casual") {
      systemMessage += "Use a casual and friendly tone. ";
    } else if (tone === "concise") {
      systemMessage += "Be direct and concise in your responses. ";
    } else if (tone === "detailed") {
      systemMessage += "Provide detailed and informative responses. ";
    }
    
    // Add response length instructions
    if (responseLength === "short") {
      systemMessage += "Keep your responses brief and to the point. ";
    } else if (responseLength === "detailed") {
      systemMessage += "Provide comprehensive and thorough responses. ";
    }
    
    // Add functionality information
    systemMessage += "You can help with task management, event planning, staff management, and business analytics. ";
    
    // Add knowledge context if available
    if (knowledgeContext) {
      systemMessage += `Use this additional information when responding: ${knowledgeContext}`;
    }
    
    // Define the conversation history to send to the API
    const conversation = [
      { role: "system", content: systemMessage },
      { role: "assistant", content: `Welcome back, ${userName}! How can I assist you today?` }
    ];
    
    // Add context if provided
    if (context) {
      conversation.push({ role: "system", content: `Current context: ${context}` });
    }
    
    // Add the user message
    conversation.push({ role: "user", content: message });
    
    console.log("Sending request to DeepSeep API with conversation:", conversation);
    
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
      return new Response(
        JSON.stringify({ error: "Error from AI service", details: errorData }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    // Save the conversation
    await supabaseClient
      .from("ai_conversations")
      .insert({
        user_id: user.id,
        message: message,
        response: aiResponse
      });
    
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
