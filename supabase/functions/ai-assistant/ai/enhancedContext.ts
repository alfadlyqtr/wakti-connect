
/**
 * Enhanced context handling for the AI assistant
 * This module extends the AI's context with user role information,
 * specialized modes, and document intelligence
 */

export interface UserRoleContext {
  accountType: string; // 'business', 'individual', 'free'
  userRole?: string; // 'student', 'professional', 'business_owner', etc.
  assistantMode?: string; // 'tutor', 'project_manager', 'content_creator', etc.
  specializedSettings?: Record<string, any>; // Mode-specific settings
}

export interface DocumentContext {
  documentType?: string;
  documentContent?: string;
  documentTitle?: string;
}

export async function enrichUserContext(supabaseClient: any, userId: string): Promise<UserRoleContext> {
  console.log("Enriching user context for:", userId);
  
  try {
    // Get basic profile data
    const { data: profileData, error: profileError } = await supabaseClient
      .from("profiles")
      .select("account_type, business_name, full_name, occupation")
      .eq("id", userId)
      .single();
      
    if (profileError) {
      console.error("Error fetching profile data:", profileError);
      return { accountType: 'free' };
    }
    
    // Get enhanced AI settings
    const { data: aiSettings, error: aiError } = await supabaseClient
      .from("ai_assistant_settings")
      .select("user_role, assistant_mode, specialized_settings")
      .eq("user_id", userId)
      .single();
    
    if (aiError && aiError.code !== "PGRST116") { // Not found is ok
      console.error("Error fetching AI settings:", aiError);
    }
    
    // Determine account type from profile
    const accountType = profileData?.account_type || 'free';
    
    // Check if this is a business account with staff
    let isBusinessWithStaff = false;
    if (accountType === 'business') {
      const { count, error: staffError } = await supabaseClient
        .from("business_staff")
        .select("id", { count: 'exact', head: true })
        .eq("business_id", userId);
        
      if (!staffError) {
        isBusinessWithStaff = count > 0;
      }
    }
    
    // Determine appropriate user role if not explicitly set
    let userRole = aiSettings?.user_role;
    if (!userRole) {
      if (accountType === 'business') {
        userRole = 'business_owner';
      } else if (profileData?.occupation?.toLowerCase().includes('student')) {
        userRole = 'student';
      } else {
        userRole = 'professional';
      }
    }
    
    // Determine appropriate assistant mode if not explicitly set
    let assistantMode = aiSettings?.assistant_mode;
    if (!assistantMode) {
      if (userRole === 'student') {
        assistantMode = 'tutor';
      } else if (userRole === 'business_owner') {
        assistantMode = isBusinessWithStaff ? 'business_manager' : 'business_assistant';
      } else {
        assistantMode = 'personal_assistant';
      }
    }
    
    return {
      accountType,
      userRole,
      assistantMode,
      specializedSettings: aiSettings?.specialized_settings || {}
    };
  } catch (error) {
    console.error("Error in enrichUserContext:", error);
    return { accountType: 'free' };
  }
}

export function buildRoleSpecificPrompt(userContext: UserRoleContext): string {
  // Default base prompt
  let basePrompt = "You are WAKTI AI, a helpful AI assistant for the WAKTI productivity platform. ";
  
  // Add role-specific customization
  switch (userContext.userRole) {
    case 'student':
      basePrompt += "You specialize in tutoring, homework help, and study planning. " +
        "You can explain concepts clearly, help structure essays, and provide learning guidance. " +
        "Focus on educational assistance and academic organization.";
      break;
      
    case 'professional':
      basePrompt += "You focus on professional productivity, work planning, and communication assistance. " +
        "You can help draft emails, manage projects, prioritize tasks, and enhance work efficiency. " +
        "Focus on professional development and workplace productivity.";
      break;
      
    case 'business_owner':
      basePrompt += "You specialize in business operations, staff coordination, and customer communication. " +
        "You can help with marketing copy, business analytics insights, and operational efficiency. " +
        "Focus on growing the business and streamlining operations.";
      break;
      
    default:
      basePrompt += "You help with task management, event planning, and productivity optimization. " +
        "You can assist with personal and professional organization.";
  }
  
  // Add assistant mode customization
  switch (userContext.assistantMode) {
    case 'tutor':
      basePrompt += " In tutor mode, you're particularly good at breaking down complex concepts, " +
        "providing step-by-step explanations, and guiding the learning process without giving direct answers. " +
        "You're encouraging and help build confidence in learning.";
      break;
      
    case 'content_creator':
      basePrompt += " In content creator mode, you excel at generating written content, " +
        "including emails, marketing copy, social media posts, and professional documents. " +
        "You can adapt your writing style based on the audience and purpose.";
      break;
      
    case 'project_manager':
      basePrompt += " In project manager mode, you help organize workflows, track progress, " +
        "set deadlines, and coordinate multiple tasks. You focus on efficiency, " +
        "timelines, and ensuring projects stay on track.";
      break;
      
    case 'business_manager':
      basePrompt += " In business manager mode, you assist with staff coordination, " +
        "business analytics, customer relationships, and operational optimization. " +
        "You provide insights to improve business performance and growth.";
      break;
  }
  
  // Add account type limitations
  if (userContext.accountType === 'free') {
    basePrompt += " However, as this is a free account, your capabilities are limited. " +
      "You should encourage upgrading to Individual or Business plans for full functionality.";
  }
  
  return basePrompt;
}

export function includeDocumentContext(basePrompt: string, documents: DocumentContext[]): string {
  if (!documents || documents.length === 0) {
    return basePrompt;
  }
  
  let enhancedPrompt = basePrompt + " You have the following document context to reference:";
  
  documents.forEach((doc, index) => {
    enhancedPrompt += `\n\nDocument ${index + 1}: ${doc.documentTitle || 'Untitled'}\nType: ${doc.documentType || 'Unknown'}\n${doc.documentContent || 'No content provided'}`;
  });
  
  enhancedPrompt += "\n\nPlease use this information when relevant to your responses.";
  
  return enhancedPrompt;
}
