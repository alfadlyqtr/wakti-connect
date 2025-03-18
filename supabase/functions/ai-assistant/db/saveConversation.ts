
export async function saveConversation(userId, message, response, supabaseClient) {
  console.log("Saving conversation for user:", userId);
  
  try {
    // First check if the record already exists to prevent duplicates
    const { data: existingData, error: checkError } = await supabaseClient
      .from("ai_conversations")
      .select("id")
      .eq("user_id", userId)
      .eq("message", message)
      .limit(1);
      
    if (checkError) {
      console.error("Error checking existing conversation:", checkError.message);
    } else if (existingData && existingData.length > 0) {
      console.log("Conversation already exists, skipping save");
      return { success: true, data: existingData[0] };
    }
    
    // Insert new conversation record
    const { data, error } = await supabaseClient
      .from("ai_conversations")
      .insert({
        user_id: userId,
        message: message,
        response: response
      })
      .select()
      .maybeSingle();
      
    if (error) {
      console.error("Error saving conversation:", error.message);
      // Log additional details for debugging
      console.error("Error code:", error.code);
      console.error("Error details:", error.details);
      return { success: false, error: error.message };
    }
    
    console.log("Conversation saved successfully with ID:", data?.id);
    return { success: true, data };
  } catch (error) {
    console.error("Exception saving conversation:", error);
    console.error("Error stack:", error.stack);
    // We don't want to fail the whole request if just saving fails
    return { success: false, error: error.message };
  }
}
