
export async function prepareAIRequest(user, message, context, supabaseClient) {
  console.log("Preparing AI request for user:", user.id);
  
  // Get user's AI assistant settings
  console.log("Fetching AI assistant settings...");
  let settings;
  try {
    const { data: settingsData, error: settingsError } = await supabaseClient
      .from("ai_assistant_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();
      
    if (settingsError && settingsError.code !== "PGRST116") { // Not found error is ok
      console.log("Error fetching AI settings:", settingsError.message);
      // Continue without settings, we'll use defaults
    } else {
      settings = settingsData;
      console.log("AI settings fetched successfully:", settings?.assistant_name || "default settings");
    }
  } catch (error) {
    console.error("Failed to fetch AI settings:", error);
    // Continue without settings, we'll use defaults
  }

  // Get user knowledge uploads if available
  let knowledgeUploads;
  try {
    console.log("Fetching knowledge uploads...");
    const { data: knowledgeData, error: knowledgeError } = await supabaseClient
      .from("ai_knowledge_uploads")
      .select("title, content")
      .eq("user_id", user.id);
      
    if (!knowledgeError) {
      knowledgeUploads = knowledgeData;
      console.log("Knowledge uploads fetched successfully:", knowledgeUploads?.length || 0, "items");
    } else {
      console.error("Error fetching knowledge uploads:", knowledgeError);
    }
  } catch (error) {
    console.error("Failed to fetch knowledge uploads:", error);
  }
  
  // Format knowledge uploads for the AI context
  const knowledgeContext = knowledgeUploads?.length > 0 
    ? "Custom knowledge: " + knowledgeUploads.map(k => `${k.title}: ${k.content}`).join(" | ")
    : "";

  // Prepare AI personality based on settings
  const aiName = settings?.assistant_name || "WAKTI";
  const tone = settings?.tone || "balanced";
  const responseLength = settings?.response_length || "balanced";
  
  // Get user's full name for personalized greeting
  let userName = "there";
  try {
    console.log("Fetching user profile for greeting...");
    const { data: userProfile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("full_name, display_name, business_name")
      .eq("id", user.id)
      .single();
      
    if (profileError) {
      console.error("Error fetching user profile:", profileError.message);
    } else if (userProfile) {
      // Log user profile for debugging
      console.log("User profile for greeting:", JSON.stringify(userProfile));
      
      // Try different name fields in order of preference
      if (userProfile.display_name && userProfile.display_name.trim()) {
        userName = userProfile.display_name.trim();
      } else if (userProfile.full_name && userProfile.full_name.trim()) {
        userName = userProfile.full_name.trim();
      } else if (userProfile.business_name && userProfile.business_name.trim()) {
        userName = userProfile.business_name.trim();
      }
      
      console.log("Selected user name for greeting:", userName);
    }
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
  }
  
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
  
  // Add topic control instructions
  systemMessage += "Always stay focused on productivity and business management topics. If users ask about unrelated topics, politely redirect them back to how you can help with the WAKTI platform. After 2-3 off-topic questions, inform them that for general chat they should visit TMW AI (https://tmw.qa/ai-chat-bot/). ";
  
  // Add personalization instructions
  systemMessage += "Always address the user by name when greeting them. ";
  
  // Add knowledge context if available
  if (knowledgeContext) {
    systemMessage += `Use this additional information when responding: ${knowledgeContext}`;
  }
  
  // Define the conversation history to send to the API
  const conversation = [
    { role: "system", content: systemMessage },
    { role: "assistant", content: `Hello ${userName}! Welcome back. How can I assist you with your tasks, appointments, or business management today?` }
  ];
  
  // Add context if provided
  if (context) {
    conversation.push({ role: "system", content: `Current context: ${context}` });
  }
  
  // Add the user message
  conversation.push({ role: "user", content: message });
  
  console.log("AI request prepared with system message length:", systemMessage.length);
  return conversation;
}
