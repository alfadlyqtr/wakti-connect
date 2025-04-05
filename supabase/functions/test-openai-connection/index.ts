
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    // No need to request the API key from the frontend
    // Just use the one stored in the Edge Function secrets
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          message: 'OpenAI API key not configured',
          details: 'The OPENAI_API_KEY is not set in the Edge Function secrets'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Create a simple test request to OpenAI API
    const url = 'https://api.openai.com/v1/models'
    
    const openaiResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    })
    
    // Check if the API key is valid
    if (openaiResponse.status === 200) {
      return new Response(
        JSON.stringify({ valid: true, message: 'OpenAI API key is valid' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      const errorData = await openaiResponse.json()
      return new Response(
        JSON.stringify({ 
          valid: false, 
          message: 'Invalid OpenAI API key',
          details: errorData.error?.message || 'Unknown error'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ valid: false, message: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
