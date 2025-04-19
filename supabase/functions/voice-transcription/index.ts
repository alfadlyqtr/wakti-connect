
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
    
    const { fileUrl, language = 'auto' } = await req.json();
    
    if (!fileUrl) {
      console.error('No file URL provided');
      throw new Error('No file URL provided');
    }
    
    console.log(`Processing file from URL: ${fileUrl}`);
    console.log("Attempting OpenAI Whisper transcription");

    // Download the audio file
    const audioResponse = await fetch(fileUrl);
    if (!audioResponse.ok) {
      throw new Error('Failed to fetch audio file');
    }
    const audioBlob = await audioResponse.blob();

    // Create form data for Whisper API
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');
    // Only append language if it's not 'auto'
    if (language !== 'auto') {
      formData.append('language', language);
    }

    // Send to Whisper API
    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: formData
    });

    if (!whisperResponse.ok) {
      throw new Error(`OpenAI Whisper API error: ${await whisperResponse.text()}`);
    }

    const result = await whisperResponse.json();
    console.log("Transcription received from OpenAI Whisper");

    return new Response(
      JSON.stringify({ text: result.text, source: 'whisper' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
