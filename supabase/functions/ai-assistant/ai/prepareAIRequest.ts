
import { enrichUserContext, buildRoleSpecificPrompt, includeDocumentContext } from "./enhancedContext.ts";

export async function prepareAIRequest(user, message, context, supabaseClient) {
  console.log("Preparing AI request for user:", user.id);
  
  // Check if message contains a special context flag
  const hasRemindContext = message.includes("[CONTEXT: remind_about_wakti_focus]");
  if (hasRemindContext) {
    // Remove the context flag before processing
    message = message.replace("[CONTEXT: remind_about_wakti_focus]", "").trim();
  }
  
  // Get enhanced user context based on role, account type, etc.
  const userContext = await enrichUserContext(supabaseClient, user.id);
  console.log("Enhanced user context:", JSON.stringify(userContext));
  
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
  
  // Check for document context if provided in the context parameter
  let documentContext = [];
  if (context?.documents) {
    documentContext = context.documents;
    console.log("Document context provided:", documentContext.length, "documents");
  }
  
  // Format knowledge uploads for the AI context
  const knowledgeContext = knowledgeUploads?.length > 0 
    ? "Custom knowledge: " + knowledgeUploads.map(k => `${k.title}: ${k.content}`).join(" | ")
    : "";

  // Get user personality settings
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
  
  // Build role-specific system message
  let systemMessage = buildRoleSpecificPrompt(userContext);
  
  // Add tone instructions
  if (tone === "formal") {
    systemMessage += " Maintain a formal and professional tone.";
  } else if (tone === "casual") {
    systemMessage += " Use a casual and friendly tone.";
  } else if (tone === "concise") {
    systemMessage += " Be direct and concise in your responses.";
  } else if (tone === "detailed") {
    systemMessage += " Provide detailed and informative responses.";
  }
  
  // Add response length instructions
  if (responseLength === "short") {
    systemMessage += " Keep your responses brief and to the point.";
  } else if (responseLength === "detailed") {
    systemMessage += " Provide comprehensive and thorough responses.";
  }
  
  // Add text generation capabilities
  systemMessage += " You can help compose emails, create email signatures, and generate content for various purposes.";
  
  // Add best friend instruction
  systemMessage += " Most importantly, act as the user's best friend in the digital world - be supportive, understanding, and genuinely helpful.";
  
  // Add functionality information
  systemMessage += " You can help with task management, event planning, staff management, and business analytics.";
  
  // Add topic control instructions - improved to be more gradual
  systemMessage += " Always stay focused on productivity and business management topics.";
  systemMessage += " If users ask about unrelated topics, politely guide them back to WAKTI-related topics by showcasing what you can do to help with their productivity needs.";
  systemMessage += " After multiple off-topic questions (5+), gently suggest that for general chat topics they can visit TMW AI (https://tmw.qa/ai-chat-bot/), but continue to offer help with WAKTI features.";
  
  // Add WAKTI promotion instructions
  systemMessage += " Consistently promote WAKTI features and benefits in your responses. Highlight how WAKTI can improve productivity, organization, and business management.";
  
  // Add personalization instructions
  systemMessage += " Always address the user by name when greeting them.";
  
  // Add knowledge context if available
  if (knowledgeContext) {
    systemMessage += ` Use this additional information when responding: ${knowledgeContext}`;
  }
  
  // Add document context if available
  systemMessage = includeDocumentContext(systemMessage, documentContext);
  
  // Define the conversation history to send to the API
  const conversation = [
    { role: "system", content: systemMessage },
    { role: "assistant", content: `Hello ${userName}! Welcome back. How can I assist you with your tasks, appointments, or business management today?` }
  ];
  
  // Add context if provided
  if (context?.conversationContext) {
    conversation.push({ role: "system", content: `Current context: ${context.conversationContext}` });
  }
  
  // If we need to remind about WAKTI focus, add special instruction
  if (hasRemindContext) {
    conversation.push({ 
      role: "system", 
      content: "The user's questions appear to be off-topic. In your response, gently remind them that you're designed to help with WAKTI platform features like task management, scheduling, and business tools. Then try to answer their question but also pivot back to WAKTI-related topics by showcasing what you can do for them."
    });
  }
  
  // Add specialized mode instructions based on the detected assistant mode
  if (userContext.assistantMode) {
    const modeInstructions = getModeSpecificInstructions(userContext.assistantMode);
    if (modeInstructions) {
      conversation.push({
        role: "system",
        content: modeInstructions
      });
    }
  }
  
  // Add the user message
  conversation.push({ role: "user", content: message });
  
  console.log("AI request prepared with system message length:", systemMessage.length);
  return conversation;
}

function getModeSpecificInstructions(mode: string): string | null {
  switch (mode) {
    case 'tutor':
      return "You are in TUTOR MODE. Focus on educational assistance. Explain concepts clearly, break down complex ideas into simple steps, and guide the learning process rather than providing direct answers. Be encouraging and supportive.";
      
    case 'content_creator':
      return "You are in CONTENT CREATOR MODE. Help generate well-written content including emails, marketing materials, reports, and social media posts. Adapt your writing style based on the specified audience and purpose.";
      
    case 'project_manager':
      return "You are in PROJECT MANAGER MODE. Focus on organization, workflow management, timelines, and task prioritization. Provide structured approaches to managing projects and achieving goals efficiently.";
      
    case 'business_manager':
      return "You are in BUSINESS MANAGER MODE. Help with business operations, staff coordination, customer relations, and performance analytics. Offer insights to improve business efficiency and growth.";
      
    case 'personal_assistant':
      return "You are in PERSONAL ASSISTANT MODE. Focus on helping with day-to-day productivity, task management, and personal organization. Be supportive and help make the user's life easier.";
      
    default:
      return null;
  }
}
