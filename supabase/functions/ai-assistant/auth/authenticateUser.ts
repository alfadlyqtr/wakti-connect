
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../utils/cors.ts";

export async function authenticateUser(req) {
  console.log("Authenticating user from request...");
  
  // Create authenticated Supabase client
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing environment variables for authentication");
    return {
      error: new Response(
        JSON.stringify({ error: "Server configuration error: Missing environment variables" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    };
  }

  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  
  // Get auth user
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    console.error("Missing Authorization header");
    return {
      error: new Response(
        JSON.stringify({ error: "Missing Authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    };
  }
  
  // Get the token from the Authorization header
  const token = authHeader.replace("Bearer ", "");
  console.log("Token received, verifying...");
  
  // Verify the token and get the user
  try {
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError) {
      console.error("Authentication error:", userError.message);
      return {
        error: new Response(
          JSON.stringify({ error: "Unauthorized: " + userError.message }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      };
    }
    
    if (!user) {
      console.error("No user found for token");
      return {
        error: new Response(
          JSON.stringify({ error: "Unauthorized: No user found" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      };
    }

    console.log("Authenticated user:", user.id);
    return { user, supabaseClient };
  } catch (error) {
    console.error("Unexpected error during authentication:", error);
    return {
      error: new Response(
        JSON.stringify({ error: "Authentication failed: " + error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    };
  }
}
