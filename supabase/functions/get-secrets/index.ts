
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { keys } = await req.json()
    
    // Get secrets from Supabase
    const secrets: Record<string, string> = {}
    for (const key of keys) {
      const value = Deno.env.get(key)
      if (!value && key === 'VOICERSS_API_KEY') {
        console.error('Missing required API key:', key)
        return new Response(
          JSON.stringify({ 
            error: `Missing required API key: ${key}. Please add it in the Supabase project settings.`
          }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
      secrets[key] = value || ''
    }

    return new Response(
      JSON.stringify({ secrets }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in get-secrets function:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
