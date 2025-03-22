
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.36.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  businessId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS preflight request");
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("Edge function called: fetch-staff-members");
    
    // Extract authorization token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("Missing Authorization header");
      return new Response(
        JSON.stringify({ success: false, error: 'Missing Authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { 
        global: { 
          headers: { Authorization: authHeader } 
        } 
      }
    )

    // Get the session to verify the user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      console.error("Authentication error:", authError);
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized', details: authError?.message }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    let businessId;
    try {
      const requestData = await req.json();
      businessId = requestData.businessId;
      
      if (!businessId) {
        console.error("Missing businessId in request");
        return new Response(
          JSON.stringify({ success: false, error: 'Missing businessId parameter' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      console.log(`Fetching staff for business ID: ${businessId}`);
      console.log(`Authenticated user ID: ${user.id}`);
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid request body format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify the user is either the business owner or a staff member
    const isBusinessOwner = user.id === businessId;
    console.log(`Is business owner: ${isBusinessOwner}`);
    
    let isStaffMember = false;
    
    if (!isBusinessOwner) {
      // Check if user is a staff member of this business
      console.log("Not business owner, checking if staff member");
      const { data: staffData, error: staffError } = await supabaseClient
        .from('business_staff')
        .select('id')
        .eq('staff_id', user.id)
        .eq('business_id', businessId)
        .neq('status', 'deleted')
        .maybeSingle();

      if (staffError) {
        console.error("Error checking staff status:", staffError);
      } else {
        isStaffMember = !!staffData;
      }
      
      console.log("Is staff member:", isStaffMember);
      
      if (!isStaffMember) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Not authorized to view this business data',
            details: 'User is neither the business owner nor a staff member'
          }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Get all staff members for this business - using service role to bypass RLS
    console.log("Fetching business_staff records");
    const { data: staffMembers, error: fetchError } = await supabaseClient
      .from('business_staff')
      .select(`
        *,
        profiles:staff_id (
          avatar_url,
          full_name
        )
      `)
      .eq('business_id', businessId)
      .neq('status', 'deleted');
      
    if (fetchError) {
      console.error('Error fetching staff:', fetchError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: fetchError.message,
          details: 'Error occurred while querying the business_staff table' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Found ${staffMembers?.length || 0} staff members`);

    // Format the permissions for each staff member
    const formattedStaff = staffMembers?.map(staff => {
      // Parse JSON permissions if stored as string
      let parsedPermissions;
      try {
        parsedPermissions = typeof staff.permissions === 'string' 
          ? JSON.parse(staff.permissions) 
          : staff.permissions;
      } catch (e) {
        console.error("Error parsing permissions:", e);
        parsedPermissions = {};
      }
      
      return {
        ...staff,
        permissions: parsedPermissions,
        profile: staff.profiles ? {
          avatar_url: staff.profiles.avatar_url,
          full_name: staff.profiles.full_name
        } : null
      };
    }) || [];

    // Return the staff members
    return new Response(
      JSON.stringify({ success: true, staffMembers: formattedStaff }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in fetch-staff-members function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'An unexpected error occurred',
        details: 'Exception caught in the main try/catch block'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
