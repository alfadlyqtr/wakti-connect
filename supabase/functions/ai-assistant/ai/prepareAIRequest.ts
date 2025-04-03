
export async function prepareAIRequest(user, message, context, supabaseClient) {
  console.log("Preparing AI request for user:", user.id);
  
  // Check if message contains special context flags
  const hasRemindContext = message.includes("[CONTEXT: remind_about_wakti_focus]");
  let systemContext = {};
  
  // Extract system context if present
  const systemContextMatch = message.match(/\[SYSTEM_CONTEXT: ([^\]]+)\]/);
  if (systemContextMatch) {
    // Remove the context flag before processing
    message = message.replace(/\[SYSTEM_CONTEXT: [^\]]+\]/, "").trim();
    
    // Parse the system context
    const contextParts = systemContextMatch[1].split(', ');
    contextParts.forEach(part => {
      const [key, value] = part.split('=');
      if (key && value) {
        systemContext[key] = value;
      }
    });
    
    console.log("Extracted system context:", systemContext);
  }
  
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
        'student': 'You are an academic assistant for students. Help with homework, assignments, study plans, and academic tasks. Provide clear explanations and educational guidance. Focus on helping the student learn and understand the material rather than just providing answers.',
        'professional': 'You are a productivity assistant for professionals. Help organize tasks, draft emails, manage schedules, and optimize workflows. Focus on efficiency, professionalism, and workplace productivity. Provide concise, actionable advice.',
        'creator': 'You are a creative assistant for content creators and writers. Help with brainstorming, drafting, editing, and overcoming creative blocks. Provide stylistic suggestions and creative inspiration. Focus on helping the user express their ideas effectively.',
        'business_owner': 'You are a business management assistant. Help with operations, customer communications, service management, and business analytics. Focus on growth, efficiency, and effective business practices. Provide practical, results-oriented advice.',
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
      .select("document_name, summary, role_context")
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
  
  // Get user interface state (what page they're on, etc.) if available
  let userInterfaceState;
  try {
    const { data: stateData, error: stateError } = await supabaseClient
      .from("user_interface_state")
      .select("current_page, last_interaction")
      .eq("user_id", user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();
      
    if (!stateError && stateData) {
      userInterfaceState = stateData;
      console.log("User interface state fetched:", userInterfaceState);
    }
  } catch (error) {
    console.warn("Failed to fetch user interface state or table doesn't exist:", error);
  }
  
  // Format knowledge uploads and documents for the AI context
  const knowledgeContext = knowledgeUploads?.length > 0 
    ? "Custom knowledge: " + knowledgeUploads.map(k => `${k.title}: ${k.content}`).join(" | ")
    : "";
    
  const documentsContext = processedDocuments?.length > 0
    ? "Recent documents: " + processedDocuments.map(d => `${d.document_name}${d.summary ? ': ' + d.summary : ''} ${d.role_context ? '[Context: ' + d.role_context + ']' : ''}`).join(" | ")
    : "";

  // Prepare AI personality - always use WAKTI AI as the name regardless of the role
  let aiName;
  
  // Get role-specific assistant name
  switch (userRole) {
    case 'student':
      aiName = "WAKTI Study Assistant";
      break;
    case 'professional':
      aiName = "WAKTI Productivity Assistant";
      break;
    case 'creator':
      aiName = "WAKTI Creator Assistant";
      break;
    case 'business_owner':
      aiName = "WAKTI Business Assistant";
      break;
    default:
      aiName = "WAKTI AI";
  }
  
  const tone = settings?.tone || "balanced";
  const responseLength = settings?.response_length || "balanced";
  
  // Get user's full name for personalized greeting
  let userName = "there";
  try {
    console.log("Fetching user profile for greeting...");
    const { data: userProfile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("full_name, display_name, business_name, account_type")
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
      
      // Add account type to system context
      if (userProfile.account_type) {
        systemContext.account_type = userProfile.account_type;
      }
      
      console.log("Selected user name for greeting:", userName);
    }
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
  }
  
  // Enhanced system message with improved integrations
  let systemMessage = `${roleContext} `;
  
  // Add WAKTI system integration capabilities
  systemMessage += `
You are integrated with WAKTI's productivity systems and can directly help with:

1. Tasks: Create, view, update, and manage user tasks
2. Events & Calendar: Schedule events, check calendar, and manage appointments
3. Business Tools: View analytics, manage staff, handle bookings
4. Contact Management: Search and interact with contacts

When users ask for help with these areas, offer to take actions on their behalf using commands.
`;

  // Add specific capabilities based on account type
  if (systemContext.account_type === 'business') {
    systemMessage += `
Since this user has a Business account, you can also:
- Help manage their staff and team members
- Provide business analytics and performance insights 
- Assist with service booking management
- Support customer relationship functions
`;
  } else if (systemContext.account_type === 'individual') {
    systemMessage += `
Since this user has an Individual account, you can:
- Provide personal task management and productivity optimization
- Help with their calendar and scheduling
- Support event creation and management
`;
  }
  
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
  
  // Add role-specific functionality guidance
  if (userRole === 'student') {
    systemMessage += "Focus on educational support, study planning, homework assistance, and knowledge building. Explain concepts clearly and help with academic tasks. ";
  } else if (userRole === 'professional') {
    systemMessage += "Focus on workplace productivity, email drafting, meeting preparation, and professional task management. Help streamline work processes. ";
  } else if (userRole === 'creator') {
    systemMessage += "Focus on content creation, creative writing, editing, and idea development. Help overcome creative blocks and refine content. ";
  } else if (userRole === 'business_owner') {
    systemMessage += "Focus on business operations, customer service, marketing, staff management, and business analytics. Help improve business processes. ";
  } else {
    systemMessage += "Help with task management, event planning, scheduling, and productivity. ";
  }
  
  // Add user interface state context if available
  if (userInterfaceState) {
    systemMessage += `The user is currently on the ${userInterfaceState.current_page} page of the WAKTI application. `;
    
    // Add specific guidance based on page
    if (userInterfaceState.current_page === 'tasks') {
      systemMessage += "You can offer specific help with task management, organization, and prioritization. ";
    } else if (userInterfaceState.current_page === 'calendar' || userInterfaceState.current_page === 'events') {
      systemMessage += "You can offer specific help with scheduling, event details, invitations, and calendar management. ";
    } else if (userInterfaceState.current_page === 'staff') {
      systemMessage += "You can offer specific help with staff management, permissions, and team coordination. ";
    } else if (userInterfaceState.current_page === 'analytics') {
      systemMessage += "You can offer help interpreting data, suggesting business improvements, and tracking performance. ";
    } else if (userInterfaceState.current_page === 'ai-assistant') {
      systemMessage += "You can showcase all your capabilities to help with productivity, task management, scheduling, and business operations. ";
    }
  }
  
  // Add system context information
  if (Object.keys(systemContext).length > 0) {
    systemMessage += "\nUser system context: ";
    
    if (systemContext.pending_tasks) {
      systemMessage += `The user has ${systemContext.pending_tasks} pending tasks. `;
    }
    
    if (systemContext.upcoming_events) {
      systemMessage += `The user has ${systemContext.upcoming_events} upcoming events. `;
    }
  }
  
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
  
  // Add active listening and proactive assistance guidance
  systemMessage += `
Be an active listener and assistant:
1. When users express challenges or pain points, acknowledge them and offer specific solutions using WAKTI's features
2. When you sense the user is struggling with a task, offer step-by-step guidance
3. After answering questions, suggest relevant features they might not know about
4. When discussing tasks or events, offer to create them directly using system commands

Remember you can help create tasks, schedule events, check calendars, and provide analytics through direct system integration.
`;
  
  // Create personalized greetings for each role
  let greetingMessage;
  if (userRole === 'student') {
    greetingMessage = `Hello ${userName}! I'm your study assistant. How can I help with your learning and academic needs today?`;
  } else if (userRole === 'professional') {
    greetingMessage = `Hello ${userName}! I'm your workplace productivity assistant. How can I help optimize your professional tasks today?`;
  } else if (userRole === 'creator') {
    greetingMessage = `Hello ${userName}! I'm your creative assistant. What are we creating or refining today?`;
  } else if (userRole === 'business_owner') {
    greetingMessage = `Hello ${userName}! I'm your business management assistant. How can I help your business succeed today?`;
  } else {
    greetingMessage = `Hello ${userName}! Welcome back. How can I assist you with your productivity needs today?`;
  }
  
  // Define the conversation history to send to the API
  const conversation = [
    { role: "system", content: systemMessage },
    { role: "assistant", content: greetingMessage }
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
