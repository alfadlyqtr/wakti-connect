
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
    
    // Check if user is a staff member - staff cannot use AI
    const { data: staffData, error: staffError } = await supabaseClient
      .from('business_staff')
      .select('id')
      .eq('staff_id', user.id)
      .maybeSingle();
      
    if (!staffError && staffData) {
      console.log("User is a staff member, no AI access");
      return { canUseAI: false };
    }
    
    // First try with RPC function (more reliable)
    console.log("Attempting RPC function can_use_ai_assistant...");
    try {
      const { data: canUseAI, error: canUseAIError } = await supabaseClient.rpc(
        "can_use_ai_assistant"
      );

      // Log for troubleshooting
      console.log("RPC check result:", { canUseAI, error: canUseAIError ? canUseAIError.message : null });
      
      if (!canUseAIError && canUseAI !== null) {
        console.log("RPC check successful, result:", canUseAI);
        return { canUseAI };
      }
    } catch (rpcError) {
      console.error("Error calling RPC function:", rpcError);
      // Continue to fallback method
    }
    
    console.log("RPC check failed, falling back to direct profile check");
    
    // Fallback to direct profile check if RPC fails
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("account_type")
      .eq("id", user.id)
      .maybeSingle();
      
    if (profileError) {
      console.error("Error checking profile access:", profileError.message);
      // If no profile is found, create one with free account type
      if (profileError.code === "PGRST116") {
        console.log("Profile not found, attempting to create default profile");
        
        try {
          const { data: newProfile, error: createError } = await supabaseClient
            .from("profiles")
            .insert({
              id: user.id,
              account_type: "free",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .maybeSingle();
            
          if (createError) {
            console.error("Error creating default profile:", createError.message);
            return {
              error: new Response(
                JSON.stringify({ error: "Error creating default profile", details: createError.message }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
              ),
              canUseAI: false
            };
          }
          
          console.log("Created default profile with account type:", newProfile.account_type);
          // Free accounts cannot use AI assistant
          return { canUseAI: false };
        } catch (createError) {
          console.error("Exception creating default profile:", createError);
          return {
            error: new Response(
              JSON.stringify({ error: "Exception creating default profile", details: createError.message }),
              { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            ),
            canUseAI: false
          };
        }
      }
      
      return {
        error: new Response(
          JSON.stringify({ error: "Error fetching user profile", details: profileError.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        ),
        canUseAI: false
      };
    }
    
    // For debugging - log profile information
    console.log("Profile data:", profile);
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
      ),
      canUseAI: false
    };
  }
}
