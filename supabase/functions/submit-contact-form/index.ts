
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      // Supabase API URL - env var exposed by default.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exposed by default.
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function.
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Get request data
    const body = await req.json()
    const { businessId, pageId, formData } = body

    if (!businessId || !pageId || !formData) {
      return new Response(
        JSON.stringify({
          error: 'Missing required parameters',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Validate form data
    if (!formData.name || !formData.phone) {
      return new Response(
        JSON.stringify({
          error: 'Name and phone are required',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Insert contact submission into database
    const { data, error } = await supabaseClient
      .from('business_contact_submissions')
      .insert({
        business_id: businessId,
        page_id: pageId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        is_read: false
      })
      .select()
      .single()

    if (error) {
      console.error("Error storing contact submission:", error)
      throw error
    }

    // Create a notification for the business owner
    await supabaseClient
      .from('notifications')
      .insert({
        user_id: businessId,
        type: 'contact_form',
        title: 'New Contact Form Submission',
        content: `${formData.name} has submitted a contact form on your business page.`,
        related_entity_id: data.id,
        related_entity_type: 'contact_submission',
        is_read: false
      })

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error processing contact form:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
