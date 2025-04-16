
import { corsHeaders } from "../utils/cors.ts";

// SIMPLIFIED: Trust the account type from user metadata only
export async function checkUserAccess(user, supabaseClient) {
  try {
    if (!user || !user.id) {
      console.error("Invalid user object provided to checkUserAccess");
      return {
        error: new Response(
          JSON.stringify({ error: "Invalid user" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        ),
        canUseAI: false
      };
    }
    
    console.log("Checking user access for user ID:", user.id);
    
    // SIMPLIFIED: Only trust the account type from metadata - this is the single source of truth
    const accountType = user.user_metadata?.account_type;
    const canUseAI = accountType === 'business' || accountType === 'individual';
    
    console.log("User access check result:", canUseAI, "Account type:", accountType);
    return { canUseAI };
    
  } catch (error) {
    console.error("Error checking user access:", error.message);
    console.error(error.stack);
    return {
      error: new Response(
        JSON.stringify({ error: "Error checking user access", details: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      ),
      canUseAI: false
    };
  }
}
