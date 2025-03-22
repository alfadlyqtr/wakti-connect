
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
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("Edge function called: fetch-staff-members");
    
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Get the session to verify the user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      console.error("Authentication error:", authError);
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const { businessId } = await req.json() as RequestBody
    console.log(`Fetching staff for business ID: ${businessId}`);

    // Verify the user is either the business owner or a staff member
    const isBusinessOwner = user.id === businessId
    
    if (!isBusinessOwner) {
      // Check if user is a staff member of this business
      const { data: staffData, error: staffError } = await supabaseClient
        .from('business_staff')
        .select('id')
        .eq('staff_id', user.id)
        .eq('business_id', businessId)
        .single()

      if (staffError || !staffData) {
        console.error("Authorization error:", staffError);
        return new Response(
          JSON.stringify({ success: false, error: 'Not authorized to view this business data' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Get all staff members for this business
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
      .neq('status', 'deleted')
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error('Error fetching staff:', fetchError);
      return new Response(
        JSON.stringify({ success: false, error: fetchError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Successfully retrieved ${staffMembers.length} staff members`);

    // Format the permissions for each staff member
    const formattedStaff = staffMembers.map(staff => ({
      ...staff,
      permissions: typeof staff.permissions === 'string' 
        ? JSON.parse(staff.permissions) 
        : staff.permissions,
      profile: staff.profiles ? {
        avatar_url: staff.profiles.avatar_url,
        full_name: staff.profiles.full_name
      } : null
    }))

    // Return the staff members
    return new Response(
      JSON.stringify({ success: true, staffMembers: formattedStaff }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in fetch-staff-members function:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
