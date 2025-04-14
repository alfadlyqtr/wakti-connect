
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
    console.log("ElevenLabs Speech-to-Text request received");
    
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    
    if (!ELEVENLABS_API_KEY) {
      console.error('ElevenLabs API key not configured');
      throw new Error('ElevenLabs API key not configured');
    }
    
    const requestData = await req.json();
    const { audio } = requestData;
    
    if (!audio) {
      console.error('No audio data provided');
      throw new Error('No audio data provided');
    }
    
    console.log("Sending audio to ElevenLabs API");
    
    // Call ElevenLabs API
    const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio: audio,
        model_id: 'whisper-1',
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ElevenLabs API error (${response.status}):`, errorText);
      throw new Error(`ElevenLabs API error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    console.log("Transcription received from ElevenLabs:", result.text);

    return new Response(
      JSON.stringify({ text: result.text }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error("Error in ElevenLabs speech-to-text function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message, 
        details: error.stack,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
