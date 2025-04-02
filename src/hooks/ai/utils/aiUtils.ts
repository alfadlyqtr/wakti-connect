
import { supabase } from "@/integrations/supabase/client";

export async function fetchUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, display_name, business_name, account_type")
      .eq("id", userId)
      .single();
      
    if (error) throw error;
    
    // Determine first name from available fields
    let firstName = "there";
    if (data.display_name) {
      firstName = data.display_name.split(' ')[0];
    } else if (data.full_name) {
      firstName = data.full_name.split(' ')[0];
    } else if (data.business_name) {
      firstName = data.business_name;
    }
    
    return {
      firstName,
      accountType: data.account_type || "free",
      fullProfile: data
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { firstName: "there", accountType: "free", fullProfile: null };
  }
}

export async function callAIAssistant(
  token: string, 
  message: string, 
  userName: string = "",
  context: any = null
) {
  try {
    const response = await supabase.functions.invoke("ai-assistant", {
      body: { message, userName, context },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (response.error) {
      throw new Error(response.error.message || "Unknown AI assistant error");
    }
    
    return response.data;
  } catch (error) {
    console.error("Error calling AI assistant:", error);
    throw error;
  }
}

// Helper to detect off-topic messages
export function checkIfOffTopic(message: string): boolean {
  const message_lower = message.toLowerCase();
  
  // Keywords that likely indicate on-topic questions
  const onTopicKeywords = [
    'task', 'event', 'appointment', 'schedule', 'booking', 
    'business', 'customer', 'client', 'staff', 'employee',
    'analytics', 'report', 'dashboard', 'productivity', 'wakti',
    'organize', 'manage', 'reminder', 'deadline', 'project',
    'performance', 'meeting', 'calendar', 'todo', 'to-do',
    'contact', 'message', 'email', 'notification', 'work'
  ];
  
  // Check if the message contains any on-topic keywords
  const containsOnTopicKeyword = onTopicKeywords.some(keyword => 
    message_lower.includes(keyword)
  );
  
  // Definitely off-topic categories and their keywords
  const offTopicCategories = [
    // General chatbot requests
    ['tell me a joke', 'tell me a story', 'entertain me', 'trivia', 'fun fact'],
    // Controversial topics
    ['politics', 'religion', 'controversial'],
    // Content generation not related to productivity
    ['write a poem', 'song lyrics', 'fiction', 'creative writing'],
    // Generic knowledge questions
    ['what is the capital', 'how many people', 'who invented', 'when was']
  ];
  
  // Check if the message matches any definitely off-topic patterns
  const isDefinitelyOffTopic = offTopicCategories.some(category => 
    category.some(phrase => message_lower.includes(phrase))
  );
  
  // If it contains on-topic keywords, it's likely on-topic
  if (containsOnTopicKeyword) {
    return false;
  }
  
  // If it matches definite off-topic patterns, it's off-topic
  if (isDefinitelyOffTopic) {
    return true;
  }
  
  // For everything else, check message length as a heuristic
  // Very short, generic messages are more likely to be off-topic
  if (message.length < 15 && !containsOnTopicKeyword) {
    return true;
  }
  
  // Default to assuming it's on-topic
  return false;
}

// Generate text suggestions based on a topic
export function generateTextSuggestions(topic: string, tone: string = "professional") {
  switch (topic) {
    case "email_signature":
      return `
Best regards,
[Your Name]
[Your Position] | [Company Name]
Phone: [Your Phone Number]
Email: [Your Email]
[Website or LinkedIn URL]
      `.trim();
    
    case "meeting_request":
      return `
Subject: Request for Meeting - [Brief Topic]

Dear [Name],

I hope this email finds you well. I would like to schedule a meeting to discuss [specific topic/project]. 

Would you be available for a [duration] meeting on [suggested date/time]? If not, please let me know what dates and times would work better for you.

The agenda for our meeting would include:
1. [Agenda item 1]
2. [Agenda item 2]
3. [Agenda item 3]

I look forward to your response.

Best regards,
[Your Name]
      `.trim();
    
    case "customer_follow_up":
      return `
Subject: Follow-Up: [Reference to Previous Interaction]

Dear [Customer Name],

Thank you for [visiting our store/contacting our support team/your recent purchase] on [date]. I wanted to personally reach out to ensure that [your experience was satisfactory/your questions were answered/you're enjoying your purchase].

[Ask a specific question about their experience or product]

If you have any further questions or concerns, please don't hesitate to contact me directly.

Thank you for choosing [Company Name]. We value your business and look forward to serving you again.

Warm regards,
[Your Name]
[Your Position]
[Your Contact Information]
      `.trim();
    
    default:
      return "I can help you craft various types of content. Let me know what specific type of text you need assistance with!";
  }
}
