
import { corsHeaders } from "../utils/cors.ts";

export async function checkUserAccess(user, supabaseClient) {
  try {
    // First try with RPC function
    const { data: canUseAI, error: canUseAIError } = await supabaseClient.rpc(
      "can_use_ai_assistant"
    );

    // Log for troubleshooting
    console.log("Can use AI check:", { canUseAI, error: canUseAIError });
    
    if (canUseAIError) {
      // Fallback to direct profile check if RPC fails
      const { data: profile, error: profileError } = await supabaseClient
        .from("profiles")
        .select("account_type")
        .eq("id", user.id)
        .single();
        
      if (profileError) {
        console.error("Error checking profile access:", profileError);
        return {
          error: new Response(
            JSON.stringify({ error: "Error fetching user profile" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          )
        };
      }
      
      // Log profile data for troubleshooting
      console.log("User profile:", profile);
      
      return {
        canUseAI: profile.account_type === "business" || profile.account_type === "individual"
      };
    }
    
    return { canUseAI };
  } catch (error) {
    console.error("Error checking user access:", error);
    return {
      error: new Response(
        JSON.stringify({ error: "Error checking user access" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    };
  }
}
