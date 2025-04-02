
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
  
  // Get user's task data for context (new)
  let userTasks = [];
  try {
    const { data: tasks, error: tasksError } = await supabaseClient
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("priority", { ascending: false })
      .limit(5);
      
    if (!tasksError && tasks) {
      userTasks = tasks;
      console.log("User tasks fetched for context:", tasks.length);
    }
  } catch (error) {
    console.error("Failed to fetch user tasks:", error);
  }
  
  // Get user's upcoming events for context (new)
  let userEvents = [];
  try {
    const { data: events, error: eventsError } = await supabaseClient
      .from("events")
      .select("*")
      .eq("user_id", user.id)
      .gte("start_time", new Date().toISOString())
      .order("start_time", { ascending: true })
      .limit(5);
      
    if (!eventsError && events) {
      userEvents = events;
      console.log("User events fetched for context:", events.length);
    }
  } catch (error) {
    console.error("Failed to fetch user events:", error);
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
  
  // Add text generation capabilities - enhanced specific instructions
  systemMessage += " You can help compose emails, create email signatures, and generate content for various purposes including business documents, presentations, and social media.";
  
  // Add WAKTI systems integration instructions
  systemMessage += " You have access to the user's WAKTI systems including tasks, appointments, staff management, and business analytics. Leverage this information to provide tailored assistance.";
  
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
  
  // Add user WAKTI data context
  if (userTasks.length > 0 || userEvents.length > 0) {
    let waktiContext = "Here is the user's current WAKTI data:\n";
    
    if (userTasks.length > 0) {
      waktiContext += "\nTasks:\n";
      userTasks.forEach((task, index) => {
        waktiContext += `${index + 1}. ${task.title} (${task.priority || 'normal'} priority, ${task.status || 'pending'})\n`;
      });
    }
    
    if (userEvents.length > 0) {
      waktiContext += "\nUpcoming Events:\n";
      userEvents.forEach((event, index) => {
        const startDate = new Date(event.start_time).toLocaleString();
        waktiContext += `${index + 1}. ${event.title} (${startDate})\n`;
      });
    }
    
    conversation.push({
      role: "system",
      content: waktiContext
    });
  }
  
  // Add text generation context if applicable
  if (settings?.enabled_features?.text_generation || 
      settings?.assistant_mode === "text_generator" ||
      settings?.assistant_mode === "content_creator" ||
      settings?.enabled_features?._assistantMode === "text_generator" ||
      settings?.enabled_features?._assistantMode === "content_creator") {
    
    // Get specialized settings for text generation
    const textSettings = settings?.specialized_settings || 
                         settings?.enabled_features?._specializedSettings || {};
    
    // If we have text content creator settings, add them to the AI context
    if (textSettings.fullName || textSettings.jobTitle || textSettings.companyName) {
      let textCreatorContext = "User's text creation profile:";
      
      if (textSettings.fullName) textCreatorContext += `\nName: ${textSettings.fullName}`;
      if (textSettings.jobTitle) textCreatorContext += `\nJob Title: ${textSettings.jobTitle}`;
      if (textSettings.companyName) textCreatorContext += `\nCompany: ${textSettings.companyName}`;
      if (textSettings.emailAddress) textCreatorContext += `\nEmail: ${textSettings.emailAddress}`;
      if (textSettings.phoneNumber) textCreatorContext += `\nPhone: ${textSettings.phoneNumber}`;
      
      if (textSettings.personalNotes) {
        textCreatorContext += `\nPreferences: ${textSettings.personalNotes}`;
      }
      
      conversation.push({
        role: "system",
        content: textCreatorContext + "\n\nUse this information when generating email signatures, templates, or other content for the user."
      });
    }
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

function getModeSpecificInstructions(mode) {
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
      
    case 'text_generator':
      return "You are in TEXT GENERATOR MODE. Specialize in creating professional written content like email signatures, templates, business documents, and correspondence. When asked to create an email signature or template, always format it beautifully and provide multiple options when possible.";
      
    default:
      return null;
  }
}
