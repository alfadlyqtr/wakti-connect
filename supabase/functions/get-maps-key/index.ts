
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Return the correct Maps API key
    const apiKey = 'AIzaSyBQ6iROkrf7ebTpqevZPaa0-Gdb_-ORw0Y';
    
    if (!apiKey) {
      console.error('GOOGLE_MAPS_API_KEY not found');
      return new Response(
        JSON.stringify({ 
          error: 'API key not configured',
          source: 'error'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Return the API key
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
        source: 'error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
