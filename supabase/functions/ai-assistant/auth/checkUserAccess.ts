
import { corsHeaders } from "../utils/cors.ts";

export async function checkUserAccess(user, supabaseClient) {
  try {
    console.log("Checking user access for user ID:", user.id);
    
    // First try with RPC function (more reliable)
    console.log("Attempting RPC function can_use_ai_assistant...");
    const { data: canUseAI, error: canUseAIError } = await supabaseClient.rpc(
      "can_use_ai_assistant"
    );

    // Log for troubleshooting
    console.log("RPC check result:", { canUseAI, error: canUseAIError ? canUseAIError.message : null });
    
    if (!canUseAIError && canUseAI !== null) {
      console.log("RPC check successful, result:", canUseAI);
      return { canUseAI };
    }
    
    console.log("RPC check failed, falling back to direct profile check");
    
    // Fallback to direct profile check if RPC fails
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("account_type")
      .eq("id", user.id)
      .single();
      
    if (profileError) {
      console.error("Error checking profile access:", profileError.message);
      return {
        error: new Response(
          JSON.stringify({ error: "Error fetching user profile", details: profileError.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      };
    }
    
    // Log profile data for troubleshooting
    console.log("Profile check successful, account type:", profile?.account_type);
    
    // Check if the account type is valid for AI access
    const canAccess = profile?.account_type === "business" || profile?.account_type === "individual";
    console.log("Can access AI:", canAccess);
    
    return { canUseAI: canAccess };
  } catch (error) {
    console.error("Error checking user access:", error.message);
    console.error(error.stack);
    return {
      error: new Response(
        JSON.stringify({ error: "Error checking user access", details: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    };
  }
}
