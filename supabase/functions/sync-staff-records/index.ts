
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.32.0";

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
    
    console.log("Request made by user:", user.id);

    // Check if the requesting user is a business account
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', user.id)
      .single();
      
    if (profileError || profile?.account_type !== 'business') {
      throw new Error('Only business accounts can sync staff records');
    }
    
    const businessId = user.id;
    console.log("Business ID for sync:", businessId);
    
    // Find all auth users with this business_id in metadata but missing from business_staff
    const { data: staffUsers, error: staffUsersError } = await supabase.auth.admin.listUsers();
    
    if (staffUsersError) {
      console.error("Error listing users:", staffUsersError);
      throw new Error('Failed to list users');
    }
    
    // Filter users that have this business_id in metadata
    const potentialStaffUsers = staffUsers.users.filter(u => 
      u.user_metadata?.business_id === businessId || 
      u.user_metadata?.is_staff === true
    );
    
    console.log(`Found ${potentialStaffUsers.length} potential staff users`);
    
    // Check which ones are missing from business_staff
    const syncedUsers = [];
    const errors = [];
    
    for (const staffUser of potentialStaffUsers) {
      // Check if already exists in business_staff
      const { data: existingStaff, error: existingStaffError } = await supabase
        .from('business_staff')
        .select('id')
        .eq('staff_id', staffUser.id)
        .eq('business_id', businessId)
        .maybeSingle();
        
      if (existingStaffError) {
        console.error(`Error checking existing staff for ${staffUser.id}:`, existingStaffError);
        errors.push({ userId: staffUser.id, error: existingStaffError.message });
        continue;
      }
      
      // If already exists, skip
      if (existingStaff) {
        console.log(`Staff record already exists for ${staffUser.id}`);
        continue;
      }
      
      // Generate staff number
      const { data: businessData } = await supabase
        .from('profiles')
        .select('business_name')
        .eq('id', businessId)
        .single();
        
      const businessPrefix = businessData?.business_name 
        ? businessData.business_name.substring(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, '')
        : 'BUS';
        
      const { count } = await supabase
        .from('business_staff')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', businessId);
        
      const staffNumber = `${businessPrefix}_Staff${String((count || 0) + 1).padStart(3, '0')}`;
      
      // Create business_staff record
      const { data: newStaff, error: newStaffError } = await supabase
        .from('business_staff')
        .insert({
          business_id: businessId,
          staff_id: staffUser.id,
          name: staffUser.user_metadata?.full_name || staffUser.email?.split('@')[0] || 'Staff Member',
          email: staffUser.email,
          position: staffUser.user_metadata?.position || 'Staff Member',
          role: staffUser.user_metadata?.staff_role || 'staff',
          staff_number: staffNumber,
          is_service_provider: false,
          permissions: {
            can_view_tasks: true,
            can_manage_tasks: false,
            can_message_staff: true,
            can_manage_bookings: false,
            can_create_job_cards: false,
            can_track_hours: true,
            can_log_earnings: false,
            can_edit_profile: true,
            can_view_customer_bookings: false,
            can_view_analytics: false
          },
          status: 'active'
        })
        .select()
        .single();
        
      if (newStaffError) {
        console.error(`Error creating staff for ${staffUser.id}:`, newStaffError);
        errors.push({ userId: staffUser.id, error: newStaffError.message });
        continue;
      }
      
      console.log(`Created staff record for ${staffUser.id}`);
      syncedUsers.push(newStaff);
      
      // Create automatic contact relationship for messaging
      await supabase
        .from('user_contacts')
        .insert([
          {
            user_id: businessId,
            contact_id: staffUser.id,
            status: 'accepted',
            staff_relation_id: newStaff.id
          },
          {
            user_id: staffUser.id,
            contact_id: businessId,
            status: 'accepted',
            staff_relation_id: newStaff.id
          }
        ]);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Synced ${syncedUsers.length} staff records`,
        data: { 
          synced: syncedUsers,
          errors: errors
        }
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
    console.error("Error in sync-staff-records function:", error.message);
    
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
