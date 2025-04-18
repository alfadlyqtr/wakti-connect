
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
    console.log("Voice transcription service starting");
    
    const { fileUrl, language = 'en' } = await req.json();
    
    if (!fileUrl) {
      console.error('No file URL provided');
      throw new Error('No file URL provided');
    }
    
    console.log(`Processing file from URL: ${fileUrl}`);
    
    // Try ElevenLabs first
    try {
      console.log("Attempting ElevenLabs transcription");
      
      const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
        method: 'POST',
        headers: {
          'xi-api-key': Deno.env.get('ELEVENLABS_API_KEY') || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio_url: fileUrl,
          model_id: 'whisper-1',
          language: language,
        }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${await response.text()}`);
      }

      const result = await response.json();
      console.log("Transcription received from ElevenLabs");

      return new Response(
        JSON.stringify({ text: result.text, source: 'elevenlabs' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error("ElevenLabs transcription failed:", error);
      throw error;
    }

  } catch (error) {
    console.error("Error in voice transcription function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        fallback: true,
        message: "Voice transcription error. Using browser fallback."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
