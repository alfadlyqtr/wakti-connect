
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.20.0"

// CORS headers for browser compatibility
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Interface for the staff data payload
interface StaffData {
  fullName: string
  email: string
  password: string
  position?: string
  isServiceProvider?: boolean
  isCoAdmin?: boolean
  permissions?: Record<string, boolean>
  avatar?: string // Base64 encoded image if provided
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get auth header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header is required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Create supabase client with user's JWT for RLS validation
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    )

    // Get authenticated user to verify business owner
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      console.error("Auth error:", authError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify user is a business account by checking profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('account_type')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.account_type !== 'business') {
      console.error("Profile error:", profileError)
      return new Response(
        JSON.stringify({ error: 'Only business accounts can create staff' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const staffData: StaffData = await req.json()
    console.log("Creating staff with data:", { ...staffData, password: "[REDACTED]" })

    // Validation
    if (!staffData.fullName || !staffData.email || !staffData.password) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if email already exists
    const { data: existingUser, error: existingUserError } = await supabaseAdmin.auth.admin.listUsers()
    if (existingUserError) {
      console.error("Error checking existing users:", existingUserError)
      return new Response(
        JSON.stringify({ error: 'Failed to check existing users' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (existingUser.users.some(u => u.email === staffData.email)) {
      return new Response(
        JSON.stringify({ error: 'Email already exists' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if a co-admin already exists when trying to create one
    if (staffData.isCoAdmin) {
      const { data: coAdmins, error: coAdminError } = await supabaseClient
        .from('business_staff')
        .select('id')
        .eq('business_id', user.id)
        .eq('role', 'co-admin')
        .eq('status', 'active')

      if (coAdminError) {
        console.error("Error checking co-admin:", coAdminError)
        return new Response(
          JSON.stringify({ error: 'Failed to check existing co-admin' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (coAdmins && coAdmins.length > 0) {
        return new Response(
          JSON.stringify({ error: 'Only one Co-Admin is allowed per business' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Get business information for generating staff number
    const { data: businessData, error: businessError } = await supabaseClient
      .from('profiles')
      .select('business_name')
      .eq('id', user.id)
      .single()

    if (businessError) {
      console.error("Error fetching business:", businessError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch business information' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate staff number
    const businessName = businessData.business_name || 'BUS'
    const prefix = businessName
      .substring(0, 3)
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')

    // Get current staff count for numbering
    const { count, error: countError } = await supabaseClient
      .from('business_staff')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', user.id)

    if (countError) {
      console.error("Error counting staff:", countError)
      return new Response(
        JSON.stringify({ error: 'Failed to count existing staff' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const staffNumber = `${prefix}_Staff${String(count || 0).padStart(3, '0')}`

    // Create the auth user account with admin API
    const { data: authData, error: authCreateError } = await supabaseAdmin.auth.admin.createUser({
      email: staffData.email,
      password: staffData.password,
      email_confirm: true,
      user_metadata: {
        full_name: staffData.fullName,
        account_type: 'staff',
        business_id: user.id,
        staff_role: staffData.isCoAdmin ? 'co-admin' : 'staff',
        staff_number: staffNumber
      }
    })

    if (authCreateError || !authData.user) {
      console.error("Error creating user:", authCreateError)
      return new Response(
        JSON.stringify({ error: authCreateError?.message || 'Failed to create user account' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log("Created auth user:", authData.user.id)

    // Handle avatar upload if provided
    let avatarUrl = null
    if (staffData.avatar && staffData.avatar.startsWith('data:image')) {
      try {
        const base64Data = staffData.avatar.split(',')[1]
        const mimeType = staffData.avatar.split(';')[0].split(':')[1]
        const fileExt = mimeType.split('/')[1]
        const fileName = `${authData.user.id}_${Date.now()}.${fileExt}`

        // Upload to storage
        const { data: uploadData, error: uploadError } = await supabaseAdmin
          .storage
          .from('avatars')
          .upload(`staff/${fileName}`, decode(base64Data), {
            contentType: mimeType,
            upsert: true
          })

        if (uploadError) {
          console.error("Avatar upload error:", uploadError)
        } else if (uploadData) {
          // Get public URL
          const { data: urlData } = await supabaseAdmin
            .storage
            .from('avatars')
            .getPublicUrl(`staff/${fileName}`)

          avatarUrl = urlData.publicUrl
        }
      } catch (error) {
        console.error("Error processing avatar:", error)
      }
    }

    // Create staff record in business_staff table
    const { data: staffRecord, error: staffError } = await supabaseAdmin
      .from('business_staff')
      .insert({
        business_id: user.id,
        staff_id: authData.user.id,
        name: staffData.fullName,
        email: staffData.email,
        position: staffData.position || 'Staff Member',
        role: staffData.isCoAdmin ? 'co-admin' : 'staff',
        staff_number: staffNumber,
        is_service_provider: staffData.isServiceProvider || false,
        permissions: staffData.permissions || {
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
      .single()

    if (staffError) {
      console.error("Error creating staff record:", staffError)
      // Try to clean up the auth user if staff record fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return new Response(
        JSON.stringify({ error: staffError.message || 'Failed to create staff record' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log("Created staff record:", staffRecord.id)

    // Create automatic contact relationship for messaging
    try {
      await supabaseAdmin
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
        ])

      // Also add contacts between existing staff and the new staff member
      const { data: existingStaff, error: existingStaffError } = await supabaseAdmin
        .from('business_staff')
        .select('staff_id, id')
        .eq('business_id', user.id)
        .neq('staff_id', authData.user.id)
        .eq('status', 'active')

      if (!existingStaffError && existingStaff && existingStaff.length > 0) {
        const contactInserts = []

        for (const staff of existingStaff) {
          contactInserts.push({
            user_id: authData.user.id,
            contact_id: staff.staff_id,
            status: 'accepted',
            staff_relation_id: staff.id
          })

          contactInserts.push({
            user_id: staff.staff_id,
            contact_id: authData.user.id,
            status: 'accepted',
            staff_relation_id: staffRecord.id
          })
        }

        if (contactInserts.length > 0) {
          await supabaseAdmin.from('user_contacts').insert(contactInserts)
        }
      }
    } catch (error) {
      console.error("Error creating contacts:", error)
      // Not critical, don't fail the overall operation
    }

    // Update profiles table info
    try {
      await supabaseAdmin
        .from('profiles')
        .update({
          account_type: 'staff',
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
          full_name: staffData.fullName,
          display_name: staffData.fullName
        })
        .eq('id', authData.user.id)
    } catch (error) {
      console.error("Error updating profile:", error)
      // Not critical, don't fail the overall operation
    }

    // Return success with the created staff record
    return new Response(
      JSON.stringify({ success: true, data: staffRecord }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error("Unexpected error:", error)
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Helper function to decode base64
function decode(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}
