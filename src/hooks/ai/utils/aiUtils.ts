
import { supabase } from "@/integrations/supabase/client";
import { AIMessage } from "@/types/ai-assistant.types";

// Fetch user profile information
export const fetchUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, display_name")
      .eq("id", userId)
      .single();
    
    if (error) throw error;
    
    let firstName = "User";
    
    if (data.display_name) {
      const nameParts = data.display_name.split(" ");
      firstName = nameParts[0];
    } else if (data.full_name) {
      const nameParts = data.full_name.split(" ");
      firstName = nameParts[0];
    }
    
    return { firstName };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { firstName: "User" };
  }
};

// Call AI Assistant
export const callAIAssistant = async (token: string, message: string, userName: string = "", context: any = {}) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ message, userName, context }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error calling AI assistant:", error);
    throw error;
  }
};

// Check if a message appears to be off-topic
export const checkIfOffTopic = (message: string): boolean => {
  // List of keywords and patterns related to WAKTI functionality
  const waktiKeywords = [
    'task', 'event', 'appointment', 'schedule', 'booking', 'business',
    'reminder', 'to-do', 'todo', 'priority', 'deadline', 'meeting',
    'project', 'staff', 'customer', 'client', 'service', 'wakti'
  ];
  
  // Convert to lowercase for case-insensitive matching
  const lowerMessage = message.toLowerCase();
  
  // Check if any WAKTI keyword is present in the message
  const containsWaktiKeyword = waktiKeywords.some(keyword => 
    lowerMessage.includes(keyword)
  );
  
  // If message contains WAKTI keywords, it's on-topic
  if (containsWaktiKeyword) {
    return false;
  }
  
  // Check for greeting patterns (which are acceptable)
  const greetingPatterns = [
    /^hi\b/i, /^hello\b/i, /^hey\b/i, /^greetings/i,
    /^good morning/i, /^good afternoon/i, /^good evening/i
  ];
  
  const isGreeting = greetingPatterns.some(pattern => 
    pattern.test(lowerMessage)
  );
  
  if (isGreeting && lowerMessage.length < 20) {
    return false; // Simple greetings are fine
  }
  
  // Questions about capabilities are on-topic
  if (lowerMessage.includes('what can you do') || 
      lowerMessage.includes('how can you help') || 
      lowerMessage.includes('your capabilities')) {
    return false;
  }
  
  // Check for problematic patterns that suggest off-topic requests
  const offTopicPatterns = [
    /tell me about (.{10,})/i, // General knowledge questions
    /what is (.{10,})/i,       // Definition questions
    /who is/i,                 // Person questions
    /where is/i,               // Location questions
    /when was/i,               // Historical questions
    /how to (.{10,})/i,        // General how-to questions
    /explain/i,                // Explanation requests
    /meaning of/i,             // Definition requests
    /difference between/i,     // Comparison requests
    /write (.{10,})/i,         // General writing requests
    /generate (.{10,})/i,      // Generation requests unrelated to WAKTI
    /create (.{10,})/i,        // Creation requests unrelated to WAKTI
  ];
  
  // If it matches an off-topic pattern and has no WAKTI keywords, likely off-topic
  return offTopicPatterns.some(pattern => pattern.test(lowerMessage));
};

// Process documents
export const processDocument = async (file: File) => {
  if (!file) return null;
  
  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File too large. Maximum size is 5MB.");
  }
  
  // Check file type
  const allowedTypes = [
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Unsupported file type. Please upload PDF, Word, TXT, CSV, or Excel files.");
  }
  
  try {
    // For this MVP, we'll just read text files directly
    // For PDFs and other formats, we'd normally use a service like Supabase Functions
    if (file.type === 'text/plain') {
      const text = await file.text();
      
      // Create a simple document object
      return {
        id: Date.now().toString(),
        title: file.name,
        content: text.slice(0, 5000), // Limit content size
        document_type: 'text',
        created_at: new Date().toISOString()
      };
    }
    
    // For other file types, we'll just create a placeholder
    // In a real implementation, you'd process these through a Supabase function
    return {
      id: Date.now().toString(),
      title: file.name,
      content: `This is a placeholder for the content of ${file.name}`,
      document_type: file.type,
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error processing document:", error);
    throw new Error("Failed to process document. Please try again.");
  }
};
