
import { corsHeaders } from "../utils/cors.ts";

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
    
    // Get the account type directly from user metadata first (most reliable)
    const accountType = user.user_metadata?.account_type;
    if (accountType === 'business' || accountType === 'individual') {
      console.log("User can access AI based on metadata account type:", accountType);
      return { canUseAI: true };
    }
    
    // Check profile data as fallback
    console.log("Checking profile data for account type");
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("account_type")
      .eq("id", user.id)
      .maybeSingle();
      
    if (!profileError && profile) {
      const profileAccountType = profile.account_type;
      console.log("Profile check successful, account type:", profileAccountType);
      
      // Check if the account type is valid for AI access
      const canAccess = profileAccountType === "business" || profileAccountType === "individual";
      console.log("Can access AI based on profile:", canAccess);
      
      return { canUseAI: canAccess };
    }
    
    // Default to denying access if all checks fail
    console.log("All access checks failed, denying access");
    return { canUseAI: false };
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
