
import { supabase } from "@/integrations/supabase/client";

export const checkIfOffTopic = (message: string): boolean => {
  const waktiKeywords = [
    'task', 'event', 'booking', 'schedule', 'appointment', 
    'business', 'staff', 'wakti', 'meeting', 'calendar', 
    'deadline', 'project', 'reminder', 'todo', 'productivity'
  ];
  
  const messageLower = message.toLowerCase();
  
  // Check if any WAKTI keywords are in the message
  return !waktiKeywords.some(keyword => messageLower.includes(keyword));
};

export const fetchUserProfile = async (userId: string): Promise<{ firstName: string }> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, display_name")
      .eq("id", userId)
      .single();
      
    if (error) {
      console.error("Error fetching user profile:", error);
      return { firstName: "" };
    }
    
    let name = "";
    if (data?.display_name) {
      name = data.display_name.split(" ")[0]; // Get first name
    } else if (data?.full_name) {
      name = data.full_name.split(" ")[0]; // Get first name
    }
    
    return { firstName: name };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { firstName: "" };
  }
};

export const callAIAssistant = async (
  token: string,
  message: string,
  userName?: string
): Promise<{ response: string }> => {
  const response = await fetch("https://sqdjqehcxpzsudhzjwbu.supabase.co/functions/v1/ai-assistant", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ 
      message,
      userName
    }),
  });
  
  if (!response.ok) {
    let errorMessage = "Error communicating with AI assistant";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (e) {
      console.error("Failed to parse error response:", e);
    }
    throw new Error(errorMessage);
  }
  
  const data = await response.json();
  
  if (!data || !data.response) {
    throw new Error("Unexpected response format from AI assistant");
  }
  
  return data;
};
