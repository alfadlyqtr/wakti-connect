
export async function saveConversation(userId, message, response, supabaseClient) {
  try {
    await supabaseClient
      .from("ai_conversations")
      .insert({
        user_id: userId,
        message: message,
        response: response
      });
    
    return { success: true };
  } catch (error) {
    console.error("Error saving conversation:", error);
    // We don't want to fail the whole request if just saving fails
    return { success: false, error };
  }
}
