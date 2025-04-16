
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../utils/cors.ts";

export async function authenticateUser(req) {
  console.log("Bypassing authentication - AI access allowed for all requests");
  
  // Create an anonymous/default user object that will always work
  const defaultUser = {
    id: 'anonymous-user',
    user_metadata: {
      account_type: 'business' // Always provide business-level access
    }
  };
  
  // Create Supabase client for potential data access
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.log("Missing Supabase environment variables, but continuing anyway");
    return { user: defaultUser, supabaseClient: null };
  }

  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  
  // Always return success with default user
  console.log("Authentication bypassed, using default user");
  return { user: defaultUser, supabaseClient };
}
