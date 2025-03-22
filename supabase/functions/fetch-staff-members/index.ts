
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
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }
    
    // Create Supabase client with service role for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the user making the request to verify they're authenticated
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error("Auth error:", userError);
      throw new Error('Unauthorized: Invalid token');
    }
    
    // Parse request body to get businessId
    const { businessId } = await req.json();
    
    if (!businessId) {
      throw new Error('Missing business ID');
    }
    
    console.log("Fetch staff members for business:", businessId, "by user:", user.id);
    
    // Verify the user is the business owner
    if (user.id !== businessId) {
      // Check if user is a co-admin
      const { data: staffData, error: staffError } = await supabase
        .from('business_staff')
        .select('role')
        .eq('staff_id', user.id)
        .eq('business_id', businessId)
        .eq('status', 'active')
        .single();
        
      if (staffError || !staffData || staffData.role !== 'co-admin') {
        throw new Error('Unauthorized: Only business owners or co-admins can view staff');
      }
    }
    
    // Fetch staff members for the business
    const { data: staffData, error: staffError } = await supabase
      .from('business_staff')
      .select('*')
      .eq('business_id', businessId)
      .neq('status', 'deleted');
      
    if (staffError) {
      console.error("Error fetching staff:", staffError);
      throw new Error(`Failed to fetch staff: ${staffError.message}`);
    }
    
    console.log("Found", staffData.length, "staff members");
    
    // Fetch profiles for each staff member
    const staffWithProfiles = await Promise.all(
      staffData.map(async (staff) => {
        if (!staff.staff_id) {
          console.log("Staff record has no staff_id:", staff.id);
          return {
            ...staff,
            profile: { 
              full_name: staff.name, 
              avatar_url: staff.profile_image_url || null 
            }
          };
        }
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', staff.staff_id)
          .single();
          
        if (profileError) {
          console.log("Could not fetch profile for staff_id", staff.staff_id, profileError);
        }
          
        return {
          ...staff,
          profile: profileError ? { 
            full_name: staff.name, 
            avatar_url: staff.profile_image_url || null 
          } : {
            ...profileData,
            avatar_url: profileData?.avatar_url || staff.profile_image_url || null
          }
        };
      })
    );
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        staffMembers: staffWithProfiles 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 200 
      }
    );
  } catch (error: any) {
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
