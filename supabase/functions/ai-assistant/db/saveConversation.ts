
export async function saveConversation(userId, message, response, supabaseClient) {
  console.log("Saving conversation for user:", userId);
  
  try {
    const { data, error } = await supabaseClient
      .from("ai_conversations")
      .insert({
        user_id: userId,
        message: message,
        response: response
      });
      
    if (error) {
      console.error("Error saving conversation:", error.message);
      return { success: false, error: error.message };
    }
    
    console.log("Conversation saved successfully");
    return { success: true, data };
  } catch (error) {
    console.error("Exception saving conversation:", error);
    // We don't want to fail the whole request if just saving fails
    return { success: false, error: error.message };
  }
}
