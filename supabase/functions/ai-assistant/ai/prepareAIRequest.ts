
export async function prepareAIRequest(user, message, context, supabaseClient) {
  console.log("Preparing AI request for user:", user.id);
  
  // Check if message contains a special context flag
  const hasRemindContext = message.includes("[CONTEXT: remind_about_wakti_focus]");
  if (hasRemindContext) {
    // Remove the context flag before processing
    message = message.replace("[CONTEXT: remind_about_wakti_focus]", "").trim();
  }
  
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

  // Get user's selected role or use default
  const userRole = settings?.role || 'general';
  console.log("Using AI assistant role:", userRole);
  
  // Get role-specific context
  let roleContext = "";
  try {
    const { data: roleContextData, error: roleContextError } = await supabaseClient
      .from("ai_role_contexts")
      .select("context_content")
      .eq("role", userRole)
      .eq("is_default", true)
      .single();
      
    if (!roleContextError && roleContextData) {
      roleContext = roleContextData.context_content;
      console.log("Role context fetched successfully");
    } else {
      console.log("Error or no role context found, using fallback");
      // Fallback contexts based on role
      const fallbackContexts = {
        'student': 'You are a helpful AI assistant for students. Help with homework, assignments, study plans, and academic tasks. Provide clear explanations and guidance for learning.',
        'employee': 'You are a productivity assistant for professionals. Help organize tasks, draft emails, manage schedules, and optimize workflows. Focus on efficiency and professionalism.',
        'writer': 'You are a creative assistant for writers. Help with ideation, outlining, editing, and overcoming writer\'s block. Provide literary advice and stylistic suggestions.',
        'business_owner': 'You are a business management assistant. Help with operations, customer communications, service management, and business analytics. Focus on growth and efficiency.',
        'general': 'You are WAKTI AI, a helpful productivity assistant. Help with organization, task management, and general productivity needs.'
      };
      roleContext = fallbackContexts[userRole] || fallbackContexts.general;
    }
  } catch (error) {
    console.error("Failed to fetch role context:", error);
    // Continue with default context
    roleContext = 'You are WAKTI AI, a helpful productivity assistant. Help with organization, task management, and general productivity needs.';
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
  
  // Get processed documents if available
  let processedDocuments;
  try {
    console.log("Fetching processed documents...");
    const { data: documentsData, error: documentsError } = await supabaseClient
      .from("ai_processed_documents")
      .select("document_name, summary")
      .eq("user_id", user.id)
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (!documentsError) {
      processedDocuments = documentsData;
      console.log("Processed documents fetched successfully:", processedDocuments?.length || 0, "items");
    } else {
      console.error("Error fetching processed documents:", documentsError);
    }
  } catch (error) {
    console.error("Failed to fetch processed documents:", error);
  }
  
  // Format knowledge uploads and documents for the AI context
  const knowledgeContext = knowledgeUploads?.length > 0 
    ? "Custom knowledge: " + knowledgeUploads.map(k => `${k.title}: ${k.content}`).join(" | ")
    : "";
    
  const documentsContext = processedDocuments?.length > 0
    ? "Recent documents: " + processedDocuments.map(d => `${d.document_name}${d.summary ? ': ' + d.summary : ''}`).join(" | ")
    : "";

  // Prepare AI personality - always use WAKTI AI as the name
  const aiName = "WAKTI AI";
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
  
  // Build system message based on role context and settings
  let systemMessage = `${roleContext} `;
  
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
  
  // Add personalization instructions
  systemMessage += "Always address the user by name when greeting them. ";
  
  // Add knowledge context if available
  if (knowledgeContext) {
    systemMessage += `Use this additional information when responding: ${knowledgeContext} `;
  }
  
  // Add document context if available
  if (documentsContext) {
    systemMessage += `Reference these documents when relevant: ${documentsContext} `;
  }
  
  // Define the conversation history to send to the API
  const conversation = [
    { role: "system", content: systemMessage },
    { role: "assistant", content: `Hello ${userName}! Welcome back. How can I assist you as your ${userRole === 'general' ? 'productivity assistant' : userRole + ' assistant'} today?` }
  ];
  
  // Add context if provided
  if (context) {
    conversation.push({ role: "system", content: `Current context: ${context}` });
  }
  
  // If we need to remind about WAKTI focus, add special instruction
  if (hasRemindContext) {
    conversation.push({ 
      role: "system", 
      content: "The user's questions appear to be off-topic. In your response, gently remind them that you're designed to help with WAKTI platform features like task management, scheduling, and business tools. Then try to answer their question but also pivot back to WAKTI-related topics by showcasing what you can do for them."
    });
  }
  
  // Add the user message
  conversation.push({ role: "user", content: message });
  
  console.log("AI request prepared with system message length:", systemMessage.length);
  return conversation;
}
