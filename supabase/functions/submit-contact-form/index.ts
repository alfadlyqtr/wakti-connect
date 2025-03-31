
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
    // Create a Supabase client with the service role key to bypass RLS
    const supabaseAdmin = createClient(
      // Supabase API URL - env var exposed by default.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase SERVICE ROLE KEY - env var exposed by default.
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      // Don't use auth context for admin operations
      { global: { headers: { } } }
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

    // Validate form data - only require name and phone
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

    console.log("Processing submission for business:", businessId, "page:", pageId);

    // Insert contact submission into database using admin client
    const { data, error } = await supabaseAdmin
      .from('business_contact_submissions')
      .insert({
        business_id: businessId,
        page_id: pageId,
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone,
        message: formData.message || null,
        is_read: false
      })
      .select()
      .single()

    if (error) {
      console.error("Error storing contact submission:", error)
      throw error
    }

    console.log("Submission stored successfully:", data.id);

    // Removed notification creation to simplify the process

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
