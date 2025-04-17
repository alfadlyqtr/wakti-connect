
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
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    // Get request body
    const requestData = await req.json();
    const { audio } = requestData;
    
    if (!audio) {
      console.error('No audio data provided');
      throw new Error('No audio data provided');
    }

    console.log("Audio data received, length:", audio.length);
    
    // Process the base64 audio
    const binaryAudio = Uint8Array.from(atob(audio), c => c.charCodeAt(0));
    const blob = new Blob([binaryAudio], { type: 'audio/webm' });
    
    // Create FormData for OpenAI API
    const formData = new FormData();
    formData.append('file', blob, 'audio.webm');
    formData.append('model', 'whisper-1');
    
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI Whisper API error (${response.status}):`, errorText);
      throw new Error(`OpenAI Whisper API error (${response.status}): ${errorText}`);
    }
    
    const result = await response.json();
    console.log("Transcription received from OpenAI Whisper:", result.text);
    
    return new Response(
      JSON.stringify({ 
        text: result.text,
        source: 'whisper',
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
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
