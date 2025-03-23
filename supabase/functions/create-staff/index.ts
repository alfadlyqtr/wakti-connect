
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
      avatar
    } = await req.json();
    
    // Validate required fields
    if (!fullName || !email || !password) {
      throw new Error('Missing required fields');
    }
    
    // Check if a co-admin already exists (if we're creating a co-admin)
    if (role === 'co-admin') {
      const { data: coAdmins, error: coAdminError } = await supabase
        .from('business_staff')
        .select('id')
        .eq('business_id', user.id)
        .eq('role', 'co-admin')
        .eq('status', 'active');
        
      if (coAdminError) {
        throw new Error(`Failed to check existing co-admins: ${coAdminError.message}`);
      }
      
      if (coAdmins && coAdmins.length > 0) {
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
    
    // Generate staff number
    const { data: businessData } = await supabase
      .from('profiles')
      .select('business_name')
      .eq('id', user.id)
      .single();
      
    const businessPrefix = (businessData?.business_name || 'BUS')
      .substring(0, 3)
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
      
    const { count } = await supabase
      .from('business_staff')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', user.id);
      
    const staffNumber = `${businessPrefix}${String((count || 0) + 1).padStart(3, '0')}`;
    
    // Handle avatar upload if provided
    let avatarUrl = null;
    if (avatar) {
      try {
        // Extract base64 data
        const base64Data = avatar.split(',')[1];
        const fileExt = avatar.split(';')[0].split('/')[1];
        
        if (base64Data) {
          const avatarBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
          const filePath = `${authData.user.id}/profile.${fileExt}`;
          
          const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('avatars')
            .upload(filePath, avatarBuffer, {
              contentType: `image/${fileExt}`,
              upsert: true
            });
            
          if (!uploadError) {
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
    
    // Add staff record to business_staff table
    const { data: staffRecord, error: staffError } = await supabase
      .from('business_staff')
      .insert({
        business_id: user.id,
        staff_id: authData.user.id,
        name: fullName,
        email: email,
        position: position || 'Staff Member',
        role: role,
        is_service_provider: isServiceProvider,
        staff_number: staffNumber,
        permissions: permissions || {
          can_manage_tasks: false,
          can_manage_bookings: false,
          can_track_hours: true,
          can_log_earnings: false,
          can_view_analytics: false
        },
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
    
    // Create automatic contact relationships
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
