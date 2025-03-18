
export async function prepareAIRequest(user, message, context, supabaseClient) {
  // Get user's AI assistant settings
  const { data: settings, error: settingsError } = await supabaseClient
    .from("ai_assistant_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();
    
  if (settingsError && settingsError.code !== "PGRST116") { // Not found error is ok
    console.log("Error fetching AI settings:", settingsError);
    // Continue without settings, we'll use defaults
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
  
  return conversation;
}
