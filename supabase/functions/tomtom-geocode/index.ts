
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

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
    const { query } = await req.json()
    const apiKey = Deno.env.get('TOMTOM_API_KEY')

    if (!apiKey) {
      throw new Error('TomTom API key not configured')
    }

    if (!query) {
      throw new Error('Query parameter is required')
    }

    // Call TomTom Geocoding API
    const response = await fetch(
      `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(query)}.json?key=${apiKey}`,
      { method: 'GET' }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to geocode location')
    }

    // Extract coordinates from the first result
    const result = data.results?.[0]
    if (!result) {
      return new Response(
        JSON.stringify({ error: 'No results found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const coordinates = {
      lat: result.position.lat,
      lon: result.position.lon
    }

    return new Response(
      JSON.stringify({ coordinates }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
