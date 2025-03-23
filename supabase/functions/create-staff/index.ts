
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
    
    // Parse request body
    const {
      fullName,
      email,
      password,
      position,
      role = 'staff',
      isServiceProvider = false,
      permissions,
      avatar // Accept avatar from request
    } = await req.json();
    
    // Validate required fields
    if (!fullName || !email || !password) {
      throw new Error('Missing required fields');
    }
    
    // Check if the user is a business account
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', user.id)
      .single();
      
    if (profileError) {
      throw new Error(`Failed to verify account type: ${profileError.message}`);
    }
    
    if (profile.account_type !== 'business') {
      throw new Error('Only business accounts can create staff members');
    }
    
    // Check if a co-admin already exists when trying to create one
    if (role === 'co-admin' || permissions?.isCoAdmin) {
      const { data: coAdmins, error: coAdminError } = await supabase
        .from('business_staff')
        .select('id')
        .eq('business_id', user.id)
        .eq('role', 'co-admin')
        .eq('status', 'active');
        
      if (coAdminError) {
        console.error("Error checking co-admin:", coAdminError);
      } else if (coAdmins && coAdmins.length > 0) {
        throw new Error("Only one Co-Admin is allowed per business");
      }
    }
    
    // Create the auth user account
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        account_type: 'staff',
        display_name: fullName,
        business_id: user.id,
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
    console.log("Business ID:", user.id);
    
    // Upload avatar if provided
    let avatarUrl = null;
    if (avatar && avatar.startsWith('data:')) {
      try {
        // Extract the base64 data
        const base64Data = avatar.split(',')[1];
        const fileExt = avatar.split(';')[0].split('/')[1];
        const fileName = `staff-avatar-${authData.user.id}.${fileExt}`;
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(`staff/${fileName}`, Uint8Array.from(atob(base64Data), c => c.charCodeAt(0)), {
            contentType: `image/${fileExt}`,
            upsert: true
          });
          
        if (uploadError) {
          console.error("Avatar upload error:", uploadError);
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(`staff/${fileName}`);
            
          avatarUrl = publicUrl;
        }
      } catch (error) {
        console.error("Error processing avatar:", error);
        // Continue without avatar - don't fail the entire staff creation
      }
    }
    
    // Prepare final permissions object
    const finalPermissions = {
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
    
    // If isCoAdmin is true in the permissions, set role to co-admin
    const finalRole = permissions?.isCoAdmin ? 'co-admin' : role;
    
    // Add staff record to business_staff table
    const { data: staffRecord, error: staffError } = await supabase
      .from('business_staff')
      .insert({
        business_id: user.id, // Ensure staff is tied to the business that created them
        staff_id: authData.user.id,
        name: fullName,
        email: email,
        position: position || 'Staff Member',
        role: finalRole,
        is_service_provider: isServiceProvider,
        permissions: finalPermissions,
        profile_image_url: avatarUrl,
        status: 'active'
      })
      .select()
      .single();
      
    if (staffError) {
      throw new Error(`Failed to create staff record: ${staffError.message}`);
    }
    
    // Update profile table to mark as staff account
    await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        full_name: fullName,
        account_type: 'staff',
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      });
    
    // Create automatic contact relationship for messaging
    await supabase
      .from('user_contacts')
      .insert([
        {
          user_id: user.id,
          contact_id: authData.user.id,
          status: 'accepted',
          staff_relation_id: staffRecord.id
        },
        {
          user_id: authData.user.id,
          contact_id: user.id,
          status: 'accepted',
          staff_relation_id: staffRecord.id
        }
      ]);
    
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
