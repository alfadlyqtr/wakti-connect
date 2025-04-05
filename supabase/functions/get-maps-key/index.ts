
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// This is a secure Maps API key that should be set in Supabase environment
// For now, we're using a placeholder key but in production, this should be changed
const FALLBACK_MAPS_KEY = 'AIzaSyBIwzALxUPNbatRBj3X1HyELQG7xToQ3vA';

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the Maps API key from environment variables
    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
    
    // If no API key is set in environment, use the fallback key
    if (!apiKey) {
      console.log('GOOGLE_MAPS_API_KEY not found in environment variables, using fallback key');
      return new Response(
        JSON.stringify({ 
          apiKey: FALLBACK_MAPS_KEY, 
          source: 'fallback'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return the API key from environment
    return new Response(
      JSON.stringify({ 
        apiKey, 
        source: 'environment'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error retrieving Maps API key:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message, 
        apiKey: FALLBACK_MAPS_KEY, 
        source: 'error-fallback'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
