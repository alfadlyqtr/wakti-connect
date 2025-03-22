
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
    console.log("Starting create-staff function");
    
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
    
    console.log(`Authenticated user: ${user.id}`);
    
    // Parse request body
    const requestData = await req.json();
    const {
      fullName,
      email,
      password,
      position,
      isServiceProvider,
      isCoAdmin,
      permissions,
      avatar
    } = requestData;
    
    // Validate required fields
    if (!fullName || !email || !password) {
      throw new Error('Missing required fields');
    }
    
    console.log(`Creating staff account for ${email}`);
    
    // Check if a co-admin already exists (if we're creating a co-admin)
    if (isCoAdmin) {
      const { data: coAdmins, error: coAdminError } = await supabase
        .from('business_staff')
        .select('id')
        .eq('business_id', user.id)
        .eq('role', 'co-admin')
        .eq('status', 'active');
        
      if (coAdminError) {
        console.error("Error checking co-admins:", coAdminError);
        throw new Error(`Failed to check existing co-admins: ${coAdminError.message}`);
      }
      
      if (coAdmins && coAdmins.length > 0) {
        throw new Error("Only one Co-Admin is allowed per business");
      }
    }
    
    // 1. Create the auth user account
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        account_type: 'staff',
        business_id: user.id,
        is_staff: true
      }
    });
    
    if (authError) {
      console.error("Auth creation error:", authError);
      throw new Error(`Failed to create auth user: ${authError.message}`);
    }
    
    if (!authData.user) {
      throw new Error("Failed to create user account");
    }
    
    console.log(`Created auth user with ID: ${authData.user.id}`);
    
    // Get business information for generating staff number
    const { data: businessData, error: businessError } = await supabase
      .from('profiles')
      .select('business_name')
      .eq('id', user.id)
      .single();
      
    if (businessError) {
      console.error("Business fetch error:", businessError);
      throw new Error(`Failed to fetch business data: ${businessError.message}`);
    }
    
    // Generate staff number
    const businessName = businessData.business_name || 'BUS';
    const prefix = businessName
      .substring(0, 3)
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
      
    // Get current staff count for numbering
    const { count, error: countError } = await supabase
      .from('business_staff')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', user.id);
      
    if (countError) {
      console.error("Staff count error:", countError);
      throw new Error(`Failed to get staff count: ${countError.message}`);
    }
    
    const staffNumber = `${prefix}_Staff${String(count || 0).padStart(3, '0')}`;
    
    // Handle avatar upload if provided
    let avatarUrl = null;
    if (avatar) {
      try {
        // Extract base64 data (remove data:image/xyz;base64, prefix)
        const base64Data = avatar.split(',')[1];
        const fileExt = avatar.split(';')[0].split('/')[1];
        
        if (!base64Data) {
          console.warn("Invalid avatar format");
        } else {
          const avatarBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
          const filePath = `${authData.user.id}/profile.${fileExt}`;
          
          const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('avatars')
            .upload(filePath, avatarBuffer, {
              contentType: `image/${fileExt}`,
              upsert: true
            });
            
          if (uploadError) {
            console.error("Avatar upload error:", uploadError);
          } else {
            console.log("Avatar uploaded successfully");
            
            // Get public URL
            const { data: urlData } = await supabase
              .storage
              .from('avatars')
              .getPublicUrl(filePath);
              
            avatarUrl = urlData.publicUrl;
          }
        }
      } catch (uploadErr) {
        console.error("Error processing avatar:", uploadErr);
        // Continue without avatar - non-fatal error
      }
    }
    
    // 2. Add staff record to business_staff table
    const { data: staffRecord, error: staffError } = await supabase
      .from('business_staff')
      .insert({
        business_id: user.id,
        staff_id: authData.user.id,
        name: fullName,
        email: email,
        position: position || 'Staff Member',
        role: isCoAdmin ? 'co-admin' : 'staff',
        is_service_provider: isServiceProvider || false,
        staff_number: staffNumber,
        permissions: permissions || {
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
        profile_image_url: avatarUrl,
        status: 'active'
      })
      .select()
      .single();
      
    if (staffError) {
      console.error("Staff record creation error:", staffError);
      throw new Error(`Failed to create staff record: ${staffError.message}`);
    }
    
    console.log(`Staff record created with ID: ${staffRecord.id}`);
    
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
      .insert({
        user_id: user.id,
        contact_id: authData.user.id,
        status: 'accepted',
        staff_relation_id: staffRecord.id
      });
      
    // Also add contacts between existing staff and the new staff member
    const { data: existingStaff, error: existingStaffError } = await supabase
      .from('business_staff')
      .select('staff_id, id')
      .eq('business_id', user.id)
      .neq('staff_id', authData.user.id)
      .eq('status', 'active');
      
    if (existingStaffError) {
      console.error("Error fetching existing staff:", existingStaffError);
    } else if (existingStaff && existingStaff.length > 0) {
      // Create contact relationships between all staff members
      const staffContacts = existingStaff.map(staff => ({
        user_id: staff.staff_id,
        contact_id: authData.user.id,
        status: 'accepted',
        staff_relation_id: staffRecord.id
      }));
      
      const reverseStaffContacts = existingStaff.map(staff => ({
        user_id: authData.user.id,
        contact_id: staff.staff_id,
        status: 'accepted',
        staff_relation_id: staff.id
      }));
      
      const { error: contactsError } = await supabase
        .from('user_contacts')
        .insert([...staffContacts, ...reverseStaffContacts]);
        
      if (contactsError) {
        console.error("Error creating staff contacts:", contactsError);
      }
    }
    
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
