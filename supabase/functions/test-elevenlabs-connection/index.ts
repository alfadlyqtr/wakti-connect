
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Testing ElevenLabs connection");
    
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    
    if (!ELEVENLABS_API_KEY) {
      console.error('ElevenLabs API key not configured');
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'ElevenLabs API key not configured' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 // Return 200 to handle gracefully
        }
      );
    }
    
    // Test the ElevenLabs connection
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      method: 'GET',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ElevenLabs API error (${response.status}):`, errorText);
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: `ElevenLabs API error: ${response.status}` 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 // Return 200 to handle gracefully
        }
      );
    }

    const result = await response.json();
    console.log("ElevenLabs connection successful");

    return new Response(
      JSON.stringify({ valid: true, data: result }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error("Error testing ElevenLabs connection:", error);
    
    return new Response(
      JSON.stringify({ 
        valid: false,
        error: error.message
      }),
      {
        status: 200, // Return 200 to handle gracefully
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
