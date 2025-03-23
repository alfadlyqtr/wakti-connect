
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.32.0";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

// Utility function to create a Supabase client
function createSupabaseClient(url: string, key: string, token?: string) {
  const options = token ? { global: { headers: { Authorization: `Bearer ${token}` } } } : undefined;
  return createClient(url, key, options);
}

// Verify user is authenticated and is a business account
async function verifyBusinessAccount(supabase: any, userId: string) {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('account_type')
    .eq('id', userId)
    .single();
    
  if (profileError) {
    throw new Error(`Failed to verify account type: ${profileError.message}`);
  }
  
  if (profile.account_type !== 'business') {
    throw new Error('Only business accounts can create staff members');
  }

  return profile;
}

// Check if a co-admin already exists when trying to create one
async function checkCoAdminLimit(supabase: any, businessId: string, isCoAdmin: boolean) {
  if (!isCoAdmin) return;
  
  const { data: coAdmins, error: coAdminError } = await supabase
    .from('business_staff')
    .select('id')
    .eq('business_id', businessId)
    .eq('role', 'co-admin')
    .eq('status', 'active');
    
  if (coAdminError) {
    console.error("Error checking co-admin:", coAdminError);
  } else if (coAdmins && coAdmins.length > 0) {
    throw new Error("Only one Co-Admin is allowed per business");
  }
}

// Process and upload avatar image
async function processAvatar(supabase: any, avatarData: string, userId: string) {
  if (!avatarData || !avatarData.startsWith('data:')) {
    return null;
  }

  try {
    // Extract the base64 data
    const base64Data = avatarData.split(',')[1];
    const fileExt = avatarData.split(';')[0].split('/')[1];
    const fileName = `staff-avatar-${userId}.${fileExt}`;
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(`staff/${fileName}`, Uint8Array.from(atob(base64Data), c => c.charCodeAt(0)), {
        contentType: `image/${fileExt}`,
        upsert: true
      });
      
    if (uploadError) {
      console.error("Avatar upload error:", uploadError);
      return null;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(`staff/${fileName}`);
        
    return publicUrl;
  } catch (error) {
    console.error("Error processing avatar:", error);
    return null;
  }
}

// Prepare final permissions object
function preparePermissions(permissions: any) {
  return {
    can_view_tasks: true,
    can_manage_tasks: false,
    can_message_staff: true,
    can_manage_bookings: false,
    can_create_job_cards: false,
    can_track_hours: true,
    can_log_earnings: false,
    can_edit_profile: true,
    can_view_customer_bookings: false,
    can_view_analytics: false,
    can_update_task_status: false,
    can_update_booking_status: false,
    can_update_profile: true,
    ...permissions
  };
}

// Create the auth user account
async function createAuthUser(supabase: any, userData: any, businessId: string) {
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: userData.email,
    password: userData.password,
    email_confirm: true,
    user_metadata: {
      full_name: userData.fullName,
      account_type: 'staff',
      display_name: userData.fullName,
      business_id: businessId,
      is_staff: true
    }
  });
  
  if (authError) {
    throw new Error(`Failed to create auth user: ${authError.message}`);
  }
  
  if (!authData.user) {
    throw new Error("Failed to create user account");
  }

  console.log("Created auth user:", authData.user.id);
  
  return authData.user;
}

// Create staff record in business_staff table
async function createStaffRecord(supabase: any, staffData: any, userId: string, authUser: any, avatarUrl: string | null) {
  const permissions = preparePermissions(staffData.permissions);
  const role = staffData.permissions?.isCoAdmin ? 'co-admin' : staffData.role || 'staff';
  
  const { data: staffRecord, error: staffError } = await supabase
    .from('business_staff')
    .insert({
      business_id: userId,
      staff_id: authUser.id,
      name: staffData.fullName,
      email: staffData.email,
      position: staffData.position || 'Staff Member',
      role: role,
      is_service_provider: staffData.isServiceProvider || false,
      permissions: permissions,
      profile_image_url: avatarUrl,
      status: 'active'
    })
    .select()
    .single();
    
  if (staffError) {
    throw new Error(`Failed to create staff record: ${staffError.message}`);
  }
  
  return staffRecord;
}

// Update profile table with staff information
async function updateProfile(supabase: any, userId: string, fullName: string, avatarUrl: string | null) {
  await supabase
    .from('profiles')
    .upsert({
      id: userId,
      full_name: fullName,
      account_type: 'staff',
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString()
    });
}

// Create automatic contact relationships for messaging
async function createContactRelationships(supabase: any, businessId: string, staffId: string, relationId: string) {
  await supabase
    .from('user_contacts')
    .insert([
      {
        user_id: businessId,
        contact_id: staffId,
        status: 'accepted',
        staff_relation_id: relationId
      },
      {
        user_id: staffId,
        contact_id: businessId,
        status: 'accepted',
        staff_relation_id: relationId
      }
    ]);
}

// Main handler function
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
    const supabase = createSupabaseClient(supabaseUrl, supabaseServiceKey);
    
    // Get the user making the request to verify they're authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error("Auth error:", userError);
      throw new Error('Unauthorized: Invalid token');
    }
    
    // Parse request body
    const requestData = await req.json();
    const {
      fullName,
      email,
      password,
      position,
      isServiceProvider = false,
      permissions,
      avatar
    } = requestData;
    
    // Validate required fields
    if (!fullName || !email || !password) {
      throw new Error('Missing required fields');
    }
    
    // Verify business account
    await verifyBusinessAccount(supabase, user.id);
    
    // Check co-admin limit if applicable
    await checkCoAdminLimit(supabase, user.id, permissions?.isCoAdmin);
    
    // Create the auth user account
    const authUser = await createAuthUser(supabase, { email, password, fullName }, user.id);
    
    // Upload avatar if provided
    const avatarUrl = await processAvatar(supabase, avatar, authUser.id);
    
    // Create staff record
    const staffRecord = await createStaffRecord(
      supabase, 
      { fullName, email, position, isServiceProvider, permissions }, 
      user.id, 
      authUser, 
      avatarUrl
    );
    
    // Update profile
    await updateProfile(supabase, authUser.id, fullName, avatarUrl);
    
    // Create contact relationships
    await createContactRelationships(supabase, user.id, authUser.id, staffRecord.id);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Staff account created successfully",
        data: staffRecord
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
    console.error("Error in create-staff function:", error.message);
    
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
