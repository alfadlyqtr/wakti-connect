
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.32.0";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get auth token from request headers
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }
    
    const token = authHeader.replace('Bearer ', '');
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }
    
    // Create Supabase client with service role for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the user making the request to verify they're authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error("Auth error:", userError);
      throw new Error('Unauthorized: Invalid token');
    }
    
    // Parse request body for businessId
    const { businessId } = await req.json();
    
    if (!businessId) {
      throw new Error('Missing businessId parameter');
    }
    
    // Only allow if the requesting user is the business owner or a co-admin
    const isBusinessOwner = user.id === businessId;
    
    if (!isBusinessOwner) {
      const { data: isCoAdmin, error: coAdminError } = await supabase
        .from('business_staff')
        .select('id')
        .eq('staff_id', user.id)
        .eq('business_id', businessId)
        .eq('role', 'co-admin')
        .eq('status', 'active')
        .maybeSingle();
        
      if (coAdminError) throw coAdminError;
      
      if (!isCoAdmin) {
        throw new Error('Unauthorized: Only business owners or co-admins can manage staff');
      }
    }
    
    // Fetch staff members for this business with profile data
    const { data: staffMembers, error: staffError } = await supabase
      .from('business_staff')
      .select(`
        *,
        profiles:staff_id (
          avatar_url,
          full_name,
          email
        )
      `)
      .eq('business_id', businessId)
      .neq('status', 'deleted')
      .order('created_at', { ascending: false });
      
    if (staffError) {
      console.error("Error fetching staff:", staffError);
      throw new Error(`Failed to fetch staff: ${staffError.message}`);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        staffMembers: staffMembers 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error in fetch-staff-members function:", error.message);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "An unknown error occurred"
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 400 
      }
    );
  }
});
