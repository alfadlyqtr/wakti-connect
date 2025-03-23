
// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/examples/deploy_deno_apps
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FetchStaffMembersRequest {
  businessId: string;
}

serve(async (req) => {
  console.log("Processing fetch-staff-members request");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = Deno.env.get('SUPABASE_URL') as string;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(url, serviceRoleKey);
    
    // Get auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }
    
    // Verify user is authenticated
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error("Auth error:", userError);
      throw new Error("Unauthorized");
    }
    
    console.log("Authenticated user:", user.id);
    
    // Get business ID from request
    const { businessId } = await req.json() as FetchStaffMembersRequest;
    
    if (!businessId) {
      throw new Error("Business ID is required");
    }
    
    console.log("Fetching staff for business:", businessId);
    
    // Fetch all staff members for this business
    const { data: staffMembers, error: staffError } = await supabase
      .from('business_staff')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });
      
    if (staffError) {
      console.error("DB error:", staffError);
      throw new Error(staffError.message);
    }
    
    // Use service role to fetch additional profile data
    console.log(`Found ${staffMembers?.length || 0} staff members`);
    
    return new Response(JSON.stringify({
      success: true,
      staffMembers: staffMembers || [],
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
    
  } catch (error) {
    console.error("Error in fetch-staff-members:", error.message);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status: 400,
    });
  }
});
